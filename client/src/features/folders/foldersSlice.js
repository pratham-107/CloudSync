import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentFolderId: null,
  breadcrumbs: [{ id: null, name: "Home" }],
  expandedFolderIds: [],
};

export const foldersSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    setCurrentFolder: (state, action) => {
      const folder = action.payload; // null for root or { folderId, name, path }
      if (!folder || !folder.folderId) {
        state.currentFolderId = null;
        state.breadcrumbs = [{ id: null, name: "Home" }];
      } else {
        state.currentFolderId = folder.folderId;
        // Build breadcrumb if path is available or append
        const pathSegments = folder.path
          ? folder.path.replace(/^\/root\/?/, "").split("/").filter(Boolean)
          : [folder.name];

        const crumbs = [{ id: null, name: "Home" }];
        pathSegments.forEach((segment, idx) => {
          crumbs.push({
            id: idx === pathSegments.length - 1 ? folder.folderId : null,
            name: segment,
          });
        });
        state.breadcrumbs = crumbs;
      }
    },
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
    navigateToBreadcrumb: (state, action) => {
      const targetCrumb = action.payload;
      state.currentFolderId = targetCrumb.id;
      const index = state.breadcrumbs.findIndex((b) => b.id === targetCrumb.id);
      if (index !== -1) {
        state.breadcrumbs = state.breadcrumbs.slice(0, index + 1);
      } else if (targetCrumb.id === null) {
        state.breadcrumbs = [{ id: null, name: "Home" }];
      }
    },
    toggleExpandFolder: (state, action) => {
      const id = action.payload;
      if (state.expandedFolderIds.includes(id)) {
        state.expandedFolderIds = state.expandedFolderIds.filter((item) => item !== id);
      } else {
        state.expandedFolderIds.push(id);
      }
    },
  },
});

export const {
  setCurrentFolder,
  setBreadcrumbs,
  navigateToBreadcrumb,
  toggleExpandFolder,
} = foldersSlice.actions;

export const selectCurrentFolderId = (state) => state.folders.currentFolderId;
export const selectBreadcrumbs = (state) => state.folders.breadcrumbs;
export const selectExpandedFolderIds = (state) => state.folders.expandedFolderIds;

export default foldersSlice.reducer;
