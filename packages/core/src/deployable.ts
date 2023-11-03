import { Resource as BaseResource } from "./resource";
import { deployableResources } from "./state";

export abstract class DeployableResource<
  Resource extends BaseResource,
  Output = any,
> {
  resource: Resource;
  output: Output | null = null;
  dependencies: {
    [key in keyof Resource["dependencies"]]: DeployableResource<
      Resource["dependencies"][key]
    >;
  };

  constructor(resourceDefinition: Resource) {
    this.resource = resourceDefinition;
    this.dependencies = {} as any;

    for (const [key, dependency] of Object.entries(
      resourceDefinition.dependencies,
    )) {
      const deployableDependency = this.findPriorSibling(dependency.id);
      this.dependencies[key as keyof Resource["dependencies"]] =
        deployableDependency;
    }

    deployableResources.push(this);
  }

  findPriorSibling(dependencyId: number) {
    const dependency = deployableResources.find(
      (resource) => resource.resource.id === dependencyId,
    );
    if (!dependency) {
      throw new Error(
        `Could not find deployable resource for dependency: ${dependencyId}. If you're seeing this error, your orchestration graph is malformed.`,
      );
    }
    return dependency;
  }

  async runDeploy() {
    this.output = await this.deploy(this.resource.getDeployProps());
  }

  abstract deploy(config: any): Promise<Output>;
}
