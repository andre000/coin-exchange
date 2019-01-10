/* eslint-disable no-console */
import mockConsole from 'jest-mock-console';
import inquirer from 'inquirer';
import MainConsole from './index';

jest.mock('inquirer');
const mockedAnswer = {
  from: 'USD',
  to: 'BRL',
  value: 1,
};

console.clear = jest.fn();
inquirer.prompt = jest.fn().mockImplementation(async () => mockedAnswer);

describe('Main Console class', () => {
  let restoreConsole;
  beforeEach(() => {
    restoreConsole = mockConsole();
  });

  afterEach(() => {
    restoreConsole();
  });

  it('should have a propriety with the avaiable coins', () => {
    const con = new MainConsole();
    expect(con.coins).toBeTruthy();
  });

  it('should have an array with the questions', () => {
    const con = new MainConsole();
    expect(Array.isArray(con.questions)).toBe(true);
    expect(con.questions.length).toBe(3);
  });

  it('should have an `start` function which should return a prompt', () => {
    const con = new MainConsole();
    con.start();
    expect(typeof con.start).toBe('function');
    expect(console.log.mock.calls[0][0]).toMatch(/Coin Exchange/);
  });

  it('should have an function to correctly format the result value', () => {
    const money = MainConsole.format(5.5, 'BRL');
    expect(money).toBe('R$5.50');
  });

  it('should treat format when converting to BTC', () => {
    const money = MainConsole.format(5, 'BTC');
    expect(money).toMatch(/BTC.+5\.00/);
  });
});
