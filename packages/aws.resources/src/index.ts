import { DeployableResource } from "@notation/core";
import { ResourceType } from "./types";
import { ApiGateway } from "./resources/api-gateway";

const resourceMap: Record<ResourceType, typeof DeployableResource> = {
  "api-gateway": ApiGateway,
  "api-gateway/deployment": DeployableResource,
  "api-gateway/integration": DeployableResource,
  "api-gateway/route": DeployableResource,
  "api-gateway/stage": DeployableResource,
  "iam/policy": DeployableResource,
  "iam/permission": DeployableResource,
  "iam/role": DeployableResource,
  lambda: DeployableResource,
  "lambda/permission": DeployableResource,
};

export default resourceMap;
