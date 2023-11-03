import { Resource } from "./resource";
import { ResourceGroup } from "./resource-group";

export let resourceGroups: ResourceGroup[] = [];
export let resources: Resource[] = [];

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
};
