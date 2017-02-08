const fs        = require('fs');
const path      = require('path');
const homedir   = path.join(require('os').homedir(), '.ina/');
const homefile  = path.join(homedir + 'packages.json');

module.exports.init = () => {
    if (!fs.existsSync(homedir)) {
        fs.mkdirSync(homedir);
        fs.writeFileSync(homefile, JSON.stringify({ available: [] }), 'utf-8');
    }
};

module.exports.getCachedNames = () => {
    return require(homefile).available || [];
};

module.exports.save = names => {
    const data      = require(homefile);
    const filtered  = names.filter(name => name !== '');

    data.available  = Array.from(new Set(data.available.concat(filtered)));

    fs.writeFileSync(homefile, JSON.stringify(data), 'utf-8');
};
