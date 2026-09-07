import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectModalData,
  closeModal,
  addToast,
} from "../features/ui/uiSlice";
import { useCreateFolderMutation } from "../services/apiSlice";
import { selectCurrentFolderId } from "../features/folders/foldersSlice";
import { X, FolderPlus } from "lucide-react";

export default function CreateFolderModal() {
  const dispatch = useDispatch();
  const modalData = useSelector(selectModalData);
  const currentFolderId = useSelector(selectCurrentFolderId);
  const targetParentId = modalData?.parentId !== undefined ? modalData.parentId : currentFolderId;

  const [folderName, setFolderName] = useState("");
  const [createFolder, { isLoading }] = useCreateFolderMutation();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    try {
      await createFolder({
        name: folderName.trim(),
        parentId: targetParentId || null,
      }).unwrap();

      dispatch(
        addToast({
          type: "success",
          message: 'Folder "' + folderName.trim() + '" created',
        })
      );
      dispatch(closeModal());
    } catch (err) {
      console.error("Failed to create folder:", err);
      dispatch(
        addToast({
          type: "error",
          message: err?.data?.error?.message || "Failed to create folder",
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
              <FolderPlus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-black">Create Directory</h3>
              <p className="text-xs text-neutral-600 font-medium">New nested media vault folder</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className="p-1.5 rounded-xl bg-white hover:bg-neutral-100 border-2 border-black shadow-[2px_2px_0px_#000] text-black"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="pt-5 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1.5 font-mono">
              Directory Name
            </label>
            <input
              type="text"
              autoFocus
              required
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="e.g. Production Assets"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6EC] border-2 border-black text-xs font-mono font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6CC5F5]"
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
              disabled={isLoading || !folderName.trim()}
              className="flex-1 py-2.5 rounded-xl bg-[#6CC5F5] hover:bg-[#58B6EB] disabled:opacity-50 text-black font-black uppercase text-xs border-2 border-black shadow-[3px_3px_0px_#000] transition-all"
            >
              {isLoading ? "Creating..." : "Create Folder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
