import { createResourceFactory, Resource } from "@notation/core";
import {
  PutIntegrationCommand,
  PutIntegrationCommandInput,
  PutIntegrationCommandOutput,
} from "@aws-sdk/client-api-gateway";
import { Api } from "./api";
import { apiGatewayClient } from "src/utils/aws-clients";

export type IntegrationInput = PutIntegrationCommandInput;
export type IntegrationOutput = PutIntegrationCommandOutput;
export type IntegrationDependencies = {
  api: InstanceType<typeof Api>;
  resource: Resource<{}, { id: string }>;
};

const createIntegrationClass = createResourceFactory<
  IntegrationInput,
  IntegrationOutput,
  IntegrationDependencies
>();

export const Integration = createIntegrationClass({
  type: "api-gateway/integration",

  getDefaultConfig(dependencies) {
    return {
      restApiId: dependencies.api.output.id,
      resourceId: dependencies.resource.output.id,
    };
  },

  deploy(props) {
    const command = new PutIntegrationCommand(props);
    return apiGatewayClient.send(command);
  },
});
