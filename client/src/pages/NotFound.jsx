import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Duck Mascot Component
function DuckMascot({ className = "w-12 h-12" }) {
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

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF6EC] text-[#131418] flex flex-col items-center justify-center p-4 sm:p-6 text-center relative overflow-hidden selection:bg-[#6CC5F5] selection:text-black">
      {/* Subtle graph background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #E2D9C8 1px, transparent 1px), linear-gradient(to bottom, #E2D9C8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-md w-full bg-white border-2 border-black rounded-3xl p-8 shadow-[8px_8px_0px_#000] relative z-10 space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-[#FFAF1A] border-2 border-black mx-auto flex items-center justify-center shadow-[4px_4px_0px_#000]">
          <DuckMascot className="w-14 h-14" />
        </div>

        <div>
          <div className="text-5xl sm:text-6xl font-black font-mono text-black tracking-tight mb-2">
            404
          </div>
          <h1 className="text-xl font-black uppercase tracking-tight text-black">
            Asset Vault Not Found
          </h1>
          <p className="text-xs font-medium text-neutral-600 mt-2">
            The media path, shared link, or workspace page you requested does not exist or has been moved.
          </p>
        </div>

        <Link
          to="/"
          className="w-full py-3 rounded-xl bg-[#6CC5F5] hover:bg-[#58B6EB] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
          <span>Return to CloudSync</span>
        </Link>
      </div>
    </div>
  );
}
