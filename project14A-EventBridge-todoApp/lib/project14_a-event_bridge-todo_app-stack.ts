import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';


export class Project14AEventBridgeTodoAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const api = new appsync.GraphqlApi(this, 'GRAPHQLAPI', {
      name: 'testing-events',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(100))
          }
        }
      }
    })

    const httpsDS = api.addHttpDataSource('ds',
       "https://events." + this.region + ".amazonaws.com/", {
         name: 'https-DS',
         authorizationConfig: {
           signingRegion: this.region,
           signingServiceName: 'events'
         }
    })

    events.EventBus.grantAllPutEvents(httpsDS);

    httpsDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'createTodo',
      requestMappingTemplate: appsync.MappingTemplate.fromFile('request.vtl'),
      responseMappingTemplate: appsync.MappingTemplate.fromFile('response.vtl')
    })

    const echoLambda = new lambda.Function(this, 'lambdaDB', {
      code: lambda.Code.fromInline(
        "exports.handler = (event, context) => { console.log(event); context.succeed(event); }"),
        runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler'
    })

        // RULE ON DEFAULT EVENT BUS TO TARGET ECHO LAMBDA
        const rule = new events.Rule(this, "AppSyncEventBridgeRule", {
          eventPattern: {
            source: ["eru-appsync-events"], // every event that has source = "eru-appsync-events" will be sent to our echo lambda
          },
        });
        rule.addTarget(new targets.LambdaFunction(echoLambda));
    // stack out
  }
}
