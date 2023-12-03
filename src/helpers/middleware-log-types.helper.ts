import { LogType } from "../enums/logType.enum";
import { LogTypes } from "../interfaces/interfaces"

export const logTypes: LogTypes = {
  [LogType.short]: (req: any, res: any) =>
    `${req.method} ${req.url} ${res.statusCode} ${
      res.getHeader("content-length") || "-"
    } - ${res.get("X-Response-Time")} ms`,
  [LogType.combined]: (req: any, res: any) =>
    `${req.ip} - ${req.user || "-"} [${new Date().toUTCString()}] "${
      req.method
    } ${req.url} HTTP/${req.httpVersion}" ${res.statusCode} ${
      res.getHeader("content-length") || "-"
    } "${req.get("referrer") || "-"}" "${req.get("user-agent")}"`,
  [LogType.dev]: (req: any, res: any) =>
    `${req.method} ${req.url} ${res.statusCode} ${res.get(
      "X-Response-Time"
    )} ms - ${res.getHeader("content-length") || "-"}`,
  [LogType.common]: (req: any, res: any) =>
    `${req.ip} - ${req.user || "-"} [${new Date().toUTCString()}] "${
      req.method
    } ${req.url} HTTP/${req.httpVersion}" ${res.statusCode} ${
      res.getHeader("content-length") || "-"
    } "${req.get("referrer") || "-"}" "${req.get("user-agent")}"`,
};
