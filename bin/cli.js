#!/usr/bin/env node
'use strict';
/*eslint no-console: 0*/

const ina           = require('ina');
const chalk         = require('chalk');
const Spnnr         = require('spnnr');
const fs            = require('fs');
const path          = require('path');
const homedir       = path.join(require('os').homedir(), '.ina/');
const homefile      = path.join(homedir + 'packages.json');
const argv          = require('minimist')(process.argv.slice(2), { boolean: ['list', 'save']});
const names         = argv._;

const clr           = chalk.gray;
const clrR          = chalk.red.bold;
const clrG          = chalk.green.bold;
const clrW          = chalk.white.bold;
const clrY          = chalk.yellow.bold;

const namesToSave   = [];
let   promises      = [];

function createDefaultHomefile() {
    fs.writeFileSync(homefile, JSON.stringify({ available: [] }), 'utf-8');
    console.log(clr('Cache created for saving package names. Have fun!'));
}

function getVersionString(version) {
    return clrY('@' + version);
}

function getDaysPassed(firstStr) {
    const now   = new Date();
    const first = new Date(firstStr);
    const a     = Date.UTC(first.getFullYear(), first.getMonth(), first.getDate());
    const b     = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const days  = Math.floor((b - a) / 86400000);

    return 'updated ' + days + ' days ago';
}

function check(name) {
    return new Promise((resolve, reject) => {
        let spinner = new Spnnr(`${clr('Looking for')} ${clrW(name)}`);

        ina.check(name).then((info) => {
            if (info.exists === true) {
                spinner.stop([
                    clrR('×'),
                    clrW(name + '@' +info.version),
                    clr('is unavailable,'),
                    clr(getDaysPassed(info.modified)),
                ].join(' '));
            } else {
                spinner.stop([
                    clrG('√'),
                    clrW(name),
                    clr('is available')
                ].join(' '));

                if (argv.save) { namesToSave.push(name); };
            }

            resolve();
        });
    });
}

if (argv.list) {
    if (!fs.existsSync(homedir)) {
        fs.mkdirSync(homedir);
        createDefaultHomefile();
    } else if (fs.existsSync(homefile)) {
        let data = require(homefile);

        if (data.available.length > 0) {
            data.available.forEach((name) => {
                console.log(`  ${clrW(name)}`);
            });
        } else {
            console.log(clr('You have not saved any package name yet.'));
        }
    } else {
        createDefaultHomefile();
    }

    process.exit(0);
}

if (names.length === 0) {
    console.log(clr('Hey you forgot to specify the name(s) you are looking for.'));
    process.exit(1);
}

names.forEach((name) => {
    promises.push(check(name));
});

Promise.all(promises).then(() => {
    let data = require(homefile);

    data.available = Array.from(new Set(data.available.concat(namesToSave)));

    fs.writeFileSync(homefile, JSON.stringify(data), 'utf-8');
});
