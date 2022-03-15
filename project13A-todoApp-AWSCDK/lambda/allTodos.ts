import { DynamoDB } from 'aws-sdk';


const documentClient = new DynamoDB.DocumentClient()
export const allTodos = async() => {
    try{
        const params = {
            TableName: process.env.TODOS_TABLE || '',
        }
        const data = await documentClient.scan(params).promise();
        return data.Items
    }catch(err){
        return 'Todos returning error: ' + err;
    }
}