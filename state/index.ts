import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
//import { save, load } from 'redux-localstorage-simple'

import tokens from './tokendata/reducer'
import tokenPrices from './tokenprice/reducer'
import notifications from './notifications/reducer'
import badgermodal from './badgermodal/reducer'
//const PERSISTED_KEYS: string[] = ['transactions']

const store = configureStore({
  reducer: {
    tokens,
    tokenPrices,
    notifications,
    badgermodal
  },
  middleware: [...getDefaultMiddleware({ thunk: false }),] //save({ states: PERSISTED_KEYS })],
  //preloadedState: load({ states: PERSISTED_KEYS })
})

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
