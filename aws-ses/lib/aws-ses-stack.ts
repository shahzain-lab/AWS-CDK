import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as neptune from 'aws-cdk-lib/aws-neptune';
import * as apigw from 'aws-cdk-lib/aws-apigateway';


export class AwsSesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // creating VPC to store neptune instance
    const vpc = new ec2.Vpc(this, 'customVPC', {
      subnetConfiguration:[
        {
          name: 'ingress',
          cidrMask: 24,
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED
        }
      ]
    })

    const sg1 = new ec2.SecurityGroup(this, 'securityGroup', {
      vpc,
      allowAllOutbound: true,
      securityGroupName: 'security config',
      description: 'first sg group vpc'
    })
    
    sg1.addIngressRule(sg1, ec2.Port.tcp(8182), 'firstrule'),

    cdk.Tags.of(sg1).add("Name", "Security group")
    
    const neptuneSubnetCluster = new neptune.CfnDBSubnetGroup(this, 'neptuneSubnetGroup', {
      dbSubnetGroupDescription: 'mySubnet',
      subnetIds: vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_ISOLATED })
      .subnetIds,
    dbSubnetGroupName: "mysubnetgroup",
    })

    const neptuneCluster = new neptune.CfnDBCluster(this, 'dbClusterNeptune', {
      dbClusterIdentifier: 'myNeptuneCluster',
      dbSubnetGroupName: neptuneSubnetCluster.dbSubnetGroupName,
      vpcSecurityGroupIds: [sg1.securityGroupId]
    })
    neptuneCluster.addDependsOn(neptuneSubnetCluster)

    const neptuneINstance = new neptune.CfnDBInstance(this, 'dbInstane', {
      dbInstanceClass: 'db.t3.medium',
      dbClusterIdentifier: neptuneCluster.dbClusterIdentifier,
      availabilityZone: vpc.availabilityZones[0]
    })
    neptuneINstance.addDependsOn(neptuneCluster);

    const handler = new lambda.Function(this, "Lambda", { 
      runtime: lambda.Runtime.NODEJS_14_X,
      code: new lambda.AssetCode("lambdas/gremlin"),
      handler: "index.handler",
      vpc: vpc,
      securityGroups: [sg1],
      environment: {
        NEPTUNE_ENDPOINT: neptuneCluster.attrEndpoint
      },
      vpcSubnets:
        {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED                                                                                                               
        }
    });
    new cdk.CfnOutput(this, "Neptune Endpoint", {
      value: neptuneCluster.attrEndpoint
    }
    )
 
 
     const apigateway = new apigw.LambdaRestApi(this, "api", {
       handler: handler
     });

     new cdk.CfnOutput(this, "apigatway Endpoint", {
      value: apigateway.url
    }
    )

  }

}
