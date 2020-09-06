'use strict'

const { DocumentClient } = require('aws-sdk/clients/dynamodb');
const dynamodb = new DocumentClient({apiVersion: '2012-08-10'});

const buildSuccessfulResponse = (userId, streamId, streams) => ({
    "statusCode": 200,
    "headers": {
        "Content-Type": "application/json"
    },
    "body": JSON.stringify({
        "status": "OK",
        "streams": streams,
        "message": `Stream [${streamId}] was sucessfully added to ${userId}`
    }),
    "isBase64Encoded": false
});

const buildErrorResponse = (statusCode, message) => ({
    "statusCode": statusCode,
    "headers": {
        "Content-Type": "application/json"
    },
    "body": JSON.stringify({"status":"ERROR","message":message}),
    "isBase64Encoded": false
})

exports.handler = async event => {
    const { userId } = event.pathParameters;
    const { streamId } = JSON.parse(event.body);

    // TODO validation of input params

    const updateParams = {
        TableName: "UserStreams",
        Key: {
            "UserId": userId
        },
        ExpressionAttributeNames: { '#s': 'Streams' },
        ExpressionAttributeValues: {
            ':s': [streamId],
            ':MAX': 3,
            ':emptyList': []
        },
        ConditionExpression: 'size (#s) < :MAX OR attribute_not_exists(Streams)',
        UpdateExpression: 'SET #s = list_append (if_not_exists(#s, :emptyList), :s)',
        ReturnValues: 'UPDATED_NEW'
    }

    try {
        console.log(`Attempting to update user [${userId}] with stream ${streamId}`)
        
        const result = await dynamodb.update(updateParams).promise();
        const streams = result.Attributes.Streams;
        
        console.log(`Update sucessful, user [${userId}] is watching streams: [${streams}]`)

        return buildSuccessfulResponse(userId, streamId, streams);

    } catch (err) {
        console.error(`Failed to update user [${userId}] with stream ${streamId}: ${err}`);

        return (err.code === "ConditionalCheckFailedException") ? 
            buildErrorResponse(400, "User is already watching three streams") : 
            buildErrorResponse(500, "Could not complete the request due to an exception");
    }
}