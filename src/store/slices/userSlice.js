import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        saveUserData: (state = initialState, action) => {
            state.user = action.payload;
        },
        removeUserData: (state = initialState) => {
            state.user = null;
        }
    }
});

export const { saveUserData, removeUserData } = userSlice.actions;

export default userSlice.reducer;
