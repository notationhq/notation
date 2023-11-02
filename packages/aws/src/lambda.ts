import { AwsResourceGroup } from "@notation/aws.resources/client";
import type {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
} from "aws-lambda";

export type FnConfig = {
  service: "aws/lambda";
  memory?: number;
  timeout?: number;
};

export type ApiGatewayHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
) => APIGatewayProxyResultV2 | Promise<APIGatewayProxyResultV2>;

export const handle = {
  apiRequest: (handler: ApiGatewayHandler): ApiGatewayHandler => handler,
};

export const fn = (config: { handler: string }) => {
  const functionGroup = new AwsResourceGroup("aws/function", { config });

  const role = functionGroup.addResource("iam/role", {});

  const policyAttachment = functionGroup.addResource("iam/policy", {
    dependencies: {
      roleId: role.id,
    },
  });

  functionGroup.addResource("lambda", {
    dependencies: {
      policyId: policyAttachment.id,
    },
  });

  return functionGroup;
};
