import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetAssetsQuery,
  useGetFoldersQuery,
} from "../services/apiSlice";
import {
  selectViewMode,
  setViewMode,
  selectSortBy,
  selectSortOrder,
  setSort,
  selectSearchQuery,
  selectSelectedIds,
  clearSelectedAssets,
  selectFilterOnlyStarred,
  selectFilterType,
} from "../features/assets/assetsSlice";
import {
  selectCurrentFolderId,
} from "../features/folders/foldersSlice";
import {
  selectActiveModal,
  openModal,
} from "../features/ui/uiSlice";
import { useUpload } from "../hooks/useUpload";
import { getFileTypeCategory } from "../utils/formatters";

// Components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import FolderCard from "../components/FolderCard";
import AssetGrid from "../components/AssetGrid";
import AssetList from "../components/AssetList";
import AssetPreviewModal from "../components/AssetPreviewModal";
import ShareModal from "../components/ShareModal";
import CreateFolderModal from "../components/CreateFolderModal";
import RenameModal from "../components/RenameModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import UploadDrawer from "../components/UploadDrawer";

// Icons
import {
  LayoutGrid,
  List,
  FolderPlus,
  UploadCloud,
  ArrowUpDown,
  Trash2,
  X,
  FilePlus,
  Sparkles,
  Inbox,
} from "lucide-react";

