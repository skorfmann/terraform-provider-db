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