const AWS = require("aws-sdk");
const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient({ region: 'ap-south-1'});


const updatePoints = async (userId, updatedpoints) => {
    await DocumentClient.update({
        TableName: "users",
        Key: {
            'userId' : userId
        },
        UpdateExpression: 'set points = :points',
        ExpressionAttributeValues:{
            ':points': updatedpoints
        }
    }).promise();
}
module.exports.restorePoints = async (params) => {
    try{
        const { userId, pointsRedeemed, total } = params;
        const foundDocument = await DocumentClient.get({
            TableName: "users",
            Key: {
                'userId' : userId
            }
        }).promise();
        const foundUser = foundDocument.Item;
        await updatePoints(userId, (foundUser.points + pointsRedeemed));
        return {
            ...params, discountPrice: 0, total, finalTotal: total
        }
    }catch (e){
        console.error(e);
        throw e;
    }
};