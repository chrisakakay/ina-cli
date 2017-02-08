'use strict';

const chalk = require('chalk');
const clr   = chalk.gray;
const clrR  = chalk.red.bold;
const clrG  = chalk.green.bold;
const clrW  = chalk.white.bold;
const DAY   = 86400000;

function getUTCDate(date) {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDaysPassed(latestDate) {
    const latest    = getUTCDate(new Date(latestDate));
    const now       = getUTCDate(new Date());
    const days      = Math.floor((now - latest) / DAY);

    return 'updated ' + days + ' days ago';
}

module.exports.getUnavailableInfo = (name, info, detailed) => {
    if (detailed) {
        return [
            clrR('×'),
            clrW(name + '@' + info.version),
            clr('is unavailable,'),
            clr(getDaysPassed(info.modified))
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
};

module.exports.getSpinnerText = name => {
    return `${clr('Looking for')} ${clrW(name)}`;
};
