const AWS = require("aws-sdk");
const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient({ region: 'ap-south-1'});

module.exports.calculateTotal = async (params) => {
    const { result_book, quantity } = params;
    let total =  +quantity*(+result_book.price);
    return {
        ...params,
        total,
        discountPrice: 0,
        finalTotal: total
    };
};