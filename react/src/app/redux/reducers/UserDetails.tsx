import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  auth: boolean,
  token: string,
  user: any,
}

const initialState: CounterState = {
  auth: false,
  token: "",
  user: {},
}

export const UserDetails = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    AddAuth: (state, action) => {
      state.auth = action.payload;
    },
    AddToken: (state, action) => {
      state.token = action.payload;
    },
    AddUserDetails: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { AddAuth, AddToken, AddUserDetails } = UserDetails.actions;

export default UserDetails.reducer;