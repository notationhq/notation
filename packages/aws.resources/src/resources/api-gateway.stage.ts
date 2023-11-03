import { Resource } from "@notation/core";
import { ApiGateway } from "./api-gateway";

export type ApiGatewayStageConfig = {
  name: string;
  resource: Resource;
  router: ApiGateway;
};

export class ApiGatewayStage extends Resource<ApiGatewayStageConfig> {
  type = "api-gateway/stage";
}
