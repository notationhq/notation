import { RecordOptionalIfNotRequired } from "./types";

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

  constructor(
    opts: RecordOptionalIfNotRequired<"config", Config> &
      RecordOptionalIfNotRequired<"dependencies", Dependencies>,
  ) {
    this.config = opts.config || ({} as Config);
    this.dependencies = opts.dependencies || ({} as Dependencies);
    return this;
  }

  abstract getDeployInput(): Input;
  abstract deploy(input: Input): Promise<Output>;
}

export function createApexResourceFactory<Input = {}, Output = {}>() {
  return (opts: {
    type: string;
    deploy: (input: Input) => Promise<Output>;
  }) => {
    return class extends Resource<Input, Output> {
      type = opts.type;
      getDeployInput(): Input {
        return this.config;
      }
      deploy = opts.deploy;
    };
  };
}

export function createResourceFactory<
  Input = {},
  Output = {},
  Dependencies extends Record<string, Resource> = {},
>() {
  return <
    DefaultConfig extends Partial<Input> = Partial<Input>,
    Config = Omit<Input, keyof DefaultConfig>,
  >(opts: {
    type: string;
    getDefaultConfig: (
      dependencies: Dependencies,
      config: Config,
    ) => DefaultConfig;
    deploy: (input: Input) => Promise<Output>;
  }) => {
    return class extends Resource<Input, Output, Config, Dependencies> {
      type = opts.type;
      getDeployInput(): Input {
        return {
          ...this.config,
          ...opts.getDefaultConfig(this.dependencies, this.config),
        } as Input;
      }
      deploy = opts.deploy;
    };
  };
}
