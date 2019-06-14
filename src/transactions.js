/*-----------------------------------------------------------------
- Actions of transactions
-----------------------------------------------------------------*/
const inquirer  = require('inquirer');
const { save } = require('./portfolio');
const { coins } = require('./options');

// Register created_attime to inquirer
inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

/**
 * Return questions to create a transaction
 * @param type
 * @returns {*[]}
 */
const transactionQuestions = (type = 'buy') => {
    return [
        {
            name   : 'coin',
            type   : 'list',
            message: `What coin do you want to ${type}?`,
            default: 'btc',
            choices: coins,
            validate: value => (value.length ? true : 'Please select a coin.'),
        },
        {
            name   : 'amount',
            type   : 'input',
            message: `How much do you want to ${type}?`,
            validate: value => (value > 0 ? true : 'Please enter a positive number.'),
        },
        {
            name   : 'created_at',
            type   : 'datetime',
            message: `When did you ${type} this coin?`,
            validate: value => (value > 0 ? true : 'Please enter a positive number.'),
            format: ['yyyy', '/', 'mm', '/', 'dd', ' ', 'hh', ':', 'MM', ' ', 'TT'],
            initial: new Date(),
        },
    ]
};


/**
 * Create a buy transaction
 */
const buy = () => {
    inquirer.prompt(
        transactionQuestions()
    ).then( answers => {
        addTransaction(
            answers.coin,
            'buy',
            answers.amount,
            answers.created_at
        );
    });
};


/**
 * Create a sell transaction
 */
const sell = () => {
    inquirer.prompt(
        transactionQuestions()
    ).then( answers => {
        addTransaction(
            answers.coin,
            'sell',
            answers.amount,
            answers.created_at
        );
    });
};


/**
 * Add a transaction to portfolio
 *
 * @param coin
 * @param type
 * @param amount
 * @param created_at
 */
function addTransaction(coin, type = 'buy', amount = 0, created_at) {
    
    const transaction_date = new Date(created_at).getTime();
    
    // Create transaction object to insert into portfolio
    const transaction = {
        type,
        amount,
        created_at: transaction_date,
    };
    
    // Save transaction into portfolio
    const result = save(coin, transaction);
    if( result ){
        console.log('Your transaction saved successfully!');
    }
    
}

module.exports = {
    buy,
    sell,
};