const promise = jest.fn()
const mockGetValue = jest.fn(() => ({ promise }))
jest.mock('aws-sdk/clients/dynamodb', () => ({
    DocumentClient: jest.fn().mockImplementation(() => ({ get: mockGetValue }))
}));

const { handler } = require('../index');

test('lambda returns 200', async () => {
    const result = { Item: { Streams: ["abc","def"] }};
    promise.mockResolvedValue(result)
    
    const res = await handler({ "pathParameters": { "userId": "123" }, "body": "{ \"streamId\": \"456\" }" });

    expect(res.statusCode).toBe(200);
})