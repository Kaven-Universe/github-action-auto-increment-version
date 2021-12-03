/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [github-action-auto-increment-version] /index.js
 * @create:      2021-12-03 22:34:52.942
 * @modify:      2021-12-04 00:43:43.652
 * @version:     1.0.1
 * @times:       8
 * @lines:       86
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

const { existsSync } = require("fs");
const core = require("@actions/core");
// const github = require("@actions/github");
const { KavenLog, LoadJsonFile, SaveStringToFile } = require("kaven-utils");
const { logJson, increase, stringifyJson } = require("./src/functions");

async function run() {
    try {
        // inputs defined in action metadata file
        const debug = core.getBooleanInput("debug");
        let dir = core.getInput("dir");
        const file = core.getInput("file");
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

        if (debug) {
            console.log(`dir: ${dir}, file: ${file}, index: ${index}, increment: ${increment}`);
        }

        if (!existsSync(file)) {
            core.setFailed(`file not exists: ${file}`);
            return;
        }

        const json = await LoadJsonFile(file);
        const oldVersion = json["version"];

        const newVersion = increase(oldVersion, index, increment);
        if (newVersion === undefined) {
            core.setFailed(`update failed: ${oldVersion}`);
            return;
        }

        json["version"] = newVersion;
        const f = await SaveStringToFile(file, stringifyJson(json));

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
