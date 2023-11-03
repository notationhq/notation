import { Resource } from "@notation/core";
import {
  CreateStageCommand,
  CreateStageCommandInput as StageInput,
  CreateStageCommandOutput as StageOutput,
} from "@aws-sdk/client-api-gateway";
import { apiGatewayClient } from "src/utils/aws-clients";
import { Api } from "./api";

export type StageConfig = {
  name: string;
};

export type StageDependencies = {
  router: Api;
};

export class Stage extends Resource<
  StageInput,
  StageOutput,
  StageConfig,
  StageDependencies
> {
  type = "api-gateway/stage";

  getDeployProps(): StageInput {
    return {
      restApiId: this.dependencies.router.output!.id,
      stageName: this.config.name,
      deploymentId: "todo",
    };
  }

  async deploy(props: StageInput) {
    const command = new CreateStageCommand(props);
    return apiGatewayClient.send(command);
  }
}
