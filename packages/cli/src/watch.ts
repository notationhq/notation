import chokidar from "chokidar";
import { deployApp } from "@notation/core";
import { compile } from "./compile";

const dotFilesRe = /(^|[\/\\])\../;

export async function watch(entryPoint: string) {
  await compile(entryPoint, true);

  const watcher = chokidar.watch("dist", {
    ignored: dotFilesRe,
    persistent: true,
  });

  watcher.on("all", debounceDeploy);

  let isDeploying = false;
  let deployQueued = false;
  let timeoutId: NodeJS.Timeout;
  const debounceTime = 500;

  function debounceDeploy() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      triggerDeploy();
    }, debounceTime);
  }

  function triggerDeploy() {
    if (isDeploying) {
      deployQueued = true;
      return;
    }

    isDeploying = true;

    deployApp(entryPoint, false)
      .then(() => {
        isDeploying = false;
        if (deployQueued) {
          deployQueued = false;
          triggerDeploy();
        }
      })
      .catch((err) => {
        console.error(err);
        isDeploying = false;
      });
  }
}
