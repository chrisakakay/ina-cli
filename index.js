#!/usr/bin/env node
'use strict';

const ina   = require('ina');
const chalk = require('chalk');
const Spnnr = require('spnnr');
const names = process.argv.slice(2);

function check(name) {
    return new Promise((resolve, reject) => {
        let spinner = new Spnnr(`${chalk.gray('Looking for')} ${chalk.white.bold(name)}`);

        ina.check(name).then((info) => {
            if (info.exists === true) {
                spinner.stop(`${chalk.red.bold('×')} ${chalk.white.bold(name)} ${chalk.gray('is unavailable')}`);
            } else {
                spinner.stop(`${chalk.green.bold('√')} ${chalk.white.bold(name)} ${chalk.gray('is available')}`);
            }

            resolve();
        });
    });
}

if (names.length === 0) {
    /*eslint no-console: 0*/
    console.log('Hey you forgot to specify the name(s) you are looking for.');
    process.exit(1);
}

let flow = Promise.resolve();

names.forEach((name) => {
    flow.then(() => check(name));
});
