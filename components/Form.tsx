import React, { useState } from 'react'
import { Button, Input, Link, makeStyles } from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';

import { ERC20Service } from '../services/erc20';
import { DAI } from '../constants/contracts';
import { DaiBalance } from './DaiBalance'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  button: {
    background: 'blue',
    color: 'white',
    fontFamily: 'sans-serif',
    marginBottom: '1rem',
    margin: 'auto',
    fontSize: '8px !important',
  },
  buttonDisabled: {
    background: '#EFE6FD',
    color: 'white',
    fontFamily: 'sans-serif',
    marginBottom: '1rem',
    margin: 'auto',
    fontSize: '8px !important',
    cursor: 'not-allowed'
  },
  input: {
    background: '#EDEDED',
    width: '400px',
    padding: '2rem 1rem 0.4rem 1rem',
    border: 'none',
    marginTop: '-20px',
    marginBottom: '1.5rem',
    borderRadius: '4px',
    zIndex: 1,
    verticalAlign: 'bottom',
    outline: 'none'
  },
  text: {
    marginLeft: '1rem',
    fontSize: '12px',
    zIndex: 2,
    color: '#404040'
  },
  link: {
    margin: 'auto'
  }
}));

const Form = () => {
  const { library } = useWeb3React();
  const [daiAmount, setDaiAmount] = useState();
  const [recipientAddress, setRecipientAddress] = useState<string>();
  const [txLink, setTxLink] = useState<string>('');
  const [txPending, setTxPending] = useState<boolean>(false);
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
    setTxPending(true);
    library
      .waitForTransaction(tx.hash)
      .then((res: any) => {
        console.log('res:', res);
        setTxPending(false);
      })
      .catch((error: any) => {
        console.log('Error:', error);
      });
    setTxLink(`https://ropsten.etherscan.io/tx/${tx.hash}`);
    console.log('tx:', tx);
  }

  return (
    <form className={classes.root}>
      <label
        className={classes.text}
        htmlFor="daiAmount">
          Enter DAI Amount
      </label>
      <input
        className={classes.input}
        type="number"
        id="daiAmount"
        onChange={daiInputChangeHandler}
        autoComplete="off" />

      <DaiBalance />

      <label
        className={classes.text}
        htmlFor="recipientAddress">
          Enter recipient address
      </label>
      <input
        className={classes.input}
        type="text"
        id="recipientAddress"
        onChange={addressInputChangeHandler}
        autoComplete="off" />

      <Button
        className={txPending ? classes.buttonDisabled : classes.button}
        onClick={formSubmissionHandler}
        variant='contained'>
          SEND
      </Button>
      
      {txLink.length > 0 &&
        <a
          className={classes.link}
          href={txLink}
          target="_blank">
          <Button className={classes.button} variant='contained'>VIEW ON ETHERSCAN</Button>
        </a>
      }
    </form>
  )
}

export default Form;
