const fs = require('fs');
const path = require('path');
const configDirectories = [
    path.resolve(__dirname, '../config/cards')
];
const cardIDs = [];
configDirectories.forEach(directory => {
    fs.readdirSync(directory).forEach(file => {
        if (file.endsWith('.json')) {
            const card_ids = require(path.join(directory, file));
            card_ids.forEach(id => {
                cardIDs.push(id);
            });
        }
    });
});
module.exports = { cardIDs };
//# sourceMappingURL=card_ids.js.map