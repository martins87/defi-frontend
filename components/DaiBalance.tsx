import { useEffect, useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import { formatEther } from '@ethersproject/units';

import { ERC20Service } from '../services/erc20';
import { DAI } from '../constants/contracts';
import { update } from '../state/daiDalanceSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

export const DaiBalance = () => {
  const { account, library, chainId } = useWeb3React();
  // const [daiBalance, setDaiBalance] = useState<string>();
  const dispatch = useAppDispatch();
  const { balance } = useAppSelector(state => state.daiBalance);
  console.log('DAI balance from redux-toolkit store:', balance);

  useEffect(() => {
    dispatch(update(''));
    if (!!account && !!library) {
      const erc20 = new ERC20Service(library, DAI);
      getBalance(erc20);
    }
  }, [account, library, chainId]); 

  const getBalance = async (contractInstance: any) => {
    const balance = await contractInstance.balanceOf(account);
    dispatch(update(balance.toString()));
  }

  return (
    <>
      <p>DAI Balance:
        {/* <span role="img" aria-label="gold">
          💰
        </span> */}
        <span>{account === null ? 'Error' : balance ? ` ${formatEther(balance)}` : ''}</span>
      </p>
    </>
  );
}