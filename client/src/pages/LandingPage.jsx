import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import {
  Cloud,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Play,
  Share2,
  Lock,
  HardDrive,
  Shield,
  Code2,
  FileVideo,
  FileAudio,
  FileImage,
  FileText,
  ChevronDown,
  Zap,
  ExternalLink,
  BookOpen,
  ArrowUpRight,
  MessageSquare,
  Search,
  Globe,
  UploadCloud,
  FolderTree,
  Sliders,
  Eye,
  Clock,
  KeyRound,
  Layers,
} from "lucide-react";

// Duck Mascot Component
function DuckMascot({ className = "w-7 h-7" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Duck Head & Body */}
      <circle cx="52" cy="38" r="22" fill="#FFAF1A" stroke="#000000" strokeWidth="4" />
      <path
        d="M32 46C24 54 22 72 32 82C42 90 70 90 80 82C88 74 86 56 74 48C68 44 60 44 54 46"
        fill="#FFAF1A"
        stroke="#000000"
        strokeWidth="4"
      />
      {/* Wing */}
      <path
        d="M40 58C36 64 38 74 48 76C56 78 64 74 66 66C66 60 58 56 48 56C44 56 42 57 40 58Z"
        fill="#FF9500"
        stroke="#000000"
        strokeWidth="3.5"
      />
      {/* Beak */}
      <path
        d="M68 34C78 33 88 38 90 42C88 46 76 48 66 45Z"
        fill="#FF5500"
        stroke="#000000"
        strokeWidth="3.5"
      />
      {/* Eye with sparkle */}
      <circle cx="60" cy="32" r="5" fill="#000000" />
      <circle cx="62" cy="30" r="1.5" fill="#FFFFFF" />
      {/* Tiny Cloud puff */}
      <path
        d="M18 30C16 30 14 32 14 34C12 34 10 36 10 38C10 40 12 42 14 42H24C26 42 28 40 28 38C28 36 26 34 24 34C24 32 22 30 20 30H18Z"
        fill="#8AD2F8"
        stroke="#000000"
        strokeWidth="2.5"
      />
    </svg>
  );
}

