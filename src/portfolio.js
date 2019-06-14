/*-----------------------------------------------------------------
- Load portfolio
-----------------------------------------------------------------*/
const fs = require('fs-extra');
const md5 = require('md5');
const file = './data/portfolio.json';
let portfolio = {};
const outputFormat = { spaces: 2 };

/**
 * Load portfolio object. Create a new one if does not exist.
 */
const initFile = () => {
    portfolio = fs.readJsonSync(file, { throws: false });
    
    if (!portfolio) {
        portfolio = {};
        fs.outputJsonSync(file, portfolio, outputFormat);
    }
};

/**
 * Save new data on portfolio file
 * @param coin
 * @param transaction
 */
const save = (coin, transaction) => {
    
    // Create a hash for transaction
    const now = new Date().getTime();
    const hash = md5(now);
    
    // Check if coin exists in portfolio
    if (!portfolio.hasOwnProperty(coin)) {
        portfolio[coin] = {};
    }
    
    // Insert transaction in portfolio
    portfolio[coin][hash] = transaction;
    
    // Write portfolio to file
    fs.writeJsonSync(file, portfolio, outputFormat);
    
    return true;
    
};

// Export portfolio
module.exports = {
    portfolio,
    initFile,
    save,
};