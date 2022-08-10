const AWS = require("aws-sdk");
const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient({ region: 'ap-south-1'});

module.exports.billCustomer = async (params) => {
    try{
        // throw new Error("Billing error");
        return "Successfully billed"
    }catch (e){
        console.error(e);
        throw e;
    }
};