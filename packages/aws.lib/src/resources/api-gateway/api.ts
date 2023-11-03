import { Resource } from "@notation/core";
import {
  CreateRestApiCommand,
  CreateRestApiCommandInput as ApiInput,
  CreateRestApiCommandOutput as ApiOutput,
} from "@aws-sdk/client-api-gateway";
import { apiGatewayClient } from "../../utils/aws-clients";

export type ApiConfig = {
  name: string;
};

export class Api extends Resource<ApiInput, ApiOutput, ApiConfig> {
  type = "api-gateway";

  getDeployProps(): ApiInput {
    return {
      name: this.config.name,
    };
  }

  async deploy(props: ApiInput) {
    const command = new CreateRestApiCommand(props);
    return apiGatewayClient.send(command);
  }
}
