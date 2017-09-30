import {
    AbstractConfigSetLevels,
    config,
    Logger as winstonLogger,
    LoggerInstance,
    transports,
} from "winston";

import { baseConsoleOptions } from "./baseConsoleOptions";

/**
 *
 * @see [Stack Overflow](https://stackoverflow.com/a/36978360)
 * @todo think about multiple log files (including child-specific logs)
 * @todo file transport
 */
class Logger {
    public static LOG_LEVELS: AbstractConfigSetLevels = config.cli.levels;
    private static singleton: Logger;

    public logger: LoggerInstance;

    private constructor() {
        this.logger = new winstonLogger({
            level: "silly",
            levels: Logger.LOG_LEVELS,
            transports: [
                new transports.Console(baseConsoleOptions),
            ],
        });
    }

    public static get instance() {
        return this.singleton || (this.singleton = new this());
    }
}

export const logger = Logger.instance;
