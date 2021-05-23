import { UniswapRouterV2 } from '../../services/swapRouter'
import { BigNumber as BN } from 'bignumber.js'
import { getToken, Quad, SingleQuad, TokenId } from '../../constants/tokens'
import { toBaseUnitBN, toTokenUnitsBN } from '..'
import { QuadsService } from '../../services/quads'
import { BigNumber } from '@ethersproject/bignumber'
import { QuadsSingleLpService } from 'services/quadsSingleLp'
import { BalancerPoolService } from 'services/balancerPool'
import { calcSingleOutGivenPoolIn } from './balancerMath'
import { ConfigurableRightsPoolService } from 'services/configurableRightsPool'
import { ERC20Service } from 'services/erc20'

export const getMintAmounts = async (
  library: any,
  quad: Quad,
  sliderValue: number,
  balances: { mainTokenBalance: BN; pair1TokenBalance: BN; pair2TokenBalance: BN },
  getMax?: boolean
): Promise<{ mainValue: BN; side1Value: BN; side2Value: BN }> => {
  const router = new UniswapRouterV2(library, 'sushi')

  const results = await Promise.all([
    router.getAmountsOut(balances.mainTokenBalance.multipliedBy(sliderValue / 100), [quad.main, quad.pair1]),
    router.getAmountsOut(balances.mainTokenBalance.multipliedBy((100 - sliderValue) / 100), [quad.main, quad.pair2]),
  ])

  const token1Value = toTokenUnitsBN(results[0][1].toString(), getToken(quad.pair1).decimals)
  const token2Value = toTokenUnitsBN(results[1][1].toString(), getToken(quad.pair2).decimals)

  if (getMax && (token1Value.gt(balances.pair1TokenBalance) || token2Value.gt(balances.pair2TokenBalance))) {
    let percentage1 = new BN(0)
    if (token1Value.gt(balances.pair1TokenBalance)) {
      percentage1 = balances.pair1TokenBalance.dividedBy(token1Value)
    }

    let percentage2 = new BN(0)
    if (token2Value.gt(balances.pair2TokenBalance)) {
      percentage2 = balances.pair2TokenBalance.dividedBy(token2Value)
    }

    const percentageDifference = (percentage1.gte(percentage2) ? percentage2 : percentage1).multipliedBy(0.99)
    const results = await Promise.all([
      router.getAmountsOut(
        balances.mainTokenBalance.multipliedBy(percentageDifference).multipliedBy(sliderValue / 100),
        [quad.main, quad.pair1]
      ),
      router.getAmountsOut(
        balances.mainTokenBalance.multipliedBy(percentageDifference).multipliedBy((100 - sliderValue) / 100),
        [quad.main, quad.pair2]
      ),
    ])

    const token1ValueNew = toTokenUnitsBN(results[0][1].toString(), getToken(quad.pair1).decimals)
    const token2ValueNew = toTokenUnitsBN(results[1][1].toString(), getToken(quad.pair2).decimals)

    return {
      mainValue: new BN(
        balances.mainTokenBalance.multipliedBy(percentageDifference).toFixed(getToken(quad.main).decimals)
      ),
      side1Value: token1ValueNew,
      side2Value: token2ValueNew,
    }
  } else {
    return { mainValue: balances.mainTokenBalance, side1Value: token1Value, side2Value: token2Value }
  }
}

