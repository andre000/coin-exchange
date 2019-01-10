import instance from './index';

describe('Currency Stack API Interface', () => {
  it('should return an axios instance with the correct paramenters', () => {
    const api = instance('CurrencyStack');
    expect(typeof api.request).toBe('function');
    expect(api.defaults.baseURL).toBe('https://api.currencystack.io/currency');
    expect(api.defaults.params.apikey).toBeTruthy();
  });
});

describe('Cryptonator API interface', () => {
  it('should return an axios instance with the correct parameters', () => {
    const api = instance('Cryptonator');
    expect(typeof api.request).toBe('function');
    expect(api.defaults.baseURL).toBe('https://api.cryptonator.com/api/ticker/');
  });
});

it('should throw an error when trying to create an unknown instance', () => {
  expect(() => {
    instance('foo');
  }).toThrow(/Not Implemented/);
});
