import { useEffect } from 'react'
import { resetTokenData, useTokenBalanceUpdater, useTokenInfoUpdater } from './hooks'
import { useWeb3React } from '@web3-react/core'
import { ERC20Service } from '../../services/erc20'
import { TokenBalance, TokenData } from '../tokendata/actions'
import { toTokenUnitsBN } from '../../utils'
import { tokenIdsArray, getToken, TokenId } from '../../constants/tokens'
import { QUADS, QUADS_SINGLE_LP } from '../../constants/contracts'

export const updateTokenData = async (
  tokenId: TokenId,
  context: any,
  useTokenInfoUpdater: (tokenData: TokenData) => void
) => {
  const account = context.account
  const token = getToken(tokenId)
  if (token.address === '' || !account) {
    return
  }

  const erc20 = new ERC20Service(context.library, token.address)

  if (tokenId === 'weth') {
    const tokenData: TokenData = {
      tokenSymbol: token.symbol,
      quadAllowance: await erc20.hasEnoughAllowance(account, QUADS),
      quadSingleAllowance: await erc20.hasEnoughAllowance(account, QUADS_SINGLE_LP),
      balance: toTokenUnitsBN((await context.library.getBalance(account)).toString(), token.decimals).toFixed(),
    }

    useTokenInfoUpdater(tokenData)
    return
  }

  const tokenData: TokenData = {
    tokenSymbol: token.symbol,
    quadAllowance: await erc20.hasEnoughAllowance(account, QUADS),
    quadSingleAllowance: await erc20.hasEnoughAllowance(account, QUADS_SINGLE_LP),
    balance: toTokenUnitsBN((await erc20.balanceOf(account)).toString(), token.decimals).toFixed(),
  }

  useTokenInfoUpdater(tokenData)
}

export const updateTokenBalance = async (
  tokenId: TokenId,
  context: any,
  useTokenBalanceUpdater: (tokenData: TokenBalance) => void
) => {
  const token = getToken(tokenId)
  if (token.address === '') {
    return
  }

  if (tokenId === 'weth') {
    const tokenBalance: TokenBalance = {
      tokenSymbol: token.symbol,
      balance: toTokenUnitsBN((await context.library.getBalance(context.account)).toString(), token.decimals).toFixed(),
    }
    useTokenBalanceUpdater(tokenBalance)

    return
  }

  const erc20 = new ERC20Service(context.library, token.address)
  const tokenBalance: TokenBalance = {
    tokenSymbol: token.symbol,
    balance: toTokenUnitsBN((await erc20.balanceOf(context.account)).toString(), token.decimals).toFixed(),
  }
  useTokenBalanceUpdater(tokenBalance)
}

export default function Updater(): null {
  const reset = resetTokenData()
  const tokenBalanceUpdater = useTokenBalanceUpdater()
  const tokenInfoUpdater = useTokenInfoUpdater()

  const { account, library, chainId } = useWeb3React()

  useEffect(() => {
    if (!chainId || !account) {
      return undefined
    }

    tokenIdsArray.forEach(async (token) => {
      updateTokenData(token, { library: library, account: account }, tokenInfoUpdater)
    })

    const balanceUpdaterTimer = setInterval(() => {
      tokenIdsArray.forEach(async (token) => {
        await updateTokenBalance(token, { library: library, account: account }, tokenBalanceUpdater)
      })
    }, 10000)

    const tokenDataUpdaterTimer = setInterval(() => {
      tokenIdsArray.forEach(async (token) => {
        updateTokenData(token, { library: library, account: account }, tokenInfoUpdater)
      })
    }, 90000)

    const balanceIntervalId: number = parseInt(balanceUpdaterTimer.toString())
    const tokenDataIntervalId: number = parseInt(tokenDataUpdaterTimer.toString())

    return () => {
      reset()
      clearInterval(balanceIntervalId)
      clearInterval(tokenDataIntervalId)
    }
  }, [chainId, library, account])

  return null
}
