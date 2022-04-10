const axios = require('axios');
const AWS = require('aws-sdk')

exports.handler = async()=> {
    const sns = new AWS.SNS();

    try{
        const result = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
       console.log("result todo 1",result.data);

    const params = {
        Message: JSON.stringify({
            call: 'hello from main lambda.',
            data: result.data
        }),
        TopicArn: process.env.TOPIC_ARN
    };
        await sns.publish(params).promise();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: result.data,
        }
    }catch(err){
        return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(err)
        }
    }
}
