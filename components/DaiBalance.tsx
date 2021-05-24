import { useEffect, useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import { formatEther } from '@ethersproject/units';

export const DaiBalance = (props) => {
  const { account } = useWeb3React();
  const [daiBalance, setDaiBalance] = useState();

  useEffect(() => {
    getBalance();
  }, [account]);

  const getBalance = async () => {
    const balance = await props.instance.balanceOf(account);
    setDaiBalance(balance);
  }

  return (
    <>
      <p>DAI Balance:
        {/* <span role="img" aria-label="gold">
          💰
        </span> */}
        <span>{daiBalance === null ? 'Error' : daiBalance ? ` ${formatEther(daiBalance)}` : ''}</span>
      </p>
    </>
  );
}