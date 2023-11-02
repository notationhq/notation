import { AwsResourceGroup } from "@notation/aws.resources/client";
import { ApiGatewayHandler, fn } from "./lambda";
export * from "./api-gateway.utils";

export const api = (config: { name: string }) => {
  const apiGroup = new AwsResourceGroup("api", config);
  const apiGateway = apiGroup.addResource("api-gateway", { name: config.name });

  apiGroup.addResource("api-gateway/stage", {
    name: "dev",
    deploymentId: "123",
    dependencies: {
      routerId: apiGateway.id,
    },
  });

  return apiGroup;
};

export const route = (
  apiGroup: ReturnType<typeof api>,
  method: string,
  path: string,
  handler: ApiGatewayHandler,
) => {
  const apiGateway = apiGroup.findResourceByType("api-gateway")!;

  // at compile time becomes infra module
  const fnGroup = handler as any as ReturnType<typeof fn>;

  const routeGroup = new AwsResourceGroup("api/route", {
    dependencies: { router: apiGroup.id, fn: fnGroup.id },
  });

  let integration;

  const lambda = fnGroup.findResourceByType("lambda")!;
  const permission = fnGroup.findResourceByType("lambda/permission");
  integration = fnGroup.findResourceByType("api-gateway/integration");

  if (!integration) {
    integration = fnGroup.addResource("api-gateway/integration", {
      dependencies: {
        apiGatewayId: apiGateway.id,
        lambdaId: lambda.id,
      },
    });
  }

  if (!permission) {
    fnGroup.addResource("lambda/permission", {
      dependencies: {
        apiGatewayId: apiGateway.id,
        lambdaId: lambda.id,
      },
    });
  }

  routeGroup.addResource("api-gateway/route", {
    method,
    path,
    dependencies: {
      apiGatewayId: apiGateway.id,
      integrationId: integration.id,
    },
  });

  return routeGroup;
};
