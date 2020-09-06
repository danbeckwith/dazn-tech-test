'use strict'

const { DocumentClient } = require('aws-sdk/clients/dynamodb');
// TODO do I need to specify version here?
const dynamodb = new DocumentClient({apiVersion: '2012-08-10'});

exports.handler = async event => {
    console.log("Starting...");

    // Parse Params
    const { userId } = event.pathParameters;
    const stream = JSON.parse(event.body);

    // Get users streams
    const getParams = {
        Key: {
            "UserId": userId
        },
        TableName: "UserStreams",
        AttributesToGet: ['Streams']
    }

    let streams;

    try {
        const result = await dynamodb.get(getParams).promise();
        console.log(result)
        streams = result.Item.Streams
    } catch (err) {
        console.error(err);
    }

    console.log(`User [${userId}] is currently watching streams: ${JSON.stringify(streams)}`);

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
        UpdateExpression: 'SET #s = list_append (#s, :s)'
    };


    try {
        const result = await dynamodb.update(updateParams).promise();
        console.log(result);
    } catch (err) {
        console.log(err);
    }

    // Build and send response

    const responseBody = {
        // TODO change message
        "message": `User [${userId}] has ${streams.length || 0} active streams`,
        "status": "OK",
    };

    const response = {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(responseBody),
        "isBase64Encoded": false
    };

    console.log("Done...");

    return response;
}