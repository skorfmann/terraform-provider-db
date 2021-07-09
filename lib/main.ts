import { Construct } from 'constructs';
import { App, TerraformStack, RemoteBackend } from 'cdktf';
import * as aws from '@cdktf/provider-aws';
import { PublishSchema } from '../components/publish-schema'
import { ProviderVersions } from '../components/provider-versions'
import { AwsEventBridge } from '../constructs/aws-event-bridge'

class DevStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new aws.AwsProvider(this, 'default', {
      region: 'eu-central-1'
    })

    const eventBridge = new AwsEventBridge(this, 'provider-db');

    new ProviderVersions(this, 'provider-versions', {
      eventBridge,
    });

    new PublishSchema(this, 'publish-schema', {
      eventBridge
    });

    new RemoteBackend(this, {
      hostname: 'app.terraform.io',
      organization: 'cdktf',
      workspaces: {
        name: 'provider-db'
      }
    });
  }
}

const app = new App();
new DevStack(app, 'provider-db-dev');
app.synth();
