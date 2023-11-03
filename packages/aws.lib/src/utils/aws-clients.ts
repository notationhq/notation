import { APIGatewayClient } from "@aws-sdk/client-api-gateway";

export const apiGatewayClient = new APIGatewayClient({ region: "us-west-2" });
