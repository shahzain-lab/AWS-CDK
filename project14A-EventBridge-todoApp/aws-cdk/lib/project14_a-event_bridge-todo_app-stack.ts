import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { requestTemplate, responseTemplate } from '../utils/appsync-templates';


export class Project14AEventBridgeTodoAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // APPSYNC GRAPHQL API
    const api = new appsync.GraphqlApi(this, 'GRAPHQLAPI', {
      name: 'todoApp-eventBridge',
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

    // TODO TABLE IN DYNAMODB
    const todoTable = new dynamodb.Table(this, 'dynamoTable', {
      tableName: 'eventBridgeTodoApp',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    });

    // DYNAMODB DATASOURCE 
    const todoTableDS = api.addDynamoDbDataSource('TODO_TABLE_DATASOURCE', todoTable);

    // ACCESSING TODO LIST FROM TODO_TABLE
    todoTableDS.createResolver({
      typeName: 'Query',
      fieldName: 'allTodos',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList()
    })

    // TODO EVENT CONSUMER HANDLER
    const LambdaEventHandler = new lambda.Function(this, 'lambdaDATABASE', {
      functionName: 'todoApp-eventBrdige-ddb',
      code: lambda.Code.fromAsset('lambda'),
        runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler'
    })


    // ACCESSING ALLRESOURCES OF TODOTABLE
    todoTable.grantFullAccess(LambdaEventHandler);

    // ACCESSING TABLE NAME VIA ENVIROMENT VARIABLES
    LambdaEventHandler.addEnvironment('TODOS_TABLE', todoTable.tableName);

    // HTTPS DATASOURCE FOR GRAPHQL API
    const httpsDS = api.addHttpDataSource('ds',
       "https://events." + this.region + ".amazonaws.com/", {
         name: 'https-DS',
         authorizationConfig: {
           signingRegion: this.region,
           signingServiceName: 'events'
         }
    })

    //  HTTPS_DS MUTATIONS
    const mutations = ["createTodo", "deleteTodo"];

    mutations.forEach((mut: string) => {

      let details = `\\\"id\\\": \\\"$ctx.args.id\\\"`;
      
      if(mut === "createTodo"){
        details = `\\\"title\\\":\\\"$ctx.args.todo.title\\\" , \\\"checked\\\":\\\"$ctx.args.todo.checked\\\"`
      }else if (mut === "deleteTodo") {
        details = `\\\"id\\\":\\\"$ctx.args.id\\\"`
      }
      
      httpsDS.createResolver({
        typeName: "Mutation",
        fieldName: mut,
        requestMappingTemplate: appsync.MappingTemplate.fromString(requestTemplate(details, mut)),
        responseMappingTemplate: appsync.MappingTemplate.fromString(responseTemplate())
      })
    })

    // PERMISSION TO ROUTE EVENTS TO EVENTBUS
    events.EventBus.grantAllPutEvents(httpsDS);

    
    // RULE ON DEFAULT EVENT BUS TO TARGET LambdaEventHandler LAMBDA
    const rule = new events.Rule(this, "AppSyncEventBridgeRule", {
      eventPattern: {
      source: ["eru-appsync-events"], // every event that has source = "eru-appsync-events" will be sent to our LambdaEventHandler lambda
      },
    });
    rule.addTarget(new targets.LambdaFunction(LambdaEventHandler));

    // stack out
  }
}
