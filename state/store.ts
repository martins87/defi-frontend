import { configureStore } from '@reduxjs/toolkit';

import balanceReducer from './balanceSlice';

const store = configureStore({
    reducer: {
        balance: balanceReducer
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
