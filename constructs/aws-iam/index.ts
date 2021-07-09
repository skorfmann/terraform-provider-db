import { PolicyStatement } from 'iam-floyd';
import { Construct, Node } from 'constructs';
import { Resource, Lazy, IResolveContext } from 'cdktf';
import * as aws from '@cdktf/provider-aws';
import * as iam from 'iam-floyd';

export class Policy {
  public static document(statement: PolicyStatement): string {
    return JSON.stringify({
      'Version': "2012-10-17",
      "Statement": [statement]
    })
  }
}

export interface AwsServiceRoleOptions {
  name?: string
  service: string | string[]
  policyStatements: iam.PolicyStatement[]
}

export class AwsServiceRole extends Resource {
  public readonly role: aws.IamRole
  private readonly policyStatements: iam.PolicyStatement[] = [];

  constructor(scope: Construct, id: string, props: AwsServiceRoleOptions) {
    super(scope, id)

    const { service } = props;

    const name = Node.of(this).addr

    this.policyStatements = props.policyStatements;

    const statement = new iam.Sts()
      .allow()
      .toAssumeRole()
      .to('sts:SetSourceIdentity')

    if (Array.isArray(service)) {
      for (const s of service) {
        statement.forService(s)
      }
    } else {
      statement.forService(service)
    }

    this.role = new aws.IamRole(this, `role`, {
      name,
      assumeRolePolicy: Policy.document(statement.toJSON())
    })

    const notesPolicy = new aws.IamPolicy(this, `role-policy`, {
      name: `${name}-role-policy`,
      path: '/',
      policy: Lazy.stringValue({
        produce: (_context: IResolveContext) => {
          return JSON.stringify({
            Version: '2012-10-17',
            Statement: this.policyStatements
          })
        }
      })
    })

    new aws.IamRolePolicyAttachment(this, `PolicyAttachment`, {
      policyArn: notesPolicy.arn,
      role: this.role.name
    })
  }

  public addPolicyStatements(...statements: iam.PolicyStatement[]) {
    this.policyStatements.push(...statements);
  }
}