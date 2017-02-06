#!/usr/bin/env node
'use strict';
/*eslint no-console: 0*/

const ina           = require('ina');
const Spnnr         = require('spnnr');
const fs            = require('fs');
const path          = require('path');
const formatter     = require('./formatter');
const logger        = require('./logger');
const homedir       = path.join(require('os').homedir(), '.ina/');
const homefile      = path.join(homedir + 'packages.json');
const argv          = require('minimist')(process.argv.slice(2), {
        boolean:    ['list', 'save', 'detailed', 'version', 'recheck'],
        alias:      { l: 'list', s: 'save', d: 'detailed', v: 'version', r: 'recheck' }
    });

function createDefaultHomefile() {
    fs.writeFileSync(homefile, JSON.stringify({ available: [] }), 'utf-8');
}

function check(name) {
    return new Promise((resolve, reject) => {
        let spinner = new Spnnr(formatter.getSpinnerText(name));

        ina.check(name).then((info) => {
            if (info.exists === true) {
                spinner.stop(formatter.getUnavailableInfo(name, info, argv.detailed));
                resolve('');
            } else {
                spinner.stop(formatter.getAvailableInfo(name));
                resolve(argv.save ? name : '');
            }
        });
    });
}

function run(names) {
    if (names.length === 0) {
        logger.logHelp();
        process.exit(1);
    }

    const promises = names.map(name => check(name));

    Promise.all(promises).then((results) => {
        let data        = require(homefile);

        results         = results.filter(name => name !== '');
        data.available  = Array.from(new Set(data.available.concat(results)));

        fs.writeFileSync(homefile, JSON.stringify(data), 'utf-8');
    });
}

if (argv.version) {
    logger.logVersion();
    process.exit(0);
}

if (argv.list) {
    if (!fs.existsSync(homedir)) {
        fs.mkdirSync(homedir);
        createDefaultHomefile();
    } else if (fs.existsSync(homefile)) {
        logger.logSaved(require(homefile));
    } else {
        createDefaultHomefile();
    }

    process.exit(0);
}

if (argv.recheck) {
    // TODO
}

run(argv._);
