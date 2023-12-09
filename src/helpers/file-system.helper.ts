import { writeFileSync, existsSync, mkdirSync } from "fs";
import * as path from "path";

function findProjectRoot(currentDir: string, marker = "package.json"): string {
  const rootPath = path.parse(currentDir).root;

  while (currentDir !== rootPath) {
    const markerPath = path.join(currentDir, marker);

    if (existsSync(markerPath)) {
      return currentDir;
    }

    currentDir = path.dirname(currentDir);
  }

  throw new Error(`Marker "${marker}" not found in the directory tree.`);
}

export const rootPath = findProjectRoot(__dirname);

function createFile(filePath: string) {
  // Normalize the path to handle both Unix-like and Windows separators
  const normalizedPath = path.normalize(filePath);

  const pathParts = normalizedPath.split(path.sep);
  const fileName = pathParts.pop() || "j-logger.log";

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
    const fullFilePath = path.join(rootPath, filePath);

    if (!existsSync(fullFilePath)) {
      createFile(fullFilePath);
    }

    writeFileSync(fullFilePath, `${msg}\n`, { flag: "a" });

    return true;
  } catch (error: any) {
    console.log(error);
    return false;
  }
}
