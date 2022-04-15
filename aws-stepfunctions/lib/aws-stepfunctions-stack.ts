import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as stepfunctionsTasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

export class AwsStepfunctionsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    

    const tableDB = new dynamodb.Table(this, 'cdk stepfunctions table demo', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: 'stepfunctions',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    })


    const addData = new lambda.Function(this, 'lambdaFunctions', {
      code: lambda.Code.fromAsset('lambda'),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'addData.handler'
    })

    addData.addEnvironment('TABLE_NAME', tableDB.tableName)
    tableDB.grantReadWriteData(addData)

    // const echoStatus = new lambda.Function(this, "echoStatus", {
    //   runtime: lambda.Runtime.NODEJS_14_X, // execution environment
    //   code: lambda.Code.fromAsset("lambda"), // code loaded from "lambda" directory
    //   handler: "echoStatus.handler",
    // });

    const firstState = new stepfunctionsTasks.LambdaInvoke(this, 'lambdainvoke',{
      lambdaFunction: addData,
      payload: stepfunctions.TaskInput.fromText(`this text is an input of the curent lambda function`)
    })

    const jobSuccess = new stepfunctions.Succeed(this, 'The job has been succeed')
    const jobFail = new stepfunctions.Fail(this, 'The job has not been succeed')

    const choice = new stepfunctions.Choice(this, 'lambda excution choice');
    choice.when(
      stepfunctions.Condition.booleanEquals(
        "$.Payload.operationSuccessful",
        true
      ),
      jobSuccess
    )
    choice.when(
      stepfunctions.Condition.booleanEquals(
        "$.Payload.operationSuccessful",
        false
      ),
      jobFail
    )

    const secondState = new stepfunctions.Pass(this, "seond invoke", {
      result: stepfunctions.Result.fromObject({
        hello: 'hello afterward'
      }),
      
      resultPath: "$.output.afterwards",
    })

    // choice.afterwards().next(secondState)


    const chain = stepfunctions.Chain.start(firstState).next(choice)

    new stepfunctions.StateMachine(this, 'state', {
      definition: chain
    })
  }
}
