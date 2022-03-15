import { DynamoDB } from 'aws-sdk';
import { Todo } from './Todo';


const documentClient = new DynamoDB.DocumentClient()
export const createTodo = async(todo: Todo) => {
    try{
        const params = {
            TableName: process.env.TODOS_TABLE || '',
            Item: todo
        }
        await documentClient.put(params).promise();
        return todo;
    }catch(err){
        return 'Todo returning error: ' + err;
    }
}