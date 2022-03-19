import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import { join } from 'path';

export class FullstackDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const websiteBucket = new s3.Bucket(this, 's3Bucket', {
      versioned: true,
      websiteIndexDocument: 'index.html',
      publicReadAccess:true
    })

    const distribution = new cloudfront.Distribution(this, 'distweb', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket)
      }
    })
    
    new CfnOutput(this, 'domainName', {
      value: distribution.domainName
    })

    new s3deploy.BucketDeployment(this, 'bucketDeploy', {
      sources: [s3deploy.Source.asset(join('__dirname', '/../../', 'packages/client/public'))],
      destinationBucket: websiteBucket,
      distribution: distribution
    })

  }
}
