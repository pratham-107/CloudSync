import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectModalData,
  closeModal,
  addToast,
} from "../features/ui/uiSlice";
import { useCreateShareMutation } from "../services/apiSlice";
import {
  X,
  Share2,
  Copy,
  Check,
  Lock,
  Calendar,
  Eye,
  Link2,
} from "lucide-react";

export default function ShareModal() {
  const dispatch = useDispatch();
  const modalData = useSelector(selectModalData);
  const asset = modalData?.asset;

  const [createShare, { isLoading }] = useCreateShareMutation();

  const [expiryOption, setExpiryOption] = useState("7d");
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [maxAccess, setMaxAccess] = useState("");
  const [useMaxAccess, setUseMaxAccess] = useState(false);

  const [createdShare, setCreatedShare] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!asset) return null;

  const handleGenerateLink = async (e) => {
    e.preventDefault();

    let expiresAt = null;
    const now = new Date();
    if (expiryOption === "1h") {
      expiresAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
    } else if (expiryOption === "24h") {
      expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    } else if (expiryOption === "7d") {
      expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (expiryOption === "30d") {
      expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    }

    try {
      const response = await createShare({
        assetId: asset.assetId,
        expiresAt,
        password: usePassword && password ? password : null,
        maxAccess: useMaxAccess && maxAccess ? parseInt(maxAccess) : null,
      }).unwrap();

      setCreatedShare(response.data);
      dispatch(
        addToast({
          type: "success",
          message: "Shareable link created!",
        })
      );
    } catch (err) {
      console.error("Failed to create share:", err);
      dispatch(
        addToast({
          type: "error",
          message: err?.data?.error?.message || "Failed to create share link",
        })
      );
    }
  };

  const handleCopyLink = () => {
    if (!createdShare) return;
    const shareUrl = window.location.origin + "/s/" + createdShare.token;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    dispatch(addToast({ type: "success", message: "Link copied to clipboard" }));
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border-2 border-black rounded-3xl shadow-[8px_8px_0px_#000] p-6 sm:p-7 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-black">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#6CC5F5] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-black">Generate Secure Share Link</h3>
              <p className="text-xs text-neutral-600 truncate max-w-xs font-mono font-bold">{asset.name}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className="p-1.5 rounded-xl bg-white hover:bg-neutral-100 border-2 border-black shadow-[2px_2px_0px_#000] text-black"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content */}
        {!createdShare ? (
          <form onSubmit={handleGenerateLink} className="py-5 space-y-4">
            {/* Expiration Options */}
            <div>
              <label className="flex items-center gap-2 text-xs font-black uppercase text-black mb-2">
                <Calendar className="w-3.5 h-3.5 text-[#FFAF1A]" />
                <span>Link Expiration</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "1h", label: "1 Hour" },
                  { id: "24h", label: "24 Hours" },
                  { id: "7d", label: "7 Days" },
                  { id: "never", label: "Never" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setExpiryOption(opt.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono border-2 border-black transition-all ${
                      expiryOption === opt.id
                        ? "bg-[#FFE27C] text-black font-black shadow-[3px_3px_0px_#000] translate-x-0.5"
                        : "bg-white text-black hover:bg-[#FAF6EC] shadow-[1px_1px_0px_#000]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Password Protection */}
            <div className="p-4 rounded-2xl bg-[#FAF6EC] border-2 border-black space-y-2.5">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2 text-xs font-black uppercase text-black">
                  <Lock className="w-3.5 h-3.5 text-[#FFAF1A]" />
                  Password Protection
                </span>
                <input
                  type="checkbox"
                  checked={usePassword}
                  onChange={(e) => setUsePassword(e.target.checked)}
                  className="rounded border-2 border-black text-black w-4 h-4 accent-black"
                />
              </label>
              {usePassword && (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secret passcode"
                  required={usePassword}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-black text-xs font-mono font-bold text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6CC5F5]"
                />
              )}
            </div>

            {/* Max Access Limit */}
            <div className="p-4 rounded-2xl bg-[#FAF6EC] border-2 border-black space-y-2.5">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2 text-xs font-black uppercase text-black">
                  <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />
                  Limit Access Count
                </span>
                <input
                  type="checkbox"
                  checked={useMaxAccess}
                  onChange={(e) => setUseMaxAccess(e.target.checked)}
                  className="rounded border-2 border-black text-black w-4 h-4 accent-black"
                />
              </label>
              {useMaxAccess && (
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={maxAccess}
                  onChange={(e) => setMaxAccess(e.target.value)}
                  placeholder="e.g. 5 downloads maximum"
                  required={useMaxAccess}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-black text-xs font-mono font-bold text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6CC5F5]"
                />
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#6CC5F5] hover:bg-[#58B6EB] disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? "Generating Link..." : "Create Shareable Link"}
              </button>
            </div>
          </form>
        ) : (
          /* Result View */
          <div className="py-5 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 rounded-2xl bg-[#86EFAC] border-2 border-black text-black text-xs font-black flex items-center gap-2.5 shadow-[2px_2px_0px_#000]">
              <Check className="w-4 h-4 text-black stroke-[3] shrink-0" />
              <span>Public link generated with Zero-Trust authorization!</span>
            </div>

            {/* Copyable Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-black">Share URL</label>
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#FAF6EC] border-2 border-black shadow-[2px_2px_0px_#000]">
                <Link2 className="w-4 h-4 text-black shrink-0 ml-2" />
                <input
                  type="text"
                  readOnly
                  value={window.location.origin + "/s/" + createdShare.token}
                  className="flex-1 bg-transparent text-xs text-black font-mono font-bold focus:outline-none select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black text-xs font-black uppercase transition-all ${
                    copied
                      ? "bg-[#86EFAC] text-black"
                      : "bg-[#FFAF1A] hover:bg-[#FF9F00] text-black shadow-[2px_2px_0px_#000]"
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Details Summary */}
            <div className="p-3.5 rounded-2xl bg-white border-2 border-black text-xs text-neutral-800 space-y-1.5 font-mono font-bold shadow-[2px_2px_0px_#000]">
              <p>
                <strong className="text-black uppercase">Expires:</strong>{" "}
                {createdShare.expiresAt ? new Date(createdShare.expiresAt).toLocaleString() : "Never"}
              </p>
              {createdShare.maxAccess && (
                <p>
                  <strong className="text-black uppercase">Max Access Limit:</strong>{" "}
                  {createdShare.maxAccess} uses
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCreatedShare(null)}
                className="flex-1 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-xs text-black font-black uppercase transition-colors border-2 border-black shadow-[2px_2px_0px_#000]"
              >
                Create Another
              </button>
              <button
                onClick={() => dispatch(closeModal())}
                className="flex-1 py-2.5 rounded-xl bg-[#6CC5F5] hover:bg-[#58B6EB] text-xs text-black font-black uppercase transition-colors border-2 border-black shadow-[2px_2px_0px_#000]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
