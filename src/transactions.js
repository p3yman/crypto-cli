/*-----------------------------------------------------------------
- Actions of transactions
-----------------------------------------------------------------*/
const { prompt } = require('inquirer');
const { save } = require('./portfolio');
const { coins } = require('./options');

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
    ]
};


/**
 * Create a buy transaction
 */
const buy = () => {
    prompt(
        transactionQuestions()
    ).then( answers => {
        addTransaction(
            answers.coin,
            'buy',
            answers.amount,
            answers.date
        );
    });
};

/**
 * Add a transaction to portfolio
 *
 * @param coin
 * @param type
 * @param amount
 * @param date
 */
function addTransaction(coin, type = 'buy', amount = 0, date = null) {
    
    const now = new Date().getTime();
    
    // Create transaction object to insert into portfolio
    const transaction = {
        type,
        amount,
        date: date || now,
    };
    
    save(coin, transaction);
    
}

module.exports = {
    buy,
};