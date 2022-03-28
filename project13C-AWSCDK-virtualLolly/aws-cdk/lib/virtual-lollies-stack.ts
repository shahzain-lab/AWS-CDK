import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';


export class VirtualLolliesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // graphql client side api powered by appsync
    const api = new appsync.GraphqlApi(this, 'graphqlVirtuallollyApi', {
      name: 'virtualLolly-graphql',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        }
      }
    });

   // db's table for storing and retreiving lollies
    const lolliesTable = new dynamodb.Table(this, 'dynamodbTable', {
      tableName: 'vitualLollies',
      partitionKey: {
        name: 'slug',
        type: dynamodb.AttributeType.STRING
      }
    });

    // dynamo as a datasource
    const lolliesDS = api.addDynamoDbDataSource('dynamoLolliesDS', lolliesTable);


    // creating resolvers
    lolliesDS.createResolver({
      typeName: 'Query',
      fieldName: 'allLollies',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList()
    })
    
    
    lolliesDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'createLolly',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PartitionKey.partition('slug').auto(),
        appsync.Values.projecting()
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
    })
  
    // stack out
  }
}
