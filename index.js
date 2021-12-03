/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [github-action-auto-increment-version] /index.js
 * @create:      2021-12-03 22:34:52.942
 * @modify:      2021-12-03 23:07:16.172
 * @version:     1.0.1
 * @times:       5
 * @lines:       71
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

const { existsSync } = require("fs");
const { join, dirname, isAbsolute } = require("path");

const core = require("@actions/core");
// const github = require("@actions/github");

const { GetFileContent, KavenLog, LoadJsonFile } = require("kaven-utils");


function logJson(data) {
    console.log(JSON.stringify(data, undefined, 2));
}

async function run() {
    try {
        // inputs defined in action metadata file
        const debug = core.getBooleanInput("debug");
        let dir = core.getInput("dir");
        const file = core.getInput("file");
        const type = core.getInput("type");

        if (debug) {
            logJson(process.env);
        }

        if (!dir) {
            if (process.env.GITHUB_WORKSPACE) {
                dir = process.env.GITHUB_WORKSPACE;
            }
        }

        if (debug) {
            console.log(`dir: ${dir}, file: ${file}, type: ${type}`);
        }

        if (!existsSync(file)) {
            core.setFailed(`file not exists: ${file}`);
            return;
        }

        const json = await LoadJsonFile(file);
        const oldVersion = json["version"];

        core.setOutput("old", oldVersion);
        core.setOutput("new", "new");

        // Get the JSON webhook payload for the event that triggered the workflow
        // const payload = JSON.stringify(github.context.payload, undefined, 2);
        // console.log(`The event payload: ${payload}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run().catch(KavenLog.DefaultErrorHandler);
