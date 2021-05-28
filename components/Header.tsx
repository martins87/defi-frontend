import React, { useEffect, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import { makeStyles } from '@material-ui/core';
// import { PowerSettingsNewIcon } from '@material-ui/icons';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

import { useEagerConnect, useInactiveListener } from '../hooks';
import { injected, network } from '../connectors';
import Spinner from './Spinner';
import Account from './Account';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#6200EE',
    position: 'fixed',
    top: '0',
    width: '100%',
    height: '8vh',
    display: 'grid',
  },
  elements: {
    // backgroundColor: 'yellow',
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 'auto'
  },
  text: {
    color: '#FFFFFF'
  },
  // style={{
  //   height: '3rem',
  //   borderRadius: '1rem',
  //   borderColor: activating ? 'orange' : connected ? 'green' : 'unset',
  //   cursor: disabled ? 'unset' : 'pointer',
  //   position: 'relative'
  // }}
  button: {
    backgroundColor: '#FFFFFF',
    height: '1.8rem',
    width: '8rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '10px !important',
    fontWeight: 'bold',
    color: '#6200EE'
  },
  deactivateBtn: {
    backgroundColor: '#FFFFFF',
    height: '1.8rem',
    width: '1.8rem',
    display: 'grid',
    alignItens: 'center',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '10px !important',
    fontWeight: 'bold',
    color: '#6200EE'
  }
}))

enum ConnectorNames {
  Injected = 'CONNECT WALLET',
  // Network = 'Network'
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  // [ConnectorNames.Network]: network
}

const getErrorMessage = (error: Error) => {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (
    error instanceof UserRejectedRequestErrorInjected //||
    // error instanceof UserRejectedRequestErrorWalletConnect ||
    // error instanceof UserRejectedRequestErrorFrame
  ) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}

const Header = () => {
  const context = useWeb3React<Web3Provider>();
  const { connector, chainId, activate, deactivate, active, error } = context;
  const classes = useStyles();

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<any>();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  // const { active, error } = useWeb3React()

  return (
    <React.Fragment>
      <div className={classes.root}>
        <div className={classes.elements}>
          <div className={classes.text}>
            DeFi App
          </div>
          <div
          // style={{
          //   display: 'grid',
          //   gridGap: '1rem',
          //   gridTemplateColumns: '1fr 1fr',
          //   maxWidth: '20rem',
          //   margin: 'auto'
          // }}
          >
            {!active && Object.keys(connectorsByName).map(name => {
              const currentConnector = connectorsByName[name]
              const activating = currentConnector === activatingConnector
              const connected = currentConnector === connector
              const disabled = !triedEager || !!activatingConnector || connected || !!error

              return (
                <button
                  // style={{
                  //   height: '3rem',
                  //   borderRadius: '1rem',
                  //   borderColor: activating ? 'orange' : connected ? 'green' : 'unset',
                  //   cursor: disabled ? 'unset' : 'pointer',
                  //   position: 'relative'
                  // }}
                  className={classes.button}
                  disabled={disabled}
                  key={name}
                  onClick={() => {
                    setActivatingConnector(currentConnector)
                    activate(connectorsByName[name])
                  }}
                >
                  <div
                  // style={{
                  //   position: 'absolute',
                  //   top: '0',
                  //   left: '0',
                  //   height: '100%',
                  //   display: 'flex',
                  //   alignItems: 'center',
                  //   color: 'black',
                  //   margin: '0 0 0 1rem'
                  // }}
                  >
                    {activating && <Spinner color={'black'} style={{ height: '25%', marginLeft: '-1rem' }} />}
                    {/* {connected && (
                    <span role="img" aria-label="check">
                      ✅
                    </span>
                  )} */}
                  </div>
                  {name}
                </button>
              )
            })}

            {active && <Account />}

            <div
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {(active || error) && (
                <button
                  // style={{
                  //   height: '3rem',
                  //   marginTop: '2rem',
                  //   borderRadius: '1rem',
                  //   borderColor: 'red',
                  //   cursor: 'pointer'
                  // }}
                  className={classes.deactivateBtn}
                  onClick={() => {
                    deactivate()
                  }}
                >
                  <PowerSettingsNewIcon />
                </button>
              )}

              {!!error && <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>{getErrorMessage(error)}</h4>}
            </div>
          </div>
        </div>
      </div>

      {/* {!!(connector === connectorsByName[ConnectorNames.Network] && chainId) && (
        <button
          style={{
            height: '3rem',
            borderRadius: '1rem',
            cursor: 'pointer'
          }}
          onClick={() => {
            ; (connector as any).changeChainId(chainId === 1 ? 4 : 1)
          }}
        >
          Switch Networks
        </button>
      )} */}
    </React.Fragment>
  )
}

export default Header;
