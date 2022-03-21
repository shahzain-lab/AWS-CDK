import * as cdk from 'aws-cdk-lib';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { join } from 'path';

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //************Frontend Deployment******************************* */

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

    //************Backend API******************** */

    // Appsync Intialized
    const api = new appsync.GraphqlApi(this, 'myGraphqlAPI', {
      name: "Bookmark graphql API",
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY
        }
      }
    })

    // dynamoDB Table instance
    const bookmarkTable = new dynamodb.Table(this, 'bookmarkTableInstance', {
      tableName: 'bookmarks',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    })

    // dynamo as a Datasource
    const dynamoDS = api.addDynamoDbDataSource('dynamoDBdatasource', bookmarkTable);


    // create resolver
    dynamoDS.createResolver({
      typeName: 'Query',
      fieldName: 'bookmarks',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList()
    })

    dynamoDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'createBookmark',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PrimaryKey.partition("id").auto(),
        appsync.Values.projecting()
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
    })
    dynamoDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteBookmark',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbDeleteItem('id', 'id'),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
    })
    dynamoDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateBookmark',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PrimaryKey.partition('id').is('id'),
        appsync.Values.projecting()
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
    })

  }
}
