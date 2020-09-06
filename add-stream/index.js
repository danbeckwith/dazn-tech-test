'use strict'

const { DocumentClient } = require('aws-sdk/clients/dynamodb');
// TODO do I need to specify version here?
const dynamodb = new DocumentClient({apiVersion: '2012-08-10'});

exports.handler = async event => {
    console.log("Starting...");

    // Parse Params
    const { userId } = event.pathParameters;
    const stream = JSON.parse(event.body);

// TODO validation of input params

    // Update with new stream
    const updateParams = {
        TableName: "UserStreams",
        Key: {
            "UserId": userId
        },
        ExpressionAttributeNames: { '#s': 'Streams' },
        ExpressionAttributeValues: {
            ':s': [stream.streamId],
            ':MAX': 3
        },
        ConditionExpression: 'size (#s) < :MAX',
        UpdateExpression: 'SET #s = list_append (#s, :s)',
        ReturnValues: 'UPDATED_NEW'
    };

    let streams;
    let response;

    try {
        console.log(`Attempting to update user [${userId}] with stream ${stream.streamId}`)
        const result = await dynamodb.update(updateParams).promise();
        streams = result.Attributes.Streams;
        console.log(`Update sucessful, user [${userId}] is watching streams: [${streams}]`)

        response = {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "status": "OK",
                "streams": streams,
                "message": `Stream [${stream.streamId}] was sucessfully added to ${userId}`
            }),
            "isBase64Encoded": false
        };

    } catch (err) {
        console.error(`Failed to update user [${userId}] with stream ${stream.streamId}: ${err}`);
        
        response = {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({"status":"ERROR","message":"User is already watching three streams"}),
            "isBase64Encoded": false
        };
    }

    console.log("Done...");

    return response;
}

// TODO move scripts in package.json