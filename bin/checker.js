'use strict';

const ina       = require('ina');
const Spnnr     = require('spnnr');
const formatter = require('./formatter');
const cache     = require('./cache');

const check = (name, detailed) => {
    return new Promise((resolve, reject) => {
        let spinner = new Spnnr(formatter.getSpinnerText(name));

        ina.check(name, detailed).then((info) => {
            if (info.exists === true) {
                spinner.stop(formatter.getUnavailableInfo(name, info, detailed));
                resolve('');
            } else {
                spinner.stop(formatter.getAvailableInfo(name));
                resolve(name);
            }
        });
    });
};

module.exports.checkAll = (names, detailed, save) => {
    if (names.length === 0) return;

    const promises = names.map(name => check(name, detailed));

    Promise.all(promises).then((results) => {
        if (save) cache.save(results);
    });
};
