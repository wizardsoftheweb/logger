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

import { LogsWithWinston } from "../src/lib/LogsWithWinston";

// This is a decorator, so we have to test lots of classes.
/* tslint:disable:max-classes-per-file */
describe("LogsWithWinston", (): void => {
    const stubLogger = sinon.createStubInstance(winston.Logger);
    describe("The factory should get to winston no matter the input", (): void => {
        const loggerSpy: sinon.SinonSpy = sinon.spy(winston, "Logger");

        beforeEach((): void => {
            loggerSpy.reset();
        });

        it("should use existing winston instances if passed in", (): void => {
            @LogsWithWinston(stubLogger)
            class DecoratedClass {
                constructor() {
                    // do nothing
                }
            }
            const decorated = new DecoratedClass();
            loggerSpy.should.not.have.been.called;
        });

        it("should use existing config when passed in", (): void => {
            const dummyConfig = { levels: winston.config.syslog.levels };
            @LogsWithWinston(dummyConfig)
            class DecoratedClass {
                constructor() {
                    // do nothing
                }
            }
            const decorated = new DecoratedClass();
            loggerSpy.should.have.been.calledWithNew;
            loggerSpy.should.have.been.calledWith(dummyConfig);
        });

        it("should use OOTB-winston without input", (): void => {
            @LogsWithWinston()
            class DecoratedClass {
                constructor() {
                    // do nothing
                }
            }
            const decorated = new DecoratedClass();
            loggerSpy.should.have.been.calledWithNew;
            loggerSpy.should.have.been.calledWith({});
        });
    });

    describe("The factory should expose winston", (): void => {
        it("The factory should expose winston", (): void => {
            @LogsWithWinston({})
            class DecoratedClass {
                constructor() {
                    // do nothing
                }
            }
            const decorated: any = new DecoratedClass();
            decorated.should.have.property("logger");
            decorated.logger.should.be.an.instanceof(winston.Logger);
            decorated.logger.should.respondTo("log");
        });
    });

    describe("The factory should expose a naive prototype chain", (): void => {
        const basewhoamiWinston = "DecoratedClass";
        const baseNaivePrototypeChain = [basewhoamiWinston];
        @LogsWithWinston({})
        class DecoratedClass {
            constructor() {
                // do nothing
            }
        }
        @LogsWithWinston({})
        class DecoratedExtension extends DecoratedClass {
            constructor() {
                super();
            }
        }
        class UndecoratedExtension extends DecoratedClass {
            constructor() {
                super();
            }
        }
        it("should define whoamiWinston and naivePrototypeChain", (): void => {
            const decorated: any = new DecoratedClass();
            (decorated as any).whoamiWinston.should.equal(basewhoamiWinston);
            (decorated as any).naivePrototypeChain.should.be.an("array")
                .that.deep.equals(baseNaivePrototypeChain);
        });

        it("should change whoamiWinston and naivePrototypeChain if a child class is decorated", (): void => {
            const decoratedName = "DecoratedExtension";
            const decorated: any = new DecoratedExtension();
            (decorated as any).whoamiWinston.should.equal(decoratedName);
            (decorated as any).naivePrototypeChain.should.be.an("array")
                .that.deep.equals(baseNaivePrototypeChain.concat(decoratedName));
        });

        it("should NOT change whoamiWinston and naivePrototypeChain if a child class is NOT decorated", (): void => {
            const decorated: any = new UndecoratedExtension();
            (decorated as any).whoamiWinston.should.equal(basewhoamiWinston);
            (decorated as any).naivePrototypeChain.should.be.an("array")
                .that.deep.equals(baseNaivePrototypeChain);
        });
    });

});
/* tslint:enable:max-classes-per-file */
// Turn it back on so it doesn't accidentally continue elsewhere
