import { createAction } from '@reduxjs/toolkit';

export interface TokenPrice {
    tokenSymbol: string;
    price: number;
}

export const putTokenPrice = createAction<TokenPrice>('tokenprice/putTokenPrice');
export const reset = createAction('tokenprice/reset');
