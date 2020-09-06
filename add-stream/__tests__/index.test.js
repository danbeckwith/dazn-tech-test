const updatePromise = jest.fn()
const mockUpdateValue = jest.fn(() => ({ promise: updatePromise }))

jest.mock('aws-sdk/clients/dynamodb', () => ({
    DocumentClient: jest.fn().mockImplementation(() => ({ 
        update: mockUpdateValue
    }))
}));

const { handler } = require('../index');

const userId = "123";
const streamId = "456";

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
            ':MAX': 3
        },
        ConditionExpression: 'size (#s) < :MAX',
        UpdateExpression: 'SET #s = list_append (#s, :s)',
        ReturnValues: 'UPDATED_NEW'
    };

    const res = await handler({ "pathParameters": { "userId": userId }, "body": `{ \"streamId\": \"${streamId}\" }` });
    
    expect(mockUpdateValue).toHaveBeenCalledWith(expectedParams);
});

test('returns 200 and list of active streams if user is watching less than three at time of request', async () => {
    const streams = ['abc', streamId]
    const expectedResponseBody = {"status":"OK","streams":streams,"message":`Stream [${streamId}] was sucessfully added to ${userId}`}
    updatePromise.mockResolvedValue({ Attributes: { Streams: streams }});

    const res = await handler({ "pathParameters": { "userId": userId }, "body": `{ \"streamId\": \"${streamId}\" }` });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(JSON.stringify(expectedResponseBody));
});

test('returns 400 and error message if user is watching three streams at time of request', async () => {
    const expectedResponseBody = {"status":"ERROR","message":"User is already watching three streams"}
    updatePromise.mockRejectedValue(new Error("ConditionalCheckFailedException"));

    const res = await handler({ "pathParameters": { "userId": userId }, "body": `{ \"streamId\": \"${streamId}\" }` });

    expect(res.statusCode).toBe(400);
    expect(res.body).toBe(JSON.stringify(expectedResponseBody));
});

// TODO tests install correct dev packages

// TODO creates user if not present

// TODO tests if request failed for other reasons