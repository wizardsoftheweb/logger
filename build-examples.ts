import { readFileSync, writeFileSync } from "fs";
import { EOL } from "os";
import { join } from "path";
import * as shelljs from "shelljs";
import * as winston from "winston";

const logger = new winston.Logger({
    level: "silly",
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            timestamp: true,
        }),
    ],
});

if (!shelljs.which("git")) {
    logger.error("git required for publication");
    throw new Error("git not found");
}

const branch = shelljs.exec("rev-parse --abbrev-ref HEAD").stdout as string;
if (branch !== "master") {
    const wrongBranch = "This script must be run on the master branch";
    logger.error(wrongBranch);
    throw new Error(wrongBranch);
}

/* tslint:disable-next-line:no-var-requires */
const config = require("./package.json");

const examplesPath = join(__dirname, "examples");

logger.info(`Updating ${config.name}`);
shelljs.cd(examplesPath);
shelljs.exec(`npm update ${config.name}`);

logger.info("Rebuilding README");
const insertRegExp = /<!-- ([^ ]*) -->\s*```(\w+)?[\s\S]*?```\s*<!-- \/\1 -->/g;
const readmePath = join(examplesPath, "README.md");
logger.silly(`Reading ${readmePath}`);
const readme = readFileSync(readmePath, "utf8");
let inserted = readme;

let match: any;
/* tslint:disable-next-line:no-conditional-assignment */
while (match = insertRegExp.exec(readme)) {
    logger.verbose(`Reinserting ${match[1]}`);
    const contents = readFileSync(join(examplesPath, match[1]));
    const replacement = `\
<!-- ${match[1]} -->\
\n\`\`\`${match[2] || ""}\
\n${contents}\
\`\`\`\
\n<!-- /${match[1]} -->`
        .replace(/\r?\n/g, EOL);
    inserted = inserted.replace(match[0], replacement);
}
logger.silly(`Writing ${readmePath}`);
writeFileSync(readmePath, inserted, "utf8");

shelljs.cd(__dirname);
logger.info("Linting examples/");
const lintOutput = shelljs.exec("tslint -c ./tslint.json -p ./examples/tsconfig.json --type-check").stdout as string;
if (lintOutput.match(/ERROR/g)) {
    throw new Error("Linting errors");
}
const stagedFiles = (shelljs.exec("git diff --cached --name-only").stdout as string)
                .split(EOL)
                .reduce((accumulated: string[], current: string): string[] => {
                    current = current.trim();
                    if (current.length > 0) {
                        accumulated.push(current);
                    }
                    return accumulated;
                }, []);
logger.silly(`Found staged files: ${JSON.stringify(stagedFiles)}`);
logger.info("Updating repository");
logger.verbose("Resetting git");
shelljs.exec("git reset");
logger.verbose("Adding examples/");
shelljs.exec("git add examples");
logger.verbose("Committing");
shelljs.exec("git commit -m 'Update examples (see build-examples.ts)'");
logger.verbose("Pushing master");
logger.silly("Guarded just to be safe");
shelljs.exec("git checkout master && git push -u origin master");
logger.verbose("Rebasing dev");
shelljs.exec("git checkout dev");
shelljs.exec("git rebase master");
shelljs.exec("git push -u origin dev");
shelljs.exec("git checkout master");
if (stagedFiles.length > 0) {
    logger.verbose("Restaging files");
    shelljs.exec(`git add ${stagedFiles.join(" ")}`);
}

logger.info("Finished building examples");
