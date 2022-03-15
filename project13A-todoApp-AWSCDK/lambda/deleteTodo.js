"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = void 0;
const aws_sdk_1 = require("aws-sdk");
const documentClient = new aws_sdk_1.DynamoDB.DocumentClient();
exports.deleteTodo = async (id) => {
    try {
        const params = {
            TableName: process.env.TODOS_TABLE || '',
            Key: {
                id
            }
        };
        await documentClient.delete(params).promise();
        return id;
    }
    catch (err) {
        return 'Todos deleting error: ' + err;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlVG9kby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlbGV0ZVRvZG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQW1DO0FBR25DLE1BQU0sY0FBYyxHQUFHLElBQUksa0JBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtBQUN2QyxRQUFBLFVBQVUsR0FBRyxLQUFLLEVBQUMsRUFBVSxFQUFFLEVBQUU7SUFDMUMsSUFBRztRQUNDLE1BQU0sTUFBTSxHQUFHO1lBQ1gsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLEVBQUU7WUFDeEMsR0FBRyxFQUFFO2dCQUNELEVBQUU7YUFDTDtTQUNKLENBQUE7UUFDRCxNQUFNLGNBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDOUMsT0FBTyxFQUFFLENBQUE7S0FDWjtJQUFBLE9BQU0sR0FBRyxFQUFDO1FBQ1AsT0FBTyx3QkFBd0IsR0FBRyxHQUFHLENBQUM7S0FDekM7QUFDTCxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEeW5hbW9EQiB9IGZyb20gJ2F3cy1zZGsnO1xyXG5cclxuXHJcbmNvbnN0IGRvY3VtZW50Q2xpZW50ID0gbmV3IER5bmFtb0RCLkRvY3VtZW50Q2xpZW50KClcclxuZXhwb3J0IGNvbnN0IGRlbGV0ZVRvZG8gPSBhc3luYyhpZDogc3RyaW5nKSA9PiB7XHJcbiAgICB0cnl7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgICAgICAgICBUYWJsZU5hbWU6IHByb2Nlc3MuZW52LlRPRE9TX1RBQkxFIHx8ICcnLFxyXG4gICAgICAgICAgICBLZXk6IHtcclxuICAgICAgICAgICAgICAgIGlkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYXdhaXQgZG9jdW1lbnRDbGllbnQuZGVsZXRlKHBhcmFtcykucHJvbWlzZSgpO1xyXG4gICAgICAgIHJldHVybiBpZFxyXG4gICAgfWNhdGNoKGVycil7XHJcbiAgICAgICAgcmV0dXJuICdUb2RvcyBkZWxldGluZyBlcnJvcjogJyArIGVycjtcclxuICAgIH1cclxufSJdfQ==