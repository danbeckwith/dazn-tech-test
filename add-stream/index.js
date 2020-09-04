'use strict'
// TODO remove as included in AWS Node runtime
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

exports.handler = async (event, context, callback) => {
    console.log("Starting...");

    const params = {
        Key: {
            "UserId": "388483ieowjds"
        },
        TableName: "UserStreams",
        AttributesToGet: ['Streams']
    }

    let streams;

    try {
        const result = await dynamodb.get(params).promise();
        streams = result.Item
    } catch (err) {
        console.error(err);
    }

    console.log("Streams: " + JSON.stringify(streams));

    console.log("Done...");
}