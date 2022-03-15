"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTodo = void 0;
const aws_sdk_1 = require("aws-sdk");
const documentClient = new aws_sdk_1.DynamoDB.DocumentClient();
exports.createTodo = async (todo) => {
    try {
        const params = {
            TableName: process.env.TODOS_TABLE || '',
            Item: todo
        };
        await documentClient.put(params).promise();
        return todo;
    }
    catch (err) {
        return 'Todo returning error: ' + err;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVG9kby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZVRvZG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQW1DO0FBSW5DLE1BQU0sY0FBYyxHQUFHLElBQUksa0JBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtBQUN2QyxRQUFBLFVBQVUsR0FBRyxLQUFLLEVBQUMsSUFBVSxFQUFFLEVBQUU7SUFDMUMsSUFBRztRQUNDLE1BQU0sTUFBTSxHQUFHO1lBQ1gsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLEVBQUU7WUFDeEMsSUFBSSxFQUFFLElBQUk7U0FDYixDQUFBO1FBQ0QsTUFBTSxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzNDLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFBQSxPQUFNLEdBQUcsRUFBQztRQUNQLE9BQU8sd0JBQXdCLEdBQUcsR0FBRyxDQUFDO0tBQ3pDO0FBQ0wsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHluYW1vREIgfSBmcm9tICdhd3Mtc2RrJztcclxuaW1wb3J0IHsgVG9kbyB9IGZyb20gJy4vVG9kbyc7XHJcblxyXG5cclxuY29uc3QgZG9jdW1lbnRDbGllbnQgPSBuZXcgRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKVxyXG5leHBvcnQgY29uc3QgY3JlYXRlVG9kbyA9IGFzeW5jKHRvZG86IFRvZG8pID0+IHtcclxuICAgIHRyeXtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIFRhYmxlTmFtZTogcHJvY2Vzcy5lbnYuVE9ET1NfVEFCTEUgfHwgJycsXHJcbiAgICAgICAgICAgIEl0ZW06IHRvZG9cclxuICAgICAgICB9XHJcbiAgICAgICAgYXdhaXQgZG9jdW1lbnRDbGllbnQucHV0KHBhcmFtcykucHJvbWlzZSgpO1xyXG4gICAgICAgIHJldHVybiB0b2RvO1xyXG4gICAgfWNhdGNoKGVycil7XHJcbiAgICAgICAgcmV0dXJuICdUb2RvIHJldHVybmluZyBlcnJvcjogJyArIGVycjtcclxuICAgIH1cclxufSJdfQ==