export const getMintedAmount = async (
  library: any,
  quad: Quad,
  sliderValue: number,
  balances: { mainTokenBalance: BN; pair1TokenBalance: BN; pair2TokenBalance: BN }
): Promise<BN> => {
  const quads = new QuadsService(library)
  let inputValueMainTmp = balances.mainTokenBalance
  const isOdd = !balances.mainTokenBalance.mod(toTokenUnitsBN(2, getToken(quad.main).decimals)).isZero()
  if (isOdd) {
    inputValueMainTmp = inputValueMainTmp.minus(toTokenUnitsBN(1, getToken(quad.main).decimals))
  }

  const minValue = balances.mainTokenBalance
    .multipliedBy(sliderValue / 100)
    .lte(balances.mainTokenBalance.multipliedBy((100 - sliderValue) / 100))
    ? balances.mainTokenBalance.multipliedBy(sliderValue / 100)
    : balances.mainTokenBalance.multipliedBy((100 - sliderValue) / 100)

  const a = await quads.generateQuadStatic(
    {
      tokenA: quad.main,
      tokenB: quad.pair1,
      tokenC: quad.pair2,
      receiptToken: quad.receipt,
      amountAFirstPairDesired: inputValueMainTmp.multipliedBy(sliderValue / 100),
      amountASecondPairDesired: inputValueMainTmp.multipliedBy((100 - sliderValue) / 100),
      amountBDesired: balances.pair1TokenBalance,
      amountCDesired: balances.pair2TokenBalance,
      amountAMin: minValue.multipliedBy(0.95),
      amountBMin: balances.pair1TokenBalance.multipliedBy(0.95),
      amountCMin: balances.pair2TokenBalance.multipliedBy(0.95),
      isFirstPairForBadger: false,
      isSecondPairForBadger: false,
    },
    'sushi',
    quad.main === 'weth' ? inputValueMainTmp : undefined
  )
  return toTokenUnitsBN(a.toString(), getToken(quad.receipt).decimals)
}

export const getReturnedAmount = async (
  library: any,
  quad: Quad,
  inputValueReward: BN
): Promise<{ mainValue: BN; side1Value: BN; side2Value: BN }> => {
  const quads = new QuadsService(library)

  let multiplier = 1

  let results: BigNumber[] = []
  let hadError = true
  while (multiplier >= 0.95) {
    try {
      results = await quads.returnQuadStatic(
        {
          poolAddress: quad.receipt,
          poolAmountIn: inputValueReward.multipliedBy(multiplier),
          minAmountsOut: [new BN(0), new BN(0)], // TODO call calculateExitNecessaryLPAmounts
          badgerTokens: quad.badgerTokens,
          deltaTokens: quad.deltaTokens,
        },
        'sushi'
      )
      if (multiplier != 1) {
        inputValueReward = inputValueReward.multipliedBy(multiplier)
      }
      hadError = false
      break
    } catch (error) {
      multiplier -= 0.01
    }
  }

  if (hadError) {
    throw new Error('Error retrieving values. Please try with different input.')
  }

  const tokenMainValue = toTokenUnitsBN(results[1].toString(), getToken(quad.main).decimals)
  const token1Value = toTokenUnitsBN(results[0].toString(), getToken(quad.pair1).decimals)
  const token2Value = toTokenUnitsBN(results[2].toString(), getToken(quad.pair2).decimals)

  return {
    mainValue: tokenMainValue,
    side1Value: token1Value,
    side2Value: token2Value,
  }
}

export const getMintedAmountSingleLp = async (library: any, quad: SingleQuad, lpPairAmount: BN): Promise<BN> => {
  const quads = new QuadsSingleLpService(library)

  const a = await quads.generateQuadStatic({
    lpPair: quad.mainLp,
    balancerPool: quad.receipt,
    lpPairAmount: lpPairAmount,
  })
  return toTokenUnitsBN(a.toString(), getToken(quad.receipt).decimals)
}

export const getReturnedAmountSingleLp = async (
  library: any,
  quad: SingleQuad,
  balancerPoolAmount: BN
): Promise<BN> => {
  const quads = new QuadsSingleLpService(library)

  let multiplier = 1

  let result: BigNumber = BigNumber.from(0)
  let hadError = true

  while (multiplier >= 0.95) {
    try {
      result = await quads.returnQuadStatic({
        balancerPool: quad.receipt,
        poolAmountIn: balancerPoolAmount,
        minAmountsOut: new BN(0), // TODO call calculateExitNecessaryLPAmounts
      })
      if (multiplier != 1) {
        balancerPoolAmount = balancerPoolAmount.multipliedBy(multiplier)
      }
      hadError = false
      break
    } catch (error) {
      multiplier -= 0.01
    }
  }

  if (hadError) {
    throw new Error('Error retrieving values. Please try with different input.')
  }

  return toTokenUnitsBN(result.toString(), getToken(quad.receipt).decimals)
}

