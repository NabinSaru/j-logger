import {
  textColors,
  backgroundColors,
  formattingOptions,
  brightColors,
} from "./consts/console-colors.const";
import { execSync } from "child_process";
import {
  writeFileSync,
  statSync,
  existsSync,
  mkdirSync,
  readFileSync,
} from "fs";
import * as path from "path";
import { LogType } from "./enums/logType.enum";
import { logTypes } from "./helpers/middleware-log-types.helper";
import { LogTypes, CallbackFunction } from "./interfaces/interfaces";

// function createCounter() {
//   let count = 0;

//   return function () {
//     count++;
//     console.log(count);
//   };
// }

(function () {
  if (existsSync("/j-logger.config")) {
    const fileContent = readFileSync("/j-logger.config", "utf8");

    try {
      const configData = JSON.parse(fileContent);

      const {
        color,
        backgroundColor,
        saveLog,
        logPath,
        textFormat,
        stylizedMode,
      } = configData;

      if (color) JLogger.TextColor = color;
      if (backgroundColor) JLogger.BackgroundColor = backgroundColor;
      if (saveLog) JLogger.SaveLog = true;
      if (logPath) {
        JLogger.SavePath = logPath;
      } else {
        JLogger.SavePath = "/log/j-logger.log";
      }
      if (textFormat && textFormat.isArray()) JLogger.TextFormat = textFormat;
      if (stylizedMode) JLogger.StylizedMode = true;
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  } else {
  }
});

function createFileIfNotExists(filePath: string) {
  try {
    const stats = statSync(filePath);

    if (stats.isFile()) {
      console.log(`${filePath} is a file.`);
    } else if (stats.isDirectory()) {
      console.log(`${filePath} is a directory.`);
      // If it's a directory, create a file in it
      const newFilePath = path.join(filePath, "newFile.txt");
      writeFileSync(newFilePath, "Hello, this is a new file!");
      JLogger.info("Created a new log file.");
    }
  } catch (error: any) {
    // Handle the error (e.g., path does not exist)
    JLogger.error(`Error: ${error.message}`);
  }
}

export class JLogger {
  private static color: string = "Black";
  private static backgroundColor: string = "White";
  private static saveLog: boolean = false;
  private static logPath: string = "";
  private static textFormat: string[];
  private static stylizedMode: boolean = false;

  static set SavePath(path: string) {
    if (!existsSync(path)) {
      mkdirSync(path);
    }
    JLogger.saveLog = true;
  }

  static set LogStyle(path: string) {}

  static set TextColor(color: string) {
    JLogger.color = textColors[color];
  }

  static set BackgroundColor(color: string) {
    JLogger.backgroundColor = backgroundColors[color];
  }

  static set SaveLog(flag: boolean) {
    JLogger.saveLog = flag;
  }

  static set TextFormat(format: string[]) {
    JLogger.textFormat = format;
  }

  static set StylizedMode(flag: boolean) {
    JLogger.stylizedMode = flag;
  }

  private static formattedLog(message: string, level: string) {
    const timestamp = new Date().toISOString();

    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    return formattedMessage;
  }

  static get TextColors() {
    return Object.keys(textColors);
  }

  static get BgColors() {
    return Object.keys(textColors);
  }

  static get FormattingOptions() {
    return Object.keys(formattingOptions);
  }

  static get BrightColors() {
    return Object.keys(brightColors);
  }

  // TODO: take default style
  static log(msg: string) {
    console.log(`${textColors.Green}${msg}${formattingOptions.Reset}`);
  }

  static info(msg: string) {
    console.log(
      `${textColors.Green}${JLogger.formattedLog(msg, "INFO")}${
        formattingOptions.Reset
      }`
    );
  }

  static error(msg: string) {
    console.log(
      `${textColors.Red}${JLogger.formattedLog(msg, "ERROR")}${
        formattingOptions.Reset
      }`
    );
  }

  static warn(msg: string) {
    // if (this.stylizedMode) {
    //   `${backgroundColors.Yellow}${textColors.White}`
    // }
    console.log(
      `${
        JLogger.stylizedMode ? backgroundColors.Yellow : textColors.Yellow
      }${JLogger.formattedLog(msg, "WARN")}${formattingOptions.Reset}`
    );
  }

  static debug(msg: string) {
    console.log(
      `${textColors.Red}${JLogger.formattedLog(msg, "DEBUG")}${
        formattingOptions.Reset
      }`
    );
  }

  static debugBox(msg: string) {
    function getTerminalWidth() {
      try {
        const width = execSync("tput cols", {
          stdio: ["pipe", "pipe", "ignore"],
        });
        return parseInt(width.toString().trim(), 10);
      } catch (error) {
        // Default width in case of error
        return 80;
      }
    }

    (function logInBox(message: string, colorCode = 37) {
      const lines = message.split("\n");
      const terminalWidth = getTerminalWidth();
      const maxLineWidth = Math.min(
        terminalWidth - 4,
        Math.max(...lines.map((line: string) => line.length))
      );

      const topLine = "┌" + "─".repeat(maxLineWidth + 2) + "┐";
      const bottomLine = "└" + "─".repeat(maxLineWidth + 2) + "┘";

      console.log(`\x1b[1;${colorCode}m${topLine}\x1b[0m`);

      lines.forEach((line: string, index: number) => {
        while (line.length > 0) {
          const truncatedLine = line.substring(0, maxLineWidth);
          const paddingLength = Math.max(
            0,
            maxLineWidth - truncatedLine.length
          );
          const padding = " ".repeat(paddingLength);
          console.log(
            `\x1b[1;${colorCode}m│ ${truncatedLine}${padding} │\x1b[0m`
          );
          line = line.substring(maxLineWidth);
        }

        // Draw an empty line for any remaining lines (if there are more lines)
        if (index < lines.length - 1) {
          const emptyPadding = " ".repeat(maxLineWidth);
          console.log(`\x1b[1;${colorCode}m│ ${emptyPadding} │\x1b[0m`);
        }
      });

      console.log(`\x1b[1;${colorCode}m${bottomLine}\x1b[0m`);
    })(msg);
  }

  static getLogTypes() {
    return Object.values(LogType);
  }
}

// export class InterceptorLogger extends JLogger {
//   constructor(logType: string) {
//     super();

//     requestLogger(logType);
//   }

//   static getLogTypes() {
//     return Object.values(LogType);
//   }
// }

export const requestLogger =
  <T extends keyof LogTypes>(logType: T) =>
  (req: any, res: any, next: CallbackFunction) => {
    const logEntry = logTypes[logType](req, res);
    JLogger.log(logEntry);
    next();
  };
