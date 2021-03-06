import { Construct } from "constructs";
import { Resource } from 'cdktf';
import { NodejsFunction, AwsEventBridge } from '@cdktf-plus/aws';
import * as iam from 'iam-floyd';
import * as path from 'path';

export interface ProviderVersionsConfig {
  eventBridge: AwsEventBridge;
}

export class ProviderVersions extends Resource {
  constructor(scope: Construct, name: string, config: ProviderVersionsConfig) {
    super(scope, name);

    const { eventBridge } = config;

    const nodeFunction = new NodejsFunction(scope, 'getProviderVersions', {
      path: path.join(__dirname, 'handler', 'index.ts'),
      timeout: 60,
      memorySize: 512,
      environment: {
        EVENT_BUS_NAME:  eventBridge.name,
      }
    });

    nodeFunction.serviceRole.addPolicyStatements(
      new iam.Events().allow().toPutEvents().on(eventBridge.bus.arn)
    );
  }
}