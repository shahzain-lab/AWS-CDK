import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as actions from 'aws-cdk-lib/aws-ses-actions';


export class AwsSesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sesLambda = new lambda.Function(this, 'ses-lamnda',{
      functionName: 'ses-lamnda-invokes',
      code: lambda.Code.fromInline(
        `exports.handler = (event)=>{ console.log("EVENT ==>> ",JSON.stringify(event)) }`),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler'
    });

    const ruleSet = new ses.ReceiptRuleSet(this, 'ruleSet',{
      receiptRuleSetName: 'ses-lambda-first-rule'
    })

    const emailAddress = new cdk.CfnParameter(this, 'emailAddress', {
      type: 'String', description: "Write your recipient email"
    });

    ruleSet.addRule('INVOKES-LAMBDA-RULE',{
      recipients: [emailAddress.valueAsString],
      actions: [
        new actions.Lambda({
          function: sesLambda,
          invocationType: actions.LambdaInvocationType.EVENT
        })
      ],
      scanEnabled: true
    })

    
  }
}
