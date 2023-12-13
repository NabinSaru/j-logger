import { writeFileSync, existsSync, mkdirSync, statSync } from "fs";
import { spawnSync } from "child_process";
import * as path from "path";

function findProjectRoot(currentDir: string, marker = "node_modules"): string {
  const { error, stdout } = spawnSync(`git worktree list --porcelain`, {
    encoding: "utf8",
    shell: true,
  });

  if (stdout) {
    // find the root path based on the git structure
    const paths = stdout
    .split("\n")
    .map((line) => {
      const [key, value] = line.split(/\s+/) || [];
      return key === "worktree" ? value : "";
    })
    .filter(Boolean);
    return paths[0];
  } else {
    // find the root path based on the node structure
    const rootPath = path.parse(currentDir).root;

    while (currentDir !== rootPath) {
      const markerPath = path.join(currentDir, marker);

      if (existsSync(markerPath)) {
        return currentDir;
      }

      currentDir = path.dirname(currentDir);
    }
  }
  throw new Error(`Marker "${marker}" not found in the directory tree.`);
}

export const rootPath = findProjectRoot(__dirname);

function createFile(filePath: string, isDir: boolean = false) {
  // Normalize the path to handle both Unix-like and Windows separators
  const normalizedPath = path.normalize(filePath);

  const pathParts = normalizedPath.split(path.sep);
  let fileName = "";

  if (isDir) {
    fileName = "j-logger.log";
  } else {
    fileName = pathParts.pop() || "j-logger.log";
  }

  // Create the directory structure
  const fileDir = path.join("/", ...pathParts);

  if (!existsSync(fileDir)) {
    mkdirSync(fileDir, { recursive: true });
  }

  const filePathWithFile = path.join(fileDir, fileName);
  writeFileSync(filePathWithFile, "");

  console.log(`[INFO]: File "${filePathWithFile}" has been created.`);
}

export function writeLog(filePath: string, msg: string): boolean {
  try {
    let fullFilePath = path.join(rootPath, filePath || "j-logger.log");

    if (!existsSync(fullFilePath)) {
      createFile(fullFilePath);
    } else {
      const stats = statSync(fullFilePath);

      if (stats.isDirectory()) {
        createFile(fullFilePath, true);
        fullFilePath = path.join(fullFilePath, "j-logger.log");
      }
    }

    writeFileSync(fullFilePath, `${msg}\n`, { flag: "a" });

    return true;
  } catch (error: any) {
    console.log(error);
    return false;
  }
}
