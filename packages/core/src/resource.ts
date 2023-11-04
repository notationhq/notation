export abstract class Resource<
  Input = {},
  Output = {},
  Config = Input,
  Dependencies extends Record<string, Resource> = {},
> {
  abstract type: string;
  config: Config;
  dependencies: Dependencies;
  id: number = -1;
  groupId: number = -1;
  output: Output = null as Output;

  constructor(opts: { config?: Config; dependencies?: Dependencies }) {
    this.config = opts.config || ({} as Config);
    this.dependencies = opts.dependencies || ({} as Dependencies);
    return this;
  }

  async runDeploy() {
    this.output = await this.deploy(this.getDeployInput() as any as Input);
  }

  abstract getDeployInput(): Input;
  abstract deploy(input: Input): Promise<Output>;
}

export abstract class ApexResource<Input = {}, Output = {}> extends Resource<
  Input,
  Output
> {
  getDeployInput(): Input {
    return this.config;
  }
  abstract deploy(input: Input): Promise<Output>;
}
