/* eslint-disable no-console */
import chalk from 'chalk';
import inquirer from 'inquirer';
import autocomplete from 'inquirer-autocomplete-prompt';
import Dinero from 'dinero.js';

import CoinExchange from '../coin-exchange';
import coins from '../coin-exchange/currency';

class MainConsole {
  constructor() {
    this.coins = Object.keys(coins);

    /* istanbul ignore next */
    this.questions = [
      {
        message: 'I want to convert from',
        type: 'autocomplete',
        name: 'from',
        pageSize: 4,
        source: async (answersSoFar, input = '') => this.coins.filter(d => d.match(input.toUpperCase())),
      },
      {
        message: 'to',
        type: 'autocomplete',
        name: 'to',
        pageSize: 4,
        source: async (answersSoFar, input = '') => this.coins.filter(d => d.match(input.toUpperCase())),
      },
      {
        message: 'the value',
        default: 1,
        name: 'value',
        type: 'input',
        validate(value) {
          const valid = !Number.isNaN(parseFloat(value));
          return valid || 'Please enter a number';
        },
        filter: Number,
      },
    ];
  }

  static get title() {
    return chalk.bold.hex('#f44336');
  }

  static get faded() {
    return chalk.gray.dim;
  }

  static get result() /* istanbul ignore next */ {
    return chalk.hex('#4caf50').bold;
  }

  start() /* istanbul ignore next */ {
    console.clear();
    console.log(MainConsole.title('Welcome to the Coin Exchange!'));
    console.log(MainConsole.faded('============================='));
    inquirer.registerPrompt('autocomplete', autocomplete);
    inquirer.prompt(this.questions).then(async (answers) => {
      const coin = new CoinExchange(answers);
      const result = await coin.exchange();
      const fResult = MainConsole.format(result, answers.to);

      console.log('\n');
      console.log(MainConsole.result(fResult));
    }).catch((err) => {
      console.error(MainConsole.title(err.message));
    });
  }

  static format(givenAmount, pCurrency) {
    const { amount, precision } = MainConsole.processAmount(givenAmount);
    const currency = (pCurrency === 'BTC' ? 'ALL' : pCurrency);

    const result = Dinero({ amount, currency, precision })
      .setLocale('pt-BR')
      .toFormat();

    return pCurrency === 'BTC' ? `${result}`.replace(/ALL/, 'BTC') : result;
  }

  static processAmount(pAmount) {
    const real = pAmount;
    const [match] = `${real}`.match(/\.[0-9]+/) ? `${real}`.match(/\.[0-9]+/) : [];
    const precision = match ? match.length - 1 : 0;

    const amount = real * (10 ** precision);
    return { amount, precision };
  }
}

export default MainConsole;
