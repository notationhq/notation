export abstract class Resource<Config = any, Output = any> {
  config: Config;
  dependencies: Record<string, Resource> = {};
  type: string = "";
  id: number = -1;
  groupId: number = -1;

  constructor(config: Config) {
    this.config = config;
    return this;
  }

  abstract getDeployProps(): any;

  get output(): Output {
    throw new Error(
      "Cannot call output on a resource until it has been deployed",
    );
  }
}
