import { LoggerInstance } from "winston";

/**
 * This definition is verbatim from
 * [the official docs](https://www.typescriptlang.org/docs/handbook/decorators.html)
 */
export type ClassDecorator = <T extends { new (...args: any[]): {} }>(constructor: T) => T;

/**
 * This interface can be used for `implements` syntax to appease syntax
 * editors.
 */
export interface ILogsWithWinston {
    naivePrototypeChain?: string[];
    logger: LoggerInstance;
    whoamiWinston?: string;
    [key: string]: any;
}
