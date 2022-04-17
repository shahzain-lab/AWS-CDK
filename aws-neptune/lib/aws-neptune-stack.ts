import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as neptune from 'aws-cdk-lib/aws-neptune';

export class AwsNeptuneStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'vpc', {
      subnetConfiguration:[
        {
          cidrMask: 24,
          name: 'ingress',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED
        }
      ]
    })

    const sg1 = new ec2.SecurityGroup(this, "mySecurityGroup2", {
      vpc,
      allowAllOutbound: true,
      description: "security group 1",
      securityGroupName: "mySecurityGroup2",
    });
    cdk.Tags.of(sg1).add("Name", "mySecurityGroup");

    sg1.addIngressRule(sg1, ec2.Port.tcp(8182), "MyRule");

    const neptuneSubnet = new neptune.CfnDBSubnetGroup(
      this,
      "neptuneSubnetGroup2",
      {
        dbSubnetGroupDescription: "My Subnet",
        subnetIds: vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_ISOLATED })
          .subnetIds,
        dbSubnetGroupName: "mysubnetgroup2",
      }
    );

    const neptuneCluster = new neptune.CfnDBCluster(this, 'neptuneClusterrDB', {
      dbSubnetGroupName: neptuneSubnet.dbSubnetGroupName,
      dbClusterIdentifier: 'mySecondID',
      vpcSecurityGroupIds: [sg1.securityGroupId]
    })
    neptuneCluster.addDependsOn(neptuneSubnet);

    const neptuneInstance = new neptune.CfnDBInstance(this, "myinstance1", {
      dbInstanceClass: "db.t3.medium",
      dbClusterIdentifier: neptuneCluster.dbClusterIdentifier,
      availabilityZone: vpc.availabilityZones[0],
    });
    neptuneInstance.addDependsOn(neptuneCluster);

    const handler = new lambda.Function(this, "Lambda12", { 
      functionName: 'neptune-vpc-lambda',
      runtime: lambda.Runtime.NODEJS_14_X,
      code: new lambda.AssetCode("lambdas/lambda1"),
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
  }
}
