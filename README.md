# `@wizardsoftheweb/logger`

[![Build Status](https://travis-ci.org/wizardsoftheweb/logger.svg?branch=master)](https://travis-ci.org/wizardsoftheweb/logger) [![Coverage Status](https://coveralls.io/repos/github/wizardsoftheweb/logger/badge.svg?branch=master)](https://coveralls.io/github/wizardsoftheweb/logger?branch=master)

This is an opinionated [`winston`](https://github.com/winstonjs/winston) setup.

<!-- MarkdownTOC -->

- [Installation](#installation)
    - [Dev version](#devversion)
- [Tests](#tests)
- [Usage](#usage)
- [Scope?](#scope)
- [Roadmap](#roadmap)
    - [Main Features](#mainfeatures)
    - [Eventual features](#eventualfeatures)

<!-- /MarkdownTOC -->


## Installation

<!--
```bash
npm install @wizardsoftheweb/logger
```
-->

### Dev version

```
npm install --save git+https://github.com/wizardsoftheweb/logger
```

## Tests

```bash
npm t
```

## Usage

TODO: write documentation after the API is done


## Scope?

Polluting the global namespace is generally considered a bad idea, so why would you do it on NPM?

## Roadmap

These percentages are pretty arbitrary. Today's 47% could be tomorrow's 90% or vice versa.

### Main Features

Once all of these are finished, I'll release `v1`. Until then, `v0` should be used with caution, because it's not stable.

| Progess | Feature |
| ------: | ------- |
|      0% | Add console formatter |
|      0% | Define levels |
|      0% | Add contextual logging calls (i.e. precede entry with scope) |
|      0% | Add decorator |
|      0% | Export the full namespace |
|      0% | Compile declaration file |
|      0% | Compile docs from source |
|      0% | Incorporate `@todo`s somewhere prominent in the docs |
|      0% | Publish package on `npm` |

### Eventual features

These are things I'd like to add, but probably won't be included in `v1`. If not, they'll most likely constitute one or more minor version increments.

| Progess | Feature |
| ------: | ------- |
|      0% | [Greenkeeper](https://greenkeeper.io/) (or similar) integration |
