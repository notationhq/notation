import { CreateStageCommand } from "@aws-sdk/client-api-gateway";
import { DeployableResource } from "@notation/core";
import { apiGatewayClient } from "src/utils/aws-clients";
import { ApiGateway } from "./api-gateway";

export type ApiGatewayStageConfig = {
  name: string;
  deploymentId: string;
};

export class ApiGatewayStage extends DeployableResource {
  async deploy(config: ApiGatewayStageConfig) {
    const apiGateway = this.dependencies["routerId"] as ApiGateway;

    const params = {
      restApiId: apiGateway.output?.id,
      stageName: config.name,
      deploymentId: config.deploymentId,
    };

    try {
      const command = new CreateStageCommand(params);
      const result = await apiGatewayClient.send(command);
      return result;
    } catch (error) {
      console.error("Error creating API Stage:", error);
      throw error;
    }
  }
}
