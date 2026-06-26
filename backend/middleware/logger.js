import winston from "winston";
import morgan from "morgan";
import fs from "fs";
import path from "path";

const logsDir = path.resolve("logs");
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

const morganMiddleware = morgan("combined", {
  stream: { write: (msg) => logger.info(msg.trim()) },
});

export { logger, morganMiddleware };
