import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { join } from 'path';


export class AwsCdkAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      //************Frontend Deployment******************************* */

    // Storage bucket for frontend assets
    const websiteBucket = new s3.Bucket(this, 'website-bucket', {
      publicReadAccess: true,
      versioned: true,
      websiteIndexDocument: 'index.html',
    })

    // CDN distribution from origin
    const distribution = new cloudfront.Distribution(this, 'websitedist', {
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

    new cdk.CfnOutput(this, 'printDomain', {
      value: distribution.domainName
    })
  }
}
