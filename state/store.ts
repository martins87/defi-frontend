import { configureStore } from '@reduxjs/toolkit';

import ethBalanceReducer from './ethBalanceSlice';
import daiBalanceReducer from './daiBalanceSlice';

const store = configureStore({
    reducer: {
        ethBalance: ethBalanceReducer,
        daiBalance: daiBalanceReducer
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
