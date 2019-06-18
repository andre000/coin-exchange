import { create } from 'axios';

export default (type) => {
  switch (type) {
    case 'CurrencyStack':
      return create({
        baseURL: 'https://api.currencystack.io/currency',
      });
    case 'Cryptonator':
      return create({
        baseURL: 'https://api.cryptonator.com/api/ticker/',
      });
    default:
      throw new Error('Not Implemented');
  }
};
