// LOGGER
// Sistema de logging de interacciones con la API, por niveles

import fs from "fs";
import path from "path";
import chalk from "chalk";
import { NODE_ENV } from "../../config/env.js";

const isProd = NODE_ENV === "production";
const logFile = path.resolve("server.log");

const timestamp = () => new Date().toISOString();

// ---- helpers -------------------------------------------------

const writeToFile = (level, message, meta) => {
  const line =
    `${timestamp()} [${level}] ${message}` +
    (meta && Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "") +
    "\n";

  fs.appendFile(logFile, line, () => {});
};

const color = {
  info: (t) => (isProd ? t : chalk.green(t)),
  warn: (t) => (isProd ? t : chalk.yellow(t)),
  error: (t) => (isProd ? t : chalk.red(t)),
  time: (t) => (isProd ? t : chalk.gray(t)),
};

// ---- logger --------------------------------------------------

export const logger = {
  info(message, meta = {}) {
    writeToFile("INFO", message, meta);

    if (!isProd) {
      console.info(
        color.time(timestamp()),
        color.info("[INFO]"),
        message,
        meta,
      );
    }
  },

  warn(message, meta = {}) {
    writeToFile("WARN", message, meta);

    console.warn(color.time(timestamp()), color.warn("[WARN]"), message, meta);
  },

  error(message, meta = {}) {
    writeToFile("ERROR", message, meta);

    console.error(
      color.time(timestamp()),
      color.error("[ERROR]"),
      message,
      meta,
    );
  },
};
