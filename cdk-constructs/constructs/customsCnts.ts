import { Construct } from "constructs";
export interface NotifyingBucketProps {
    prefix?: string;
  }
  
export class BucketsCnts extends Construct{
    constructor(scope: Construct, id: string, props: NotifyingBucketProps ){
         super(scope, id)

        // const bucket = new s3.Bucket(this, "bucket");
        // this.topic = new sns.Topic(this, "topic");
    
        // bucket.addObjectCreatedNotification(
        //   new s3notify.SnsDestination(this.topic),
        //   { prefix: props.prefix }
        // );
    
    }
}