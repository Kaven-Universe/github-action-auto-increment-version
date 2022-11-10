/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [github-action-auto-increment-version] /index.js
 * @create:      2021-12-03 22:34:52.942
 * @modify:      2022-11-10 17:23:37.053
 * @version:     1.0.1
 * @times:       18
 * @lines:       111
 * @copyright:   Copyright © 2021-2022 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

/* eslint-disable no-console */

const { existsSync } = require("fs");
const core = require("@actions/core");
// const github = require("@actions/github");
const { IncreaseVersion } = require("kaven-basic");
const { KavenLog, SaveStringToFile, TryParseVersionFromFile } = require("kaven-utils");
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
            console.log(JSON.stringify(process.env, undefined, 2));
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
                const path = dir ? join(dir, f) : f;
                if (existsSync(path)) {
                    file = f;
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

        const result = await TryParseVersionFromFile(file);
        if (result === undefined) {
            core.setFailed(`parse version failed: ${file}`);
            return;
        }

        const { version, lines, versionLine, endOfLineSequence } = result;

        const newVersion = IncreaseVersion(version, index, increment);
        if (newVersion === undefined) {
            core.setFailed(`update failed: ${version}`);
            return;
        }

        const lineIndex = lines.indexOf(versionLine);
        lines[lineIndex] = lines[lineIndex].replace(version, newVersion);
        const f = await SaveStringToFile(lines.join(endOfLineSequence), file);

        console.log(`update version from ${version} to ${newVersion}, ${f}`);

        core.setOutput("version", version);
        core.setOutput("newVersion", newVersion);

        // Get the JSON webhook payload for the event that triggered the workflow
        // const payload = JSON.stringify(github.context.payload, undefined, 2);
        // console.log(`The event payload: ${payload}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run().catch(KavenLog.DefaultErrorHandler);
