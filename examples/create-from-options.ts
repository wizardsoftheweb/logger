import { ok } from "assert";
import { config, Logger } from "winston";

import { LogsWithWinston } from "@wizardsoftheweb/logs-with-winston";

@LogsWithWinston({ levels: config.syslog.levels })
class Foo {
    constructor() {
        // do nothing
    }
}

const example = new Foo();
ok(typeof (example as any).logger.silly === "undefined");
// OK
