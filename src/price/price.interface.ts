import { BigNumber } from 'bignumber.js';

export interface IPrice {
  price: string;
}

export interface ICalculatePrice {
  bidPrice: BigNumber;
  askPrice: BigNumber;
  commissionRate: BigNumber;
}
