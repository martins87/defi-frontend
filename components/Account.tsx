import { useWeb3React } from "@web3-react/core";

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  text: {
    color: '#FFFFFF'
  }
}))

const Account = () => {
  const { account } = useWeb3React();
  const classes = useStyles();

  return (
    <>
      <span className={classes.text}>
        {account === null
          ? '-'
          : account
            ? ` ${account.substring(0, 6)}...${account.substring(account.length - 4)}`
            : ''}
      </span>
    </>
  )
}

export default Account;