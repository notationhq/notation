import { Resource } from "src/orchestrator/resource";
import { State, StateNode } from "./state";

export async function updateResource(
  resource: Resource,
  state: State,
  stateNode: StateNode,
  patch: any,
): Promise<void> {
  if (!resource.update) {
    throw new Error(
      `Update not implemented for ${resource.type} ${resource.id}`,
    );
  }

  const pk = await resource.getPrimaryKey(stateNode.input, stateNode.output);

  resource.output = await resource.update({ ...pk, ...patch });

  await state.update(resource.id, {
    lastOperation: "update",
    lastOperationAt: new Date().toISOString(),
    input: await resource.getInput(),
    output: resource.output,
  });
}
