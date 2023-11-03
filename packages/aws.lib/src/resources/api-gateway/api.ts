import { ApexResource } from "@notation/core";
import {
  CreateRestApiCommand,
  CreateRestApiCommandInput as ApiInput,
  CreateRestApiCommandOutput as ApiOutput,
} from "@aws-sdk/client-api-gateway";
import { apiGatewayClient } from "../../utils/aws-clients";

export class Api extends ApexResource<ApiInput, ApiOutput> {
  type = "api-gateway";

  async deploy(props: ApiInput) {
    const command = new CreateRestApiCommand(props);
    return apiGatewayClient.send(command);
  }
}
