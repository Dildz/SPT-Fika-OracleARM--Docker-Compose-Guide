const fs = require('fs');
const path = require('path');

const configDirectories = [
    path.resolve(__dirname, '../config/binders'),
    path.resolve(__dirname, '../config/packs'),
    path.resolve(__dirname, '../config/cards')
];

const customItemConfigs = [];

configDirectories.forEach(directory => {
    fs.readdirSync(directory).forEach(file => {
        if (file.endsWith('.json')) {
            const config = require(path.join(directory, file));
            customItemConfigs.push(config);
        }
    });
});

module.exports = { customItemConfigs };
