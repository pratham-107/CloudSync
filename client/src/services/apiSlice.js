import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token || localStorage.getItem("cloudsync_token");
    if (token) {
      headers.set("Authorization", "Bearer " + token);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Asset", "Folder", "Share", "User"],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Asset", "Folder", "User"],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    refreshToken: builder.mutation({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        body,
      }),
    }),
    getMe: builder.query({
      query: () => "/auth/me",
      transformResponse: (response) => response.data?.user,
      providesTags: ["User"],
    }),

    // Assets endpoints
    getAssets: builder.query({
      query: ({ folderId = null, page = 1, limit = 50, sort = "createdAt", order = "desc", search = "" } = {}) => {
        const params = new URLSearchParams();
        if (folderId) params.append("folderId", folderId);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (sort) params.append("sort", sort);
        if (order) params.append("order", order);
        if (search) params.append("search", search);
        return "/assets?" + params.toString();
      },
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result && result.assets
          ? [
              ...result.assets.map(({ assetId }) => ({ type: "Asset", id: assetId })),
              { type: "Asset", id: "LIST" },
            ]
          : [{ type: "Asset", id: "LIST" }],
    }),

    getAsset: builder.query({
      query: (assetId) => "/assets/" + assetId,
      transformResponse: (response) => response.data,
      providesTags: (result, error, assetId) => [{ type: "Asset", id: assetId }],
    }),

    getUploadUrl: builder.mutation({
      query: (body) => ({
        url: "/assets/upload-url",
        method: "POST",
        body,
      }),
    }),

    confirmUpload: builder.mutation({
      query: (body) => ({
        url: "/assets",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Asset", id: "LIST" }, "User"],
    }),

    updateAsset: builder.mutation({
      query: ({ assetId, ...patch }) => ({
        url: "/assets/" + assetId,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { assetId }) => [
        { type: "Asset", id: assetId },
        { type: "Asset", id: "LIST" },
      ],
    }),

    deleteAsset: builder.mutation({
      query: (assetId) => ({
        url: "/assets/" + assetId,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Asset", id: "LIST" }, "User"],
    }),

    // Folders endpoints
    getFolders: builder.query({
      query: (parentId = null) => {
        return parentId ? "/folders?parentId=" + parentId : "/folders";
      },
      transformResponse: (response) => response.data?.folders || [],
      providesTags: ["Folder"],
    }),

    createFolder: builder.mutation({
      query: (body) => ({
        url: "/folders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Folder"],
    }),

    renameFolder: builder.mutation({
      query: ({ folderId, name }) => ({
        url: "/folders/" + folderId,
        method: "PATCH",
        body: { name },
      }),
      invalidatesTags: ["Folder"],
    }),

    deleteFolder: builder.mutation({
      query: (folderId) => ({
        url: "/folders/" + folderId,
        method: "DELETE",
      }),
      invalidatesTags: ["Folder", { type: "Asset", id: "LIST" }, "User"],
    }),

    // Shares endpoints
    createShare: builder.mutation({
      query: (body) => ({
        url: "/shares",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Share"],
    }),

    accessShare: builder.query({
      query: ({ token, password }) => {
        return password ? "/shares/" + token + "?password=" + encodeURIComponent(password) : "/shares/" + token;
      },
      transformResponse: (response) => response.data,
    }),

    revokeShare: builder.mutation({
      query: (shareId) => ({
        url: "/shares/" + shareId,
        method: "DELETE",
      }),
      invalidatesTags: ["Share"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useGetAssetsQuery,
  useGetAssetQuery,
  useGetUploadUrlMutation,
  useConfirmUploadMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
  useGetFoldersQuery,
  useCreateFolderMutation,
  useRenameFolderMutation,
  useDeleteFolderMutation,
  useCreateShareMutation,
  useLazyAccessShareQuery,
  useRevokeShareMutation,
} = apiSlice;
