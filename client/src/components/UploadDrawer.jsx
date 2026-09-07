import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUploadQueue,
  selectIsUploadDrawerOpen,
  selectIsUploadDrawerMinimized,
  setUploadDrawerOpen,
  toggleUploadDrawerMinimized,
  removeUpload,
  clearCompletedUploads,
} from "../features/uploads/uploadsSlice";
import { formatBytes } from "../utils/formatters";
import {
  UploadCloud,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";

export default function UploadDrawer() {
  const dispatch = useDispatch();
  const queue = useSelector(selectUploadQueue);
  const isOpen = useSelector(selectIsUploadDrawerOpen);
  const isMinimized = useSelector(selectIsUploadDrawerMinimized);

  if (!isOpen || queue.length === 0) return null;

  const totalCount = queue.length;
  const completedCount = queue.filter((u) => u.status === "done").length;
  const activeCount = queue.filter(
    (u) =>
      u.status === "uploading" ||
      u.status === "pending" ||
      u.status === "processing"
  ).length;

  return (
    <div className="fixed bottom-6 right-6 z-40 w-full max-w-sm bg-white border-2 border-black rounded-3xl shadow-[8px_8px_0px_#000] overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div
        onClick={() => dispatch(toggleUploadDrawerMinimized())}
        className="flex items-center justify-between px-4 py-3 bg-[#FAF6EC] border-b-2 border-black cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-[#6CC5F5] border-2 border-black text-black">
            {activeCount > 0 ? (
              <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
            ) : (
              <UploadCloud className="w-4 h-4 stroke-[2.5]" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-black leading-tight">
              {activeCount > 0
                ? `Streaming ${activeCount} file${activeCount > 1 ? "s" : ""}...`
                : `${completedCount} upload${completedCount > 1 ? "s" : ""} done`}
            </h4>
            <span className="text-[10px] text-neutral-600 font-mono font-bold">
              {completedCount} of {totalCount} uploaded
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {completedCount > 0 && !isMinimized && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(clearCompletedUploads());
              }}
              title="Clear finished"
              className="p-1 text-black hover:bg-white rounded-lg border border-transparent hover:border-black transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleUploadDrawerMinimized());
            }}
            className="p-1 text-black hover:bg-white rounded-lg border border-transparent hover:border-black transition-colors"
          >
            {isMinimized ? (
              <ChevronUp className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <ChevronDown className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setUploadDrawerOpen(false));
            }}
            className="p-1 text-black hover:bg-white rounded-lg border border-transparent hover:border-black transition-colors"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Upload Items List */}
      {!isMinimized && (
        <div className="max-h-64 overflow-y-auto divide-y-2 divide-black/10 p-2 space-y-1 bg-white">
          {queue.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-xl hover:bg-[#FAF6EC] transition-colors space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="font-bold text-black truncate max-w-[200px]"
                  title={item.name}
                >
                  {item.name}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === "done" && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-black text-emerald-700 bg-[#86EFAC] px-1.5 py-0.2 rounded border border-black">
                      <CheckCircle2 className="w-3 h-3 stroke-[3]" /> 100%
                    </span>
                  )}
                  {item.status === "error" && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-black text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded border border-rose-500">
                      <AlertCircle className="w-3 h-3" /> Failed
                    </span>
                  )}
                  {(item.status === "uploading" ||
                    item.status === "processing" ||
                    item.status === "pending") && (
                    <span className="text-[10px] font-mono font-black text-black bg-[#FFE27C] px-1.5 py-0.2 rounded border border-black">
                      {item.progress}%
                    </span>
                  )}

                  <button
                    onClick={() => dispatch(removeUpload(item.id))}
                    className="text-neutral-500 hover:text-black p-0.5 rounded"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-neutral-100 border border-black rounded-full overflow-hidden">
                <div
                  style={{ width: `${item.progress}%` }}
                  className={`h-full transition-all duration-200 ${
                    item.status === "done"
                      ? "bg-[#86EFAC]"
                      : item.status === "error"
                      ? "bg-rose-500"
                      : "bg-[#6CC5F5]"
                  }`}
                />
              </div>

              <div className="flex justify-between text-[10px] text-neutral-600 font-mono font-bold">
                <span>{formatBytes(item.size)}</span>
                {item.error && (
                  <span className="text-rose-600 truncate max-w-[180px]">
                    {item.error}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
