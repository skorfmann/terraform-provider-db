# A Terraform Provider Database

This uses CDK for Terraform (cdktf) to provision a serverless application to do two things:

- Fetch and publish Terraform Provider Schemas to a AWS S3 Bucket
- Build cdktf TypeScript types from these provider schemas for further analysis
- Provide an AWS Athena interface to this data

## Use it

Assumes valid AWS credentials in ENV

```
yarn install
cdktf deploy
```

## Still to Build

- [ ] Iterate over all providers
- [ ] Select compatible Terraform version depending on provider protocol
- [ ] Add Glue / Athena as constructs
- [ ] Extract constructs into dedicated repository
- [ ] Tests
- [ ] Cloudfront to make schemas publicly accessible
- [ ] Web hook to build and publish a single provider schema