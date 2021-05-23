import { createReducer } from '@reduxjs/toolkit'
import { putTokenData, putTokenBalance, reset, TokenData } from './actions'

export interface TokenDataState {
  tokenInfos: TokenData[]
}

export const initialState: TokenDataState = { tokenInfos: [] }

export default createReducer(initialState, (builder) =>
  builder
    .addCase(putTokenData, (tokens, { payload: { tokenSymbol, ...props } }) => {
      const foundTokenId = tokens.tokenInfos.findIndex((x) => x.tokenSymbol === tokenSymbol)
      if (foundTokenId !== -1) {
        tokens.tokenInfos[foundTokenId] = { tokenSymbol, ...props }
      } else {
        tokens.tokenInfos.push({ tokenSymbol, ...props })
      }
    })
    .addCase(putTokenBalance, (tokens, { payload: { tokenSymbol, balance } }) => {
      const foundTokenId = tokens.tokenInfos.findIndex((x) => x.tokenSymbol === tokenSymbol)
      if (foundTokenId !== -1) {
        tokens.tokenInfos[foundTokenId].balance = balance
      } else {
        tokens.tokenInfos.push({
          balance: balance,
          quadAllowance: false,
          quadSingleAllowance: false,
          tokenSymbol: tokenSymbol,
        })
      }
    })
    .addCase(reset, (tokens) => {
      tokens = {
        tokenInfos: tokens.tokenInfos.map(({ tokenSymbol }) => {
          return {
            balance: '0',
            quadAllowance: false,
            quadSingleAllowance: false,
            tokenSymbol: tokenSymbol,
          }
        }),
      }
    })
)
