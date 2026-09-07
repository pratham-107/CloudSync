import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSidebarOpen,
  openModal,
} from "../features/ui/uiSlice";
import {
  selectCurrentFolderId,
  setCurrentFolder,
} from "../features/folders/foldersSlice";
import {
  selectFilterOnlyStarred,
  setFilterOnlyStarred,
  selectFilterType,
  setFilterType,
} from "../features/assets/assetsSlice";
import { selectCurrentUser, selectIsAuthenticated } from "../features/auth/authSlice";
import { useGetMeQuery } from "../services/apiSlice";
import { formatBytes } from "../utils/formatters";
import FolderTree from "./FolderTree";
import {
  FolderOpen,
  Star,
  Plus,
  HardDrive,
  Image,
  Video,
  FileText,
  Music,
  Archive,
  Layers,
} from "lucide-react";

// Duck Mascot Component
function DuckMascot({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="52" cy="38" r="22" fill="#FFAF1A" stroke="#000000" strokeWidth="4" />
      <path
        d="M32 46C24 54 22 72 32 82C42 90 70 90 80 82C88 74 86 56 74 48C68 44 60 44 54 46"
        fill="#FFAF1A"
        stroke="#000000"
        strokeWidth="4"
      />
      <path
        d="M40 58C36 64 38 74 48 76C56 78 64 74 66 66C66 60 58 56 48 56C44 56 42 57 40 58Z"
        fill="#FF9500"
        stroke="#000000"
        strokeWidth="3.5"
      />
      <path
        d="M68 34C78 33 88 38 90 42C88 46 76 48 66 45Z"
        fill="#FF5500"
        stroke="#000000"
        strokeWidth="3.5"
      />
      <circle cx="60" cy="32" r="5" fill="#000000" />
      <circle cx="62" cy="30" r="1.5" fill="#FFFFFF" />
      <path
        d="M18 30C16 30 14 32 14 34C12 34 10 36 10 38C10 40 12 42 14 42H24C26 42 28 40 28 38C28 36 26 34 24 34C24 32 22 30 20 30H18Z"
        fill="#8AD2F8"
        stroke="#000000"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export default function Sidebar() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector(selectSidebarOpen);
  const currentFolderId = useSelector(selectCurrentFolderId);
  const filterOnlyStarred = useSelector(selectFilterOnlyStarred);
  const filterType = useSelector(selectFilterType);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const reduxUser = useSelector(selectCurrentUser);

  const { data: liveUser } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  const user = liveUser || reduxUser;
  const storageUsed = user?.storageUsed || 0;
  const storageLimit = user?.storageLimit || 5368709120;
  const usedPercentage = Math.min(100, Math.round((storageUsed / storageLimit) * 100));

  const handleAllFiles = () => {
    dispatch(setFilterOnlyStarred(false));
    dispatch(setFilterType("all"));
    dispatch(setCurrentFolder(null));
  };

  const handleStarred = () => {
    dispatch(setFilterOnlyStarred(true));
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-[#FAF6EC] border-r-2 border-black transition-transform duration-300 ease-in-out selection:bg-[#6CC5F5] ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:static lg:translate-x-0`}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 h-16 border-b-2 border-black bg-[#FAF6EC]">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#FFAF1A] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
            <DuckMascot className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-black tracking-tight">CloudSync</span>
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] border border-black animate-pulse" />
            </div>
            <span className="text-[10px] text-neutral-600 font-mono font-bold uppercase tracking-wider">
              Media Workspace
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {/* Main Nav */}
        <div className="space-y-1.5">
          <button
            onClick={handleAllFiles}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2 border-black ${
              !filterOnlyStarred && currentFolderId === null && filterType === "all"
                ? "bg-[#6CC5F5] text-black shadow-[3px_3px_0px_#000] translate-x-0.5"
                : "bg-white text-neutral-800 hover:bg-[#FFE27C] shadow-[2px_2px_0px_#000] hover:translate-x-0.5"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FolderOpen className="w-4 h-4 text-black" />
              <span>All Assets</span>
            </div>
            {!filterOnlyStarred && currentFolderId === null && filterType === "all" && (
              <span className="w-2 h-2 rounded-full bg-black" />
            )}
          </button>

          <button
            onClick={handleStarred}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2 border-black ${
              filterOnlyStarred
                ? "bg-[#FFAF1A] text-black shadow-[3px_3px_0px_#000] translate-x-0.5"
                : "bg-white text-neutral-800 hover:bg-[#FFE27C] shadow-[2px_2px_0px_#000] hover:translate-x-0.5"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className={`w-4 h-4 ${filterOnlyStarred ? "fill-black text-black" : "text-black"}`} />
              <span>Starred</span>
            </div>
            {filterOnlyStarred && <span className="w-2 h-2 rounded-full bg-black" />}
          </button>
        </div>

        {/* Categories */}
        <div>
          <div className="px-2 mb-2 text-[10px] font-black text-neutral-700 uppercase tracking-widest font-mono">
            Categories
          </div>
          <div className="space-y-1">
            {[
              { id: "all", label: "All Formats", icon: Layers, bg: "#FFE27C" },
              { id: "image", label: "Images", icon: Image, bg: "#86EFAC" },
              { id: "video", label: "Videos", icon: Video, bg: "#6CC5F5" },
              { id: "audio", label: "Audio", icon: Music, bg: "#FFAF1A" },
              { id: "document", label: "Documents", icon: FileText, bg: "#F472B6" },
              { id: "archive", label: "Archives", icon: Archive, bg: "#A7F3D0" },
            ].map((cat) => {
              const Icon = cat.icon;
              const isCatActive = filterType === cat.id && !filterOnlyStarred;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    dispatch(setFilterOnlyStarred(false));
                    dispatch(setFilterType(cat.id));
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-black ${
                    isCatActive
                      ? "bg-black text-white shadow-[2px_2px_0px_#000]"
                      : "bg-white text-neutral-800 hover:bg-[#FAF6EC] hover:shadow-[1px_1px_0px_#000]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Folders Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-black text-neutral-700 uppercase tracking-widest font-mono">
              Folders
            </span>
            <button
              onClick={() =>
                dispatch(
                  openModal({
                    type: "createFolder",
                    data: { parentId: currentFolderId },
                  })
                )
              }
              title="New Folder"
              className="p-1 rounded-lg bg-white hover:bg-[#FFE27C] border border-black shadow-[1px_1px_0px_#000] text-black transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
          <FolderTree />
        </div>
      </div>

      {/* Storage Quota Card */}
      <div className="p-3.5 border-t-2 border-black bg-[#FAF6EC]">
        <div className="p-3 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_#000]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-black uppercase">
              <HardDrive className="w-3.5 h-3.5 text-[#FFAF1A]" />
              <span>Storage Quota</span>
            </div>
            <span className="font-mono text-xs font-black text-black px-1.5 py-0.2 bg-[#FFE27C] border border-black rounded">
              {usedPercentage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-neutral-100 border border-black overflow-hidden mb-2">
            <div
              style={{ width: `${usedPercentage}%` }}
              className={`h-full transition-all duration-300 ${
                usedPercentage > 90 ? "bg-rose-500" : "bg-[#6CC5F5]"
              }`}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-neutral-700 font-mono font-bold">
            <span>{formatBytes(storageUsed)}</span>
            <span>{formatBytes(storageLimit)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
