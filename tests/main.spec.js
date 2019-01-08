import CoinExchange from '../src/components/coin-exchange';
import MainConsole from '../src/components/main-console';
import InstanceAPI from '../src/components/interface';

describe('Smoke Tests', () => {
  it('should exist an class for control the functions of the project', () => {
    expect(CoinExchange).toBeTruthy();
  });

  it('should exist an class for manipulate the console', () => {
    expect(MainConsole).toBeTruthy();
  });

  it('should exist an function to create an instance for consuming the API', () => {
    expect(typeof InstanceAPI).toBe('function');
  });
});
