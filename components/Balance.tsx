import { useEffect, useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import { formatEther } from '@ethersproject/units';

import { update } from '../state/ethBalanceSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

export const Balance = () => {
  const { account, library, chainId } = useWeb3React()
  const dispatch = useAppDispatch();
  const { balance } = useAppSelector(state => state.ethBalance);
  const timeInterval: number = 20; // seconds

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
        })
    }
  }

  useEffect(() => {
    setInterval(() => updateBalance(), timeInterval * 1000);
  }, []);

  useEffect((): any => {
    if (!!account && !!library) {
      let stale = false
      library
        .getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            console.log('Balance:', balance);
            console.log('toString:', balance.toString());
            dispatch(update(balance.toString()));
            // setBalance(balance)
          }
        })
        .catch(() => {
          if (!stale) {
            dispatch(update(null));
            // setBalance(null)
          }
        })

      return () => {
        stale = true
        dispatch(update(undefined));
        // setBalance(undefined)
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

