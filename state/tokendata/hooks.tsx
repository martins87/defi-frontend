import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { putTokenData, putTokenBalance, TokenBalance, TokenData, reset } from './actions'

import { AppDispatch, AppState } from '../index'
import { TokenId, getToken} from '../../constants/tokens'

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTokenBalanceUpdater(): (tokenBalance: TokenBalance) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (tokenBalance: TokenBalance) => {
      dispatch(putTokenBalance(tokenBalance))
    },
    [dispatch]
  )
}

export function useTokenInfoUpdater(): (tokenData: TokenData) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (tokenData: TokenData) => {
      dispatch(putTokenData(tokenData))
    },
    [dispatch]
  )
}

export function resetTokenData(): () => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => {
    dispatch(reset())
  }, [dispatch])
}

export const useTokenData = () => (tokenId: TokenId) : TokenData => {
  const tokenSymbol = getToken(tokenId).symbol
  const state = useSelector<AppState, AppState['tokens']>((state) => state.tokens)
  const value = state.tokenInfos[state.tokenInfos.findIndex((x) => x.tokenSymbol === tokenSymbol)]
  return value
    ? value
    : {
        balance: '0',
        quadAllowance: false,
        quadSingleAllowance: false,
        tokenSymbol: tokenSymbol
      }
}


export function useAllTokenData(): TokenData[] {
  const state = useSelector<AppState, AppState['tokens']>((state) => state.tokens)
  return state.tokenInfos
}
