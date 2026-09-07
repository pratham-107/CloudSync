import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveAssetPreview,
  toggleSelectAsset,
  selectSelectedIds,
} from "../features/assets/assetsSlice";
import { useUpdateAssetMutation } from "../services/apiSlice";
import { openModal } from "../features/ui/uiSlice";
import {
  formatBytes,
  formatDate,
  getFileTypeCategory,
  downloadFile,
} from "../utils/formatters";
import {
  Star,
  Share2,
  Download,
  MoreVertical,
  Trash2,
  Edit2,
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  FileArchive,
  File,
  Check,
} from "lucide-react";

export default function AssetGrid({ assets = [] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
      {assets.map((asset) => (
        <AssetGridCard key={asset.assetId} asset={asset} />
      ))}
    </div>
  );
}

function AssetGridCard({ asset }) {
  const dispatch = useDispatch();
  const selectedIds = useSelector(selectSelectedIds);
  const [updateAsset] = useUpdateAssetMutation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const menuRef = useRef(null);

  const isSelected = selectedIds.includes(asset.assetId);
  const fileCategory = getFileTypeCategory(asset.mimeType, asset.name);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleStar = async (e) => {
    e.stopPropagation();
    try {
      await updateAsset({
        assetId: asset.assetId,
        isStarred: !asset.isStarred,
      }).unwrap();
    } catch (err) {
      console.error("Failed to toggle star:", err);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    dispatch(openModal({ type: "share", data: { asset } }));
  };

  const handleRename = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    dispatch(openModal({ type: "renameAsset", data: { asset } }));
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    dispatch(openModal({ type: "deleteAsset", data: { asset } }));
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    downloadFile(asset.s3Url, asset.name);
  };

  const renderIcon = () => {
    switch (fileCategory) {
      case "image":
        return <FileImage className="w-8 h-8 text-[#FFAF1A]" />;
      case "video":
        return <FileVideo className="w-8 h-8 text-[#38BDF8]" />;
      case "audio":
        return <FileAudio className="w-8 h-8 text-[#86EFAC]" />;
      case "document":
      case "pdf":
        return <FileText className="w-8 h-8 text-[#F472B6]" />;
      case "spreadsheet":
        return <FileText className="w-8 h-8 text-[#34D399]" />;
      case "archive":
        return <FileArchive className="w-8 h-8 text-[#FBBF24]" />;
      default:
        return <File className="w-8 h-8 text-neutral-600" />;
    }
  };

  return (
    <div
      onClick={() => dispatch(setActiveAssetPreview(asset))}
      className={`group relative flex flex-col justify-between rounded-2xl bg-white border-2 border-black transition-all duration-200 cursor-pointer shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:-translate-y-0.5 ${
        menuOpen ? "z-30" : "hover:z-10"
      } ${
        isSelected
          ? "ring-2 ring-black bg-[#FFE27C]"
          : "hover:border-black"
      }`}
    >
      {/* Thumbnail / Preview Area */}
      <div className="relative w-full aspect-square bg-[#FAF6EC] flex items-center justify-center overflow-hidden rounded-t-2xl border-b-2 border-black">
        {fileCategory === "image" && asset.s3Url ? (
          <>
            <img
              src={asset.thumbnailUrl || asset.s3Url}
              alt={asset.name}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-[#FAF6EC]">
                <FileImage className="w-8 h-8 text-neutral-400" />
              </div>
            )}
          </>
        ) : (
          <div className="p-3.5 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] group-hover:scale-105 transition-transform duration-200">
            {renderIcon()}
          </div>
        )}

        {/* Multi-select Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleSelectAsset(asset.assetId));
          }}
          className={`absolute top-2 left-2 w-5 h-5 rounded-lg border-2 border-black flex items-center justify-center transition-all ${
            isSelected
              ? "bg-[#FFAF1A] text-black opacity-100 shadow-[1px_1px_0px_#000] font-bold"
              : "bg-white text-transparent hover:text-black opacity-0 group-hover:opacity-100 shadow-[1px_1px_0px_#000]"
          }`}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        {/* Star Button */}
        <button
          onClick={handleToggleStar}
          className={`absolute top-2 right-2 p-1.5 rounded-xl border-2 border-black transition-all ${
            asset.isStarred
              ? "bg-[#FFE27C] text-black shadow-[1px_1px_0px_#000] opacity-100"
              : "bg-white text-neutral-400 hover:text-black opacity-0 group-hover:opacity-100 shadow-[1px_1px_0px_#000]"
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${asset.isStarred ? "fill-[#FFAF1A] text-black" : "text-black"}`} />
        </button>
      </div>

      {/* Card Info */}
      <div className="p-3 bg-white rounded-b-2xl">
        <div className="flex items-start justify-between gap-1">
          <h4
            className="text-xs font-black text-black truncate"
            title={asset.name}
          >
            {asset.name}
          </h4>

          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 rounded-lg text-black hover:bg-[#FFE27C] border border-black/20 hover:border-black opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {menuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 bottom-full mb-1.5 w-36 p-1.5 rounded-2xl bg-white border-2 border-black shadow-[6px_6px_0px_#000] z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <button
                  onClick={handleShare}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold text-black hover:bg-[#6CC5F5] transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-black" />
                  <span>Share Link</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold text-black hover:bg-[#86EFAC] transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-black" />
                  <span>Download</span>
                </button>
                <button
                  onClick={handleRename}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold text-black hover:bg-[#FFE27C] transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-black" />
                  <span>Rename</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-600 font-mono font-bold">
          <span>{formatBytes(asset.size)}</span>
          <span>{formatDate(asset.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
