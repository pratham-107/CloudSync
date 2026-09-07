import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentFolder } from "../features/folders/foldersSlice";
import { openModal } from "../features/ui/uiSlice";
import { formatDate } from "../utils/formatters";
import { Folder, MoreVertical, Edit2, Trash2 } from "lucide-react";

export default function FolderCard({ folder, viewMode = "grid" }) {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenFolder = () => {
    dispatch(
      setCurrentFolder({
        folderId: folder.folderId,
        name: folder.name,
        path: folder.path,
      })
    );
  };

  const handleRename = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    dispatch(
      openModal({
        type: "renameFolder",
        data: { folderId: folder.folderId, currentName: folder.name },
      })
    );
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    dispatch(
      openModal({
        type: "deleteFolder",
        data: { folderId: folder.folderId, name: folder.name },
      })
    );
  };

  if (viewMode === "list") {
    return (
      <div
        onClick={handleOpenFolder}
        className={`group flex items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-[#FAF6EC] border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer relative ${
          menuOpen ? "z-30" : ""
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-[#FFE27C] text-black border-2 border-black">
            <Folder className="w-4 h-4 fill-black" />
          </div>
          <div className="truncate">
            <h4 className="text-xs sm:text-sm font-black text-black truncate">
              {folder.name}
            </h4>
            <p className="text-[10px] text-neutral-600 font-mono font-bold">
              {folder.children?.length || 0} subdirectories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-[11px] font-mono font-bold text-neutral-600">
            {formatDate(folder.createdAt)}
          </span>
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1.5 rounded-lg text-black hover:bg-[#FFE27C] border border-black/20 hover:border-black transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
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
      </div>
    );
  }

  return (
    <div
      onClick={handleOpenFolder}
      className={`group relative flex flex-col justify-between p-4 rounded-2xl bg-white hover:bg-[#FAF6EC] border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer ${
        menuOpen ? "z-30" : "hover:z-10"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-xl bg-[#FFE27C] text-black border-2 border-black group-hover:scale-105 transition-transform">
          <Folder className="w-5 h-5 fill-black" />
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1 rounded-lg text-black hover:bg-[#FFE27C] border border-black/20 hover:border-black opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4" />
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

      <div>
        <h4 className="text-xs sm:text-sm font-black text-black group-hover:text-black truncate">
          {folder.name}
        </h4>
        <p className="text-[10px] text-neutral-600 font-mono font-bold mt-1">
          {folder.children?.length || 0} items
        </p>
      </div>
    </div>
  );
}
