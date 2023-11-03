import { AwsResourceGroup } from "@notation/aws.resources/client";
import { ApiGateway, ApiGatewayStage } from "@notation/aws.resources/resources";
import { ApiGatewayHandler, fn } from "./lambda";
export * from "./api-gateway.utils";

export const api = (config: { name: string }) => {
  const apiGroup = new AwsResourceGroup("api", config);
  const apiGateway = apiGroup.add(new ApiGateway({ name: config.name }));

  apiGroup.add(
    new ApiGatewayStage({
      name: "prod",
      router: apiGateway,
      deployment: apiGateway,
    }),
  );

  return apiGroup;
};

export const route = (
  apiGroup: ReturnType<typeof api>,
  method: string,
  path: string,
  handler: ApiGatewayHandler,
) => {
  const apiGateway = apiGroup.findResource("api-gateway")!;

  // at compile time becomes infra module
  const fnGroup = handler as any as ReturnType<typeof fn>;

  const routeGroup = new AwsResourceGroup("api/route", {
    dependencies: { router: apiGroup.id, fn: fnGroup.id },
  });

  let integration;

  const lambda = fnGroup.findResource("lambda")!;
  const permission = fnGroup.findResource("lambda/permission");
  integration = fnGroup.findResource("api-gateway/integration");

  if (!integration) {
    integration = fnGroup.add("api-gateway/integration", {
      dependencies: {
        apiGatewayId: apiGateway.id,
        lambdaId: lambda.id,
      },
    });
  }

  if (!permission) {
    fnGroup.add("lambda/permission", {
      dependencies: {
        apiGatewayId: apiGateway.id,
        lambdaId: lambda.id,
      },
    });
  }

  routeGroup.add("api-gateway/route", {
    method,
    path,
    dependencies: {
      apiGatewayId: apiGateway.id,
      integrationId: integration.id,
    },
  });

  return routeGroup;
};
