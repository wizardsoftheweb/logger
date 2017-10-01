import { LoggerInstance, transports } from "winston";

import { LogsWithWinston } from "@wizardsoftheweb/logs-with-winston";

@LogsWithWinston({ transports: [new transports.Console()] })
class Foo {
    constructor() {
        // do nothing
    }
    public doSomething() {
        // this.logger.info("something");
        // TSError: ⨯ Unable to compile TypeScript
        // filename.ts (11,14): Property 'logger' does not exist on type 'Foo'. (2339)
    }
}
