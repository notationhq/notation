import {
  resources,
  resourceGroups,
  getResourceCount,
  getResourceGroupCount,
} from "./state";
import { Resource } from "./resource";

export type ResourceGroupOptions = {
  dependencies?: Record<string, number>;
  [key: string]: any;
};

export abstract class ResourceGroup {
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

  add<T extends Resource>(resource: T) {
    resource.id = getResourceCount();
    resource.groupId = this.id;
    resources.push(resource);
    this.resources.push(resource);
    return resource;
  }

  findResource(type: string) {
    return this.resources.find((r) => r.type === type);
  }
}
