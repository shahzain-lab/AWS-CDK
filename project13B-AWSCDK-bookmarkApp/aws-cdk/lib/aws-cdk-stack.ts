import * as cdk from 'aws-cdk-lib';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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
