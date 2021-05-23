import { InjectedConnector } from '@web3-react/injected-connector'

const POLLING_INTERVAL = 12000
const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.RPC_URL_1 as string,
  3: 'https://ropsten.infura.io/v3/8d810610fe7741cc9753cbaafb1f000c',
}

// Interaction only with Ropsten network
export const injected = new InjectedConnector({ supportedChainIds: [3] })
