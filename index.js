/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [github-action-auto-increment-version] /index.js
 * @create:      2021-12-03 22:34:52.942
 * @modify:      2021-12-04 00:04:57.158
 * @version:     1.0.1
 * @times:       6
 * @lines:       150
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

/**
 * 
 * @param {string} version 
 * @param {number} index 
 * @param {number} increment 
 * @returns 
 */
function increase(version, index, increment) {
    let numbers = version.match(/\d+/g).map(Number);
    const strings = version.match(/[!\d]+/g);

    if (!numbers) {
        return undefined;
    }

    if (index < 0) {
        let temp = numbers.reverse();
        temp[-index - 1] += increment;
        numbers = temp.reverse();
    } else {
        numbers[index - 1] += increment;
    }

    if (numbers && strings) {
        const startsWithString = version.startsWith(strings[0]);
        const result = [];

        while (true) {
            const s = strings.shift();
            const n = numbers.shift();

            if (startsWithString) {
                if (s !== undefined) {
                    result.push(s);
                }

                if (n !== undefined) {
                    result.push(n);
                }
            } else {
                if (n !== undefined) {
                    result.push(n);
                }

                if (s !== undefined) {
                    result.push(s);
                }
            }

            if (s === undefined && n === undefined) {
                return result.join("");
            }
        }
    } else if (numbers) {
        return numbers.join("");
    }

    return undefined;
}

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

        console.log(`update version from ${oldVersion} to ${newVersion}`);

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
