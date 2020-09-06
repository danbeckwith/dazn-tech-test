const { DocumentClient } = require('aws-sdk/clients/dynamodb');
const dynamodb = new DocumentClient({apiVersion: '2012-08-10'});

exports.addStreamToUser = async (userId, streamId) => {
    return await dynamodb.update({
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
    }).promise();
};
