import {
    Logger,
    LoggerInstance,
    LoggerOptions,
} from "winston";

/**
 * This is verbatim from [the official docs](https://www.typescriptlang.org/docs/handbook/decorators.html)
 */
type ClassDecorator = <T extends { new (...args: any[]): {} }>(constructor: T) => T;

export interface ILogsWithWinston {
    context?: string[];
    logger: LoggerInstance;
    whoami?: string;
    [key: string]: any;
}

/**
 * This class decorator factory allows you to easily attach an instance of
 * Winston to your code.
 *
 * @param  {LoggerInstance | LoggerOptions} input
 * Can be an existing instance (e.g. app singleton, constructor options, or
 * empty for the default config.
 * @return {ClassDecorator}
 * Extends the passed-in class to have access to `winston` instance.
 */
export function LogsWithWinston(input: LoggerInstance | LoggerOptions): ClassDecorator {
    // Check the type
    let insertedLogger: LoggerInstance;
    if (input instanceof Logger) {
        insertedLogger = input;
    } else {
        insertedLogger = new Logger(input || {});
    }
    // Spit out the new class
    return function classDecorator<T extends { new (...args: any[]): {} }>(constructor: T): T {
        return class extends constructor {
            /** @type {LoggerInstance} `winston` instance */
            public logger: LoggerInstance = insertedLogger;
            /** @type {string[]} A naive prototype chain */
            protected context: string[];
            /** @type {string} The constructor's name */
            private whoami: string;
            /**
             * Call super and attach inheritance info (if any)
             *
             * @param {any[]} ...args
             * Original args
             */
            constructor(...args: any[])  {
                super(...args);
                // Save a private reference to `name`
                this.whoami = this.constructor.name;
                // This will have elements if the class extends a decorated super
                if (typeof this.context === "undefined") {
                    this.context = [this.whoami];
                } else {
                    this.context.push(this.whoami);
                }
            }
        };
    };
}
