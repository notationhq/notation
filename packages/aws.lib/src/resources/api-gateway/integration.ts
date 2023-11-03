import { Resource } from "@notation/core";
import {
  PutIntegrationCommand,
  PutIntegrationCommandInput,
  PutIntegrationCommandOutput,
} from "@aws-sdk/client-api-gateway";
import { Api } from "./api";
import { apiGatewayClient } from "src/utils/aws-clients";

export type IntegrationInput = PutIntegrationCommandInput;
export type IntegrationOutput = PutIntegrationCommandOutput;
export type IntegrationConfig = Omit<
  IntegrationInput,
  "restApiId" | "resourceId"
>;
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

  getDeployInput(): IntegrationInput {
    return {
      restApiId: this.dependencies.api.output.id,
      resourceId: this.dependencies.resource.output.id,
      ...this.config,
    };
  }

  deploy(props: IntegrationInput) {
    const command = new PutIntegrationCommand(props);
    return apiGatewayClient.send(command);
  }
}
