import { useWeb3React } from "@web3-react/core"

export const Account = () => {
  const { account } = useWeb3React()

  return (
    <>
      <p>Account: 
        {/* <span role="img" aria-label="robot">
          🤖
        </span> */}
        <span>
          {account === null
            ? '-'
            : account
              ? ` ${account.substring(0, 6)}...${account.substring(account.length - 4)}`
              : ''}
        </span>
      </p>
    </>
  )
}
