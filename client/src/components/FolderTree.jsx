import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentFolderId,
  selectExpandedFolderIds,
  setCurrentFolder,
  toggleExpandFolder,
} from "../features/folders/foldersSlice";
import { useGetFoldersQuery } from "../services/apiSlice";
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";

export default function FolderTree() {
  const { data: folders = [], isLoading } = useGetFoldersQuery(null);

  if (isLoading) {
    return (
      <div className="px-3 py-2 text-xs font-mono font-bold text-neutral-500 animate-pulse">
        Loading vault folders...
      </div>
    );
  }

  if (!folders || folders.length === 0) {
    return (
      <div className="px-3 py-2 text-xs font-mono font-semibold text-neutral-500">
        No folders created yet
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {folders.map((folder) => (
        <FolderTreeItem key={folder.folderId} folder={folder} level={0} />
      ))}
    </div>
  );
}

function FolderTreeItem({ folder, level = 0 }) {
  const dispatch = useDispatch();
  const currentFolderId = useSelector(selectCurrentFolderId);
  const expandedFolderIds = useSelector(selectExpandedFolderIds);

  const isExpanded = expandedFolderIds.includes(folder.folderId);
  const isSelected = currentFolderId === folder.folderId;
  const hasChildren = folder.children && folder.children.length > 0;

  const handleSelect = (e) => {
    e.stopPropagation();
    dispatch(
      setCurrentFolder({
        folderId: folder.folderId,
        name: folder.name,
        path: folder.path,
      })
    );
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    dispatch(toggleExpandFolder(folder.folderId));
  };

  return (
    <div>
      <div
        onClick={handleSelect}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        className={`group flex items-center justify-between pr-2 py-1.5 rounded-xl cursor-pointer text-xs font-bold transition-all select-none border ${
          isSelected
            ? "bg-[#FFE27C] text-black border-black shadow-[2px_2px_0px_#000] font-black"
            : "bg-white text-neutral-800 border-black/20 hover:border-black hover:bg-[#FAF6EC]"
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {hasChildren ? (
            <button
              onClick={handleToggle}
              className="p-0.5 rounded hover:bg-neutral-200 text-black"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
            </button>
          ) : (
            <span className="w-3.5" />
          )}

          {isSelected || isExpanded ? (
            <FolderOpen className="w-4 h-4 text-[#FFAF1A] fill-[#FFAF1A] shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-[#FFAF1A] shrink-0" />
          )}
          <span className="truncate">{folder.name}</span>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="space-y-1 mt-1">
          {folder.children.map((child) => (
            <FolderTreeItem
              key={child.folderId}
              folder={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
