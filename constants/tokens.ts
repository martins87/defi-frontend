// import { dai, usdc, weth, earnquad, unknown, sushiquad } from '../assets/tokens'

export interface Token {
  symbol: string
  address: string
  decimals: number
  displayedDecimals: number
  geckoApiId: string
}

export type TokenId =
  | 'dai'
  | 'weth'

const tokens: { [key in TokenId]: Token } = {
  dai: {
    symbol: 'DAI',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
    displayedDecimals: 2,
    geckoApiId: 'dai'
  },
  weth: {
    symbol: 'wETH',
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: 18,
    displayedDecimals: 3,
    geckoApiId: 'weth'
  }
}

export const tokensArray: Token[] = Object.values(tokens)

export const tokenIdsArray: TokenId[] = Object.keys(tokens) as TokenId[]

export const getToken = (tokenId: TokenId): Token => tokens[tokenId]

export const getTokens = (tokenIds: TokenId[]): Token[] => tokenIds.map((id) => tokens[id])
