import { Construct } from "constructs";
import { Resource } from 'cdktf';
import { DockerFunction } from '../../constructs/docker-function';
import * as aws from '@cdktf/provider-aws';
import * as iam from 'iam-floyd';
import * as path from 'path';
import { AwsEventBridge } from "../../constructs/aws-event-bridge";

export interface PublishSchemaConfig {
  eventBridge: AwsEventBridge
}

export class PublishSchema extends Resource {
  constructor(scope: Construct, name: string, config: PublishSchemaConfig) {
    super(scope, name);

    const { eventBridge } = config;

    const bucket = new aws.S3Bucket(scope, 'schema-bucket', {
      bucketPrefix: 'schema-bucket',
    })

    const lambda = new DockerFunction(scope, 'publish-schema-lambda', {
      path: path.join(__dirname, 'function'),
      environment: {
        BUCKET: bucket.bucket,
      }
    });

    lambda.serviceRole.addPolicyStatements(
      new iam.S3()
        .allow()
        .toPutObject()
        .toPutObjectAcl()
        .on(bucket.arn, `${bucket.arn}/*`)
    );

    eventBridge.addIntegration(lambda.fn, {
      'detail-type': [
        { 'prefix': 'Publish Provider Schema' },
      ],
      source: [
        'com.cdktf.provider-db'
      ]
    })

  }
}