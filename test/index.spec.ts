// Things like ...be.true; or ...be.rejected; dont play nice with TSLint
/* tslint:disable:no-unused-expression */
import * as chai from "chai";
// Needed for describe, it, etc.
import { } from "mocha";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

const should = chai.should();
chai.use(sinonChai);

import {
    Logger,
    LoggerInstance,
    LoggerOptions,
} from "winston";
import * as winston from "winston";

import { ILogsWithWinston, LogsWithWinston } from "../src";

// This is a decorator, so we have to test lots of classes.
/* tslint:disable:max-classes-per-file */
describe("index", (): void => {
    it("should compile properly", (): void => {
        LogsWithWinston.should.be.a("function");
    });
});
