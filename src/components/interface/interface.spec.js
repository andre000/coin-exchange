import instance from './index';

describe('Currency Stack API Interface', () => {
  it('should return an axios instance with the correct paramenters', () => {
    const api = instance('CurrencyStack');
    expect(typeof api.request).toBe('function');
    expect(api.defaults.baseURL).toBe('https://api.currencystack.io/currency');
    expect(api.defaults.params.apikey).toBeTruthy();
  });
});
