import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as CodePipeline from 'aws-cdk-lib/aws-codepipeline'
import * as pipelineActions from 'aws-cdk-lib/aws-codepipeline-actions'
import * as CodeBuild from 'aws-cdk-lib/aws-codebuild';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as events from 'aws-cdk-lib/aws-events'
import * as eventsTargets from 'aws-cdk-lib/aws-events-targets'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { join } from 'path';
import { EVENT_SOURCE, requestTemplate, responseTemplate } from '../utils/appsync-templates';

export class Project14CEventBridgeVirtualLollyAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);



  //  *******************(FrontEnd deployment)*******************

    // Storage bucket for frontend assets
    const websiteBucket = new s3.Bucket(this, 'website-storage-bucket', {
      publicReadAccess: true,
      versioned: true,
      websiteIndexDocument: 'index.html',
    })

    // CDN distribution from origin
    const distribution = new cloudfront.Distribution(this, 'dist', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket)
      }
    })

    // Print domain to console
    new cdk.CfnOutput(this, 'print-domainName', {
      value: distribution.domainName
    })

    // deploying bucket
    new s3deploy.BucketDeployment(this, 'bucketDeploy', {
      sources: [s3deploy.Source.asset(join('__dirname', '/../../', 'packages/client/public'))],
      destinationBucket: websiteBucket,
      distribution: distribution
    })

//  *******************(backend APIs)*******************


    // graphql client side api powered by appsync
    const api = new appsync.GraphqlApi(this, 'graphqlVirtuallollyEventBridgeApi', {
      name: 'VirtualLolly EventBridge Graphql',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(360))
          }
        }
      }
    });

   // db's table for storing and retreiving lollies
    const lolliesTable = new dynamodb.Table(this, 'lolliesTable', {
      tableName: 'vitualEventBridgeLollies',
      partitionKey: {
        name: 'slug',
        type: dynamodb.AttributeType.STRING
      }
    });

    // dynamo as a datasource
    const lolliesDS = api.addDynamoDbDataSource('dynamoLolliesDATASOURCE', lolliesTable);


    // creating resolvers
    lolliesDS.createResolver({
      typeName: 'Query',
      fieldName: 'allLollies',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList()
    })
  

    // TODO EVENT CONSUMER HANDLER
    const LambdaEventHandler = new lambda.Function(this, 'lambdaDATABASEVirtuallLolly', {
      functionName: 'VirtuallLolly-eventBrdige-ddb',
      code: lambda.Code.fromAsset('lambda'),
        runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler'
    })


    // ACCESSING ALLRESOURCES OF TODOTABLE
    lolliesTable.grantFullAccess(LambdaEventHandler);

    // ACCESSING TABLE NAME VIA ENVIROMENT VARIABLES
    LambdaEventHandler.addEnvironment('Lollies_TABLE', lolliesTable.tableName);

    // HTTPS DATASOURCE FOR GRAPHQL API
    const httpsDS = api.addHttpDataSource('VL',
       "https://events." + this.region + ".amazonaws.com/", {
         name: 'https-DS-VL',
         authorizationConfig: {
           signingRegion: this.region,
           signingServiceName: 'events'
         }
    })

    const mutations = ["createLolly"];

    mutations.forEach((mut: string) => {
        
      let details = `\\\"id\\\": \\\"$ctx.args.id\\\"`

      if(mut === "createLolly"){
        details = `\\\"recName\\\":\\\"$ctx.args.recName\\\" , \\\"message\\\":\\\"$ctx.args.message\\\", \\\"senderName\\\":\\\"$ctx.args.senderName\\\", \\\"flavorTop\\\":\\\"$ctx.args.flavorTop\\\", \\\"flavorMiddle\\\":\\\"$ctx.args.flavorMiddle\\\", \\\"flavorBottom\\\":\\\"$ctx.args.flavorBottom\\\"`
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
      const rule = new events.Rule(this, "AppSyncEventBridgeRuleforVirtuallolly", {
        eventPattern: {
        source: [EVENT_SOURCE], // every event that has source = "eru-appsync-events" will be sent to our LambdaEventHandler lambda
        },
      });
      rule.addTarget(new eventsTargets.LambdaFunction(LambdaEventHandler));
  




//  *******************(CI CD pipeline)*******************
 //stackName
    const stackName = 'Project14CEventBridgeVirtualLollyAppStack'

    // Artifact outputs
    const sourceOutput = new CodePipeline.Artifact()
    const buildOutput = new CodePipeline.Artifact()

    // CDK build instructions
    const cdkBuild = new CodeBuild.PipelineProject(this, 'CDKBUILD', {
      buildSpec: CodeBuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            "runtime-versions": {
              "nodejs": 12
            },
            commands: [
              'cd project14C-EventBridge-virtualLollyApp',
              'cd aws-cdk',
              'npm install'
            ],
          },
          build: {
            commands: [
              'npm run build',
              'npm run cdk synth -- -o dist'
            ]
          }
        },
        artifacts: {
          'base-directory': 'project14C-EventBridge-virtualLollyApp/aws-cdk/dist',
          files: [
            `${stackName}.template.json`
          ]
        }
      }),
      environment: {
        buildImage: CodeBuild.LinuxBuildImage.STANDARD_3_0
      }
    })

    //cdk deploy MyStack --parameters githubAccessTokenSecret=your secrets.
    const githubAccess = new cdk.CfnParameter(this, 'githubAccessTokenSecret', {
      type: 'String',
      description: 'write your github secret here'

    })
  
    const pipeline = new CodePipeline.Pipeline(this, 'cdkPipelineVirtualLollyApp', {
      pipelineName: 'virtualLollies-eventsbridge-pipeline',
      crossAccountKeys: false,
      restartExecutionOnUpdate: true
    })

    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new pipelineActions.GitHubSourceAction({
          actionName: 'Checkout',
          owner: 'shahzain-lab',
          repo: 'AWS-CDK',
          oauthToken: cdk.SecretValue.plainText(githubAccess.valueAsString),
          output: sourceOutput,
          branch: 'master',
        })
      ]
    })

    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new pipelineActions.CodeBuildAction({
          actionName: 'cdkBuild',
          project: cdkBuild,
          input: sourceOutput,
          outputs: [buildOutput],
        }),
      ],
    })

    pipeline.addStage({
      stageName: 'DeployCDK',
      actions: [
        new pipelineActions.CloudFormationCreateUpdateStackAction({
          actionName: "AdministerPipeline",
          templatePath: buildOutput.atPath(`${stackName}.template.json`),   ///Input artifact with the CloudFormation template to deploy
          stackName: stackName,                                           ///Name of stack
          adminPermissions: true  
        }),
      ],
    })
    // stack out
  }
}
