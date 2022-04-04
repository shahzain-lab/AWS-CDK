import * as AWS from 'aws-sdk';

const documentClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.BOOKMARKS_TABLE || ''

export const handler = async (event: any) => {
    try{
          //////////////  add bookmark /////////////////////////
          if (event["detail-type"] === "createBookmark") {
            console.log("creating===>", JSON.stringify(event.detail, null, 2));
            const params = {
                TableName: TABLE_NAME,
                Item: { id: 'bk' + (Math.random() * 1000), ...event.detail},
            }
            await documentClient.put(params).promise();
            return event.detail
          }

         //////////////  deleting bookmark /////////////////////////
         else if (event["detail-type"] === "deleteBookmark") {
            console.log("deleting===>", JSON.stringify(event.detail, null, 2));
            const params = {
                TableName: TABLE_NAME,
                Key: { id: event.detail.id },
            }
            await documentClient.delete(params).promise();
            return event.detail.id
         }
         
          //////////////  updating bookmark /////////////////////////
         else if (event["detail-type"] === "updateBookmark"){
            console.log("deleting===>", JSON.stringify(event.detail, null, 2));
            const params = {
                TableName: TABLE_NAME,
                Key: event.detail.id,
                Item: event.detail
            }
            await documentClient.update(params).promise()
         }
     }
    catch (error) {
        console.log('Error', error)
    }
}