const { DynamoDB } = require("aws-sdk");

exports.handler = async (e: string) => {
  const dynamo = new DynamoDB();

  var generateId = Date.now();
  var idString = generateId.toString();

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      id: { S: idString },
      message: { S: e },
    },
  };
  try {
    await dynamo.putItem(params).promise();
    return { operationSuccessful: true };
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return { operationSuccessful: false };
  }
};