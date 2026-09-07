import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../features/ui/uiSlice";
import {
  selectSearchQuery,
  setSearchQuery,
} from "../features/assets/assetsSlice";
import { selectCurrentUser, selectIsAuthenticated, logout } from "../features/auth/authSlice";
import { useGetMeQuery } from "../services/apiSlice";
import { useUpload } from "../hooks/useUpload";
import { formatBytes } from "../utils/formatters";
import {
  Menu,
  Search,
  UploadCloud,
  User,
  LogOut,
  ChevronDown,
  X,
  HardDrive,
} from "lucide-react";

export default function Navbar() {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const reduxUser = useSelector(selectCurrentUser);
  const { startUpload } = useUpload();

  const { data: liveUser } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  const user = liveUser || reduxUser;
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      startUpload(e.target.files);
      e.target.value = null;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const storageUsed = user?.storageUsed || 0;
  const storageLimit = user?.storageLimit || 5368709120;
  const percentUsed = Math.min(100, Math.round((storageUsed / storageLimit) * 100));

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 md:px-7 bg-[#FAF6EC]/95 backdrop-blur-md border-b-2 border-black">
      {/* Left: Mobile Sidebar toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-black hover:bg-[#FFE27C] transition-all lg:hidden"
        >
          <Menu className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Neo-brutalist Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none stroke-[2.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search assets, tags, files..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-white border-2 border-black text-xs sm:text-sm text-black placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#6CC5F5] shadow-[2px_2px_0px_#000] transition-all font-mono font-bold"
          />
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(""))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Upload CTA & Profile Dropdown */}
      <div className="flex items-center gap-3">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          multiple
          className="hidden"
        />

        {/* Neo-Brutalist Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6CC5F5] hover:bg-[#58B6EB] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
        >
          <UploadCloud className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">Upload Files</span>
        </button>

        {/* User Account Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl bg-white hover:bg-[#FFE27C] border-2 border-black shadow-[2px_2px_0px_#000] transition-all"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#FFAF1A] border border-black text-black font-black text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-black text-black leading-tight">
                {user?.name || "Account"}
              </span>
              <span className="text-[10px] text-neutral-600 truncate max-w-[120px] font-mono font-bold">
                {user?.email || "user@cloudsync.io"}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 p-3 rounded-2xl bg-white border-2 border-black shadow-[6px_6px_0px_#000] z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="p-2 border-b-2 border-black pb-3 mb-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-black">{user?.name}</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#86EFAC] text-black border border-black">
                    FREE TIER
                  </span>
                </div>
                <p className="text-xs text-neutral-600 truncate font-mono mt-0.5 font-bold">{user?.email}</p>

                <div className="mt-3 pt-3 border-t border-black/10">
                  <div className="flex items-center justify-between text-xs text-neutral-700 font-bold mb-1.5">
                    <span className="flex items-center gap-1.5 text-black font-black">
                      <HardDrive className="w-3.5 h-3.5 text-[#FFAF1A]" />
                      Storage Meter
                    </span>
                    <span className="font-mono font-black text-black">{percentUsed}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 border border-black rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percentUsed}%` }}
                      className="h-full bg-[#6CC5F5] rounded-full transition-all duration-300"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-600 mt-1 text-right font-mono font-bold">
                    {formatBytes(storageUsed)} / {formatBytes(storageLimit)}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-black uppercase text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4 stroke-[2.5]" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
