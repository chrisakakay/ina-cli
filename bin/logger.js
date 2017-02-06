'use strict';

const chalk = require('chalk');
const clr   = chalk.gray;
const clrW  = chalk.white.bold;
const path  = require('path');

module.exports.logHelp = () => {
    console.log(clr([
        'Usage: ina [options] [package names]',
        '',
        'Options:',
        '   -v, --version   prints the version',
        '   -l, --list      lists the saved names',
        '   -r, --recheck   rechecks the saved names',
        '   -s, --save      saves the available name',
        '   -d, --detailed  shows more info about taken names'
    ].join('\n')));
}

module.exports.logVersion = () => {
    let pack = require(path.join(path.dirname(__filename) + '/../package.json'));

    console.log(clr(pack.version));
}

module.exports.logSaved = data => {
    if (data.available.length > 0) {
        data.available.forEach((name) => {
            console.log(`* ${clrW(name)}`);
        });
    }
}