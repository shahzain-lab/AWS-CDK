import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'firstUserPool', {
      userPoolName: 'My First userpool',
      selfSignUpEnabled: true,
      signInAliases: { email: true, username: true },
      autoVerify: {email: true},
      userVerification: {
        emailSubject: 'Verify your email to access our services.',
        emailBody: 'Hello {username}, you\'re requested to verify your email.You\'re verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE
      },
      standardAttributes: {
        fullname: {
          required: true,
          mutable: false,
        },
      },
      passwordPolicy: {
        minLength: 12,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
        tempPasswordValidity: cdk.Duration.days(3),
      },   
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY
    }) 

    const userPoolClient = new cognito.UserPoolClient(this, 'userPoolClientFirst',{
      userPool,
    })

    new cdk.CfnOutput(this, 'userPoolID', {
      value: userPool.userPoolId
    })

    new cdk.CfnOutput(this, 'userPoolClientID', {
      value: userPoolClient.userPoolClientId
    })
    
  }
}
