import { AwsResourceGroup } from "@notation/aws.lib/client";
import { apiGateway } from "@notation/aws.lib/resources";
import { ApiGatewayHandler, fn } from "./lambda";
export * from "./api-gateway.utils";

export const api = (config: { name: string }) => {
  const apiGroup = new AwsResourceGroup("api", config);
  const api = apiGroup.add(new apiGateway.Api({ config }));

  apiGroup.add(
    new apiGateway.Stage({
      config: { stageName: "dev" },
      dependencies: { router: api },
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
  const api = apiGroup.findResource("api-gateway") as apiGateway.Api;

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
    integration = fnGroup.add(
      new apiGateway.LambdaIntegration({
        dependencies: { api, lambda },
      }),
    );
  }

  if (!permission) {
    fnGroup.add("lambda/permission", {
      dependencies: {
        apiGatewayId: api.id,
        lambdaId: lambda.id,
      },
    });
  }

  routeGroup.add("api-gateway/route", {
    method,
    path,
    dependencies: {
      apiGatewayId: api.id,
      integrationId: integration.id,
    },
  });

  return routeGroup;
};
