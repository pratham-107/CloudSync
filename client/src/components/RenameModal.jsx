import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveModal,
  selectModalData,
  closeModal,
  addToast,
} from "../features/ui/uiSlice";
import {
  useRenameFolderMutation,
  useUpdateAssetMutation,
} from "../services/apiSlice";
import { X, Edit2 } from "lucide-react";

export default function RenameModal() {
  const dispatch = useDispatch();
  const activeModal = useSelector(selectActiveModal);
  const modalData = useSelector(selectModalData);

  const isFolder = activeModal === "renameFolder";
  const currentName = isFolder
    ? modalData?.currentName || ""
    : modalData?.asset?.name || "";

  const [name, setName] = useState(currentName);
  const [renameFolder, { isLoading: isRenamingFolder }] = useRenameFolderMutation();
  const [updateAsset, { isLoading: isUpdatingAsset }] = useUpdateAssetMutation();

  const isLoading = isRenamingFolder || isUpdatingAsset;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (isFolder) {
        await renameFolder({
          folderId: modalData.folderId,
          name: name.trim(),
        }).unwrap();
      } else {
        await updateAsset({
          assetId: modalData.asset.assetId,
          name: name.trim(),
        }).unwrap();
      }

      dispatch(
        addToast({
          type: "success",
          message: 'Renamed to "' + name.trim() + '" successfully',
        })
      );
      dispatch(closeModal());
    } catch (err) {
      console.error("Rename error:", err);
      dispatch(
        addToast({
          type: "error",
          message: err?.data?.error?.message || "Failed to rename",
        })
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border-2 border-black rounded-3xl shadow-[8px_8px_0px_#000] p-6 sm:p-7 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b-2 border-black">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#FFE27C] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
              <Edit2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-black">
                Rename {isFolder ? "Directory" : "Asset"}
              </h3>
              <p className="text-xs text-neutral-600 font-medium">Update item identification name</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className="p-1.5 rounded-xl bg-white hover:bg-neutral-100 border-2 border-black shadow-[2px_2px_0px_#000] text-black"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pt-5 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1.5 font-mono">
              New Name
            </label>
            <input
              type="text"
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6EC] border-2 border-black text-xs text-black font-mono font-bold placeholder-neutral-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6CC5F5]"
            />
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
              type="submit"
              disabled={isLoading || !name.trim()}
              className="flex-1 py-2.5 rounded-xl bg-[#6CC5F5] hover:bg-[#58B6EB] disabled:opacity-50 text-black font-black uppercase text-xs border-2 border-black shadow-[3px_3px_0px_#000] transition-all"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
