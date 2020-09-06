const getPromise = jest.fn().mockResolvedValue({ Item: { Streams: [] }})
const updatePromise = jest.fn()
const mockGetValue = jest.fn(() => ({ promise: getPromise }))
const mockUpdateValue = jest.fn(() => ({ promise: updatePromise }))

jest.mock('aws-sdk/clients/dynamodb', () => ({
    DocumentClient: jest.fn().mockImplementation(() => ({ 
        get: mockGetValue,
        update: mockUpdateValue
    }))
}));

const { handler } = require('../index');

const userId = "123";
const streamId = "456";

beforeEach(() => {
    jest.clearAllMocks();
});

test('calls get with the provided userid', async () => {
    const expectedParams = {
        Key: {
            "UserId": userId
        },
        TableName: "UserStreams",
        AttributesToGet: ['Streams']
    };

    const res = await handler({ "pathParameters": { "userId": userId }, "body": `{ \"streamId\": ${streamId} }` });
    
    expect(mockGetValue).toHaveBeenCalledWith(expectedParams);
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
        UpdateExpression: 'SET #s = list_append (#s, :s)'
    };

    const res = await handler({ "pathParameters": { "userId": userId }, "body": `{ \"streamId\": \"${streamId}\" }` });
    
    expect(mockUpdateValue).toHaveBeenCalledWith(expectedParams);
});

// TODO don't add if stream is already being watched