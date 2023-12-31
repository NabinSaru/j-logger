import {
  textColors,
  backgroundColors,
  formattingOptions,
  brightColors,
  KVinterface,
} from "./consts/console-colors.const";
import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync } from "fs";
import * as path from "path";
import { LogType } from "./enums/logType.enum";
import { LogLevel } from "./enums/logLevel.enum";
import { logTypes } from "./helpers/middleware-log-types.helper";
import { LogTypes, CallbackFunction } from "./interfaces/interfaces";
import { rootPath, writeLog } from "./helpers/file-system.helper";

const DEFAULT: KVinterface = {
  configFilePath: "/j-logger.config.json",
  configLogPath: "/log/j-logger.log",
};

const currentTime = () => {
  return new Date().toISOString();
};

export class JLogger {
  static color: string = "";
  static backgroundColor: string = "";
  static saveLog: boolean = false;
  static logPath: string = "";
  static textFormat:string = "";
  static stylizedMode: boolean = false;

  // Setters
  static set SavePath(path: string) {
    JLogger.logPath = path;
    JLogger.saveLog = true;
  }

  static set TextColor(color: string) {
    JLogger.color = textColors[color];
  }

  static set BackgroundColor(color: string) {
    JLogger.backgroundColor = backgroundColors[color];
  }

  static set SaveLog(flag: boolean) {
    JLogger.saveLog = flag;
  }

  static set TextFormat(options: string[]) {
    const textFormats = [];
    for (const option of options) {
      textFormats.push(formattingOptions[option]);
    }
    console.log(textFormats)
    JLogger.textFormat = textFormats.join('');
  }

  static set StylizedMode(flag: boolean) {
    JLogger.stylizedMode = flag;
  }

  // Getters
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

  // Methods
  private static formattedLog(message: string, level: string) {
    const timestamp = new Date().toISOString();

    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    return formattedMessage;
  }

  static log(msg: string) {
    if (JLogger.saveLog) {
      writeLog(JLogger.logPath, msg);
    }

    console.log(
      `${JLogger.backgroundColor}${JLogger.color}${JLogger.textFormat}${msg}${formattingOptions.Reset}`
    );
  }

  static info(msg: string) {
    const formattedMessage = JLogger.formattedLog(msg, LogLevel.INFO);
    if (JLogger.saveLog) {
      writeLog(JLogger.logPath, formattedMessage);
    }

    if (JLogger.stylizedMode) {
      console.log(
        `${backgroundColors.Green}${textColors.Black}[${LogLevel.INFO}]${
          formattingOptions.Reset
        }${brightColors.Green} [${currentTime()}] ${msg}${
          formattingOptions.Reset
        }`
      );
    } else {
      console.log(
        `${textColors.Green}${formattedMessage}${formattingOptions.Reset}`
      );
    }
  }

  static error(msg: string) {
    const formattedMessage = JLogger.formattedLog(msg, LogLevel.ERROR);
    if (JLogger.saveLog) {
      writeLog(JLogger.logPath, formattedMessage);
    }

    if (JLogger.stylizedMode) {
      console.log(
        `${backgroundColors.Red}${textColors.White}[${LogLevel.ERROR}]${
          formattingOptions.Reset
        }${brightColors.Red} [${currentTime()}] ${msg}${
          formattingOptions.Reset
        }`
      );
    } else {
      console.log(
        `${textColors.Red}${formattedMessage}${formattingOptions.Reset}`
      );
    }
  }

  static warn(msg: string) {
    const formattedMessage = JLogger.formattedLog(msg, LogLevel.WARN);
    if (JLogger.saveLog) {
      writeLog(JLogger.logPath, formattedMessage);
    }

    if (JLogger.stylizedMode) {
      console.log(
        `${backgroundColors.Yellow}${textColors.Black}[${LogLevel.WARN}]${
          formattingOptions.Reset
        }${brightColors.Yellow} [${currentTime()}] ${msg}${
          formattingOptions.Reset
        }`
      );
    } else {
      console.log(
        `${textColors.Yellow}${formattedMessage}${formattingOptions.Reset}`
      );
    }
  }

  static debug(msg: string) {
    if (JLogger.stylizedMode) {
      console.log(
        `${backgroundColors.Magenta}${textColors.White}[${LogLevel.DEBUG}]${
          formattingOptions.Reset
        }${textColors.Magenta} [${currentTime()}] ${msg}${
          formattingOptions.Reset
        }`
      );
    } else {
      const formattedMessage = JLogger.formattedLog(msg, LogLevel.DEBUG);

      console.log(
        `${textColors.Magenta}${formattedMessage}${formattingOptions.Reset}`
      );
    }
  }

  static cleanLog(msg: string) {
    console.log(msg);
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

export const requestLogger =
  <T extends keyof LogTypes>(logType: T) =>
  (req: any, res: any, next: CallbackFunction) => {
    const start = Date.now();
    res.on("finish", () => {
      res.locals.responseTime = Date.now() - start;
      const logEntry = logTypes[logType](req, res);
      if (JLogger.stylizedMode) {
        const { protocol } = req;
        const stylizedLog = `${backgroundColors.Blue}${
          textColors.White
        }${protocol.toUpperCase()}${formattingOptions.Reset}${
          brightColors.Blue
        } ${logEntry}${formattingOptions.Reset}`;
        JLogger.cleanLog(stylizedLog);
      } else {
        JLogger.log(logEntry);
      }
    });
    next();
  };

/**
 * initializes the JLogger Class with the config file
 */
(function () {
  const fullConfigPath = path.join(rootPath, DEFAULT.configFilePath);

  if (existsSync(fullConfigPath)) {
    try {
      const fileContent = readFileSync(fullConfigPath, "utf8");
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

      // check deep clone or array overwrite
      if (Array.isArray(textFormat) && textFormat.length)
        JLogger.TextFormat = textFormat;
      if (stylizedMode) JLogger.StylizedMode = true;
      if (saveLog) {
        JLogger.SaveLog = true;
        JLogger.SavePath = logPath || DEFAULT.configLogPath;
      }
      JLogger.cleanLog("[INFO] Log style set from config file");
    } catch (error) {
      JLogger.cleanLog(`[ERROR] Error parsing JSON: ${error}`);
    }
  } else {
    JLogger.cleanLog("[INFO] Setting default log style");
  }
})();
