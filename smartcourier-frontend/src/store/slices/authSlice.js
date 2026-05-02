import { createSlice } from '@reduxjs/toolkit';

const token = sessionStorage.getItem('token');
const role = sessionStorage.getItem('role');
const userName = sessionStorage.getItem('userName');
const email = sessionStorage.getItem('email');

const initialState = {
  token,
  role,
  userName,
  email,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.userName = action.payload.name;
      state.email = action.payload.email;
      state.isAuthenticated = true;

      sessionStorage.setItem('token', action.payload.token);
      sessionStorage.setItem('role', action.payload.role);
      sessionStorage.setItem('userName', action.payload.name);
      sessionStorage.setItem('email', action.payload.email);
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.userName = null;
      state.email = null;
      state.isAuthenticated = false;

      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('email');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
