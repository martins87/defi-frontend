import React, { useState } from 'react'
import Button from '@material-ui/core/Button';

const Form = () => {
  const [daiAmount, setDaiAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

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
    </form>
  )
}

export default Form;
