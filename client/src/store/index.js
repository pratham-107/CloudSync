import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "../services/apiSlice";
import authReducer from "../features/auth/authSlice";
import assetsReducer from "../features/assets/assetsSlice";
import foldersReducer from "../features/folders/foldersSlice";
import uploadsReducer from "../features/uploads/uploadsSlice";
import uiReducer from "../features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    assets: assetsReducer,
    folders: foldersReducer,
    uploads: uploadsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore file objects or non-serializables in specific actions if needed
        ignoredActions: ["uploads/addUploads"],
        ignoredPaths: ["uploads.queue"],
      },
    }).concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export default store;
