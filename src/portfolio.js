/*-----------------------------------------------------------------
- Load portfolio
-----------------------------------------------------------------*/
const fs = require('fs-extra');
const md5 = require('md5');
const Table = require('cli-table3');
const moment = require('moment');
const chalk = require('chalk');
const { prompt }  = require('inquirer');
const { coins } = require('./options');
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

/**
 * Return questions for history of a coin
 * @returns {{default: string, name: string, type: string, message: string, choices: (*[]|*), validate: (function(*): *)}[]}
 */
const historyQuestions = () => {
    return [
        {
            name   : 'coin',
            type   : 'list',
            message: `What coin do you want to see the transactions?`,
            default: 'btc',
            choices: coins,
            validate: value => (value.length ? true : 'Please select a coin.'),
        },
    ];
};

/**
 * Show history of coin transactions
 */
const coinHistory = () => {
    
    prompt(
        historyQuestions()
    ).then( answers => {
    
        const coin = coins.find(item => item.value === answers.coin);
        const symbol = ` ${coin.value.toUpperCase()}`;
        let total = 0;
    
        // Make table
        const table = new Table({
            head: [{colSpan: 4, content: `${coin.name} transactions history`}],
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
        });
    
        // Set head columns
        table.push([
            chalk.cyan.bold('ID'),
            chalk.cyan.bold('Date'),
            chalk.cyan.bold('Type'),
            chalk.cyan.bold('Amount'),
        ]);
    
        if( portfolio.hasOwnProperty(coin.value) && Object.keys(portfolio[coin.value]).length ) {
    
            // Get history and make table rows
            const history = portfolio[coin.value];
            
            Object.keys(history).map(id => {
        
                const item = history[id];
                item.type = item.type.toUpperCase();
        
                if (item.type === 'BUY') {
                    item.type = chalk.blue.bold(item.type);
                    total += item.amount;
                } else {
                    item.type = chalk.red.bold(item.type);
                    total -= item.amount;
                }
        
                table.push([
                    chalk.hex('#AAAAAA')(id),
                    moment(item.created_at).format('MMMM D, YYYY HH:mm A'),
                    item.type === 'BUY' ? chalk.blue.bold(item.type) : chalk.red.bold(item.type),
                    chalk.bold(item.amount) + chalk.hex('#AAAAAA')(symbol),
                ]);
            });
    
            // Set total
            table.push([
                { colSpan  : 3,
                    hAlign : 'right',
                    content: chalk.green.bold('Total:')
                },
                chalk.bold(total + symbol),
            ]);
    
        } else {
    
            table.push([
                { colSpan  : 4,
                    hAlign : 'center',
                    content: chalk.green.bold(`\n\nYou don't have any transaction for this coin!\n\n`),
                    style: {
                        'padding-right': 10,
                        'padding-left': 10,
                    }
                },
            ]);
            
        }
    
        // Print table
        console.log(table.toString());
        
    });
};

// Export portfolio
module.exports = {
    portfolio,
    initFile,
    save,
    coinHistory,
};