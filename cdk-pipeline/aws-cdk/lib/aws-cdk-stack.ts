import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';


export class AwsCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const dynamoTable = new dynamodb.Table(this, 'DynamoTable', {
      tableName: 'CI/CD-Table',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    })

    new CfnOutput(this, 'print-table-name', {
      value: dynamoTable.tableName
    })

  }
}
