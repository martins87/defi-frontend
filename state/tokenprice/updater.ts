import { useEffect } from 'react'
import { resetTokenPrices, useTokenPriceUpdater } from './hooks'
import { useWeb3React } from '@web3-react/core'
import { TokenPrice } from './actions'
import { tokensArray, Token } from '../../constants/tokens'
import axios from 'axios'
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

import { PancakePair } from '../../services/pancakePair'
import { BigNumber as BN } from 'bignumber.js'
import { toTokenUnitsBN } from '../../utils'

const getPricesFromGecko = (library: any, tokenPriceUpdater: (tokenPrice: TokenPrice) => void) => {
  const tokenIds = tokensArray
    .filter((x) => x.geckoApiId !== '')
    .map((x) => x.geckoApiId)
    .join(',')

  axios
    .get(COINGECKO_BASE_URL + '/simple/price?', {
      params: {
        ids: tokenIds,
        vs_currencies: 'usd',
      },
    })
    .then((prices) => {
      const arr = Object.entries(prices.data).map((x) => x)
      const geckoPrices = ([...new Set(arr)] as [string, {usd: number}][]).map(x => {return {geckoApiId: x[0], price: x[1].usd, tokenSymbol: ''}})
      
      for (let i = 0; i < geckoPrices.length; i++) {
        const geckoPrice = geckoPrices[i];
        const foundTokens = tokensArray.filter((t) => t.geckoApiId === geckoPrice.geckoApiId)
        if (foundTokens) {
          foundTokens.forEach((token) => {
            tokenPriceUpdater({ price: geckoPrice.price, tokenSymbol: token.symbol })
            geckoPrices[i].tokenSymbol = token.symbol
          })
        }
      }

      const bnbPrice = geckoPrices.find((t) => t.tokenSymbol === 'bnb')
      const cakePrice = geckoPrices.find((t) => t.tokenSymbol === 'cake')
      const bnbCakeToken = tokensArray.find((x) => x.symbol === 'bnb-cake')
      if (bnbCakeToken && bnbPrice && cakePrice) {
        getTinPriceFromPancake(bnbPrice.price, library, tokenPriceUpdater)
        getBnbLpPriceFromPancake(bnbPrice.price, cakePrice.price, bnbCakeToken, library, tokenPriceUpdater)
      }
    })
}

const getTinPriceFromPancake = async (
  bnbPrice: number,
  library: any,
  tokenPriceUpdater: (tokenPrice: TokenPrice) => void
) => {
  const bnbTinAddress = tokensArray.find((x) => x.symbol === 'bnb-tin')
  if (bnbTinAddress) {
    const pancakePair = new PancakePair(library, bnbTinAddress.address)
    const [left, right] = await pancakePair.getReserves()
    const circulatingSupply = toTokenUnitsBN(new BN((await pancakePair.totalSupply()).toString()), 18)
    const tinReserves = toTokenUnitsBN(new BN(left.toString()), 18)
    const bnbReserves = toTokenUnitsBN(new BN(right.toString()), 18)

    const tinPrice = parseFloat(
      new BN(right.toString()).dividedBy(new BN(left.toString())).multipliedBy(bnbPrice).toFixed(2)
    )

    const bnbTin = parseFloat(
      bnbReserves
        .multipliedBy(new BN(bnbPrice))
        .plus(tinReserves.multipliedBy(new BN(tinPrice)))
        .dividedBy(circulatingSupply)
        .toFixed(2)
    )
    tokenPriceUpdater({ price: bnbTin as number, tokenSymbol: 'bnb-tin' })
    tokenPriceUpdater({ price: bnbTin as number, tokenSymbol: 'tBNB-TIN' })
    tokenPriceUpdater({ price: tinPrice as number, tokenSymbol: 'tin' })
  }
}

const getBnbLpPriceFromPancake = async (
  bnbPrice: number,
  tokenPrice: number,
  lpToken: Token,
  library: any,
  tokenPriceUpdater: (tokenPrice: TokenPrice) => void
) => {
  const pancakePair = new PancakePair(library, lpToken.address)
  const [left, right] = await pancakePair.getReserves()
  const circulatingSupply = toTokenUnitsBN(new BN((await pancakePair.totalSupply()).toString()), 18)
  const searchedTokenReserves = toTokenUnitsBN(new BN(left.toString()), 18)
  const bnbReserves = toTokenUnitsBN(new BN(right.toString()), 18)

  const bnbToken = parseFloat(
    bnbReserves
      .multipliedBy(new BN(bnbPrice))
      .plus(searchedTokenReserves.multipliedBy(new BN(tokenPrice)))
      .dividedBy(circulatingSupply)
      .toFixed(2)
  )
  tokenPriceUpdater({ price: bnbToken as number, tokenSymbol: lpToken.symbol })
}

export default function Updater(): null {
  const reset = resetTokenPrices()
  const tokenPriceUpdater = useTokenPriceUpdater()

  const { account, library, chainId } = useWeb3React()

  useEffect(() => {
    if (!chainId || !account) {
      return undefined
    }

    const balanceUpdaterTimer = setInterval(() => {
      getPricesFromGecko(library, tokenPriceUpdater)
    }, 60000)

    getPricesFromGecko(library, tokenPriceUpdater)
    const intervalId: number = parseInt(balanceUpdaterTimer.toString())

    return () => {
      reset()
      clearInterval(intervalId)
    }
  }, [chainId, library, account])

  return null
}
