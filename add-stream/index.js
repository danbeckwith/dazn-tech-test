'use strict'

const { DocumentClient } = require('aws-sdk/clients/dynamodb');
// TODO do I need to specify version here?
const dynamodb = new DocumentClient({apiVersion: '2012-08-10'});

exports.handler = async event => {
    console.log("Starting...");

    console.log("event");
    console.log(JSON.stringify(event));

    const { userId } = event.pathParameters;
    const stream = JSON.parse(event.body);

    const params = {
        Key: {
            "UserId": userId
        },
        TableName: "UserStreams",
        AttributesToGet: ['Streams']
    }

    let streams;

    try {
        const result = await dynamodb.get(params).promise();
        console.log(result)
        streams = result.Item.Streams
    } catch (err) {
        console.error(err);
    }

    console.log(`User [${userId}] is currently watching streams: ${JSON.stringify(streams)}`);

    const responseBody = {
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