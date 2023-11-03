import { Resource } from "@notation/core";
import { PutIntegrationCommandInput as IntegrationInput } from "@aws-sdk/client-api-gateway";
import { Api } from "./api";
import { Integration } from ".";

export type LambdaIntegrationConfig = {
  name: string;
};

export type LambdaIntegrationDependencies = {
  api: Api;
  lambda: Resource<{}, { id: string; arn: string }>;
};

export class LambdaIntegration extends Resource<
  {},
  {},
  LambdaIntegrationConfig,
  LambdaIntegrationDependencies
> {
  type = "api-gateway/integration/lambda";
  region = "eu-west-1";
  integration: Integration;

  constructor(opts: {
    config: LambdaIntegrationConfig;
    dependencies: LambdaIntegrationDependencies;
  }) {
    super(opts);
    this.integration = new Integration({
      config: {
        name: opts.config.name,
        type: "AWS_PROXY",
        uri: LambdaIntegration.getLambdaInvocationUri(
          this.region,
          this.dependencies.lambda.output.arn,
        ),
        httpMethod: "POST",
      },
      dependencies: {
        api: opts.dependencies.api,
        resource: opts.dependencies.lambda,
      },
    });
  }

  getDeployProps() {
    return this.integration.getDeployProps();
  }

  deploy(props: IntegrationInput) {
    return this.integration.deploy(props);
  }

  static getLambdaInvocationUri(region: string, arn: string) {
    return `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${arn}/invocations`;
  }
}
