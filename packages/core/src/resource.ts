import { Resource } from "./resource-group";
import { deployableResources } from "./state";

export abstract class DeployableResource {
  id: number;
  config: any;
  output: any | null = null;
  dependencies: { [key: string]: DeployableResource };

  constructor(resourceDefinition: Resource, config: any) {
    this.id = resourceDefinition.id;
    this.config = config;
    this.dependencies = {};

    for (const key in resourceDefinition.dependencies) {
      this.dependencies[key] = this.findPriorSibling(
        resourceDefinition.dependencies[key],
      )!;
    }

    deployableResources.push(this);
  }

  findPriorSibling(id: number) {
    return deployableResources.find(
      (deployableResource) => deployableResource.id === id,
    )!;
  }

  abstract deploy(config: any): Promise<any>;
}
