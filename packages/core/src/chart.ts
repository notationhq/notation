import pako from "pako";
import { fromUint8Array } from "js-base64";
import { ResourceGroup, Resource } from "./resource-group";

export const createMermaidFlowChart = (
  resourceGroups: ResourceGroup<{}>[],
  resources: Resource<{}>[],
): string => {
  let mermaidString = "flowchart TD\n";
  let connectionsString = "";

  resourceGroups.forEach((group) => {
    mermaidString += `  subgraph ${group.type}_${group.id}\n`;
    group.resources.forEach((resource) => {
      mermaidString += `    ${resource.type}_${resource.id}(${resource.type})\n`;
    });
    mermaidString += `  end\n`;

    group.resources.forEach((resource) => {
      Object.values(resource.dependencies).forEach((depId) => {
        const depResource = resources.find((r) => r.id === depId);
        if (depResource) {
          connectionsString += `  ${resource.type}_${resource.id} --> ${depResource.type}_${depId}\n`;
        }
      });
    });
  });

  return `${mermaidString}\n${connectionsString}`;
};

export function createMermaidLiveUrl(mermaidCode: string) {
  const state = {
    code: mermaidCode,
    mermaid: JSON.stringify({ theme: "default" }, undefined, 2),
    autoSync: true,
    updateDiagram: true,
  };
  const json = JSON.stringify(state);
  const data = new TextEncoder().encode(json);
  const compressed = pako.deflate(data, { level: 9 });
  const string = fromUint8Array(compressed, true);
  return `https://mermaid.live/view#pako:${string}`;
}
