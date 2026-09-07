import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveModal,
  selectModalData,
  closeModal,
  addToast,
} from "../features/ui/uiSlice";
import {
  useDeleteFolderMutation,
  useDeleteAssetMutation,
} from "../services/apiSlice";
import { clearSelectedAssets } from "../features/assets/assetsSlice";
import { X, AlertTriangle } from "lucide-react";

export default function DeleteConfirmModal() {
  const dispatch = useDispatch();
  const activeModal = useSelector(selectActiveModal);
  const modalData = useSelector(selectModalData);

  const [deleteFolder, { isLoading: isDeletingFolder }] = useDeleteFolderMutation();
  const [deleteAsset, { isLoading: isDeletingAsset }] = useDeleteAssetMutation();

  const isFolder = activeModal === "deleteFolder";
  const isBatch = activeModal === "batchDelete";
  const isLoading = isDeletingFolder || isDeletingAsset;

  const handleConfirmDelete = async () => {
    try {
      if (isFolder) {
        await deleteFolder(modalData.folderId).unwrap();
        dispatch(
          addToast({
            type: "success",
            message: 'Directory "' + modalData.name + '" removed permanently',
          })
        );
      } else if (isBatch) {
        const assetIds = modalData.assetIds || [];
        for (const id of assetIds) {
          await deleteAsset(id).unwrap();
        }
        dispatch(clearSelectedAssets());
        dispatch(
          addToast({
            type: "success",
            message: "Removed " + assetIds.length + " assets",
          })
        );
      } else {
        await deleteAsset(modalData.asset.assetId).unwrap();
        dispatch(
          addToast({
            type: "success",
            message: 'Asset "' + modalData.asset.name + '" removed',
          })
        );
      }
      dispatch(closeModal());
    } catch (err) {
      console.error("Delete failed:", err);
      dispatch(
        addToast({
          type: "error",
          message: err?.data?.error?.message || "Failed to delete",
        })
      );
    }
  };

  const title = isFolder
    ? "Delete Directory"
    : isBatch
    ? "Delete Multiple Assets"
    : "Delete Asset";

  const description = isFolder
    ? 'Are you sure you want to permanently delete "' +
      (modalData?.name || "this directory") +
      '"? All subdirectories and files inside will be permanently removed from your vault.'
    : isBatch
    ? "Are you sure you want to delete " +
      (modalData?.assetIds?.length || 0) +
      " selected files from your cloud vault?"
    : 'Are you sure you want to delete "' +
      (modalData?.asset?.name || "this file") +
      '"? This action is irreversible.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border-2 border-black rounded-3xl shadow-[8px_8px_0px_#000] p-6 sm:p-7 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b-2 border-black">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-600 border-2 border-rose-500 shadow-[2px_2px_0px_#000]">
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-black">{title}</h3>
              <p className="text-[10px] text-rose-600 font-mono uppercase tracking-wider font-black">
                Destructive Action
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className="p-1.5 rounded-xl bg-white hover:bg-neutral-100 border-2 border-black shadow-[2px_2px_0px_#000] text-black"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <div className="py-5">
          <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-medium">
            {description}
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="flex-1 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-black font-black uppercase text-xs transition-colors border-2 border-black shadow-[2px_2px_0px_#000]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black uppercase text-xs shadow-[3px_3px_0px_#000] border-2 border-black transition-all"
          >
            {isLoading ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
