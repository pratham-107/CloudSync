import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBreadcrumbs,
  navigateToBreadcrumb,
} from "../features/folders/foldersSlice";
import { ChevronRight, Home, Folder } from "lucide-react";

export default function Breadcrumbs() {
  const dispatch = useDispatch();
  const breadcrumbs = useSelector(selectBreadcrumbs);

  return (
    <nav className="flex items-center space-x-2 text-xs font-bold text-black overflow-x-auto py-1">
      {breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        const isFirst = idx === 0;

        return (
          <React.Fragment key={crumb.id || "root-" + idx}>
            {idx > 0 && <ChevronRight className="w-4 h-4 text-black stroke-[3] shrink-0" />}
            <button
              onClick={() => dispatch(navigateToBreadcrumb(crumb))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black transition-all whitespace-nowrap font-mono text-xs ${
                isLast
                  ? "text-black font-black bg-[#FFE27C] shadow-[2px_2px_0px_#000] pointer-events-none"
                  : "text-neutral-800 hover:text-black bg-white hover:bg-[#FAF6EC] shadow-[2px_2px_0px_#000] hover:translate-x-0.5"
              }`}
            >
              {isFirst ? (
                <Home className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              ) : (
                <Folder className="w-3.5 h-3.5 text-[#FFAF1A] fill-[#FFAF1A]" />
              )}
              <span>{crumb.name}</span>
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
