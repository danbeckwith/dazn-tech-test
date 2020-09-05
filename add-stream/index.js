'use strict'
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

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
        streams = result.Item.Streams
    } catch (err) {
        console.error(err);
    }

    console.log("Current streams: " + JSON.stringify(streams));

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