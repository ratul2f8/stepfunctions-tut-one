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
module.exports.redeemPoints = async (params) => {
    try{
        const { total, pointsRedeemed, userId } = params;
        const foundDocument = await DocumentClient.get({
            TableName: "users",
            Key: {
                'userId' : userId
            }
        }).promise();
        const foundUser = foundDocument.Item;
        if(!foundUser){
            let error = new Error("User not found");
            throw error;
        }
        if(foundUser.points >= pointsRedeemed){
            //assume that 1 points  = 0.01 unit price
            let discountPrice = pointsRedeemed* 0.01;
            let currentTotal = total - discountPrice;
            if(currentTotal < 0){
                let error = new Error("Order value is not sufficient to apply this much points");
                throw error;
            }
            await updatePoints(userId, (foundUser.points - pointsRedeemed));
            return {
                ...params, discountPrice, total, finalTotal: currentTotal
            }

        }else{
            let error = new Error("Insufficient points to retrieve");
            throw error;
        }
    }catch (e){
        console.error(e);
        throw e;
    }
};