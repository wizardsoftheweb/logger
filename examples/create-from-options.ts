import { config, Logger } from "winston";

import { LogsWithWinston } from "@wizardsoftheweb/logs-with-winston";

@LogsWithWinston({ levels: config.syslog.levels })
class Foo {
    constructor() {
        // do nothing
    }
}

const example = new Foo();
console.log(typeof (example as any).logger.silly === "undefined");
// true
