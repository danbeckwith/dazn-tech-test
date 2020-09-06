'use strict'

const { DocumentClient } = require('aws-sdk/clients/dynamodb');
// TODO do I need to specify version here?
const dynamodb = new DocumentClient({apiVersion: '2012-08-10'});

exports.handler = async event => {
    console.log("Starting...");

    // Parse Params
    const { userId } = event.pathParameters;
    const { streamId } = JSON.parse(event.body);

// TODO validation of input params
// TODO remove log lines

    // Update with new stream
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

    let streams;
    let response;

    try {
        console.log(`Attempting to update user [${userId}] with stream ${streamId}`)
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
                "message": `Stream [${streamId}] was sucessfully added to ${userId}`
            }),
            "isBase64Encoded": false
        };

    } catch (err) {
        console.error(`Failed to update user [${userId}] with stream ${streamId}: ${err}`);

        let message = "User is already watching three streams";

        if (err.statusCode === 500 || err.statusCode === 503) {
            message = "An error occured on the server side"
        }

        response = {
            "statusCode": err.statusCode,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({"status":"ERROR","message":message}),
            "isBase64Encoded": false
        };
    }

    console.log("Done...");

    return response;
}

// TODO move scripts in package.json