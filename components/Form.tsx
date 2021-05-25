import React, { useState } from 'react'
import { Button, Input, Link, makeStyles } from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';

import { ERC20Service } from '../services/erc20';
import { DAI } from '../constants/contracts';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  button: {
    background: 'blue',
    color: 'white',
    fontFamily: 'sans-serif'
  },
  input: {
    background: '#EDEDED',
    padding: '1rem',
    border: 'none',
    marginBottom: '1rem'
  },
  text: {
    color: 'gray'
  }
}));

const Form = () => {
  const { library } = useWeb3React();
  const [daiAmount, setDaiAmount] = useState();
  const [recipientAddress, setRecipientAddress] = useState();
  const [txLink, setTxLink] = useState('');
  const classes = useStyles();

  const daiInputChangeHandler = (event: any) => {
    const amount: number = +event.target.value * 10 ** 18;
    setDaiAmount(amount.toString());
    console.log('dai amount:', amount);
  }

  const addressInputChangeHandler = (event: any) => {
    setRecipientAddress(event.target.value);
  }

  const formSubmissionHandler = (event: any) => {
    event.preventDefault();

    console.log('daiAmount:', daiAmount);
    console.log('recipient:', recipientAddress);

    // TODO validation...
    if (true) {
      transfer(recipientAddress, daiAmount);
    } else {
      // UI alert stuff
    }
  }

  const transfer = async (recipient: any, amount: any) => {
    const erc20 = new ERC20Service(library, DAI);
    const tx = await erc20.transfer(recipientAddress, daiAmount);
    setTxLink(`https://ropsten.etherscan.io/tx/${tx.hash}`);
    console.log('tx:', tx);
  }

  return (
    <form className={classes.root}>
      <label className={classes.text} htmlFor="daiAmount">Enter DAI amount</label>
      <input className={classes.input} type="text" id="daiAmount" onChange={daiInputChangeHandler} />
      <label className={classes.text} htmlFor="recipientAddress">Enter recipient address</label>
      <input className={classes.input} type="text" id="recipientAddress" onChange={addressInputChangeHandler} />
      <Button className={classes.button} onClick={formSubmissionHandler} variant='contained'>SEND</Button>
      {txLink.length > 0 ? <Link href={txLink}>
        View transaction on Etherscan
      </Link> : null}
    </form>
  )
}

export default Form;
