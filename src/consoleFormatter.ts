import { EOL } from "os";
import { inspect } from "util";
import {
    config,
    WinstonModuleTransportOptions,
} from "winston";

import * as winston from "winston";


class ConsoleFormatter {
    public static INDENT = "    ";

    public static format(options: WinstonModuleTransportOptions): string {
        return ConsoleFormatter.formatTimestamp(options)
            + ConsoleFormatter.formatLevel(options)
            + ConsoleFormatter.formatErrorOrMessage(options);
    }

    private static indentMultilines(text: string): string {
        return EOL
            + ConsoleFormatter.INDENT
            + text.replace(/\r?\n/gm, EOL + ConsoleFormatter.INDENT);
    }

    private static formatTimestamp(options: WinstonModuleTransportOptions): string {
        return `[${options.timestamp()}]`;
    }

    private static formatLevel(options: WinstonModuleTransportOptions): string {
        return config.colorize(options.level as any, `[${options.level}]`);
    }

    private static formatError(options: WinstonModuleTransportOptions): string {
        return " "
            + (
                typeof options.meta.message === "string" && options.meta.message.length > 0
                    ? options.meta.message
                    : ""
            )
            + ConsoleFormatter.indentMultilines(options.meta.stack);
    }

    private static formatMessage(options: WinstonModuleTransportOptions): string {
        return options.message || "";
    }

    private static formatMeta(options: WinstonModuleTransportOptions): string {
        if (typeof options.meta !== "undefined" && Object.keys(options.meta).length > 0) {
            return ConsoleFormatter.indentMultilines(inspect(options.meta));
        }
        return "";
    }

    private static formatMessageAndMeta(options: WinstonModuleTransportOptions): string {
        return ConsoleFormatter.formatMessage(options)
            + ConsoleFormatter.formatMeta(options);
    }

    private static formatErrorOrMessage(options: WinstonModuleTransportOptions): string {
        if (typeof options.meta.stack !== "undefined" && options.meta.stack.match(/error/i)) {
            return ConsoleFormatter.formatError(options);
        } else {
            return ConsoleFormatter.formatMessageAndMeta(options);
        }
    }
}

export const consoleFormatter = ConsoleFormatter.format;
