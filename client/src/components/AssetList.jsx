import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveAssetPreview,
  toggleSelectAsset,
  selectAllAssets,
  clearSelectedAssets,
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

export default function AssetList({ assets = [] }) {
  const dispatch = useDispatch();
  const selectedIds = useSelector(selectSelectedIds);

  const allSelected = assets.length > 0 && selectedIds.length === assets.length;

  const handleToggleSelectAll = () => {
    if (allSelected) {
      dispatch(clearSelectedAssets());
    } else {
      dispatch(selectAllAssets(assets.map((a) => a.assetId)));
    }
  };

  return (
    <div className="rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0px_#000] overflow-visible">
      <table className="w-full text-left text-xs text-black">
        <thead className="bg-[#FAF6EC] text-[10px] font-black uppercase tracking-widest text-black font-mono border-b-2 border-black">
          <tr>
            <th className="py-3.5 px-4 w-10 rounded-tl-2xl">
              <button
                onClick={handleToggleSelectAll}
                className={`w-4 h-4 rounded border-2 border-black flex items-center justify-center transition-all ${
                  allSelected
                    ? "bg-[#FFAF1A] text-black font-bold shadow-[1px_1px_0px_#000]"
                    : "bg-white text-transparent hover:border-black"
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </button>
            </th>
            <th className="py-3.5 px-4">Name</th>
            <th className="py-3.5 px-4 hidden md:table-cell">Type</th>
            <th className="py-3.5 px-4">Size</th>
            <th className="py-3.5 px-4 hidden sm:table-cell">Uploaded</th>
            <th className="py-3.5 px-4 text-right rounded-tr-2xl">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-black/10 font-medium">
          {assets.map((asset) => (
            <AssetListRow key={asset.assetId} asset={asset} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AssetListRow({ asset }) {
  const dispatch = useDispatch();
  const selectedIds = useSelector(selectSelectedIds);
  const [updateAsset] = useUpdateAssetMutation();

  const [menuOpen, setMenuOpen] = useState(false);
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
        return <FileImage className="w-4 h-4 text-[#FFAF1A]" />;
      case "video":
        return <FileVideo className="w-4 h-4 text-[#38BDF8]" />;
      case "audio":
        return <FileAudio className="w-4 h-4 text-[#86EFAC]" />;
      case "document":
      case "pdf":
        return <FileText className="w-4 h-4 text-[#F472B6]" />;
      case "spreadsheet":
        return <FileText className="w-4 h-4 text-[#34D399]" />;
      case "archive":
        return <FileArchive className="w-4 h-4 text-[#FBBF24]" />;
      default:
        return <File className="w-4 h-4 text-neutral-600" />;
    }
  };

  return (
    <tr
      onClick={() => dispatch(setActiveAssetPreview(asset))}
      className={`group hover:bg-[#FAF6EC] transition-colors cursor-pointer relative ${
        menuOpen ? "z-30 bg-[#FAF6EC]" : ""
      } ${
        isSelected ? "bg-[#FFE27C]/30" : ""
      }`}
    >
      <td className="py-3 px-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleSelectAsset(asset.assetId));
          }}
          className={`w-4 h-4 rounded border-2 border-black flex items-center justify-center transition-all ${
            isSelected
              ? "bg-[#FFAF1A] text-black font-bold shadow-[1px_1px_0px_#000]"
              : "bg-white text-transparent group-hover:border-black"
          }`}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </td>

      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-white border-2 border-black shadow-[1px_1px_0px_#000] shrink-0">
            {renderIcon()}
          </div>
          <div className="truncate max-w-xs sm:max-w-md">
            <span className="font-bold text-black group-hover:text-black truncate block text-xs">
              {asset.name}
            </span>
            {asset.tags && asset.tags.length > 0 && (
              <div className="flex gap-1 mt-0.5">
                {asset.tags.map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.2 text-[9px] font-mono font-bold rounded bg-[#FFE27C] text-black border border-black"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </td>

      <td className="py-3 px-4 hidden md:table-cell text-neutral-700 font-mono font-bold text-[11px] capitalize">
        {fileCategory}
      </td>

      <td className="py-3 px-4 text-neutral-700 font-mono font-bold text-[11px] whitespace-nowrap">
        {formatBytes(asset.size)}
      </td>

      <td className="py-3 px-4 hidden sm:table-cell text-neutral-700 font-mono font-bold text-[11px] whitespace-nowrap">
        {formatDate(asset.createdAt)}
      </td>

      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleToggleStar}
            className={`p-1.5 rounded-lg border border-transparent hover:border-black hover:bg-[#FFE27C] transition-colors ${
              asset.isStarred ? "text-black bg-[#FFE27C] border-black" : "text-neutral-500 hover:text-black"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${asset.isStarred ? "fill-[#FFAF1A] text-black" : "text-black"}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg text-black hover:bg-[#6CC5F5] border border-transparent hover:border-black transition-colors"
            title="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-black hover:bg-[#86EFAC] border border-transparent hover:border-black transition-colors"
            title="Download"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-black hover:bg-[#FAF6EC] border border-black/20 hover:border-black transition-colors"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {menuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-1 w-36 p-1.5 rounded-2xl bg-white border-2 border-black shadow-[6px_6px_0px_#000] z-50 animate-in fade-in zoom-in-95 duration-100"
              >
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
      </td>
    </tr>
  );
}
