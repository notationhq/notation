import { Resource } from "./resource";

type Newable<T> = new (...args: any[]) => T;

export const createDeployableResourceGraph = async (
  resourceDefinitionGraph: Resource[],
  deployableResourceMap: { [key: string]: Newable<Resource> },
) => {
  const outputGraph: Resource[] = [];

  for (const node of resourceDefinitionGraph) {
    if (!deployableResourceMap[node.type]) {
      throw new Error(`Unsupported node type: ${node.type}`);
    }

    const Deployable = deployableResourceMap[node.type];
    const config = {}; // ?
    const deployable = new Deployable(node, config);

    outputGraph.push(deployable);
  }

  return outputGraph;
};
