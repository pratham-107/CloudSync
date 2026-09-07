import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  queue: [],
  isOpen: false,
  isMinimized: false,
};

export const uploadsSlice = createSlice({
  name: "uploads",
  initialState,
  reducers: {
    addUploads: (state, action) => {
      // action.payload: array of { id, name, size, mimeType, folderId }
      const newItems = action.payload.map((item) => ({
        id: item.id || "up_" + Math.random().toString(36).substring(2, 9),
        name: item.name,
        size: item.size,
        mimeType: item.mimeType,
        folderId: item.folderId,
        progress: 0,
        status: "pending",
        error: null,
      }));
      state.queue.unshift(...newItems);
      state.isOpen = true;
      state.isMinimized = false;
    },
    updateUploadProgress: (state, action) => {
      const { id, progress, status, error } = action.payload;
      const item = state.queue.find((u) => u.id === id);
      if (item) {
        if (progress !== undefined) item.progress = progress;
        if (status !== undefined) item.status = status;
        if (error !== undefined) item.error = error;
      }
    },
    removeUpload: (state, action) => {
      state.queue = state.queue.filter((u) => u.id !== action.payload);
      if (state.queue.length === 0) {
        state.isOpen = false;
      }
    },
    clearCompletedUploads: (state) => {
      state.queue = state.queue.filter((u) => u.status !== "done");
      if (state.queue.length === 0) {
        state.isOpen = false;
      }
    },
    setUploadDrawerOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    toggleUploadDrawerMinimized: (state) => {
      state.isMinimized = !state.isMinimized;
    },
  },
});

export const {
  addUploads,
  updateUploadProgress,
  removeUpload,
  clearCompletedUploads,
  setUploadDrawerOpen,
  toggleUploadDrawerMinimized,
} = uploadsSlice.actions;

export const selectUploadQueue = (state) => state.uploads.queue;
export const selectIsUploadDrawerOpen = (state) => state.uploads.isOpen;
export const selectIsUploadDrawerMinimized = (state) => state.uploads.isMinimized;
export const selectActiveUploadsCount = (state) =>
  state.uploads.queue.filter((u) => u.status === "uploading" || u.status === "pending" || u.status === "processing").length;

export default uploadsSlice.reducer;
