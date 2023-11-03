import { Resource } from "@notation/core";
import {
  PutIntegrationCommand,
  PutIntegrationCommandInput,
  PutIntegrationCommandOutput,
} from "@aws-sdk/client-api-gateway";
import { Api } from "./api";
import { apiGatewayClient } from "src/utils/aws-clients";

export type LambdaIntegrationInput = PutIntegrationCommandInput;
export type LambdaIntegrationOutput = PutIntegrationCommandOutput;

export type LambdaIntegrationConfig = Omit<
  LambdaIntegrationInput,
  "restApiId" | "resourceId" | "type" | "uri" | "httpMethod"
>;

export type LambdaIntegrationDependencies = {
  api: Api;
  lambda: Resource<{}, { id: string; arn: string }>;
};

export class LambdaIntegration extends Resource<
  LambdaIntegrationInput,
  LambdaIntegrationOutput,
  LambdaIntegrationConfig,
  LambdaIntegrationDependencies
> {
  type = "api-gateway/integration/lambda";
  region = "eu-west-1";

  getDeployInput(): LambdaIntegrationInput {
    return {
      restApiId: this.dependencies.api.output.id,
      resourceId: this.dependencies.lambda.output.id,
      type: "AWS_PROXY",
      uri: LambdaIntegration.getLambdaInvocationUri(
        this.region,
        this.dependencies.lambda.output.arn,
      ),
      httpMethod: "POST",
      ...this.config,
    };
  }

  async deploy(input: LambdaIntegrationInput) {
    const command = new PutIntegrationCommand(input);
    return apiGatewayClient.send(command);
  }

  static getLambdaInvocationUri(region: string, arn: string) {
    return `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${arn}/invocations`;
  }
}
