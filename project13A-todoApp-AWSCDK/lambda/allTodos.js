"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTodos = void 0;
const aws_sdk_1 = require("aws-sdk");
const documentClient = new aws_sdk_1.DynamoDB.DocumentClient();
exports.allTodos = async () => {
    try {
        const params = {
            TableName: process.env.TODOS_TABLE || '',
        };
        const data = await documentClient.scan(params).promise();
        return data.Items;
    }
    catch (err) {
        return 'Todos returning error: ' + err;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsVG9kb3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbGxUb2Rvcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBbUM7QUFHbkMsTUFBTSxjQUFjLEdBQUcsSUFBSSxrQkFBUSxDQUFDLGNBQWMsRUFBRSxDQUFBO0FBQ3ZDLFFBQUEsUUFBUSxHQUFHLEtBQUssSUFBRyxFQUFFO0lBQzlCLElBQUc7UUFDQyxNQUFNLE1BQU0sR0FBRztZQUNYLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsSUFBSSxFQUFFO1NBQzNDLENBQUE7UUFDRCxNQUFNLElBQUksR0FBRyxNQUFNLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDekQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBO0tBQ3BCO0lBQUEsT0FBTSxHQUFHLEVBQUM7UUFDUCxPQUFPLHlCQUF5QixHQUFHLEdBQUcsQ0FBQztLQUMxQztBQUNMLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IER5bmFtb0RCIH0gZnJvbSAnYXdzLXNkayc7XHJcblxyXG5cclxuY29uc3QgZG9jdW1lbnRDbGllbnQgPSBuZXcgRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKVxyXG5leHBvcnQgY29uc3QgYWxsVG9kb3MgPSBhc3luYygpID0+IHtcclxuICAgIHRyeXtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIFRhYmxlTmFtZTogcHJvY2Vzcy5lbnYuVE9ET1NfVEFCTEUgfHwgJycsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBkb2N1bWVudENsaWVudC5zY2FuKHBhcmFtcykucHJvbWlzZSgpO1xyXG4gICAgICAgIHJldHVybiBkYXRhLkl0ZW1zXHJcbiAgICB9Y2F0Y2goZXJyKXtcclxuICAgICAgICByZXR1cm4gJ1RvZG9zIHJldHVybmluZyBlcnJvcjogJyArIGVycjtcclxuICAgIH1cclxufSJdfQ==