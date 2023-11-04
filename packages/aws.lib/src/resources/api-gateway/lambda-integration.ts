import { Resource, createResourceFactory } from "@notation/core";
import {
  PutIntegrationCommand,
  PutIntegrationCommandInput,
  PutIntegrationCommandOutput,
} from "@aws-sdk/client-api-gateway";
import { Api } from "./api";
import { apiGatewayClient } from "src/utils/aws-clients";

type Lambda = Resource<{}, { id: string; arn: string }>;

export type LambdaIntegrationInput = PutIntegrationCommandInput;
export type LambdaIntegrationOutput = PutIntegrationCommandOutput;
export type LambdaIntegrationDependencies = {
  api: InstanceType<typeof Api>;
  lambda: Lambda;
};

const createLambdaIntegrationClass = createResourceFactory<
  LambdaIntegrationInput,
  LambdaIntegrationOutput,
  LambdaIntegrationDependencies
>();

export const LambdaIntegration = createLambdaIntegrationClass({
  type: "api-gateway/integration/lambda",

  getDefaultConfig: (dependencies) => ({
    restApiId: dependencies.api.output.id,
    resourceId: dependencies.lambda.output.id,
    type: "AWS_PROXY",
    uri: getLambdaInvocationUri("eu-west-1", dependencies.lambda.output.arn),
  }),

  deploy: async (input) => {
    const command = new PutIntegrationCommand(input);
    return apiGatewayClient.send(command);
  },
});

const getLambdaInvocationUri = (region: string, arn: string) => {
  return `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${arn}/invocations`;
};
