import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addUploads,
  updateUploadProgress,
} from "../features/uploads/uploadsSlice";
import {
  useGetUploadUrlMutation,
  useConfirmUploadMutation,
} from "../services/apiSlice";
import { updateUserStorage } from "../features/auth/authSlice";
import { addToast } from "../features/ui/uiSlice";
import { selectCurrentFolderId } from "../features/folders/foldersSlice";

export function useUpload() {
  const dispatch = useDispatch();
  const currentFolderId = useSelector(selectCurrentFolderId);
  const user = useSelector((state) => state.auth.user);

  const [getUploadUrl] = useGetUploadUrlMutation();
  const [confirmUpload] = useConfirmUploadMutation();

  const uploadFile = useCallback(
    async (file, uploadId, targetFolderId) => {
      try {
        dispatch(
          updateUploadProgress({
            id: uploadId,
            progress: 5,
            status: "uploading",
          })
        );

        // 1. Get Pre-signed URL from Backend
        const mimeType = file.type || "application/octet-stream";
        const urlResponse = await getUploadUrl({
          filename: file.name,
          mimeType,
          size: file.size,
          folderId: targetFolderId || null,
        }).unwrap();

        const { uploadUrl, s3Key, assetId } = urlResponse.data;

        // 2. Direct-to-S3 XHR Upload with Real-Time Progress
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadUrl, true);
          xhr.setRequestHeader("Content-Type", mimeType);

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percent = Math.min(
                92,
                Math.round((e.loaded / e.total) * 85) + 8
              );
              dispatch(
                updateUploadProgress({
                  id: uploadId,
                  progress: percent,
                  status: "uploading",
                })
              );
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error("S3 Upload failed with status " + xhr.status));
            }
          };

          xhr.onerror = () => {
            reject(new Error("Network error during S3 upload"));
          };

          xhr.send(file);
        });

        // 3. Confirm Upload & Save Metadata
        dispatch(
          updateUploadProgress({
            id: uploadId,
            progress: 95,
            status: "processing",
          })
        );

        await confirmUpload({
          assetId,
          s3Key,
          name: file.name,
          originalName: file.name,
          mimeType,
          size: file.size,
          folderId: targetFolderId || null,
          tags: [],
        }).unwrap();

        dispatch(
          updateUploadProgress({
            id: uploadId,
            progress: 100,
            status: "done",
          })
        );

        dispatch(updateUserStorage(file.size));
        dispatch(
          addToast({
            type: "success",
            message: "Uploaded " + file.name + " successfully",
          })
        );
      } catch (err) {
        console.error("Upload failed for file:", file.name, err);
        const errorMessage =
          err?.data?.error?.message || err?.message || "Upload failed";
        dispatch(
          updateUploadProgress({
            id: uploadId,
            progress: 0,
            status: "error",
            error: errorMessage,
          })
        );
        dispatch(
          addToast({
            type: "error",
            message: file.name + ": " + errorMessage,
          })
        );
      }
    },
    [dispatch, getUploadUrl, confirmUpload]
  );

  const startUpload = useCallback(
    (files, targetFolderOverride = null) => {
      if (!files || files.length === 0) return;
      const fileList = Array.from(files);

      const remainingStorage = (user?.storageLimit || 5368709120) - (user?.storageUsed || 0);
      const totalUploadSize = fileList.reduce((acc, f) => acc + f.size, 0);

      if (totalUploadSize > remainingStorage) {
        dispatch(
          addToast({
            type: "error",
            message: "Storage quota exceeded. Please free up space or upload smaller files.",
          })
        );
        return;
      }

      const folderToUse =
        targetFolderOverride !== null ? targetFolderOverride : currentFolderId;

      const items = fileList.map((file) => {
        const uploadId = "up_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
        return {
          id: uploadId,
          name: file.name,
          size: file.size,
          mimeType: file.type || "application/octet-stream",
          folderId: folderToUse,
          file,
        };
      });

      dispatch(addUploads(items));

      // Process uploads sequentially or concurrently (up to 3 parallel)
      items.forEach((item) => {
        uploadFile(item.file, item.id, item.folderId);
      });
    },
    [dispatch, currentFolderId, user, uploadFile]
  );

  return { startUpload };
}
