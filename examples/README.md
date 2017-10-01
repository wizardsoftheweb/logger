# `@wizardsoftheweb/logs-with-winston` Examples

These examples should illustrate how to use the API. If you'd like to run them yourself,
```bash
git clone https://github.com/wizardsoftheweb/logs-with-winston.github.com
cd logs-with-winston/examples
npm install
```
followed by
```bash
./node_modules/.bin/ts-node <filename>
```

## Zero config
```typescript
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
```

## Existing Instance
```typescript
import { Logger, transports } from "winston";

import { LogsWithWinston } from "@wizardsoftheweb/logs-with-winston";

const logger = new Logger({
    transports: [
        new (transports.Console)(),
        new (transports.File)({ filename: "somefile.log" }),
    ],
});

@LogsWithWinston(logger)
class Foo {
    constructor() {
        // do nothing
    }
}

const example = new Foo();
console.log((example as any).logger === logger);
// true
```

## Create from Options
```typescript
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
```

## `implements ILogsWithWinston`

Depending on your environment, this may or may not be necessary. Here's the problem:

```typescript
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
```
Here's how to solve it:
```typescript
import { LoggerInstance, transports } from "winston";

import { LogsWithWinston } from "@wizardsoftheweb/logs-with-winston";

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
```
Because interfaces define a public contract, you can't declare the members with their intended scopes, hence the surrounding wall of comments. [The official mixin docs](https://www.typescriptlang.org/docs/handbook/mixins.html) recommend a similar solution.
