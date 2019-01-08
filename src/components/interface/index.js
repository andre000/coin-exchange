import dotenv from 'dotenv';
import { create } from 'axios';

dotenv.config();

export default (type) => {
  switch (type) {
    case 'CurrencyStack':
      return create({
        baseURL: 'https://api.currencystack.io/currency',
        params: {
          apikey: process.env.CURRENCYSTACK_API,
        },
      });

    default:
      throw new Error('Not Implemented');
  }
};
