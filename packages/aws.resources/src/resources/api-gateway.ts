import { Resource } from "@notation/core";

export class ApiGateway extends Resource<{ name: string }> {
  type = "api-gateway";

  constructor(config: { name: string }) {
    super(config);
  }
}
