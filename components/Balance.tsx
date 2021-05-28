import { useEffect, useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import { formatEther } from '@ethersproject/units';

import { updateEthBalance } from '../state/balanceSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { BigNumber } from 'ethers';

export const Balance = () => {
  const { account, library, chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  const { balance } = useAppSelector(state => state.ethBalance);
  console.log('ETH balance from redux-toolkit store:', balance);
  const [blockHeight, setBlockHeight] = useState<number>(0);
  const timeInterval: number = 20; // seconds

  const getLatestBlock = () => {
    if (!!library) {
      library
        .getBlockNumber()
        .then((blockNumber: number) => {
          console.log('Latest block:', blockNumber);
          if (blockNumber > blockHeight) {
            setBlockHeight(blockNumber);
          }
        })
        .catch((error: any) => {
          console.log('Error:', error);
          setBlockHeight(null);
        })
    }
  }

  const updateBalance = (blockNumber: any) => {
    if (!!account && !!library) {
      const balancePromise: Promise<BigNumber> = blockNumber === null ?
        library.getBalance(account) :
        library.getBalance(account, blockNumber);
      balancePromise
        .then((balance: any) => {
          console.log(`${Date.now()}: ${balance.toString()} ETH`);
          dispatch(updateEthBalance(balance.toString()));
        })
        .catch((error: any) => {
          console.log('Error:', error);
          dispatch(updateEthBalance(null));
        });
    }
  }

  useEffect(() => {
    setInterval(() => updateBalance(null), timeInterval * 1000);
  }, []);

  useEffect((): any => {
    if (!!account && !!library) {
      let stale = false;
      library
        .getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            dispatch(updateEthBalance(balance.toString()));
          }
        })
        .catch((error: any) => {
          if (!stale) {
            console.log('Error:', error);
            dispatch(updateEthBalance(null));
          }
        })

      const updateBlockNumber = (blockNumber: number) => {
        console.log('New block:', blockNumber);
        updateBalance(blockNumber);
        setBlockHeight(blockNumber);
      }
      library.on('block', updateBlockNumber);

      return () => {
        stale = true;
        library.removeListener('block', updateBlockNumber);
        dispatch(updateEthBalance(undefined));
      }
    }
  }, [account, library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <p>
        Balance:
        <span>{balance === null ? 'Error' : balance ? ` Ξ ${formatEther(balance)}` : ''}</span>
      </p>
    </>
  )
}

