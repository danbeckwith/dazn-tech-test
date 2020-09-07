'use strict'

const { addStreamToUser } = require('./lib/store');
const { buildSuccessfulResponse, buildErrorResponse } = require('./lib/responseBuilder');

exports.handler = async event => {
    const { userId } = event.pathParameters;
    const { streamId } = JSON.parse(event.body);

    if (typeof userId !== "string" || typeof streamId !== "string") {
        return buildErrorResponse(400, "userId and streamId must be valid strings");
    }

    if (userId === "" || streamId === "") {
        return buildErrorResponse(400, "userId and streamId must not be empty strings");
    }

    try {
        console.log(`Attempting to update user [${userId}] with stream [${streamId}]`);
        
        const result = await addStreamToUser(userId, streamId);
        const streams = result.Attributes.Streams;
        
        console.log(`Update sucessful, user [${userId}] can watch stream: [${streamId}]`);

        return buildSuccessfulResponse(userId, streamId, streams);
    } catch (err) {
        console.error(`Failed to update user [${userId}] with stream [${streamId}]: ${err}`);

        const message = err.code === "ConditionalCheckFailedException" ?
            `User [${userId}] is already watching three streams` :
            "Internal Server Error"
        
        return buildErrorResponse(500, message);
    }
}