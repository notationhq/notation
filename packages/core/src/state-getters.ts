import { resourceGroups, resources, deployableResources } from "./state";

export const getResourceGroups = () => resourceGroups;
export const getResources = () => resources;
export const getDeployableResources = () => deployableResources;
