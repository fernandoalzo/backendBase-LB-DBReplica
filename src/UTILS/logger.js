// Centralized Logger for the API
// Log levels: ERROR = 0, WARN = 1, INFO = 2, DEBUG = 3, LOG = 4

const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
    LOG: 4,
};

class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance;
        }

        // Check if logging is disabled entirely
        // Set to true to disable all logging, or use environment variable
        this.isLoggingDisabled = false;
        this.currentLogLevel = this.getDefaultLogLevel();

        Logger.instance = this;
    }

    // Set default log level to INFO in production, DEBUG in development
    // Can be overridden with LOG_LEVEL environment variable
    getDefaultLogLevel() {
        const envLogLevel = process.env.LOG_LEVEL?.toUpperCase();
        if (envLogLevel && LOG_LEVELS[envLogLevel] !== undefined) {
            return LOG_LEVELS[envLogLevel];
        }
        return process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;
    }

    shouldLog(level) {
        return !this.isLoggingDisabled && level <= this.currentLogLevel;
    }

    formatMessage(level, message) {
        const now = new Date();
        const timestamp = now.toISOString().replace('T', ' ').substring(0, 19); // YYYY-MM-DD HH:MM:SS
        const levelStr = Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === level);
        return `[${timestamp}] [${levelStr}] ${message}`;
    }

    error(message, ...args) {
        if (this.shouldLog(LOG_LEVELS.ERROR)) {
            console.error(this.formatMessage(LOG_LEVELS.ERROR, message), ...args);
        }
    }

    warn(message, ...args) {
        if (this.shouldLog(LOG_LEVELS.WARN)) {
            console.warn(this.formatMessage(LOG_LEVELS.WARN, message), ...args);
        }
    }

    info(message, ...args) {
        if (this.shouldLog(LOG_LEVELS.INFO)) {
            console.log(this.formatMessage(LOG_LEVELS.INFO, message), ...args);
        }
    }

    debug(message, ...args) {
        if (this.shouldLog(LOG_LEVELS.DEBUG)) {
            console.log(this.formatMessage(LOG_LEVELS.DEBUG, message), ...args);
        }
    }

    log(message, ...args) {
        if (this.shouldLog(LOG_LEVELS.LOG)) {
            console.log(this.formatMessage(LOG_LEVELS.LOG, message), ...args);
        }
    }
}

const instance = new Logger();
// Ensure the singleton instance is frozen to prevent modification
Object.freeze(instance);

module.exports = instance;