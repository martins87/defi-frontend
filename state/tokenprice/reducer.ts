import { createReducer } from '@reduxjs/toolkit'
import { putTokenPrice, reset, TokenPrice } from './actions'

export interface TokenPricesDataState {
  tokenPrices: TokenPrice[]
}

export const initialState: TokenPricesDataState = { tokenPrices: [] }

export default createReducer(initialState, (builder) =>
  builder
    .addCase(putTokenPrice, (tokenPrices, { payload: { tokenSymbol, price } }) => {
      const foundTokenId = tokenPrices.tokenPrices.findIndex((x) => x.tokenSymbol === tokenSymbol)
      if (foundTokenId !== -1) {
        tokenPrices.tokenPrices[foundTokenId] = { tokenSymbol, price }
      } else {
        tokenPrices.tokenPrices.push({ tokenSymbol, price })
      }
    })
    .addCase(reset, (tokenPrices) => {
      tokenPrices = {
        tokenPrices: tokenPrices.tokenPrices.map(({ tokenSymbol }) => {
          return {
            tokenSymbol: tokenSymbol,
            price: 0,
          }
        }),
      }
    })
)
