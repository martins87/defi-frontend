import { configureStore } from '@reduxjs/toolkit';

import ethBalanceReducer from './ethBalanceSlice';

const store = configureStore({
    reducer: {
        ethBalance: ethBalanceReducer,
        daiBalance: ethBalanceReducer
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
