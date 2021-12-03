/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [github-action-auto-increment-version] /src/test.js
 * @create:      2021-12-04 00:19:48.929
 * @modify:      2021-12-04 00:35:33.133
 * @version:     1.0.1
 * @times:       14
 * @lines:       46
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

const { increase } = require("./functions");

function test_increase(expected, ...args) {
    const r = increase.call(undefined, ...args);
    if (r !== expected) {
        throw new Error(`${expected} !== ${r}`);
    }
}

test_increase("1.0.1", "1.0.0", -1, 1);
test_increase("1.0.10", "1.0.9", -1, 1);
test_increase("1.0.100", "1.0.99", -1, 1);

test_increase("1.0.1", "1.0.0", 3, 1);
test_increase("1.0.10", "1.0.9", 3, 1);
test_increase("1.0.100", "1.0.99", 3, 1);

test_increase("1.1.0", "1.0.0", 2, 1);
test_increase("1.1.10", "1.0.10", 2, 1);
test_increase("1.1.100", "1.0.100", 2, 1);

test_increase("1.0.0-build5601", "1.0.0-build5600", -1, 1);
test_increase("1.0.0-build5601", "1.0.0-build5600", 4, 1);

test_increase("2", "1", 1, 1);
test_increase("101", "1", 1, 100);

test_increase(undefined, "no-numbers", 1, 1);

console.log("All OK");
