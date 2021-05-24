import React, { useState } from 'react'
import { Button, Link } from '@material-ui/core';

const Form = (props) => {
  const [daiAmount, setDaiAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [txLink, setTxLink] = useState('');

  const daiInputChangeHandler = (event: any) => {
    setDaiAmount(event.target.value);
  }

  const addressInputChangeHandler = (event: any) => {
    setRecipientAddress(event.target.value);
  }

  const formSubmissionHandler = (event: any) => {
    event.preventDefault();

    console.log('daiAmount:', daiAmount);
    console.log('recipient:', recipientAddress); 
    transfer(recipientAddress, daiAmount);
  }

  const transfer = async (recipient: any, amount: any) => {
    const tx = await props.instance.transfer(recipientAddress, daiAmount);
    setTxLink(`https://ropsten.etherscan.io/tx/${tx.hash}`);
    console.log('tx:', tx);
  }

  return (
    <form>
      <div className='form-control'>
        <label htmlFor="daiAmount">Enter DAI amount</label>
        <input type="text" id="daiAmount" onChange={daiInputChangeHandler} />
      </div>
      <div className='form-control'>
        <label htmlFor="recipientAddress">Enter recipient address</label>
        <input type="text" id="recipientAddress" onChange={addressInputChangeHandler}/>
      </div>
      <Button onClick={formSubmissionHandler} variant='contained'>Send</Button>
      {txLink.length > 0 ? <Link href={txLink}>
        View transaction on Etherscan
      </Link> : null}
    </form>
  )
}

export default Form;
