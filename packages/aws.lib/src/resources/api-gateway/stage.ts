import { createResourceFactory } from "@notation/core";
import {
  CreateStageCommand,
  CreateStageCommandInput,
  CreateStageCommandOutput,
} from "@aws-sdk/client-api-gateway";
import { apiGatewayClient } from "src/utils/aws-clients";
import { Api } from "./api";

export type StageInput = CreateStageCommandInput;
export type StageOutput = CreateStageCommandOutput;
export type StageDependencies = { router: InstanceType<typeof Api> };

const createStageClass = createResourceFactory<
  StageInput,
  StageOutput,
  StageDependencies
>();

export const Stage = createStageClass({
  type: "api-gateway/stage",

  getDefaultConfig: (dependencies) => ({
    restApiId: dependencies.router.output.id,
    deploymentId: "todo",
  }),

  async deploy(props: StageInput) {
    const command = new CreateStageCommand(props);
    return apiGatewayClient.send(command);
  },
});
