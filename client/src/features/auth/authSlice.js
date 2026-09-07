import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../../services/apiSlice";

const savedToken = localStorage.getItem("cloudsync_token");
const savedUser = localStorage.getItem("cloudsync_user");

const initialState = {
  token: savedToken || null,
  refreshToken: localStorage.getItem("cloudsync_refresh_token") || null,
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedToken,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;

      localStorage.setItem("cloudsync_token", accessToken);
      if (refreshToken) localStorage.setItem("cloudsync_refresh_token", refreshToken);
      localStorage.setItem("cloudsync_user", JSON.stringify(user));
    },
    updateUserStorage: (state, action) => {
      if (state.user) {
        state.user.storageUsed = (state.user.storageUsed || 0) + action.payload;
        localStorage.setItem("cloudsync_user", JSON.stringify(state.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("cloudsync_token");
      localStorage.removeItem("cloudsync_refresh_token");
      localStorage.removeItem("cloudsync_user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        apiSlice.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          if (payload.data) {
            const { user, accessToken, refreshToken } = payload.data;
            state.user = user;
            state.token = accessToken;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;

            localStorage.setItem("cloudsync_token", accessToken);
            if (refreshToken) localStorage.setItem("cloudsync_refresh_token", refreshToken);
            localStorage.setItem("cloudsync_user", JSON.stringify(user));
          }
        }
      )
      .addMatcher(
        apiSlice.endpoints.getMe.matchFulfilled,
        (state, { payload }) => {
          if (payload) {
            state.user = { ...(state.user || {}), ...payload };
            localStorage.setItem("cloudsync_user", JSON.stringify(state.user));
          }
        }
      );
  },
});

export const { setCredentials, updateUserStorage, logout } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;
