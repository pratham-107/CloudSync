import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  viewMode: localStorage.getItem("cloudsync_view_mode") || "grid",
  sortBy: "createdAt",
  sortOrder: "desc",
  selectedIds: [],
  searchQuery: "",
  filterOnlyStarred: false,
  filterType: "all",
  activeAssetPreview: null,
};

export const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
      localStorage.setItem("cloudsync_view_mode", action.payload);
    },
    setSort: (state, action) => {
      const { field, order } = action.payload;
      if (field) state.sortBy = field;
      if (order) state.sortOrder = order;
      else if (state.sortBy === field) {
        state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilterOnlyStarred: (state, action) => {
      state.filterOnlyStarred = action.payload;
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
    toggleSelectAsset: (state, action) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((item) => item !== id);
      } else {
        state.selectedIds.push(id);
      }
    },
    selectAllAssets: (state, action) => {
      state.selectedIds = action.payload;
    },
    clearSelectedAssets: (state) => {
      state.selectedIds = [];
    },
    setActiveAssetPreview: (state, action) => {
      state.activeAssetPreview = action.payload;
    },
  },
});

export const {
  setViewMode,
  setSort,
  setSearchQuery,
  setFilterOnlyStarred,
  setFilterType,
  toggleSelectAsset,
  selectAllAssets,
  clearSelectedAssets,
  setActiveAssetPreview,
} = assetsSlice.actions;

export const selectViewMode = (state) => state.assets.viewMode;
export const selectSortBy = (state) => state.assets.sortBy;
export const selectSortOrder = (state) => state.assets.sortOrder;
export const selectSearchQuery = (state) => state.assets.searchQuery;
export const selectSelectedIds = (state) => state.assets.selectedIds;
export const selectFilterOnlyStarred = (state) => state.assets.filterOnlyStarred;
export const selectFilterType = (state) => state.assets.filterType;
export const selectActiveAssetPreview = (state) => state.assets.activeAssetPreview;

export default assetsSlice.reducer;
