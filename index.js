/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [github-action-auto-increment-version] /index.js
 * @create:      2021-12-03 22:34:52.942
 * @modify:      2021-12-04 08:20:01.489
 * @version:     1.0.1
 * @times:       13
 * @lines:       110
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

const { existsSync } = require("fs");
const core = require("@actions/core");
// const github = require("@actions/github");
const { KavenLog, GetFileLines, SaveStringToFile } = require("kaven-utils");
const { logJson, increase, tryParseVersion } = require("./src/functions");
const { join, resolve } = require("path");

async function run() {
    try {
        // inputs defined in action metadata file
        const debug = core.getBooleanInput("debug");
        let dir = core.getInput("dir");
        let file = core.getInput("file");
        const index = Number(core.getInput("index"));
        const increment = Number(core.getInput("increment"));

        if (debug) {
            logJson(process.env);
        }

        if (Number.isNaN(index)) {
            core.setFailed(`invalid index: ${index}`);
            return;
        }

        if (Number.isNaN(increment)) {
            core.setFailed(`invalid increment: ${index}`);
            return;
        }

        if (!dir) {
            if (process.env.GITHUB_WORKSPACE) {
                dir = process.env.GITHUB_WORKSPACE;
            }
        }

        if (!file) {
            const possibleFiles = ["package.json", "pubspec.yaml"];
            for (const f of possibleFiles) {
                if (existsSync(f)) {
                    file =f;
                }
            }
        }

        if (!existsSync(file) && dir) {
            file = join(dir, file);
        }

        if (!existsSync(file)) {
            core.setFailed(`file not exists: ${file}`);
            return;
        }

        file = resolve(file);

        if (debug) {
            console.log(`dir: ${dir}, file: ${file}, index: ${index}, increment: ${increment}`);
        }

        const { endOfLineSequence, lines } = await GetFileLines(file);
        const versionLines = lines.filter(p => tryParseVersion(p) !== undefined);
        if (versionLines.length !== 1) {
            core.setFailed(`parse version failed: ${versionLines.length}`);
            return;
        }

        const versionLine = versionLines[0];
        const oldVersion = tryParseVersion(versionLine);

        const newVersion = increase(oldVersion, index, increment);
        if (newVersion === undefined) {
            core.setFailed(`update failed: ${oldVersion}`);
            return;
        }

        const lineIndex = lines.indexOf(versionLine);
        lines[lineIndex] = newVersion;
        const f = await SaveStringToFile(lines.join(endOfLineSequence), file);

        console.log(`update version from ${oldVersion} to ${newVersion}, ${f}`);

        core.setOutput("oldVersion", oldVersion);
        core.setOutput("newVersion", newVersion);

        // Get the JSON webhook payload for the event that triggered the workflow
        // const payload = JSON.stringify(github.context.payload, undefined, 2);
        // console.log(`The event payload: ${payload}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run().catch(KavenLog.DefaultErrorHandler);
