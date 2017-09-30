// Things like ...be.true; or ...be.rejected; dont play nice with TSLint
/* tslint:disable:no-unused-expression */
import * as chai from "chai";
// Needed for describe, it, etc.
import { } from "mocha";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

const should = chai.should();
chai.use(sinonChai);

describe("Empty package", (): void => {
    it("should contain nothing", (): void => {
        true.should.be.true;
    });
});
