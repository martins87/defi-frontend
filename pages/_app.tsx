import { AppProps } from 'next/app';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ThemeProvider } from '@material-ui/styles'
import { Provider } from 'react-redux';

import '../styles/globals.css'
import { muiTheme } from '../theme'
import store from '../state/store';

const getLibrary = (provider: any): Web3Provider => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={muiTheme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Web3ReactProvider>
    </ThemeProvider>
  )
}

export default App;
