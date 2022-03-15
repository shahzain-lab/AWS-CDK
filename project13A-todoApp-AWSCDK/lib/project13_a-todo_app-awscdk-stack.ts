import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';

export class Project13ATodoAppAwscdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /// APPSYNC INITIALIZED
    const api = new appsync.GraphqlApi(this, 'TodoGraphqlapi', {
      name: 'Todos graphqlAPI',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        }
      }
    })

    /// LAMBDA - FUNCTION
    const lambdaHandler = new lambda.Function(this, 'lambdaAPIHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'main.handler'
    })

    /// DYNAMODB INITIALIZED
    const todosTable = new dynamodb.Table(this, 'dynamoTable', {
      tableName: 'TodosItems',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    })

    /// ACCESS TABLE FROM LAMBDA
    todosTable.grantFullAccess(lambdaHandler);

    ///  ADD EVRIOMENTAL VARIABLE 
    lambdaHandler.addEnvironment('TODOS_TABLE', todosTable.tableName)

    /// LAMBDA as a DATASOURCE
    const lambdaDS = api.addLambdaDataSource("lambdaDATASOURCE", lambdaHandler);

    /// APPSYNC - RESOLVERS
    lambdaDS.createResolver({
      typeName: 'Query',
      fieldName: 'allTodos'
    });

    lambdaDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'createTodo'
    });

    lambdaDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteTodo'
    });
  }
}
