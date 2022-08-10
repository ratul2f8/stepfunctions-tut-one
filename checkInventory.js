const AWS = require("aws-sdk");
const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient({ region: 'ap-south-1'});

const isBookAvailable = (book, quantity) => {
    return (book.quantity - quantity) > 0
}

module.exports.checkInventory = async ({ bookId, quantity, pointsRedeemed, userId }) => {
    try{
        //validate request

        if(!bookId){
            let error =  new Error( "bookId is required");
            error.name = "INVALID_REQUEST";
            throw error
        }
        if(!userId){
            let error =  new Error( "userId is required");
            error.name = "INVALID_REQUEST";
            throw error
        }
        else if(isNaN(quantity)){
            let error =  new Error("quantity in number is required");
            error.name = "INVALID_REQUEST";
            throw error
        }

        if(isNaN(pointsRedeemed)){
            let error =  new Error("redeemed points must be a positive number");
            error.name = "INVALID_REQUEST";
            throw error
        }else if(+pointsRedeemed < 0){
            let error =  new Error("redeemed points can not be a negative number");
            error.name = "INVALID_REQUEST";
            throw error
        }

        let result = await DocumentClient.query({
            TableName: "books",
            KeyConditionExpression: 'bookId = :bookId',
            ExpressionAttributeValues: {
                ':bookId': bookId
            }
        }).promise();
        console.log("Books are: ", result);
        let book = result.Items[0];
        if(!book){
            throw new Error( "Book not found")
        }
        if(isBookAvailable(book, quantity)){
            return book
        }else{
            throw  new Error("Book out of stock")
        }
    }catch (e){
        console.error(e);
        throw e;
    }
};