export default function Dashboard() {
  const dispatch = useDispatch();
  const currentFolderId = useSelector(selectCurrentFolderId);
  const viewMode = useSelector(selectViewMode);
  const sortBy = useSelector(selectSortBy);
  const sortOrder = useSelector(selectSortOrder);
  const searchQuery = useSelector(selectSearchQuery);
  const selectedIds = useSelector(selectSelectedIds);
  const filterOnlyStarred = useSelector(selectFilterOnlyStarred);
  const filterType = useSelector(selectFilterType);
  const activeModal = useSelector(selectActiveModal);

  const { startUpload } = useUpload();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef(null);

  // Queries
  const { data: assetsData, isLoading: isLoadingAssets } = useGetAssetsQuery({
    folderId: currentFolderId,
    sort: sortBy,
    order: sortOrder,
    search: searchQuery,
  });

  const { data: folders = [] } =
    useGetFoldersQuery(currentFolderId);

  const rawAssets = assetsData?.assets || [];

  // Filter client-side for categories & starred if needed
  const filteredAssets = rawAssets.filter((asset) => {
    if (filterOnlyStarred && !asset.isStarred) return false;
    if (filterType !== "all") {
      const cat = getFileTypeCategory(asset.mimeType, asset.name);
      if (cat !== filterType) return false;
    }
    return true;
  });

  // Drag & Drop Handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      startUpload(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      startUpload(e.target.files);
      e.target.value = null;
    }
  };

  const handleBatchDelete = () => {
    dispatch(
      openModal({
        type: "batchDelete",
        data: { assetIds: selectedIds },
      })
    );
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex h-screen bg-[#FAF6EC] text-[#131418] overflow-hidden relative selection:bg-[#6CC5F5] selection:text-black font-sans"
    >
      {/* Subtle graph background overlay */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #E2D9C8 1px, transparent 1px), linear-gradient(to bottom, #E2D9C8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Drag overlay */}
      {isDraggingOver && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#8AD2F8]/90 backdrop-blur-md border-4 border-dashed border-black p-8 pointer-events-none animate-in fade-in duration-150">
          <div className="p-6 rounded-3xl bg-[#FFAF1A] text-black border-3 border-black shadow-[6px_6px_0px_#000] mb-4 animate-bounce">
            <UploadCloud className="w-16 h-16 stroke-[2.5]" />
          </div>
          <h2 className="text-3xl font-black text-black tracking-tight uppercase">
            Drop assets here to stream upload
          </h2>
          <p className="text-sm font-mono font-bold text-black mt-2">
            Direct S3 Pre-Signed Acceleration • Zero Server Delay
          </p>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <Navbar />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
          {/* Top Bar: Breadcrumbs & Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-black">
            <Breadcrumbs />

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Batch Actions Bar (when items selected) */}
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFE27C] border-2 border-black shadow-[2px_2px_0px_#000] text-black text-xs font-mono font-black animate-in fade-in duration-150">
                  <span>{selectedIds.length} selected</span>
                  <button
                    onClick={handleBatchDelete}
                    className="p-1 rounded-lg hover:bg-rose-100 text-rose-700 transition-colors"
                    title="Delete selected"
                  >
                    <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={() => dispatch(clearSelectedAssets())}
                    className="p-1 rounded-lg hover:bg-black/10 text-black"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              )}

              {/* View Mode Toggle (Grid / List) */}
              <div className="flex items-center p-1 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
                <button
                  onClick={() => dispatch(setViewMode("grid"))}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-[#6CC5F5] text-black border border-black shadow-sm font-bold"
                      : "text-neutral-600 hover:text-black"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => dispatch(setViewMode("list"))}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-[#6CC5F5] text-black border border-black shadow-sm font-bold"
                      : "text-neutral-600 hover:text-black"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Sort Order Selector */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-xs text-black font-mono font-bold">
                <ArrowUpDown className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    dispatch(setSort({ field, order }));
                  }}
                  className="bg-transparent text-xs text-black font-bold focus:outline-none cursor-pointer"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="size-desc">Largest First</option>
                  <option value="size-asc">Smallest First</option>
                </select>
              </div>

              {/* New Folder Button */}
              <button
                onClick={() =>
                  dispatch(
                    openModal({
                      type: "createFolder",
                      data: { parentId: currentFolderId },
                    })
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFE27C] border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-black font-black text-xs uppercase"
              >
                <FolderPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>New Folder</span>
              </button>

              {/* Upload Button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                multiple
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#6CC5F5] hover:bg-[#58B6EB] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <UploadCloud className="w-3.5 h-3.5 stroke-[3]" />
                <span>Upload</span>
              </button>
            </div>
          </div>

          {/* Folders Section */}
          {folders.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[11px] font-mono font-black uppercase tracking-wider text-neutral-700">
                Folders ({folders.length})
              </h3>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5"
                    : "space-y-2"
                }
              >
                {folders.map((folder) => (
                  <FolderCard
                    key={folder.folderId}
                    folder={folder}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Assets Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-mono font-black uppercase tracking-wider text-neutral-700">
                Files ({filteredAssets.length})
              </h3>
              {filterOnlyStarred && (
                <span className="text-xs text-black font-black font-mono flex items-center gap-1 px-2 py-0.5 bg-[#FFAF1A] border border-black rounded-lg">
                  <Sparkles className="w-3.5 h-3.5" /> Starred Only
                </span>
              )}
            </div>

            {isLoadingAssets ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-44 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_#000] animate-pulse"
                  />
                ))}
              </div>
            ) : filteredAssets.length > 0 ? (
              viewMode === "grid" ? (
                <AssetGrid assets={filteredAssets} />
              ) : (
                <AssetList assets={filteredAssets} />
              )
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-white border-2 border-black shadow-[6px_6px_0px_#000] text-center space-y-4">
                <div className="p-4 rounded-2xl bg-[#FFE27C] border-2 border-black text-black shadow-[2px_2px_0px_#000]">
                  <Inbox className="w-10 h-10 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-base font-black text-black uppercase tracking-tight">
                    {searchQuery
                      ? `No results matching "${searchQuery}"`
                      : filterOnlyStarred
                      ? "No starred assets yet"
                      : "This folder is empty"}
                  </h4>
                  <p className="text-xs font-medium text-neutral-600 mt-1 max-w-sm">
                    Drag and drop images, 4K videos, audio, or documents anywhere to stream upload them.
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6CC5F5] hover:bg-[#58B6EB] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <FilePlus className="w-4 h-4 stroke-[3]" />
                  <span>Choose Files</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Modals */}
      <AssetPreviewModal />
      {activeModal === "share" && <ShareModal />}
      {activeModal === "createFolder" && <CreateFolderModal />}
      {(activeModal === "renameFolder" || activeModal === "renameAsset") && (
        <RenameModal />
      )}
      {(activeModal === "deleteFolder" ||
        activeModal === "deleteAsset" ||
        activeModal === "batchDelete") && <DeleteConfirmModal />}

      {/* Floating Upload Queue Drawer */}
      <UploadDrawer />
    </div>
  );
}
