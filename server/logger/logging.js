const winston = require("winston");
const { combine, timestamp, printf } = winston.format;

const myFormat = printf(({ level, message, timestamp }) => {
    // Check if the log is going to the console
    const consoleLog = process.env.NODE_ENV === 'development' ? true : false;

    // Apply colorization only for console logs
    const logMessage = consoleLog
        ? `[${timestamp}] [info] ${message}`
        : `[${timestamp}] [error] ${message}`;

    return logMessage;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        winston.format.colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
        myFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/server.log' })
    ],
});

module.exports = logger;