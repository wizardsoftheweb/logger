import {
    config,
    ConsoleTransportOptions,
} from "winston";


import {consoleFormatter} from "./consoleFormatter";

export const baseConsoleOptions: ConsoleTransportOptions = {
    colorize: true,
    formatter: consoleFormatter,
    timestamp: (): string => {
        return (new Date()).toISOString();
    },
};
