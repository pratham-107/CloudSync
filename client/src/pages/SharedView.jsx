import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLazyAccessShareQuery } from "../services/apiSlice";
import {
  formatBytes,
  getFileTypeCategory,
  isImage,
  isVideo,
  isAudio,
  downloadFile,
} from "../utils/formatters";
import {
  Download,
  Lock,
  ArrowRight,
  AlertCircle,
  FileText,
  HardDrive,
  Clock,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

// Duck Mascot Component
function DuckMascot({ className = "w-7 h-7" }) {
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

export default function SharedView() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [shareData, setShareData] = useState(null);

  const [triggerAccessShare, { isLoading }] = useLazyAccessShareQuery();

  const fetchShare = async (pwd = null) => {
    setErrorMessage("");
    try {
      const response = await triggerAccessShare({
        token,
        password: pwd,
      }).unwrap();
      setShareData(response.data);
      setPasswordRequired(false);
    } catch (err) {
      console.error("Access share error:", err);
      if (err?.status === 401) {
        setPasswordRequired(true);
        if (pwd) setErrorMessage("Incorrect password. Please try again.");
      } else if (err?.status === 410) {
        setErrorMessage("This share link has expired or the file is no longer available.");
      } else if (err?.status === 429) {
        setErrorMessage("This share link has reached its maximum access limit.");
      } else {
        setErrorMessage(
          err?.data?.error?.message || "Unable to access this shared link."
        );
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchShare();
    }
  }, [token]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!password) return;
    fetchShare(password);
  };

  const asset = shareData?.asset;
  const downloadUrl = shareData?.downloadUrl || asset?.s3Url;
  const fileCategory = asset ? getFileTypeCategory(asset.mimeType, asset.name) : "file";

  return (
    <div className="min-h-screen bg-[#FAF6EC] text-[#131418] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden selection:bg-[#6CC5F5] selection:text-black">
      {/* Subtle graph background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #E2D9C8 1px, transparent 1px), linear-gradient(to bottom, #E2D9C8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Header */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between py-2 relative z-10 border-b-2 border-black pb-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#FFAF1A] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
            <DuckMascot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-black tracking-tight text-black">CloudSync</span>
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] border border-black inline-block" />
            </div>
            <p className="text-[10px] text-neutral-600 font-mono font-bold uppercase">
              Zero-Trust Media Share
            </p>
          </div>
        </Link>

        <Link
          to="/login"
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-50 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
        >
          Sign In
        </Link>
      </header>

      {/* Main Body */}
      <main className="w-full max-w-xl mx-auto flex-1 flex flex-col items-center justify-center my-8 relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 text-center p-8 bg-white border-2 border-black rounded-3xl shadow-[6px_6px_0px_#000]">
            <div className="w-10 h-10 rounded-full border-4 border-black border-t-[#FFAF1A] animate-spin" />
            <p className="text-xs font-mono font-bold text-neutral-800">Verifying secure access token...</p>
          </div>
        ) : passwordRequired ? (
          /* Password Protected Card */
          <div className="w-full bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#000] space-y-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3.5 rounded-2xl bg-[#FFAF1A] border-2 border-black text-black shadow-[3px_3px_0px_#000]">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black uppercase text-black">Password Protected Asset</h2>
              <p className="text-xs font-medium text-neutral-600 max-w-sm">
                This share link is protected by zero-trust encryption. Please enter the access password.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-50 border-2 border-rose-500 text-xs text-rose-800 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-black uppercase tracking-wider text-black mb-1.5">
                  Security Password
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter link password"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6EC] border-2 border-black text-xs font-mono font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6CC5F5] transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#6CC5F5] hover:bg-[#58B6EB] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>Unlock & Stream File</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </form>
          </div>
        ) : errorMessage ? (
          /* Error / Expired View */
          <div className="w-full bg-white border-2 border-black rounded-3xl p-8 shadow-[8px_8px_0px_#000] text-center space-y-4">
            <div className="p-4 rounded-2xl bg-rose-100 border-2 border-rose-500 text-rose-600 w-14 h-14 mx-auto flex items-center justify-center shadow-[3px_3px_0px_#000]">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase text-black">Link Unavailable</h3>
              <p className="text-xs font-medium text-neutral-600 mt-2 max-w-sm mx-auto leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE27C] hover:bg-[#FFD750] border-2 border-black text-black text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Return Home</span>
            </Link>
          </div>
        ) : asset ? (
          /* Unlocked Asset Card */
          <div className="w-full bg-white border-2 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_#000] space-y-0">
            {/* Preview Banner */}
            <div className="w-full h-64 bg-[#181920] flex items-center justify-center p-4 overflow-hidden border-b-2 border-black relative">
              {isImage(asset.mimeType) && downloadUrl ? (
                <img
                  src={downloadUrl}
                  alt={asset.name}
                  className="max-h-full max-w-full object-contain rounded-xl shadow-lg"
                />
              ) : isVideo(asset.mimeType) && downloadUrl ? (
                <video
                  src={downloadUrl}
                  controls
                  className="max-h-full max-w-full rounded-xl shadow-lg"
                />
              ) : isAudio(asset.mimeType) && downloadUrl ? (
                <audio src={downloadUrl} controls className="w-full max-w-sm" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-neutral-300">
                  <div className="w-16 h-16 rounded-2xl bg-[#FFAF1A] border-2 border-black flex items-center justify-center text-black shadow-[3px_3px_0px_#000]">
                    <FileText className="w-8 h-8" />
                  </div>
                  <span className="text-xs uppercase tracking-wider font-mono font-bold text-white">
                    {fileCategory} File
                  </span>
                </div>
              )}
            </div>

            {/* Information & Download */}
            <div className="p-6 sm:p-7 space-y-5 bg-white">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-base font-black text-black truncate max-w-xs sm:max-w-md">
                    {asset.name}
                  </h2>
                  <div className="flex items-center gap-3 text-xs font-mono font-bold text-neutral-600 mt-1">
                    <span className="flex items-center gap-1 text-black">
                      <HardDrive className="w-3.5 h-3.5 text-[#FFAF1A]" />
                      {formatBytes(asset.size)}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{fileCategory}</span>
                  </div>
                </div>

                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-black bg-[#86EFAC] text-black border-2 border-black shrink-0 shadow-[2px_2px_0px_#000]">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified S3
                </span>
              </div>

              {shareData?.expiresIn && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF6EC] border-2 border-black text-xs font-mono font-bold text-neutral-700">
                  <Clock className="w-4 h-4 text-black shrink-0" />
                  <span>
                    Expires in {Math.ceil(shareData.expiresIn / 3600)} hour(s)
                  </span>
                </div>
              )}

              <button
                onClick={() => downloadFile(downloadUrl, asset.name)}
                className="w-full py-3.5 rounded-xl bg-[#6CC5F5] hover:bg-[#58B6EB] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 stroke-[3]" />
                <span>Download Asset</span>
              </button>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] font-mono font-bold text-neutral-500 relative z-10">
        CloudSync • Pre-Signed Direct S3 Streaming Infrastructure
      </footer>
    </div>
  );
}
