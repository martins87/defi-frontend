import { Contract, Wallet, ethers } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber';
import { createTransactionInfo, TransactionInfo } from './transactionInfo'

const erc20Abi = [
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function balanceOf(address marketMaker) external view returns (uint256)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
  'function decimals() external view returns (uint8)',
  'function transferFrom(address sender, address recipient, uint256 amount) public returns (bool)',
  'function transfer(address to, uint256 value) public returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
]

export class ERC20Service {
  provider: any
  contract: Contract

  constructor(provider: any, contractAddress: string) {
    this.provider = provider
    console.log('[erc20] provider:', this.provider);
    const signer: Wallet = provider.getSigner()
    this.contract = new ethers.Contract(contractAddress, erc20Abi, provider).connect(signer)
  }
  
  balanceOf = async (owner: string): Promise<BigNumber> => {
    console.log('[erc20] provider:', this.provider);
    return await this.contract.balanceOf(owner)
  }

  transfer = async (recipient: string, amount: number): Promise<TransactionInfo> => {
      return this.contract.transfer(recipient, amount);
  }
}
