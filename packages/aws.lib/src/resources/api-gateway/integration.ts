import { Resource } from "@notation/core";
import {
  PutIntegrationCommand,
  PutIntegrationCommandInput as IntegrationInput,
  PutIntegrationCommandOutput as IntegrationOutput,
} from "@aws-sdk/client-api-gateway";
import { Api } from "./api";
import { apiGatewayClient } from "src/utils/aws-clients";

export type IntegrationConfig = {
  name: string;
  type: IntegrationInput["type"];
  uri: IntegrationInput["uri"];
  httpMethod: IntegrationInput["httpMethod"];
};

export type IntegrationDependencies = {
  api: Api;
  resource: Resource<{}, { id: string; arn: string }>;
};

export class Integration extends Resource<
  IntegrationInput,
  IntegrationOutput,
  IntegrationConfig,
  IntegrationDependencies
> {
  type = "api-gateway/integration";
  region = "eu-west-1";

  getDeployProps(): IntegrationInput {
    return {
      type: this.config.type,
      uri: this.config.uri,
      restApiId: this.dependencies.api.output.id,
      resourceId: this.dependencies.resource.output.id,
      httpMethod: this.config.httpMethod,
    };
  }

  deploy(props: IntegrationInput) {
    const command = new PutIntegrationCommand(props);
    return apiGatewayClient.send(command);
  }
}
