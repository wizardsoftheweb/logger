# `@wizardsoftheweb/logs-with-winston`

[![Build Status](https://travis-ci.org/wizardsoftheweb/logs-with-winston.svg?branch=master)](https://travis-ci.org/wizardsoftheweb/logs-with-winston) [![Coverage Status](https://coveralls.io/repos/github/wizardsoftheweb/logs-with-winston/badge.svg?branch=master)](https://coveralls.io/github/wizardsoftheweb/logs-with-winston?branch=master)

This started out as an opinionated [`winston`](https://github.com/winstonjs/winston) setup, but I quickly realized I just wanted a `winston` decorator because trying to come up with unified logging is hard.

This decorator adds a public member, `logger`, which you can prepopulate with your own instance of a `winston` logger or feed it options to do it for you.

I'm going to use this for a few weeks before tagging `v1` because I want to make sure it's actually as simple as it should be.

<!-- MarkdownTOC -->

- [Installation](#installation)
- [Tests](#tests)
- [Usage](#usage)
    - [API](#api)
        - [`LogsWithWinston(input?: LoggerInstance | LoggerOptions)`](#logswithwinstoninputloggerinstance|loggeroptions)
    - [Examples](#examples)
        - [Zero config](#zeroconfig)
        - [Existing Instance](#existinginstance)
        - [Create from Options](#createfromoptions)
        - [`implements ILogsWithWinston`](#implementsilogswithwinston)
- [Scope?](#scope)
- [Roadmap](#roadmap)
    - [Main Features](#mainfeatures)
    - [Eventual features](#eventualfeatures)

<!-- /MarkdownTOC -->


## Installation

```bash
npm install @wizardsoftheweb/logs-with-winston
```

## Tests

```bash
npm install git+https://github.com/wizardsoftheweb/logs-with-winston
npm t
```

## Usage

### API

#### `LogsWithWinston(input?: LoggerInstance | LoggerOptions)`

`input` is an existing `LoggerInstance`, a `LoggerOptions` object that can be passed to `winston` to create a new `LoggerInstance`, or an object that won't do anything.

I've also exported an interface, `ILogsWithWinston`, that you can use for `implements` to appease code editors.

### Examples

#### Zero config
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
(example as any).logger instanceof Logger;
// true
```

#### Existing Instance
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
(example as any).logger === logger;
// true
```

#### Create from Options
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
typeof (example as any).logger.silly === "undefined";
// true
```

#### `implements ILogsWithWinston`

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
        this.logger.info("something");
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
    naivePrototypeChain?: string[];
    whoamiWinston?: string;
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

## Scope?

Polluting the global namespace is generally considered a bad idea, so why would you do it on NPM?

## Roadmap

These percentages are pretty arbitrary. Today's 47% could be tomorrow's 90% or vice versa.

### Main Features

Once all of these are finished, I'll release `v1`. Until then, `v0` should be used with caution, because it's not stable.

| Progess | Feature |
| ------: | ------- |
|    100% | Add decorator |
|    100% | Test |
|    100% | Export the full namespace |
|    100% | Compile declaration file |
|     70% | ~~Compile docs from source~~ Write docs |
|      0% | Publish package on `npm` |

### Eventual features

These are things I'd like to add, but probably won't be included in `v1`. If not, they'll most likely constitute one or more minor version increments.

| Progess | Feature |
| ------: | ------- |
|      0% | [Greenkeeper](https://greenkeeper.io/) (or similar) integration |
|      0% | Move examples to subdirectory
