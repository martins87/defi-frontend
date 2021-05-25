import { useEffect, useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import { formatEther } from '@ethersproject/units';

import { update } from '../state/balanceSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

export const Balance = () => {
  const { account, library, chainId } = useWeb3React()
  // const [balance, setBalance] = useState(); // change to redux
  const dispatch = useAppDispatch();
  const { balance } = useAppSelector(state => state.balance);
  console.log('ETH balance from redux-toolkit store:', balance);

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

