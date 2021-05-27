import { useEffect, useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import { formatEther } from '@ethersproject/units';

import { update } from '../state/ethBalanceSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

export const Balance = () => {
  const { account, library, chainId } = useWeb3React()
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

  const updateBalance = () => {
    if (!!account && !!library) {
      library
        .getBalance(account)
        .then((balance: any) => {
          console.log(`${Date.now()}: ${balance.toString()} ETH`);
          dispatch(update(balance.toString()));
        })
        .catch((error: any) => {
          console.log('Error:', error);
        });
    }
  }

  const updateBalanceOnNewBlock = (blockNumber: number) => {
    if (!!account && !!library) {
      library
      .getBalance(account, blockNumber)
      .then((balance: any) => {
          console.log('[updateBalanceOnNewBlock]', balance.toString());
          dispatch(update(balance.toString()));
        })
        .catch((error: any) => {
          console.log('Error:', error);
        });
    }
  }

  useEffect(() => {
    setInterval(() => updateBalance(), timeInterval * 1000);
  }, []);

  useEffect((): any => {
    if (!!account && !!library) {
      let stale = false;
      library
        .getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            dispatch(update(balance.toString()));
          }
        })
        .catch(() => {
          if (!stale) {
            dispatch(update(null));
          }
        })

      const updateBlockNumber = (blockNumber: number) => {
        console.log('New block:', blockNumber);
        updateBalanceOnNewBlock(blockNumber);
        setBlockHeight(blockNumber);
      }
      library.on('block', updateBlockNumber);

      return () => {
        stale = true;
        dispatch(update(undefined));
      }
    }
  }, [account, library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <p>Balance:
                {/* <span role="img" aria-label="gold">
                    💰
                </span> */}
        <span>{balance === null ? 'Error' : balance ? ` Ξ${formatEther(balance)}` : ''}</span>
      </p>
    </>
  )
}

