import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import got from 'got';
import { ProviderVersions } from "./provider-versions";
import { ProviderList } from './provider-list';

const client = new EventBridgeClient({ region: "eu-central-1" });
const eventBusName = process.env.EVENT_BUS_NAME;

const fetchProviders = async () => {
  const providers = await got.get('https://registry.terraform.io/v1/providers', {
    responseType: 'json'
  });

  return providers.body as ProviderList;
}

const fetchProviderVersions = async (providerName: string) => {
  const providerVersions = await got.get(`https://registry.terraform.io/v1/providers/${providerName}/versions`, {
    responseType: 'json'
  });
  return providerVersions.body as ProviderVersions
}

interface PublishProviderSchema {
  id:           string;
  owner:        string;
  namespace:    string;
  name:         string;
  alias:        null;
  version:      string;
}

const publish = async (event: PublishProviderSchema) => {
  const command = new PutEventsCommand({
    Entries: [
      {
        EventBusName: eventBusName,
        Detail: JSON.stringify(event),
        DetailType: `Publish Provider Schema for ${event.namespace}/${event.name}`,
        Source: "com.cdktf.provider-db"
      }
    ]
  });
  await client.send(command);
}

export const handler = async (_event: any) => {
  const providers = await fetchProviders();
  for (const provider of providers.providers) {
    const fqn = `${provider.namespace}/${provider.name}`;
    const versions = await fetchProviderVersions(fqn);
    for (const version of versions.versions) {
      await publish({
        id: provider.id,
        owner: provider.owner,
        namespace: provider.namespace,
        name: provider.name,
        alias: provider.alias,
        version: version.version,
      })
    }
  }
}