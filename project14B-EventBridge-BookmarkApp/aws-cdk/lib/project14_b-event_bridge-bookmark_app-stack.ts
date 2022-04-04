import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { EVENT_SOURCE, requestTemplate, responseTemplate } from '../utils/appsync-templates';
import { Construct } from 'constructs';
import { join } from 'path';

export class Project14BEventBridgeBookmarkAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    
    //************Frontend Deployment******************************* */

    // Storage bucket for frontend assets
    const websiteBucket = new s3.Bucket(this, 'bookmark-web-bucket', {
      publicReadAccess: true,
      versioned: true,
      websiteIndexDocument: 'index.html',
    })

    // CDN distribution from origin
    const distribution = new cloudfront.Distribution(this, 'bookmark-dist', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket)
      }
    })

    // Print domain to console
    new cdk.CfnOutput(this, 'print-domainName', {
      value: distribution.domainName
    })

    // deploying bucket
    new s3deploy.BucketDeployment(this, 'deploy-bookmarkDeploy', {
      sources: [s3deploy.Source.asset(join('__dirname', '/../../', 'packages/gatsby-client/public'))],
      destinationBucket: websiteBucket,
      distribution: distribution
    })

    //************Backend API******************** */

    // APPSYNC GRAPHQL API
    const api = new appsync.GraphqlApi(this, 'GRAPHQLAPIBookmaks', {
      name: 'bookmarkApp-eventBridge',
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

    // Bookmark TABLE IN DYNAMODB
    const bookmarkTable = new dynamodb.Table(this, 'dynamoTable', {
      tableName: 'eventBridgeBookmarkApp',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    });

    // DYNAMODB DATASOURCE 
    const todoTableDS = api.addDynamoDbDataSource('Bookmark_TABLE_DATASOURCE', bookmarkTable);

    // ACCESSING Bookmark LIST FROM Bookmark_TABLE
    todoTableDS.createResolver({
      typeName: 'Query',
      fieldName: 'bookmarks',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList()
    })

    // TODO EVENT CONSUMER HANDLER
    const LambdaEventHandler = new lambda.Function(this, 'lambdaDATABASEBookmarks', {
      functionName: 'BookmarkApp-eventBrdige-ddb',
      code: lambda.Code.fromAsset('lambda'),
        runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler'
    })


    // ACCESSING ALLRESOURCES OF TODOTABLE
    bookmarkTable.grantFullAccess(LambdaEventHandler);

    // ACCESSING TABLE NAME VIA ENVIROMENT VARIABLES
    LambdaEventHandler.addEnvironment('BOOKMARKS_TABLE', bookmarkTable.tableName);

    // HTTPS DATASOURCE FOR GRAPHQL API
    const httpsDS = api.addHttpDataSource('ds',
       "https://events." + this.region + ".amazonaws.com/", {
         name: 'https-DS-BA',
         authorizationConfig: {
           signingRegion: this.region,
           signingServiceName: 'events'
         }
    })

    const mutations = ["createBookmark", "updateBookmark", "deleteBookmark"];

    mutations.forEach((mut: string) => {
        
      let details = `\\\"id\\\": \\\"$ctx.args.id\\\"`

      if(mut === "createBookmark"){
        details = `\\\"title\\\":\\\"$ctx.args.title\\\" , \\\"url\\\":\\\"$ctx.args.url\\\"`
      }else if (mut === "deleteBookmark") {
        details = `\\\"id\\\":\\\"$ctx.args.id\\\"`
      }else if(mut === "updateBookmark"){
        details = `\\\"id\\\":\\\"$ctx.args.id\\\" , \\\"title\\\":\\\"$ctx.args.title\\\" , \\\"url\\\":\\\"$ctx.args.url\\\"`
      }

      httpsDS.createResolver({
        typeName: 'Mutation',
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
        source: [EVENT_SOURCE], // every event that has source = "eru-appsync-events" will be sent to our LambdaEventHandler lambda
        },
      });
      rule.addTarget(new targets.LambdaFunction(LambdaEventHandler));
  

    // stack out
  }
}
