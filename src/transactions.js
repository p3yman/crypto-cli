/*-----------------------------------------------------------------
- Actions of transactions
-----------------------------------------------------------------*/
const { prompt } = require('inquirer');
const { portfolio } = require('./portfolio');
const { coins } = require('./options');

const transactionQuestions = [
    {
        name   : 'coin',
        type   : 'list',
        message: 'What coin do you want to buy?',
        default: 'btc',
        choices: coins,
        validate: value => (value.length ? true : 'Please select a coin.'),
    },
];

/**
 * Create a buy transaction
 */
const buy = () => {
    prompt(
        transactionQuestions
    ).then( answers => {
        console.log(answers);
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
    
    const transaction = {
        type,
        amount,
        date: date || new Date(),
    };
    
    console.log(coin);
    console.log(transaction);
    
}

module.exports = {
    buy,
};