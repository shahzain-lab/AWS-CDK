import * as AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = process.env.TODOS_TABLE || '';

export const handler = async (event: any) => {
    console.log(JSON.stringify(event, null, 2));
    
    try {
        //////////////  add Todo /////////////////////////
        if (event["detail-type"] === "createTodo") {
            console.log("detail===>", JSON.stringify(event.detail, null, 2));
            const params = {
                TableName: TABLE_NAME,
                Item: { id: 'mk' + (Math.random() * 1000), ...event.detail},
            }
            await docClient.put(params).promise();
            return event.detail
        }

        //////////////  deleting todo /////////////////////////
        else if (event["detail-type"] === "deleteTodo") {
            console.log("detail===>", JSON.stringify(event.detail, null, 2));
            const params = {
                TableName: TABLE_NAME,
                Key: { id: event.detail.id },
            }
            await docClient.delete(params).promise();
            return event.detail.id
        }
    }
    catch (error) {
        console.log('Error', error)
    }
}
