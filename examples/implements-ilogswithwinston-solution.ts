import { LoggerInstance, transports } from "winston";

import { ILogsWithWinston, LogsWithWinston } from "@wizardsoftheweb/logs-with-winston";

@LogsWithWinston({ transports: [new transports.Console()] })
class Bar implements ILogsWithWinston {
    /* Begin copypasta */
    /* tslint:disable */
    logger: LoggerInstance;
    naivePrototypeChain: string[];
    whoamiWinston: string;
    /* tslint:enable */
    /* End copypasta */
    constructor() {
        // do nothing
    }
    public doSomething() {
        this.logger.info("something");
    }
}

const example = new Bar();
example.doSomething();
// info: something
