import {
  resources,
  resourceGroups,
  getResourceCount,
  getResourceGroupCount,
} from "./state";

export type Resource = {
  type: string;
  id: number;
  groupId: number;
  dependencies: Record<string, number>;
};

export type ResourceOptions<T> = T & {
  dependencies?: Record<string, number>;
};

export type ResourceGroupOptions = {
  dependencies?: Record<string, number>;
  [key: string]: any;
};

export class ResourceGroup<ResourceConfigMap extends Record<string, any>> {
  type: string;
  id: number;
  dependencies: Record<string, number>;
  config: Record<string, any>;
  resources: Resource[];

  constructor(type: string, opts: ResourceGroupOptions) {
    const { dependencies, ...config } = opts;
    this.type = type;
    this.id = getResourceGroupCount();
    this.dependencies = dependencies || {};
    this.config = config || {};
    this.resources = [];
    resourceGroups.push(this);
    return this;
  }

  addResource = <T extends keyof ResourceConfigMap>(
    type: T,
    opts: ResourceOptions<ResourceConfigMap[T]>,
  ) => {
    const resource: Resource = {
      id: getResourceCount(),
      groupId: this.id,
      type: type as string,
      dependencies: opts.dependencies || {},
      ...opts,
    };
    resources.push(resource);
    this.resources.push(resource);
    return resource;
  };

  findResourceByType = (type: keyof ResourceConfigMap) => {
    return this.resources.find((r) => r.type === type);
  };
}
