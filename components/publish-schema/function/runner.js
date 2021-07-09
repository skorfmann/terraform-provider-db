const { exec } = require("child_process");
const { promisify } = require('util');
const { readSchema } = require('cdktf-cli/lib/get/generator/provider-schema');
const { ConstructsMakerTarget, Language } = require('cdktf-cli/lib/get/constructs-maker');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const client = new S3Client({ region: "eu-central-1" });
const bucket = process.env.BUCKET;

exports.handler = async function(event, context) {
  const customExec = promisify(exec)

  const name = event.detail.name;
  const fqn = event.detail.namespace + "/" + name;
  const version = event.detail.version;
  const key = `provider/${fqn}/${version}/schema.json`

  // event.detail structure
  // "id": "hashicorp/azurestack/0.10.0",
  // "owner": "",
  // "namespace": "hashicorp",
  // "name": "azurestack",
  // "alias": null,
  // "version": "0.10.0",

  const target = ConstructsMakerTarget.from({
    name,
    source: name,
    version: `= ${version}`,
    fqn: fqn,
  }, Language.TYPESCRIPT)

  try {
    // cleanup potential leftover files from previous runs
    await customExec(`rm -rf /tmp/*`, { stdio: "inherit" })
    await customExec(`mkdir -p /tmp/.terraform.d/plugin-cache`, { stdio: "inherit" });

    const result = await readSchema([target]);

    const command = new PutObjectCommand({Bucket: bucket, Key: key, Body: JSON.stringify(result.providerSchema, null, 2), ContentType: "application/json"});
    await client.send(command)
  } catch(e) {
    console.log(e)
    throw e
  }

  return
}