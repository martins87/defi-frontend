import { useEffect, useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import { formatEther } from '@ethersproject/units';

export const Balance = () => {
    const { account, library, chainId } = useWeb3React()
  
    const [balance, setBalance] = useState(); // change to redux
    useEffect((): any => {
        if (!!account && !!library) {
            let stale = false
  
            library
                .getBalance(account)
                .then((balance: any) => {
                    if (!stale) {
                        // change to redux
                        setBalance(balance)
                    }
                })
                .catch(() => {
                    if (!stale) {
                        // change to redux
                        setBalance(null)
                    }
                })
  
            return () => {
                stale = true
                // change to redux
                setBalance(undefined)
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