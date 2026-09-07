import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveAssetPreview,
  setActiveAssetPreview,
} from "../features/assets/assetsSlice";
import {
  useUpdateAssetMutation,
  useGetAssetQuery,
} from "../services/apiSlice";
import { openModal } from "../features/ui/uiSlice";
import {
  formatBytes,
  formatDate,
  getFileTypeCategory,
  isImage,
  isVideo,
  isAudio,
  isPdf,
  downloadFile,
} from "../utils/formatters";
import {
  X,
  Download,
  Share2,
  Star,
  Trash2,
  Calendar,
  HardDrive,
  FileText,
  Plus,
} from "lucide-react";

export default function AssetPreviewModal() {
  const dispatch = useDispatch();
  const rawAsset = useSelector(selectActiveAssetPreview);

  const { data: asset = rawAsset } = useGetAssetQuery(rawAsset?.assetId, {
    skip: !rawAsset?.assetId,
  });

  const [updateAsset] = useUpdateAssetMutation();
  const [newTag, setNewTag] = useState("");
  const [isEditingTags, setIsEditingTags] = useState(false);

  if (!rawAsset) return null;

  const currentAsset = asset || rawAsset;
  const fileCategory = getFileTypeCategory(currentAsset.mimeType, currentAsset.name);

  const handleClose = () => {
    dispatch(setActiveAssetPreview(null));
  };

  const handleToggleStar = async () => {
    try {
      await updateAsset({
        assetId: currentAsset.assetId,
        isStarred: !currentAsset.isStarred,
      }).unwrap();
    } catch (err) {
      console.error("Failed to toggle star:", err);
    }
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    const tag = newTag.trim().toLowerCase();
    const currentTags = currentAsset.tags || [];
    if (!currentTags.includes(tag)) {
      const updatedTags = [...currentTags, tag];
      await updateAsset({
        assetId: currentAsset.assetId,
        tags: updatedTags,
      }).unwrap();
    }
    setNewTag("");
  };

  const handleRemoveTag = async (tagToRemove) => {
    const updatedTags = (currentAsset.tags || []).filter((t) => t !== tagToRemove);
    await updateAsset({
      assetId: currentAsset.assetId,
      tags: updatedTags,
    }).unwrap();
  };

  const handleShare = () => {
    dispatch(openModal({ type: "share", data: { asset: currentAsset } }));
  };

  const handleDelete = () => {
    dispatch(openModal({ type: "deleteAsset", data: { asset: currentAsset } }));
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[88vh] bg-white border-2 border-black rounded-3xl shadow-[8px_8px_0px_#000] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-[#FAF6EC]">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <h3 className="text-sm sm:text-base font-black text-black truncate">
              {currentAsset.name}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-[#FFE27C] text-black border border-black uppercase shrink-0">
              {fileCategory}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStar}
              className={`p-2 rounded-xl border-2 border-black transition-all ${
                currentAsset.isStarred
                  ? "bg-[#FFE27C] text-black shadow-[2px_2px_0px_#000]"
                  : "bg-white text-black hover:bg-[#FAF6EC]"
              }`}
              title="Star asset"
            >
              <Star className={`w-4 h-4 ${currentAsset.isStarred ? "fill-[#FFAF1A]" : ""}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white hover:bg-[#6CC5F5] border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-0.5 transition-all text-black"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => downloadFile(currentAsset.s3Url, currentAsset.name)}
              className="p-2 rounded-xl bg-white hover:bg-[#86EFAC] border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-0.5 transition-all text-black"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handleDelete}
              className="p-2 rounded-xl bg-white hover:bg-rose-100 border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-0.5 transition-all text-rose-600"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="h-5 w-0.5 bg-black mx-1" />

            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-white hover:bg-neutral-100 border-2 border-black shadow-[2px_2px_0px_#000] text-black"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Content Body: Viewer (left) + Metadata (right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Main Viewer */}
          <div className="flex-1 flex items-center justify-center p-6 bg-[#181920] overflow-auto">
            {isImage(currentAsset.mimeType) && currentAsset.s3Url ? (
              <img
                src={currentAsset.s3Url}
                alt={currentAsset.name}
                className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl border-2 border-white/20"
              />
            ) : isVideo(currentAsset.mimeType) && currentAsset.s3Url ? (
              <video
                src={currentAsset.s3Url}
                controls
                className="max-h-full max-w-full rounded-2xl shadow-2xl border-2 border-white/20"
              />
            ) : isAudio(currentAsset.mimeType) && currentAsset.s3Url ? (
              <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-3xl border-2 border-black shadow-[6px_6px_0px_#000] max-w-md w-full">
                <div className="w-20 h-20 rounded-2xl bg-[#FFE27C] border-2 border-black flex items-center justify-center text-black">
                  <HardDrive className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <h4 className="font-black text-black text-base">{currentAsset.name}</h4>
                  <p className="text-xs text-neutral-600 font-mono font-bold mt-1">{formatBytes(currentAsset.size)}</p>
                </div>
                <audio src={currentAsset.s3Url} controls className="w-full" />
              </div>
            ) : isPdf(currentAsset.mimeType) && currentAsset.s3Url ? (
              <iframe
                src={currentAsset.s3Url}
                title={currentAsset.name}
                className="w-full h-full rounded-2xl border-2 border-white/20 bg-white"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-center max-w-md p-8 bg-white rounded-3xl border-2 border-black shadow-[6px_6px_0px_#000]">
                <div className="p-4 rounded-2xl bg-[#FFE27C] border-2 border-black text-black">
                  <FileText className="w-12 h-12" />
                </div>
                <div>
                  <h4 className="font-black text-black text-base uppercase">{currentAsset.name}</h4>
                  <p className="text-xs font-medium text-neutral-600 mt-1">
                    Browser streaming preview is not supported for this file format.
                  </p>
                </div>
                <button
                  onClick={() => downloadFile(currentAsset.s3Url, currentAsset.name)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6CC5F5] hover:bg-[#58B6EB] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] transition-all"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Download File</span>
                </button>
              </div>
            )}
          </div>

          {/* Details Sidebar */}
          <div className="w-full md:w-80 border-t-2 md:border-t-0 md:border-l-2 border-black bg-[#FAF6EC] p-6 overflow-y-auto flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-black font-mono mb-3">
                  Technical Specs
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-white rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] space-y-1">
                    <span className="text-neutral-500 block text-[10px] font-mono font-bold uppercase">MIME Type</span>
                    <span className="font-mono text-black font-bold text-xs truncate block">{currentAsset.mimeType}</span>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] space-y-1">
                    <span className="text-neutral-500 block text-[10px] font-mono font-bold uppercase">File Size</span>
                    <span className="font-mono text-black font-bold text-xs block">{formatBytes(currentAsset.size)}</span>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] space-y-1">
                    <span className="text-neutral-500 block text-[10px] font-mono font-bold uppercase">Created Date</span>
                    <span className="font-mono text-black font-bold text-xs block">{formatDate(currentAsset.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div className="border-t-2 border-black/10 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-black font-mono">
                    Tags & Labels
                  </h4>
                  <button
                    onClick={() => setIsEditingTags(!isEditingTags)}
                    className="text-[11px] text-black hover:underline font-black"
                  >
                    {isEditingTags ? "Done" : "Edit Tags"}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {currentAsset.tags && currentAsset.tags.length > 0 ? (
                    currentAsset.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FFE27C] text-black text-xs font-mono font-bold border border-black shadow-[1px_1px_0px_#000]"
                      >
                        #{tag}
                        {isEditingTags && (
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="text-neutral-600 hover:text-rose-600 ml-1 font-black"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-neutral-500 italic font-mono">No tags assigned</span>
                  )}
                </div>

                {isEditingTags && (
                  <form onSubmit={handleAddTag} className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag (e.g. trailer, master)"
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white border-2 border-black text-xs text-black font-mono font-bold placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6CC5F5]"
                    />
                    <button
                      type="submit"
                      className="p-1.5 rounded-xl bg-[#FFAF1A] border-2 border-black text-black font-bold shadow-[1px_1px_0px_#000]"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t-2 border-black/10 pt-4">
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#6CC5F5] hover:bg-[#58B6EB] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <Share2 className="w-4 h-4 stroke-[3]" />
                <span>Create Share Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
