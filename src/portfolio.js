/*-----------------------------------------------------------------
- Load portfolio
-----------------------------------------------------------------*/
const fs = require('fs-extra');
const file = './data/portfolio.json';
const data = {};

// Load portfolio object. Create a new one if does not exist.
portfolio = fs.readJsonSync(file, { throws: false });
if( !portfolio ){
    fs.outputJsonSync(file, {})
}
portfolio = Object.assign(data, fs.readJsonSync(file));

// Export portfolio
module.exports = {
    portfolio
};