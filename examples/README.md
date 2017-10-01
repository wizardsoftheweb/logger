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

<!-- zero-config.ts -->
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
<!-- /zero-config.ts -->

## Existing Instance

<!-- existing-instance.ts -->
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
<!-- /existing-instance.ts -->

## Create from Options

<!-- create-from-options.ts -->
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
<!-- /create-from-options.ts -->

## `implements ILogsWithWinston`

Depending on your environment, this may or may not be necessary. Here's the problem:

<!-- implements-ilogswithwinston-failure.ts -->
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
<!-- /implements-ilogswithwinston-failure.ts -->
Here's how to solve it:
<!-- implements-ilogswithwinston-solution.ts -->
```typescript
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

```
<!-- /implements-ilogswithwinston-solution.ts -->
Because interfaces define a public contract, you can't declare the members with their intended scopes, hence the surrounding wall of comments. [The official mixin docs](https://www.typescriptlang.org/docs/handbook/mixins.html) recommend a similar solution.
