import { Contract, Wallet, ethers, BigNumber } from 'ethers'

const pancakePairAbi = [
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function totalSupply() external view returns (uint256)'
]

export class PancakePair {
  provider: any
  contract: Contract

  constructor(provider: any, contractAddress: string) {
    this.provider = provider
    const signer: Wallet = provider.getSigner()
    this.contract = new ethers.Contract(contractAddress, pancakePairAbi, provider).connect(signer)
  }

  getReserves = async (): Promise<BigNumber[]> => {
    return await this.contract.getReserves()
  }

  totalSupply = async (): Promise<BigNumber> => {
    return await this.contract.totalSupply()
  }
}
