'use-strict'

exports.buildSuccessfulResponse = (userId, streamId, streams) => ({
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

exports.buildErrorResponse = (statusCode, message) => ({
    "statusCode": statusCode,
    "headers": {
        "Content-Type": "application/json"
    },
    "body": JSON.stringify({"status":"ERROR","message":message}),
    "isBase64Encoded": false
});