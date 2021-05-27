import { configureStore } from '@reduxjs/toolkit';

import { rootSlice } from './balanceSlice';

const store = configureStore({
    reducer: {
        ethBalance: rootSlice.ethBalanceReducer,
        daiBalance: rootSlice.daiBalanceReducer
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
