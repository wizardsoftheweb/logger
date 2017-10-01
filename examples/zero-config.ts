import { Logger } from "winston";

import { LogsWithWinston } from "@wizardsoftheweb/logs-with-winston";

@LogsWithWinston()
class Foo {
    constructor() {
        // do nothing
    }
}

const example = new Foo();
console.log((example as any).logger instanceof Logger);
// true
