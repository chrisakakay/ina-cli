'use strict';

const chalk = require('chalk');
const clr   = chalk.gray;
const clrR  = chalk.red.bold;
const clrG  = chalk.green.bold;
const clrW  = chalk.white.bold;

function getDaysPassed(firstStr) {
    const now   = new Date();
    const first = new Date(firstStr);
    const a     = Date.UTC(first.getFullYear(), first.getMonth(), first.getDate());
    const b     = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const days  = Math.floor((b - a) / 86400000);

    return 'updated ' + days + ' days ago';
}

module.exports.getUnavailableInfo = (name, info, detailed) => {
    if (detailed) {
        return [
            clrR('×'),
            clrW(name + '@' + info.version),
            clr('is unavailable,'),
            clr(getDaysPassed(info.modified)),
        ].join(' ');
    } else {
        return [
            clrR('×'),
            clrW(name),
            clr('is unavailable')
        ].join(' ');
    }
};

module.exports.getAvailableInfo = name => {
    return `${clrG('√')} ${clrW(name)} ${clr('is available')}`;
}

module.exports.getSpinnerText = name => {
    return `${clr('Looking for')} ${clrW(name)}`;
}
