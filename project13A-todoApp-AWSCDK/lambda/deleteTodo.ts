import { DynamoDB } from 'aws-sdk';


const documentClient = new DynamoDB.DocumentClient()
export const deleteTodo = async(id: string) => {
    try{
        const params = {
            TableName: process.env.TODOS_TABLE || '',
            Key: {
                id
            }
        }
        await documentClient.delete(params).promise();
        return id
    }catch(err){
        return 'Todos deleting error: ' + err;
    }
}