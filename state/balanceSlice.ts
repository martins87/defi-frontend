import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BalanceState {
    balance: string
}

const initialState: BalanceState = {
    balance: ''
}

export const balanceSlice = createSlice({
    name: 'balance',
    initialState,
    reducers: {
        update: (state, action: PayloadAction<string>) => { state.balance = action.payload }
    }
});

export const { update } = balanceSlice.actions;

export default balanceSlice.reducer;
