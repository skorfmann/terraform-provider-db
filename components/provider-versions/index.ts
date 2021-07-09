import { Construct } from "constructs";
import { Resource } from 'cdktf';
import { NodejsFunction } from '../../constructs/nodejs-function';
import * as iam from 'iam-floyd';
import * as path from 'path';
import { AwsEventBridge } from '../../constructs/aws-event-bridge';

export interface ProviderVersionsConfig {
  eventBridge: AwsEventBridge;
}

export class ProviderVersions extends Resource {
  constructor(scope: Construct, name: string, config: ProviderVersionsConfig) {
    super(scope, name);

    const { eventBridge } = config;

    const nodeFunction = new NodejsFunction(scope, 'getProviderVersions', {
      path: path.join(__dirname, 'handler', 'index.ts'),
      environment: {
        EVENT_BUS_NAME:  eventBridge.name,
      }
    });

    nodeFunction.serviceRole.addPolicyStatements(
      new iam.Events().allow().toPutEvents().on(eventBridge.bus.arn)
    );
  }
}