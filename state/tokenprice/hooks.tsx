import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { putTokenPrice, TokenPrice, reset } from './actions'

import { AppDispatch, AppState } from '../index'
import { getToken, TokenId } from '../../constants/tokens'

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTokenPriceUpdater(): (tokenPrice: TokenPrice) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (tokenPrice: TokenPrice) => {
      dispatch(putTokenPrice(tokenPrice))
    },
    [dispatch]
  )
}

export function resetTokenPrices(): () => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => {
    dispatch(reset())
  }, [dispatch])
}

export const useTokenPrice = () => (tokenId: TokenId) : TokenPrice => {
  const tokenSymbol = getToken(tokenId).symbol
  const state = useSelector<AppState, AppState['tokenPrices']>((state) => state.tokenPrices)
  const value = state.tokenPrices[state.tokenPrices.findIndex((x) => x.tokenSymbol === tokenSymbol)]
  return value
    ? value
    : {
        price: 0,
        tokenSymbol: tokenSymbol,
      }
}

export function useAllTokenPrices(): TokenPrice[] {
  const state = useSelector<AppState, AppState['tokenPrices']>((state) => state.tokenPrices)
  return state.tokenPrices
}
