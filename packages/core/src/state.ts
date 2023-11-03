import { Resource } from "./resource";
import { ResourceGroup } from "./resource-group";
import { DeployableResource } from "./deployable";

export let resourceGroups: ResourceGroup[] = [];
export let resources: Resource[] = [];
export let deployableResources: DeployableResource<any>[] = [];

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
