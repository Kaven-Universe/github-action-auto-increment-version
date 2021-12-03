/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [github-action-auto-increment-version] /src/functions.js
 * @create:      2021-12-04 00:13:27.140
 * @modify:      2021-12-04 00:35:22.381
 * @version:     1.0.1
 * @times:       3
 * @lines:       83
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

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
    let numbers = version.match(/\d+/g)?.map(Number);
    const strings = version.match(/[^\d]+/g);

    if (!numbers) {
        return undefined;
    }

    if (index < 0) {
        const temp = numbers.reverse();
        temp[-index - 1] += increment;
        numbers = temp.reverse();
    } else {
        numbers[index - 1] += increment;
    }

    if (numbers && strings) {
        const startsWithString = version.startsWith(strings[0]);
        const result = [];

        let s, n;
        do {
            s = strings.shift();
            n = numbers.shift();

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
        } while (s !== undefined || n !== undefined);

        return result.join("");
    } else if (numbers) {
        return numbers.join("");
    }

    return undefined;
}

module.exports = {
    logJson,
    increase,
};
