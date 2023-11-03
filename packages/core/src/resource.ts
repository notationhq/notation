export abstract class Resource<
  Input = {},
  Output = {},
  Config = {},
  Dependencies extends Record<string, Resource> = {},
> {
  config: Config;
  dependencies: Dependencies;
  type: string = "";
  id: number = -1;
  groupId: number = -1;
  output: Output = null as Output;

  constructor(opts: { config: Config; dependencies?: Dependencies }) {
    this.config = opts.config;
    this.dependencies = opts.dependencies || ({} as Dependencies);
    return this;
  }

  async runDeploy() {
    this.output = await this.deploy(this.getDeployProps());
  }

  abstract getDeployProps(): Input;
  abstract deploy(input: Input): Promise<Output>;
}
