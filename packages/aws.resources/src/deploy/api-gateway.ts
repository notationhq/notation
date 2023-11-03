import { CreateRestApiCommand } from "@aws-sdk/client-api-gateway";
import { DeployableResource } from "@notation/core";
import { apiGatewayClient } from "../utils/aws-clients";

export type ApiGatewayConfig = {
  name: string;
};

export class ApiGateway extends DeployableResource {
  async deploy(config: ApiGatewayConfig) {
    const params = {
      name: config.name,
    };

    try {
      const command = new CreateRestApiCommand(params);
      const result = await apiGatewayClient.send(command);
      return result;
    } catch (error) {
      console.error("Error creating API Gateway:", error);
      throw error;
    }
  }
}
