import { createApexResourceFactory } from "@notation/core";
import {
  CreateRestApiCommand,
  CreateRestApiCommandInput,
  CreateRestApiCommandOutput,
} from "@aws-sdk/client-api-gateway";
import { apiGatewayClient } from "../../utils/aws-clients";

export type ApiInput = CreateRestApiCommandInput;
export type ApiOutput = CreateRestApiCommandOutput;

const createApiClass = createApexResourceFactory<ApiInput, ApiOutput>();

export const Api = createApiClass({
  type: "api-gateway",
  async deploy(props: ApiInput) {
    const command = new CreateRestApiCommand(props);
    return apiGatewayClient.send(command);
  },
});
