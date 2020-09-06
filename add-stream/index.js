'use strict'

const { addStreamToUser } = require('./lib/store');
const { buildSuccessfulResponse, buildErrorResponse } = require('./lib/responseBuilder');

exports.handler = async event => {
    const { userId } = event.pathParameters;
    const { streamId } = JSON.parse(event.body);

    try {
        console.log(`Attempting to update user [${userId}] with stream ${streamId}`)
        
        const result = await addStreamToUser(userId, streamId)
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