// Cloud Cartoon Component
function CartoonCloud({ className = "w-24 h-12" }) {
  return (
    <svg viewBox="0 0 120 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 45C12 45 6 39 6 31C6 24 11 18 18 18C20 10 28 4 38 4C49 4 58 11 60 21C64 17 70 15 76 15C86 15 94 23 94 33C101 33 107 38 107 45C107 52 101 57 94 57H20C12 57 6 52 6 45"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LandingPage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activeHeroTab, setActiveHeroTab] = useState("VAULT");
  const [openAccordion, setOpenAccordion] = useState(0);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText("npx create-cloudsync-app my-vault");
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const architectureItems = [
    {
      title: "DIRECT S3 PRE-SIGNED HIGHWAYS",
      content:
        "Uploads and downloads stream directly between the client browser and AWS S3 storage via short-lived pre-signed signatures. Bypasses application server bottlenecks completely for wire-speed multi-gigabyte transfers.",
    },
    {
      title: "ZERO-TRUST SHAREABLE URLS",
      content:
        "Generate granular, time-expiring public share links with optional bcrypt password hashing, view counters, and instant revocation from your active links dashboard.",
    },
    {
      title: "IN-BROWSER 4K MEDIA PREVIEWERS",
      content:
        "High-performance native previewers for 4K H.264/WebM video, lossless audio waveforms, high-res RAW/PNG/SVG imagery, and multi-page PDF documents without downloading heavy files.",
    },
    {
      title: "NESTED VAULTS & STORAGE TELEMETRY",
      content:
        "Organize assets into infinite subfolder trees with instant drag-and-drop batch movements, breadcrumbs, search indexing, and real-time 5 GB storage quota accounting.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EC] text-[#131418] font-sans selection:bg-[#6CC5F5] selection:text-black">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#FFAF1A] border-b-2 border-black py-2 px-4 text-center text-xs font-bold text-black flex items-center justify-center gap-2">
        <span className="px-2 py-0.5 rounded-full bg-white border border-black text-[10px] uppercase tracking-wider font-black">
          NEW
        </span>
        <span>CloudSync 2.0 with Direct S3 Pre-signed Streaming & 5GB Free Storage is live!</span>
        <Link to="/register" className="underline hover:text-white transition-colors ml-1 font-extrabold inline-flex items-center gap-1">
          Claim your 5GB <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#FAF6EC]/95 backdrop-blur-md border-b-2 border-black px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#FFAF1A] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_#000] transition-all">
              <DuckMascot className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-black tracking-tight text-black">CloudSync</span>
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] border border-black inline-block" />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-neutral-800">
            <a href="#features" className="hover:text-[#0088CC] transition-colors flex items-center gap-1">
              Features <ChevronDown className="w-3.5 h-3.5" />
            </a>
            <a href="#architecture" className="hover:text-[#0088CC] transition-colors">
              Architecture
            </a>
            <a href="#features" className="hover:text-[#0088CC] transition-colors">
              Media Previews
            </a>
            <a href="#integrations" className="hover:text-[#0088CC] transition-colors">
              Tech Stack
            </a>
            <a href="#stories" className="hover:text-[#0088CC] transition-colors">
              Use Cases
            </a>
            <a href="#resources" className="hover:text-[#0088CC] transition-colors">
              Resources
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-[#86EFAC] hover:bg-[#6EE7B7] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#000] transition-all flex items-center gap-1.5"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-black uppercase tracking-wider text-black hover:text-[#0088CC] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-[#6CC5F5] hover:bg-[#58B6EB] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#000] transition-all flex items-center gap-1.5"
                >
                  <span>Start Free</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 border-b-2 border-black overflow-hidden">
        {/* Subtle graph background */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #E2D9C8 1px, transparent 1px), linear-gradient(to bottom, #E2D9C8 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border-2 border-black text-[11px] font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_#000]">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] border border-black animate-ping" />
              Direct S3 Media Asset Platform
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-black uppercase leading-[1.08]">
              Cloud Media <br />
              Storage Built <br />
              <span className="bg-[#6CC5F5] px-2 py-0.5 border-2 border-black inline-block shadow-[4px_4px_0px_#000] mt-1">
                For Speed.
              </span>
            </h1>

            <p className="text-sm sm:text-base font-medium text-neutral-700 leading-relaxed max-w-lg">
              Stream 4K video, scrub lossless audio, and share password-protected vaults at wire speed. Direct S3 pre-signed uploads bypass web server bottlenecks for instant file sync.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/register"
                className="px-6 py-3.5 rounded-xl bg-[#6CC5F5] hover:bg-[#58B6EB] text-black font-black text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000] transition-all flex items-center gap-2"
              >
                <span>Try 5GB Free</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>

              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-50 text-black font-black text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000] transition-all"
              >
                Launch Workspace
              </Link>
            </div>

            {/* CLI Quickstart */}
            <div className="pt-2">
              <div className="text-[11px] font-mono font-bold text-neutral-600 mb-1.5 flex items-center gap-2">
                <span>Or scaffold CloudSync in your project:</span>
                <DuckMascot className="w-4 h-4" />
              </div>

              <div className="flex items-center justify-between max-w-md bg-white border-2 border-black rounded-xl p-2 shadow-[3px_3px_0px_#000]">
                <code className="text-xs font-mono font-bold text-black pl-2 truncate">
                  npx create-cloudsync-app my-vault
                </code>
                <button
                  onClick={handleCopyInstall}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FFAF1A] hover:bg-[#FF9F00] text-black font-mono text-[11px] font-bold border border-black shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? "COPIED" : "COPY"}</span>
                </button>
              </div>
            </div>

            {/* Trusted by creative teams */}
            <div className="pt-6 border-t-2 border-black/20">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-neutral-500 block mb-3">
                TRUSTED BY CREATIVE TEAMS & STUDIOS
              </span>
              <div className="flex flex-wrap items-center gap-6 text-xs font-black tracking-tight text-neutral-800 opacity-90">
                <span className="flex items-center gap-1.5"><FileVideo className="w-4 h-4 text-[#FFAF1A]" /> PixelForge Studios</span>
                <span className="flex items-center gap-1.5"><FileAudio className="w-4 h-4 text-[#38BDF8]" /> EchoSound Labs</span>
                <span className="flex items-center gap-1.5"><FileImage className="w-4 h-4 text-[#86EFAC]" /> FrameShift</span>
                <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-[#F472B6]" /> RenderGrid</span>
                <span className="flex items-center gap-1.5"><HardDrive className="w-4 h-4 text-[#FFAF1A]" /> SyncVFX</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Studio Console Widget */}
          <div className="lg:col-span-6">
            <div className="bg-white border-2 border-black rounded-3xl p-4 sm:p-6 shadow-[8px_8px_0px_#000] relative">
              {/* Header Tabs */}
              <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
                <div className="flex items-center gap-1.5 bg-[#FAF6EC] p-1 rounded-xl border border-black overflow-x-auto">
                  {[
                    { id: "VAULT", label: "VAULT ASSETS" },
                    { id: "STREAM", label: "4K STREAM" },
                    { id: "SHARE", label: "ZERO-TRUST SHARE" },
                    { id: "QUOTA", label: "STORAGE QUOTA" },
                  ].map((tab) => {
                    const active = activeHeroTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveHeroTab(tab.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
                          active
                            ? "bg-black text-[#FFE27C] shadow-sm"
                            : "text-neutral-600 hover:text-black"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444] border border-black" />
                  <span className="w-3 h-3 rounded-full bg-[#EAB308] border border-black" />
                  <span className="w-3 h-3 rounded-full bg-[#22C55E] border border-black" />
                </div>
              </div>

              {/* Dynamic Tab 1: VAULT ASSETS */}
              {activeHeroTab === "VAULT" && (
                <div className="space-y-3">
                  <div className="bg-[#FAF6EC] border-2 border-black rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-800">
                      <Search className="w-4 h-4 text-neutral-500" />
                      <span>Filter: /Production/Season_02/4K_Exports/</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-[#FFAF1A] border border-black text-[10px] font-black">
                      4 ASSETS
                    </span>
                  </div>

                  <div className="bg-[#181920] border-2 border-black rounded-2xl p-3 text-xs font-mono text-neutral-200 space-y-2.5">
                    {/* Item 1 */}
                    <div className="p-2.5 rounded-xl bg-[#242632] border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#FFAF1A] border border-black flex items-center justify-center text-black font-bold">
                          <FileVideo className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-xs">cinematic_teaser_4k_hdr.mp4</div>
                          <div className="text-[10px] text-neutral-400 font-mono">1.84 GB • Video • Direct S3 Stream</div>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded bg-[#86EFAC]/20 border border-[#86EFAC]/40 text-[#86EFAC] text-[10px] font-bold">
                        READY
                      </span>
                    </div>

                    {/* Item 2 */}
                    <div className="p-2.5 rounded-xl bg-[#242632] border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#6CC5F5] border border-black flex items-center justify-center text-black font-bold">
                          <FileAudio className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-xs">master_soundtrack_96khz.flac</div>
                          <div className="text-[10px] text-neutral-400 font-mono">142.6 MB • Lossless Audio • Waveform</div>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded bg-[#6CC5F5]/20 border border-[#6CC5F5]/40 text-[#6CC5F5] text-[10px] font-bold">
                        READY
                      </span>
                    </div>

                    {/* Item 3 */}
                    <div className="p-2.5 rounded-xl bg-[#242632] border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#86EFAC] border border-black flex items-center justify-center text-black font-bold">
                          <FileImage className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-xs">hero_keyart_poster_fullres.png</div>
                          <div className="text-[10px] text-neutral-400 font-mono">28.4 MB • 8000x5000 • In-browser Zoom</div>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded bg-[#86EFAC]/20 border border-[#86EFAC]/40 text-[#86EFAC] text-[10px] font-bold">
                        READY
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Tab 2: 4K STREAM */}
              {activeHeroTab === "STREAM" && (
                <div className="space-y-3">
                  <div className="bg-[#181920] border-2 border-black rounded-2xl p-4 text-xs font-mono text-neutral-200 space-y-3">
                    <div className="relative aspect-video rounded-xl bg-black border border-white/20 flex flex-col items-center justify-center overflow-hidden">
                      {/* Video Player UI Mock */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded bg-black/70 border border-white/20 text-[10px] text-white">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span>S3 DIRECT STREAM • 4K UHD</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#FFAF1A] border-2 border-black flex items-center justify-center text-black shadow-lg cursor-pointer hover:scale-105 transition-transform">
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-neutral-300 bg-black/60 px-2 py-1 rounded">
                        <span>01:42 / 04:30</span>
                        <span>3840x2160 • 48 Mbps • H.264</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#242632] border border-white/10 text-[11px] space-y-1">
                      <div className="text-neutral-400">Pre-signed S3 Streaming URL:</div>
                      <div className="text-[#38BDF8] truncate">https://cloudsync-vault.s3.amazonaws.com/raw/cinematic_trailer.mp4?X-Amz-Signature=8f9a2e...</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Tab 3: ZERO-TRUST SHARE */}
              {activeHeroTab === "SHARE" && (
                <div className="space-y-3">
                  <div className="bg-[#FAF6EC] border-2 border-black rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-black text-black uppercase flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-[#FFAF1A]" />
                        CREATE SECURE SHARE LINK
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#86EFAC] border border-black text-[10px] font-bold">
                        AES-256
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2 bg-white rounded-xl border border-black">
                        <div className="text-[10px] text-neutral-500 font-bold">EXPIRATION</div>
                        <div className="font-black text-black">24 Hours (Custom)</div>
                      </div>
                      <div className="p-2 bg-white rounded-xl border border-black">
                        <div className="text-[10px] text-neutral-500 font-bold">PASSWORD GATE</div>
                        <div className="font-black text-black">Enabled (Bcrypt)</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white border border-black rounded-xl p-2 font-mono text-xs">
                      <span className="text-black font-bold truncate pr-2">
                        https://cloudsync.io/s/vault-9x4k7b
                      </span>
                      <button className="px-2.5 py-1 rounded bg-[#FFAF1A] border border-black font-black text-[10px] text-black">
                        COPY
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Tab 4: STORAGE QUOTA */}
              {activeHeroTab === "QUOTA" && (
                <div className="space-y-3">
                  <div className="bg-[#FAF6EC] border-2 border-black rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-mono font-black uppercase text-black">STORAGE USAGE</div>
                        <div className="text-lg font-black text-black">2.41 GB <span className="text-xs text-neutral-500 font-mono">/ 5.00 GB (48%)</span></div>
                      </div>
                      <span className="px-2 py-1 rounded-xl bg-[#86EFAC] border border-black text-xs font-black">
                        FREE TIER
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden border border-black flex">
                      <div className="h-full bg-[#FFAF1A]" style={{ width: "55%" }} title="Video (55%)" />
                      <div className="h-full bg-[#6CC5F5]" style={{ width: "20%" }} title="Audio (20%)" />
                      <div className="h-full bg-[#86EFAC]" style={{ width: "15%" }} title="Images (15%)" />
                      <div className="h-full bg-[#F472B6]" style={{ width: "10%" }} title="Docs (10%)" />
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
                      <div className="p-1 rounded bg-white border border-black"><span className="font-bold text-black">1.3 GB</span> Video</div>
                      <div className="p-1 rounded bg-white border border-black"><span className="font-bold text-black">480 MB</span> Audio</div>
                      <div className="p-1 rounded bg-white border border-black"><span className="font-bold text-black">360 MB</span> Images</div>
                      <div className="p-1 rounded bg-white border border-black"><span className="font-bold text-black">240 MB</span> Docs</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Console Footer */}
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-neutral-600 mt-4 pt-3 border-t-2 border-black">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 border border-black animate-pulse" />
                  <span>S3 EDGE REGION: AP-NORTHEAST-1</span>
                </div>
                <span className="text-black bg-[#FFE27C] px-2 py-0.5 rounded border border-black">
                  Zero Server Bottleneck ⚡
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SKY BLUE ARCHITECTURE SECTION (with cartoon clouds) */}
      <section id="architecture" className="bg-[#8AD2F8] border-b-2 border-black py-20 px-4 sm:px-8 relative overflow-hidden">
        {/* Floating Cartoon Clouds */}
        <div className="absolute top-8 left-12 opacity-80 pointer-events-none">
          <CartoonCloud className="w-28 h-14" />
        </div>
        <div className="absolute top-16 right-16 opacity-80 pointer-events-none">
          <CartoonCloud className="w-36 h-18" />
        </div>
        <div className="absolute bottom-10 left-1/4 opacity-70 pointer-events-none">
          <CartoonCloud className="w-24 h-12" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-12">
          {/* Section Header */}
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
              DIRECT-TO-S3 ARCHITECTURE
            </h2>
            <p className="text-sm font-medium text-black mt-2 leading-relaxed">
              Why route heavy 4K videos and loss-less sound files through traditional web servers? CloudSync gives every user direct pre-signed S3 highways for ultra-fast, unthrottled streaming.
            </p>
          </div>

          {/* Architecture Interactive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Accordion Column */}
            <div className="lg:col-span-5 space-y-3">
              {architectureItems.map((item, idx) => {
                const isOpen = openAccordion === idx;
                return (
                  <div
                    key={item.title}
                    className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenAccordion(isOpen ? -1 : idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-black text-xs sm:text-sm uppercase tracking-wide text-black hover:bg-neutral-50 transition-colors"
                    >
                      <span>{item.title}</span>
                      <span className="w-6 h-6 rounded-lg bg-[#FAF6EC] border border-black flex items-center justify-center font-black text-sm">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs font-medium text-neutral-700 leading-relaxed border-t border-black/10 pt-3">
                        {item.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Architecture Illustration Card */}
            <div className="lg:col-span-7">
              <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#000] space-y-6">
                {/* Visual Top Tier: Isolated Clients */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-[#FFE27C] border-2 border-black shadow-[3px_3px_0px_#000]">
                    <div className="text-[10px] font-black uppercase text-black">CREATOR CLIENT</div>
                    <div className="my-1 text-xs font-mono font-bold bg-white rounded-lg border border-black py-0.5">REACT 19</div>
                    <DuckMascot className="w-8 h-8 mx-auto mt-1" />
                  </div>

                  <div className="p-3 rounded-2xl bg-[#6CC5F5] border-2 border-black shadow-[3px_3px_0px_#000]">
                    <div className="text-[10px] font-black uppercase text-black">TEAM COLLAB</div>
                    <div className="my-1 text-xs font-mono font-bold bg-white rounded-lg border border-black py-0.5">REDUX STORE</div>
                    <div className="w-8 h-8 rounded-full bg-white border border-black mx-auto mt-1 flex items-center justify-center font-bold text-xs">👥</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#86EFAC] border-2 border-black shadow-[3px_3px_0px_#000]">
                    <div className="text-[10px] font-black uppercase text-black">PUBLIC VIEWERS</div>
                    <div className="my-1 text-xs font-mono font-bold bg-white rounded-lg border border-black py-0.5">ZERO-TRUST</div>
                    <div className="w-8 h-8 rounded-full bg-white border border-black mx-auto mt-1 flex items-center justify-center font-bold text-xs">🔒</div>
                  </div>
                </div>

                {/* Arrow Flow */}
                <div className="flex justify-center items-center gap-2 text-xs font-mono font-black text-black">
                  <span>↓↓↓ DIRECT S3 PRE-SIGNED HIGHWAYS (ZERO SERVER OVERLOAD) ↓↓↓</span>
                </div>

                {/* Shared Storage Base Layer */}
                <div className="p-4 rounded-2xl bg-[#FAF6EC] border-2 border-black shadow-[4px_4px_0px_#000]">
                  <div className="text-center font-mono font-black text-xs uppercase tracking-wider text-black mb-2">
                    AWS S3 STORAGE ENGINE & CLOUDFRONT CDN
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono font-bold text-neutral-800">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-black">
                      ⚡ Pre-Signed Streaming
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-black">
                      📁 Nested Vaults
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-black">
                      🛡️ Bcrypt Password Locks
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-black">
                      📊 5GB Free Quota
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Quote Card */}
          <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <span className="text-3xl font-serif text-[#FFAF1A]">“</span>
              <p className="text-sm sm:text-base font-semibold text-neutral-800 leading-relaxed -mt-4">
                Routing 4K video exports through standard Node servers was causing timeouts and throttling our editing studio. Switching to CloudSync's direct S3 streaming cut our client delivery time from hours to seconds.
              </p>
            </div>
            <div className="border-t-2 md:border-t-0 md:border-l-2 border-black pt-4 md:pt-0 md:pl-6 shrink-0">
              <div className="font-black text-sm text-black">PixelForge Studios</div>
              <div className="text-xs font-mono text-neutral-600">Marcus Vance</div>
              <div className="text-[10px] font-mono text-neutral-500">Head of Post-Production</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CREAM SERVERLESS AT THE FRONTIER GRID */}
      <section id="features" className="py-20 px-4 sm:px-8 border-b-2 border-black">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
              EVERYTHING YOUR MEDIA WORKFLOW NEEDS
            </h2>
            <p className="text-sm font-medium text-neutral-700 mt-2 leading-relaxed">
              From heavy raw camera footage to confidential client presentations, manage and stream your assets effortlessly.
            </p>
          </div>

          {/* 3 Neo-Brutalist Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: DIRECT S3 STREAMING */}
            <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <div className="px-3 py-1 rounded-xl bg-[#FFE27C] border-2 border-black font-black text-xs uppercase">
                    DIRECT S3
                  </div>
                  <UploadCloud className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-base font-black text-black uppercase">
                  Unthrottled S3 Uploads
                </h3>
                <p className="text-xs font-medium text-neutral-600 leading-relaxed">
                  Upload gigabyte-sized files directly from your browser to Amazon S3. Zero server bottlenecks, real-time chunk progress, and parallel asset queueing.
                </p>
              </div>

              <div className="bg-[#FAF6EC] border border-black rounded-xl p-3 font-mono text-[11px] space-y-1">
                <div className="flex justify-between text-neutral-500 text-[10px]">
                  <span>FILE</span>
                  <span>SPEED / STATUS</span>
                </div>
                <div className="flex justify-between font-bold text-black">
                  <span>b_roll_4k_hdr.mov</span>
                  <span className="text-emerald-600 font-black">94 MB/s (DONE)</span>
                </div>
                <div className="flex justify-between font-bold text-black">
                  <span>podcast_stem_01.wav</span>
                  <span className="text-emerald-600 font-black">82 MB/s (DONE)</span>
                </div>
              </div>

              <Link
                to="/register"
                className="inline-flex items-center gap-1 text-xs font-black uppercase text-black hover:text-[#0088CC] transition-colors"
              >
                Start Uploading <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: ZERO-TRUST SHARING */}
            <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <div className="px-3 py-1 rounded-xl bg-[#6CC5F5] border-2 border-black font-black text-xs uppercase">
                    ZERO-TRUST
                  </div>
                  <Share2 className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-base font-black text-black uppercase">
                  Secure Expiring Share Links
                </h3>
                <p className="text-xs font-medium text-neutral-600 leading-relaxed">
                  Generate secure URLs with custom expiration (1h, 24h, 7d), password protection, and view counting. Revoke access with a single click.
                </p>
              </div>

              <div className="bg-[#FAF6EC] border border-black rounded-xl p-3 font-mono text-[11px] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black">cloudsync.io/s/9x8f2a...</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#86EFAC] text-[9px] font-bold border border-black">PROTECTED</span>
                </div>
                <div className="text-[10px] text-neutral-500">Expires in 24h • Password: ••••••••</div>
              </div>

              <Link
                to="/register"
                className="inline-flex items-center gap-1 text-xs font-black uppercase text-black hover:text-[#0088CC] transition-colors"
              >
                Explore Sharing <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: MEDIA PREVIEWERS */}
            <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <div className="px-3 py-1 rounded-xl bg-[#86EFAC] border-2 border-black font-black text-xs uppercase">
                    PREVIEWS
                  </div>
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-base font-black text-black uppercase">
                  In-Browser Media Players
                </h3>
                <p className="text-xs font-medium text-neutral-600 leading-relaxed">
                  Preview video, audio, high-res images, and documents without third-party tools. Scrub audio waveforms, zoom into vector artwork, and flip through PDFs.
                </p>
              </div>

              <div className="bg-[#FAF6EC] border border-black rounded-xl p-3 font-mono text-[11px] space-y-1">
                <div className="flex justify-between items-center text-black font-bold">
                  <span>Playback Buffer Latency</span>
                  <span className="text-[#38BDF8] font-black">12ms (STREAMING)</span>
                </div>
                <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden border border-black">
                  <div className="h-full bg-[#86EFAC] w-11/12" />
                </div>
              </div>

              <Link
                to="/register"
                className="inline-flex items-center gap-1 text-xs font-black uppercase text-black hover:text-[#0088CC] transition-colors"
              >
                Try In Browser <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SUPPORTED MEDIA FORMATS & INTEGRATIONS */}
      <section id="integrations" className="py-20 px-4 sm:px-8 border-b-2 border-black bg-[#FAF6EC]">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
              BUILT FOR ALL YOUR MEDIA FORMATS
            </h2>
            <p className="text-sm font-medium text-neutral-700 leading-relaxed">
              Native streaming support across video, audio, image, and document standards.
            </p>
          </div>

          {/* Formats Badges */}
          <div className="py-4 flex flex-wrap justify-center items-center gap-3.5 max-w-4xl mx-auto">
            {[
              { name: "MP4 / H.264", bg: "#6CC5F5", type: "Video" },
              { name: "WebM 4K", bg: "#FFAF1A", type: "Video" },
              { name: "WAV Lossless", bg: "#86EFAC", type: "Audio" },
              { name: "MP3 / AAC", bg: "#FFE27C", type: "Audio" },
              { name: "PNG / WebP", bg: "#F472B6", type: "Image" },
              { name: "SVG Vectors", bg: "#38BDF8", type: "Vector" },
              { name: "PDF Multi-page", bg: "#FBBF24", type: "Docs" },
              { name: "ZIP Archives", bg: "#A7F3D0", type: "Archive" },
              { name: "AWS S3 Direct", bg: "#E879F9", type: "Storage" },
              { name: "React 19 + RTK", bg: "#6CC5F5", type: "Frontend" },
            ].map((tool) => (
              <div
                key={tool.name}
                style={{ backgroundColor: tool.bg }}
                className="px-4 py-2.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] font-mono font-black text-xs text-black hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#000] transition-all cursor-default flex items-center gap-2"
              >
                <span>{tool.name}</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 bg-black text-white rounded font-bold">
                  {tool.type}
                </span>
              </div>
            ))}
          </div>

          {/* Mascot Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFAF1A] border-2 border-black text-xs font-black text-black shadow-[3px_3px_0px_#000]">
            <DuckMascot className="w-5 h-5" />
            <span>CLOUDSYNC IS LIGHTNING FAST!</span>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMERS / USE CASES */}
      <section id="stories" className="bg-[#8AD2F8] border-b-2 border-black py-20 px-4 sm:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
              WHO USES CLOUDSYNC?
            </h2>
            <p className="text-sm font-medium text-black mt-2 leading-relaxed">
              From creative studios to software teams, CloudSync powers friction-free media workflows.
            </p>
          </div>

          {/* Use Case Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="font-black text-base text-black flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FFAF1A] border border-black" />
                  Video Producers & Filmmakers
                </div>
                <div className="text-2xl sm:text-3xl font-black text-black">
                  10x Faster
                </div>
                <p className="text-xs font-semibold text-neutral-800 leading-relaxed">
                  Deliver raw footage, color grades, and trailer cuts to clients with zero transcoding delays and instant in-browser 4K playback.
                </p>
              </div>
              <div className="text-[11px] font-mono font-bold text-black uppercase underline">
                EXPLORE VIDEO VAULTS →
              </div>
            </div>

            <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="font-black text-base text-black flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#6CC5F5] border border-black" />
                  Design & Branding Agencies
                </div>
                <div className="text-2xl sm:text-3xl font-black text-black">
                  Zero Trust
                </div>
                <p className="text-xs font-semibold text-neutral-800 leading-relaxed">
                  Share client design packages and brand guidelines securely with password-protected expiring links and instant view analytics.
                </p>
              </div>
              <div className="text-[11px] font-mono font-bold text-black uppercase underline">
                EXPLORE SECURE SHARING →
              </div>
            </div>

            <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="font-black text-base text-black flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#86EFAC] border border-black" />
                  Audio & Podcast Engineers
                </div>
                <div className="text-2xl sm:text-3xl font-black text-black">
                  96kHz Lossless
                </div>
                <p className="text-xs font-semibold text-neutral-800 leading-relaxed">
                  Scrub lossless audio waveforms in real time, review multi-track stems, and organize podcast seasons with nested folder trees.
                </p>
              </div>
              <div className="text-[11px] font-mono font-bold text-black uppercase underline">
                EXPLORE AUDIO STREAMING →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. DEVELOPER & API SECTION */}
      <section className="py-20 px-4 sm:px-8 border-b-2 border-black bg-[#FAF6EC]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
              DEVELOPER-READY STORAGE API
            </h2>
            <p className="text-sm font-medium text-neutral-700 mt-2 leading-relaxed">
              Integrate direct S3 pre-signed media uploads and programmatic share links directly into your apps.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Terminal Preview */}
            <div className="lg:col-span-6 bg-[#131418] border-2 border-black rounded-3xl p-5 shadow-[8px_8px_0px_#000] text-xs font-mono text-neutral-300 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#FFAF1A]" />
                  <span className="font-bold text-white">JavaScript / S3 Direct Upload</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  REST API
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/80 border border-white/10 text-neutral-300 font-mono text-[11px] leading-relaxed overflow-x-auto space-y-1">
                <div><span className="text-[#F472B6]">const</span> response = <span className="text-[#F472B6]">await</span> fetch(<span className="text-[#86EFAC]">'/api/assets/upload'</span>, &#123;</div>
                <div className="pl-4">method: <span className="text-[#86EFAC]">'POST'</span>,</div>
                <div className="pl-4">headers: &#123; <span className="text-[#86EFAC]">'Authorization'</span>: <span className="text-[#86EFAC]">`Bearer $&#123;token&#125;`</span> &#125;,</div>
                <div className="pl-4">body: formData,</div>
                <div>&#125;);</div>
                <div className="text-neutral-500 pt-2">&#47;&#47; File uploaded directly & quota updated</div>
                <div className="text-[#38BDF8]">const &#123; asset, quotaRemaining &#125; = await response.json();</div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 text-neutral-400">
                <span>Response Time: <strong className="text-white">42ms</strong></span>
                <span>Storage Left: <strong className="text-[#86EFAC]">2.59 GB</strong></span>
              </div>
            </div>

            {/* 3 Features Cards */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000]">
                <div className="flex items-center gap-2 font-black text-sm text-black uppercase mb-1">
                  <UploadCloud className="w-4 h-4 text-[#38BDF8]" />
                  <span>PRE-SIGNED S3 PROTOCOL</span>
                </div>
                <p className="text-xs font-medium text-neutral-700">
                  Request secure, scoped upload signatures to transfer multi-GB files directly to AWS S3 without consuming server bandwidth.
                </p>
              </div>

              <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000]">
                <div className="flex items-center gap-2 font-black text-sm text-black uppercase mb-1">
                  <KeyRound className="w-4 h-4 text-[#FFAF1A]" />
                  <span>EXPIRING SHARE TOKENS</span>
                </div>
                <p className="text-xs font-medium text-neutral-700">
                  Generate secure share tokens with custom TTLs, bcrypt passwords, and public view counters.
                </p>
              </div>

              <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000]">
                <div className="flex items-center gap-2 font-black text-sm text-black uppercase mb-1">
                  <FolderTree className="w-4 h-4 text-[#86EFAC]" />
                  <span>NESTED FOLDER HIERARCHIES</span>
                </div>
                <p className="text-xs font-medium text-neutral-700">
                  Manage complex folder structures, move assets with single REST calls, and maintain full path breadcrumbs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. RESOURCES & GUIDES */}
      <section id="resources" className="bg-[#FAF6EC] border-b-2 border-black py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
                RESOURCES & BEST PRACTICES
              </h2>
              <p className="text-xs font-medium text-neutral-600 mt-1">
                Guides, tutorials, and cloud storage architecture tips from the CloudSync team.
              </p>
            </div>

            <Link
              to="/register"
              className="px-4 py-2 rounded-xl bg-[#FFE27C] hover:bg-[#FFD750] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              VISIT DOCS →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Why Direct S3 Streaming Beats Traditional Proxy Uploads",
                date: "STORAGE ARCHITECTURE",
                bg: "#FFE27C",
              },
              {
                title: "Building Zero-Trust Share Links with Password Protection",
                date: "SECURITY & AUTH",
                bg: "#F472B6",
              },
              {
                title: "Optimizing 4K Video Playback in Modern Web Browsers",
                date: "MEDIA ENGINEERING",
                bg: "#6CC5F5",
              },
              {
                title: "Managing Quotas and Nested Folders at Scale with Redux",
                date: "REACT & REDUX",
                bg: "#86EFAC",
              },
            ].map((post) => (
              <div
                key={post.title}
                className="bg-white border-2 border-black rounded-3xl p-5 shadow-[5px_5px_0px_#000] flex flex-col justify-between space-y-4 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000] transition-all cursor-pointer"
              >
                <div
                  style={{ backgroundColor: post.bg }}
                  className="w-full h-32 rounded-2xl border-2 border-black flex items-center justify-center p-3 text-center font-black text-xs text-black"
                >
                  <DuckMascot className="w-12 h-12" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-black leading-snug uppercase">
                    {post.title}
                  </h4>
                  <p className="text-[10px] font-mono text-neutral-500 mt-2 font-bold">
                    {post.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-[#131418] text-white py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-xs">
            {/* Brand column */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFAF1A] border border-black flex items-center justify-center shadow-sm">
                  <DuckMascot className="w-5 h-5" />
                </div>
                <span className="text-xl font-black text-white">CloudSync</span>
              </div>
              <p className="text-neutral-400 text-xs max-w-xs font-medium leading-relaxed">
                Direct-to-S3 media asset manager with zero-trust share links, real-time in-browser previews, and 5GB free storage.
              </p>
              <div className="flex items-center gap-3 text-neutral-400">
                <a href="https://github.com" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors"><Code2 className="w-4 h-4" /></a>
                <a href="https://discord.com" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors"><MessageSquare className="w-4 h-4" /></a>
                <a href="https://cloudsync.io" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors"><Globe className="w-4 h-4" /></a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="space-y-2.5 font-mono">
              <div className="font-black text-white uppercase text-[11px] tracking-wider mb-2">CloudSync</div>
              <div><a href="#features" className="text-neutral-400 hover:text-white">Features</a></div>
              <div><a href="#architecture" className="text-neutral-400 hover:text-white">Architecture</a></div>
              <div><Link to="/login" className="text-neutral-400 hover:text-white">Sign In</Link></div>
              <div><Link to="/register" className="text-neutral-400 hover:text-white">Sign Up (5GB Free)</Link></div>
            </div>

            <div className="space-y-2.5 font-mono">
              <div className="font-black text-white uppercase text-[11px] tracking-wider mb-2">Product</div>
              <div><a href="#features" className="text-neutral-400 hover:text-white">Direct S3 Streaming</a></div>
              <div><a href="#features" className="text-neutral-400 hover:text-white">Zero-Trust Sharing</a></div>
              <div><a href="#features" className="text-neutral-400 hover:text-white">4K Media Players</a></div>
              <div><a href="#integrations" className="text-neutral-400 hover:text-white">Supported Formats</a></div>
            </div>

            <div className="space-y-2.5 font-mono">
              <div className="font-black text-white uppercase text-[11px] tracking-wider mb-2">Community</div>
              <div><a href="#resources" className="text-neutral-400 hover:text-white">Guides & Docs</a></div>
              <div><a href="https://discord.com" className="text-neutral-400 hover:text-white">Discord</a></div>
              <div><a href="https://github.com" className="text-neutral-400 hover:text-white">GitHub</a></div>
            </div>

            <div className="space-y-2.5 font-mono">
              <div className="font-black text-white uppercase text-[11px] tracking-wider mb-2">Security</div>
              <div><a href="#terms" className="text-neutral-400 hover:text-white">Zero-Trust Protocol</a></div>
              <div><a href="#terms" className="text-neutral-400 hover:text-white">Bcrypt Passwords</a></div>
              <div><a href="#terms" className="text-neutral-400 hover:text-white">Privacy Policy</a></div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-neutral-500 gap-4">
            <div>
              CloudSync is powered by direct S3 streaming architecture • © 2026 CloudSync, Inc.
            </div>
            <div className="flex items-center gap-4">
              <span>5GB Free Storage</span>
              <span>•</span>
              <span>Direct S3 Acceleration</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
