import {
  PutIntegrationCommand,
  PutIntegrationCommandInput,
  PutIntegrationCommandOutput,
} from "@aws-sdk/client-api-gateway";
import { DeployableResource } from "@notation/core";
import { apiGatewayClient } from "src/utils/aws-clients";
import { ApiGatewayIntegration } from "src/resources/api-gateway.integration";

export type ApiGatewayIntegrationProps = PutIntegrationCommandInput;
export type ApiGatewayIntegrationOutput = PutIntegrationCommandOutput;

export class DeployableApiGatewayIntegration extends DeployableResource<ApiGatewayIntegration> {
  async deploy(props: ApiGatewayIntegrationProps) {
    try {
      const command = new PutIntegrationCommand(props);
      const result = await apiGatewayClient.send(command);
      return result;
    } catch (error) {
      console.error("Error creating API Gateway Integration:", error);
      throw error;
    }
  }
}
