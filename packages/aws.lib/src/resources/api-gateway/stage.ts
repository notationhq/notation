import { Resource } from "@notation/core";
import {
  CreateStageCommand,
  CreateStageCommandInput,
  CreateStageCommandOutput,
} from "@aws-sdk/client-api-gateway";
import { apiGatewayClient } from "src/utils/aws-clients";
import { Api } from "./api";

export type StageConfig = Omit<StageInput, "restApiId" | "deploymentId">;
export type StageInput = CreateStageCommandInput;
export type StageOutput = CreateStageCommandOutput;
export type StageDependencies = { router: Api };

export class Stage extends Resource<
  StageInput,
  StageOutput,
  StageConfig,
  StageDependencies
> {
  type = "api-gateway/stage";

  getDeployInput = (): StageInput => ({
    restApiId: this.dependencies.router.output.id,
    deploymentId: "todo",
    ...this.config,
  });

  async deploy(props: StageInput) {
    const command = new CreateStageCommand(props);
    return apiGatewayClient.send(command);
  }
}
