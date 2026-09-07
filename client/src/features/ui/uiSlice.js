import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: true,
  activeModal: null, // "createFolder" | "renameFolder" | "share" | "deleteAsset" | "deleteFolder"
  modalData: null,
  toasts: [],
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action) => {
      const { type, data } = action.payload;
      state.activeModal = type;
      state.modalData = data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
    addToast: (state, action) => {
      const { type = "info", message, duration = 4000 } = action.payload;
      const id = "toast_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
      state.toasts.push({ id, type, message, duration });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  addToast,
  removeToast,
} = uiSlice.actions;

export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectActiveModal = (state) => state.ui.activeModal;
export const selectModalData = (state) => state.ui.modalData;
export const selectToasts = (state) => state.ui.toasts;

export default uiSlice.reducer;