interface Args {
  from: string,
  to: string,
  value: BigNumber
}

export const calculateLiquidity = async (library: any, quad: SingleQuad, tokenAmountOut: BN, account: string) => {
  const quads = new QuadsSingleLpService(library)

  const balancerPool = getToken(quad.receipt)
  const inToken = getToken(quad.mainLp)
  tokenAmountOut = toBaseUnitBN(tokenAmountOut, balancerPool.decimals)

const cps = new ConfigurableRightsPoolService(balancerPool.address, library)
  
  const retAmount = await cps.exitswapPoolAmountInStatic('0x397ff1542f962076d0bfe58ea045ffa2d347aca0', tokenAmountOut,new BN(0))
  console.log(retAmount.toString())
  const balancerPoolAddress = await cps.bPool()

  const balancerPoolService = new BalancerPoolService(balancerPoolAddress, library)
  const a = await ((new ERC20Service(library, balancerPool.address)).getTransfers('minted'))
  const b = await ((new ERC20Service(library, balancerPool.address)).getTransfers('burned'))

  let mintedAmount = BigNumber.from(0)
  let burnedAmount = BigNumber.from(0)
  for (let i = 0; i < a.length; i++) {
    const event = a[i];
    if (event.args) {
      mintedAmount = mintedAmount.add(event.args.value)
    }
  }

  for (let i = 0; i < b.length; i++) {
    const event = b[i];
    if (event.args) {
      burnedAmount = burnedAmount.add(event.args.value)
    }
  }
  console.log(mintedAmount.toString())
  console.log(burnedAmount.toString())
  //const balancerPoolService = new ERC20Service(balancerPoolAddress, library)
 const tokenIn = (await quads.userInfo(account))
 console.log(tokenIn.shares.toString())
  //const tokens : string[] = await balancerPoolService.getCurrentTokens())
  const poolTokenWeight = await balancerPoolService.getDenormalizedWeight(quad.mainLp)
  const poolTokenBalance = await balancerPoolService.getBalanceOfToken(quad.mainLp)
  //const poolTokenBalance2 = await balancerPoolService.getBalanceOfToken('SLP_dai_eth')
  console.log(poolTokenBalance.toString())
  //console.log(poolTokenBalance2.toString())
  
  const totalWeight = await balancerPoolService.getTotalDenormalizedWeight()
  const swapFee = await balancerPoolService.getSwapFee()
  
  const totalSupply = await balancerPoolService.getTotalSupply()
  // const maxOutRatio = 1 / 3;
  console.log(totalSupply)

  if (tokenAmountOut.div(totalSupply).gt(0.99)) {
    console.log('OMEGALUL')
  }
  const ret = calcSingleOutGivenPoolIn(
    new BN(poolTokenBalance.toString()),
    new BN(poolTokenWeight.toString()),
    new BN(mintedAmount.sub(burnedAmount).toString()),
    new BN(totalWeight.toString()),
    tokenAmountOut,
    new BN(swapFee.toString())
  )

  const bb = ret.div(new BN(poolTokenBalance.toString()))
    console.log(bb.toFixed())
    console.log(toTokenUnitsBN(poolTokenBalance.toString(), 18).toFixed())
    console.log(toTokenUnitsBN(poolTokenBalance.toString(), 18).multipliedBy(1/3).toFixed(18))
  console.log(toTokenUnitsBN(ret.toString(),18).toFixed(18))
}
