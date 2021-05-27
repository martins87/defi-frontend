import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BalanceState {
    balance: string
}

const initialState: BalanceState = {
    balance: ''
}

export const ethBalanceSlice = createSlice({
    name: 'ethBalanceSlice',
    initialState,
    reducers: {
        updateEthBalance: (state, action: PayloadAction<string>) => { state.balance = action.payload }
    }
});

export const daiBalanceSlice = createSlice({
    name: 'daiBalanceSlice',
    initialState,
    reducers: {
        updateDaiBalance: (state, action: PayloadAction<string>) => { state.balance = action.payload }
    }
});

export const { updateEthBalance } = ethBalanceSlice.actions;
export const { updateDaiBalance } = daiBalanceSlice.actions;

export const rootSlice = { 
    ethBalanceReducer: ethBalanceSlice.reducer,
    daiBalanceReducer: daiBalanceSlice.reducer
}
