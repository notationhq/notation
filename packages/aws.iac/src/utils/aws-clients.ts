import { ApiGatewayV2Client } from "@aws-sdk/client-apigatewayv2";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { IAMClient } from "@aws-sdk/client-iam";
import { region } from "src/context";

export const lambdaClient = new LambdaClient({ region });
export const apiGatewayClient = new ApiGatewayV2Client({ region });
export const iamClient = new IAMClient({ region });