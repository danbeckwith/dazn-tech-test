const promise = jest.fn();
const mockUpdate = jest.fn(() => ({ promise }));

jest.mock('aws-sdk/clients/dynamodb', () => ({
    DocumentClient: jest.fn().mockImplementation(() => ({ 
        update: mockUpdate
    }))
}));

const { handler } = require('../index');

const userId = "123";
const streamId = "456";

const buildDynamoError = (message, code, statusCode) => {
    const error = new Error(message);
    error.code = code;
    error.statusCode = statusCode;
    
    return error;
}

beforeEach(() => {
    jest.clearAllMocks();
});

test('attempts conditional update with the provided parameters', async () => {
    const expectedParams = {
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
    };

    const res = await handler({ "pathParameters": { "userId": userId }, "body": `{ \"streamId\": \"${streamId}\" }` });
    
    expect(mockUpdate).toHaveBeenCalledWith(expectedParams);
});

test('returns 200 and list of active streams if user is watching less than three at time of request', async () => {
    const streams = ['abc', streamId];
    const expectedResponseBody = {"status":"OK","streams":streams,"message":`Stream [${streamId}] was sucessfully added to user [${userId}]`};
    promise.mockResolvedValue({ Attributes: { Streams: streams }});

    const res = await handler({ "pathParameters": { "userId": userId }, "body": `{ \"streamId\": \"${streamId}\" }` });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(JSON.stringify(expectedResponseBody));
});

test('returns 500 and error message if user is watching three streams at time of request', async () => {
    const expectedResponseBody = {"status":"ERROR","message":`User [${userId}] is already watching three streams`};

    const mockError = buildDynamoError("The conditional request failed", "ConditionalCheckFailedException", 400);
    promise.mockRejectedValue(mockError);

    const res = await handler({ "pathParameters": { "userId": userId }, "body": `{ \"streamId\": \"${streamId}\" }` });

    expect(res.statusCode).toBe(500);
    expect(res.body).toBe(JSON.stringify(expectedResponseBody));
});

test('returns 400 and error message if parameters are not valid strings', async () => {
    const expectedResponseBody = {"status":"ERROR","message":"userId and streamId must be valid strings"};

    const res = await handler({ "pathParameters": { "userId": {"message":"hello"} }, "body": `{ \"streamId\": \"${streamId}\" }` });

    expect(res.statusCode).toBe(400);
    expect(res.body).toBe(JSON.stringify(expectedResponseBody));
});

test('returns 400 and error message if any parameters are empty strings', async () => {
    const expectedResponseBody = {"status":"ERROR","message":"userId and streamId must not be empty strings"};

    const res = await handler({ "pathParameters": { "userId": "" }, "body": `{ \"streamId\": \"${streamId}\" }` });

    expect(res.statusCode).toBe(400);
    expect(res.body).toBe(JSON.stringify(expectedResponseBody));
});

test('returns 500 and error message if Dynamo returns a bad request error', async () => {
    const expectedResponseBody = {"status":"ERROR","message":"Internal Server Error"};

    const mockError = buildDynamoError("Current throughput quota exceeded", "RequestLimitExceeded", 400);
    promise.mockRejectedValue(mockError);

    const res = await handler({ "pathParameters": { "userId": userId }, "body": `{ \"streamId\": \"${streamId}\" }` });

    expect(res.statusCode).toBe(500);
    expect(res.body).toBe(JSON.stringify(expectedResponseBody));
});

test('returns 500 and error message when Dynamo returns a server error', async () => {
    const expectedResponseBody = {"status":"ERROR","message":"Internal Server Error"};

    const mockError = buildDynamoError("A serverside error occured", "InternalServerError", 500);
    promise.mockRejectedValue(mockError);

    const res = await handler({ "pathParameters": { "userId": userId }, "body": `{ \"streamId\": \"${streamId}\" }` });

    expect(res.statusCode).toBe(500);
    expect(res.body).toBe(JSON.stringify(expectedResponseBody));
});