import * as AWS from 'aws-sdk';

const documentClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.Lollies_TABLE || ''

export const handler = async (event: any) => {
    try{
          //////////////  add createLolly /////////////////////////
          if (event["detail-type"] === "createLolly") {
            console.log("creating===>", JSON.stringify(event.detail, null, 2));
            const params = {
                TableName: TABLE_NAME,
                Item: { slug: 'vl' + (Math.random() * 1000), ...event.detail},
            }
            await documentClient.put(params).promise();
            return event.detail
          }
     }
    catch (error) {
        console.log('Error', error)
    }
}