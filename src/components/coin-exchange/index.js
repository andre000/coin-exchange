import createInterface from '../interface';
import avaiableCoins from './currency';

class CoinExchange {
  constructor({ from, to, value = 1 }) {
    this.from = from;
    this.to = to;
    this.value = parseFloat(value);

    this.coins = avaiableCoins;
    this.verifyParameters();
    this.buildInterfaces();
  }

  static get CRYPTO() {
    return ['BTC'];
  }

  verifyParameters() {
    if (this.from.length !== 3) {
      throw new Error('The "from" parameter must have 3 characters!');
    }

    if (this.to.length !== 3) {
      throw new Error('The "to" parameter must have 3 characters!');
    }

    if (!this.coins[this.from] || !this.coins[this.to]) {
      const invalidCoin = this.coins[this.from] ? this.to : this.from;
      throw new Error(`${invalidCoin} isn't a valid coin`);
    }

    if (Number.isNaN(this.value)) {
      throw new Error('The "value" parameter must be a number');
    }

    if (CoinExchange.CRYPTO.includes(this.from) || CoinExchange.CRYPTO.includes(this.to)) {
      this.isCrypto = true;
    }
  }

  buildInterfaces() {
    this.api = {};
    this.api.currencyStack = createInterface('CurrencyStack');
    this.api.cryptonator = createInterface('Cryptonator');
  }

  async exchange() {
    const result = this.isCrypto ? await this.exchangeCrypto()
      : await this.exchangeCoin();

    return result * this.value;
  }

  async exchangeCoin() {
    const { data } = await this.api.currencyStack.get('', { params: { base: this.from, target: this.to } });
    return data.rates[this.to];
  }

  async exchangeCrypto() {
    const { data } = await this.api.cryptonator.get(`${this.from}-${this.to}`);
    return data.ticker.price;
  }
}

export default CoinExchange;
