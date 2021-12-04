/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [github-action-auto-increment-version] /src/test.js
 * @create:      2021-12-04 00:19:48.929
 * @modify:      2021-12-04 08:40:04.434
 * @version:     1.0.1
 * @times:       22
 * @lines:       69
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

const {join} = require("path");
const { increase, tryParseVersion, tryParseVersionFromFile } = require("./functions");

function test_increase(expected, ...args) {
    const r = increase.call(undefined, ...args);
    if (r !== expected) {
        throw new Error(`${expected} !== ${r}`);
    }
}

function test_tryParseVersion(expected, ...args) {
    const r = tryParseVersion.call(undefined, ...args);
    if (r !== expected) {
        throw new Error(`${expected} !== ${r}`);
    }
}

async function test() {
    test_increase("1.0.1", "1.0.0", -1, 1);
    test_increase("1.0.10", "1.0.9", -1, 1);
    test_increase("1.0.100", "1.0.99", -1, 1);

    test_increase("1.0.1", "1.0.0", 3, 1);
    test_increase("1.0.10", "1.0.9", 3, 1);
    test_increase("1.0.100", "1.0.99", 3, 1);

    test_increase("v1.1.0", "v1.0.0", 2, 1);
    test_increase("v1.1.10", "v1.0.10", 2, 1);
    test_increase("v1.1.100", "v1.0.100", 2, 1);

    test_increase("1.0.0-build5601", "1.0.0-build5600", -1, 1);
    test_increase("1.0.0-build5601", "1.0.0-build5600", 4, 1);

    test_increase("2", "1", 1, 1);
    test_increase("101", "1", 1, 100);

    test_increase(undefined, "no-numbers", 1, 1);

    const versions = ["1.0.1", "1.0.10+12", "10.0.0.6", "1.2.3-daily-build-1", "v0.0.9"];
    for (const version of versions) {
        test_tryParseVersion(version, `version: ${version}`);
        test_tryParseVersion(version, ` version : ${version} `);
        test_tryParseVersion(version, ` "version": "${version}" `);
        test_tryParseVersion(version, ` "version" : "${version}" `);
    }

    const version = await tryParseVersionFromFile(join(__dirname, "../package.json"));
    if (version === undefined) {
        throw new Error();
    }
}

test().then(() => console.log("All OK"));
