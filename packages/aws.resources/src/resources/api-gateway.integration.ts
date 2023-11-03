import { Resource } from "@notation/core";
import {
  ApiGatewayIntegrationProps,
  ApiGatewayIntegrationOutput,
} from "src/deploy/api-gateway.integration";
import { ApiGateway } from "./api-gateway";

export type ApiGatewayIntegrationConfig = {
  name: string;
  api: ApiGateway;
  resource: Resource;
  type: ApiGatewayIntegrationProps["type"];
  uri: ApiGatewayIntegrationProps["uri"];
};

export class ApiGatewayIntegration extends Resource<
  ApiGatewayIntegrationConfig,
  ApiGatewayIntegrationOutput
> {
  type = "api-gateway/integration";

  getDeployProps(): ApiGatewayIntegrationProps {
    return {
      type: this.config.type,
      uri: this.config.uri,
      restApiId: this.config.api.output.id,
      resourceId: this.config.resource.output.id,
      httpMethod: this.dependencies.resourceId.output.httpMethod,
    };
  }
}
