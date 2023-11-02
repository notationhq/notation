import { Resource, ResourceGroup } from "./resource-group";
import { DeployableResource } from "./resource";

export let resourceGroups: ResourceGroup<any, any>[] = [];
export let resources: Resource[] = [];
export let deployableResources: DeployableResource[] = [];

let resourceGroupCounter = 0;
let resourceCounter = 0;

export const getResourceCount = () => {
  return resourceCounter++;
};

export const getResourceGroupCount = () => {
  return resourceGroupCounter++;
};

export const reset = () => {
  resources = [];
  resourceGroups = [];
  resourceCounter = 0;
  resourceGroupCounter = 0;
  deployableResources = [];
};
