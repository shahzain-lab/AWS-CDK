import {  Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sub from 'aws-cdk-lib/aws-sns-subscriptions';
import * as destination from 'aws-cdk-lib/aws-lambda-destinations';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam' 


export class LamndaDestinationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // lambda layers
    const layer = new lambda.LayerVersion(this, 'lambdaLayerVersion', {
      code: lambda.Code.fromAsset('lambda-layer')
    })

    // sns topic
    const snsTopic = new sns.Topic(this, 'snsTopic');

    // event bus
    const lambdaEventBus = new events.EventBus(this, 'lambdaEventBus', {
      eventBusName: 'lambdaEventBus'
    })

    // subscriber
    const subscriberlambda = new lambda.Function(this, 'sub-lambda', {
      functionName: 'subscriber',
      code: lambda.Code.fromAsset('lambda'),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'subscriber.handler',
      onSuccess: new destination.EventBridgeDestination(lambdaEventBus),
      onFailure: new destination.EventBridgeDestination(lambdaEventBus)
    })

    snsTopic.addSubscription(new sub.LambdaSubscription(subscriberlambda))
    
    // lambda that will produce message
    const mainlambda = new lambda.Function(this, 'lambda-functions', {
      functionName: 'lambdaLayer',
      code: lambda.Code.fromAsset('lambda'),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      layers: [layer],
      environment: {
        TOPIC_ARN: snsTopic.topicArn
      }
    })

    mainlambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["sns:*"],
        resources: ["*"]
      })
    );

    const successLambda = new lambda.Function(this, 'SuccesserLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'success.handler'
    });

    const successRule = new events.Rule(this, 'successRule', {
      eventBus: lambdaEventBus,
      eventPattern:
      {
        "detail": {
          "responsePayload": {
            "source": ["event-success"],
            "action": ["data"]
          }
        }
      },
      targets : [
        new targets.LambdaFunction(successLambda)
      ]
    });

    const failLambda = new lambda.Function(this, 'failureLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'fail.handler',
    });

    const failRule = new events.Rule(this, 'failRule', {
      eventBus: lambdaEventBus,
      eventPattern:
      {
        "detail": {
          "responsePayload": {
            "source": ["event-fail"],
            "action": ["data"]
          }
        }
      },
      targets : [
        new targets.LambdaFunction(failLambda)
      ]
    });



    // stack out
  }
}
