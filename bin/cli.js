#!/usr/bin/env node
'use strict';

const logger    = require('./logger');
const checker   = require('./checker');
const cache     = require('./cache');
const argv      = require('minimist')(process.argv.slice(2), {
        boolean: [
            'list',
            'save',
            'detailed',
            'version',
            'recheck',
            'help'
        ],
        alias: {
            l: 'list',
            s: 'save',
            d: 'detailed',
            v: 'version',
            r: 'recheck',
            h: 'help'
        }
    });

cache.init();

if (argv.help) {
    logger.logHelp();
    process.exit(0);
}

if (argv.version) {
    logger.logVersion();
    process.exit(0);
}

if (argv.list) {
    logger.logSaved(cache.getCachedNames());
    process.exit(0);
}

checker.checkAll(argv.recheck ? cache.getCachedNames() : argv._, argv.detailed, argv.save);
