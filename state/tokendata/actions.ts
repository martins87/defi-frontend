import { createAction } from '@reduxjs/toolkit';

export interface TokenData {
    tokenSymbol: string
    balance: string
    quadAllowance: boolean
    quadSingleAllowance: boolean 
}

export interface TokenBalance {
    tokenSymbol: string;
    balance: string;
}

export const putTokenData = createAction<TokenData>('tokendata/putTokenData');
export const putTokenBalance = createAction<TokenBalance>('tokendata/putTokenBalance');
export const reset = createAction('tokendata/reset');
