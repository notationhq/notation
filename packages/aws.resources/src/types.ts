import { ApiGatewayConfig } from "./resources/api-gateway";
import { ApiGatewayStageConfig } from "./resources/api-gateway.stage";

export type ResourceConfigMap = {
  "api-gateway": ApiGatewayConfig;
  "api-gateway/stage": ApiGatewayStageConfig;
  "api-gateway/deployment": {};
  "api-gateway/integration": {};
  "api-gateway/route": { method: string; path: string };
  lambda: {};
  "lambda/permission": {};
  "iam/role": {};
  "iam/policy": {};
  "iam/permission": {};
};

export type ResourceType = keyof ResourceConfigMap;
