import CoinExchange from './index';

describe('CoinExchange Class', () => {
  it('should receive an object with two coins as parameters and a float value', () => {
    const coin = new CoinExchange({
      from: 'BRL',
      to: 'USD',
      value: 1,
    });

    expect(coin.from).toBe('BRL');
    expect(coin.to).toBe('USD');
    expect(coin.value).toBe(1);
  });

  it('should have 1 as default value when this parameter is omitted', () => {
    const coin = new CoinExchange({
      from: 'BRL',
      to: 'USD',
    });

    expect(coin.value).toBe(1);
  });

  it('should throw an error when `to` parameter isn\'t given correctly', () => {
    expect(() => {
      const coin = new CoinExchange({ from: 'BRL', to: 'DOLAR' });
      return coin.value;
    }).toThrow('The "to" parameter must have 3 characters!');
  });

  it('should throw an error when `from` parameter isn\'t given correctly', () => {
    expect(() => {
      const coin = new CoinExchange({ from: 'REAL', to: 'USD' });
      return coin.value;
    }).toThrow('The "from" parameter must have 3 characters!');
  });

  it('should have instances of the two API interfaces on construction', () => {
    const coin = new CoinExchange({
      from: 'BRL',
      to: 'USD',
    });

    expect(coin.api.currencyStack).toBeTruthy();
    expect(coin.api.cryptonator).toBeTruthy();
  });

  it('should have a list with the available coins to convert', () => {
    const coin = new CoinExchange({
      from: 'BRL',
      to: 'GBP',
    });

    expect(coin.coins.AED).toBe('United Arab Emirates Dirham');
  });

  it('should throw an error when trying to convert to a wrong value. Parameter `to`', () => {
    expect(() => {
      const coin = new CoinExchange({
        from: 'BRL',
        to: 'XYZ',
      });
      return coin;
    }).toThrow(/XYZ isn't a valid coin/);
  });

  it('should throw an error when trying to convert to a wrong value. Parameter `from`', () => {
    expect(() => {
      const coin = new CoinExchange({
        to: 'BRL',
        from: 'XYZ',
      });
      return coin;
    }).toThrow(/XYZ isn't a valid coin/);
  });

  it('should throw an error when `value` parameter isn\'t a number', () => {
    expect(() => {
      const coin = new CoinExchange({
        from: 'BRL',
        to: 'EUR',
        value: 'not a value',
      });
      return coin;
    }).toThrow(/The "value" parameter must be a number/);
  });

  it('should have an `exchange` function which returns the converted value', async () => {
    const mockedResult = {
      data: {
        base: 'USD',
        last_update: '2018-12-10T15:10:58.253Z',
        rates: {
          GBP: 0.7914459201,
        },
        status: 200,
        target: 'GBP',
      },
    };

    const coin = new CoinExchange({
      from: 'USD',
      to: 'GBP',
    });

    coin.api.currencyStack = {
      get: jest.fn().mockResolvedValue(mockedResult),
    };
    const result = await coin.exchange();

    expect(coin.api.currencyStack.get.mock.calls.length).toBe(1);
    expect(coin.api.currencyStack.get.mock.calls).toEqual([['', { params: { base: 'USD', target: 'GBP' } }]]);
    expect(result).toBe(mockedResult.data.rates.GBP);
  });

  it('should set the `isCrypto` propriety to true when user tries to convert BTC', () => {
    const coin = new CoinExchange({
      from: 'USD',
      to: 'BTC',
      value: 500.55,
    });

    expect(coin.isCrypto).toBe(true);
  });

  it('should try to exchange with the crypto API when any of the coins in a cryptocurrency', async () => {
    const mockedResult = {
      data: {
        ticker: {
          base: 'BTC', target: 'USD', price: 4026.41923197, volume: '77748.18297130', change: '1.98372106',
        },
        timestamp: 1547029441,
        success: true,
        error: '',
      },
    };

    const coin = new CoinExchange({
      from: 'BTC',
      to: 'USD',
    });

    coin.api.cryptonator = {
      get: jest.fn().mockResolvedValue(mockedResult),
    };

    const result = await coin.exchange();

    expect(coin.api.cryptonator.get.mock.calls.length).toBe(1);
    expect(coin.api.cryptonator.get.mock.calls).toEqual([['BTC-USD']]);
    expect(result).toBe(mockedResult.data.ticker.price);
  });

  it('should throw an execption when the crypto API fails', async () => {
    const mockedResult = {
      data: {
        success: false,
        error: 'Error',
      },
    };

    const coin = new CoinExchange({
      from: 'BTC',
      to: 'USD',
    });

    coin.api.cryptonator = {
      get: jest.fn().mockResolvedValue(mockedResult),
    };

    expect(coin.exchangeCrypto()).rejects.toThrow(/Cryptonator:/);
  });
});
