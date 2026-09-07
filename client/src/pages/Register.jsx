import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRegisterMutation, useLoginMutation } from "../services/apiSlice";
import { setCredentials } from "../features/auth/authSlice";
import { addToast } from "../features/ui/uiSlice";
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
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

// Cartoon Cloud Component
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

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const isLoading = isRegistering || isLoggingIn;

  // Validation criteria
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password && password === confirmPassword;
  const isPasswordValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isPasswordValid) {
      setErrorMessage("Please meet all password security requirements.");
      return;
    }
    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      await register({ name, email, password }).unwrap();
      // Auto-login after registration
      const loginResponse = await login({ email, password }).unwrap();
      dispatch(setCredentials(loginResponse.data));
      dispatch(
        addToast({
          type: "success",
          message: "Account created successfully! Welcome to CloudSync.",
        })
      );
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Registration failed:", err);
      const msg =
        err?.data?.error?.message ||
        err?.error ||
        "Registration failed. Please try again.";
      setErrorMessage(msg);
    }
  };

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

      {/* Floating Cartoon Clouds */}
      <div className="absolute top-10 left-10 opacity-70 pointer-events-none hidden md:block">
        <CartoonCloud className="w-28 h-14" />
      </div>
      <div className="absolute bottom-12 right-12 opacity-70 pointer-events-none hidden md:block">
        <CartoonCloud className="w-36 h-18" />
      </div>

      {/* Top Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between relative z-10 py-2">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-[#FFAF1A] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_#000] transition-all">
            <DuckMascot className="w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tight text-black">CloudSync</span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-50 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto my-6 relative z-10">
        {/* Header Badge */}
        <div className="text-center mb-5 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border-2 border-black text-[11px] font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_#000]">
            <span className="w-2 h-2 rounded-full bg-[#86EFAC] border border-black animate-pulse" />
            5 GB Free Media Vault
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black">
            Create Free Account
          </h1>
          <p className="text-xs font-medium text-neutral-600">
            Instant S3 streaming, zero server bottlenecks, and time-expiring share links.
          </p>
        </div>

        {/* Neo-brutalist Card */}
        <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-7 shadow-[8px_8px_0px_#000] relative">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border-2 border-rose-500 flex items-start gap-2.5 text-xs text-rose-800 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono font-black uppercase tracking-wider text-black mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivers"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF6EC] border-2 border-black text-xs font-mono font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6CC5F5] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-black uppercase tracking-wider text-black mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF6EC] border-2 border-black text-xs font-mono font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6CC5F5] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-black uppercase tracking-wider text-black mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2 rounded-xl bg-[#FAF6EC] border-2 border-black text-xs font-mono font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6CC5F5] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-black p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-black uppercase tracking-wider text-black mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF6EC] border-2 border-black text-xs font-mono font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6CC5F5] transition-all"
                />
              </div>
            </div>

            {/* Password Requirements Checklist */}
            {password && (
              <div className="p-3 rounded-2xl bg-[#FAF6EC] border-2 border-black grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                <span
                  className={`flex items-center gap-1.5 font-bold ${
                    hasMinLength ? "text-emerald-700" : "text-neutral-500"
                  }`}
                >
                  {hasMinLength ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-neutral-400 stroke-[3]" />
                  )}{" "}
                  8+ Chars
                </span>
                <span
                  className={`flex items-center gap-1.5 font-bold ${
                    hasUppercase ? "text-emerald-700" : "text-neutral-500"
                  }`}
                >
                  {hasUppercase ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-neutral-400 stroke-[3]" />
                  )}{" "}
                  Uppercase
                </span>
                <span
                  className={`flex items-center gap-1.5 font-bold ${
                    hasLowercase ? "text-emerald-700" : "text-neutral-500"
                  }`}
                >
                  {hasLowercase ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-neutral-400 stroke-[3]" />
                  )}{" "}
                  Lowercase
                </span>
                <span
                  className={`flex items-center gap-1.5 font-bold ${
                    hasNumber ? "text-emerald-700" : "text-neutral-500"
                  }`}
                >
                  {hasNumber ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-neutral-400 stroke-[3]" />
                  )}{" "}
                  Number
                </span>
                <span
                  className={`flex items-center gap-1.5 font-bold ${
                    hasSpecial ? "text-emerald-700" : "text-neutral-500"
                  }`}
                >
                  {hasSpecial ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-neutral-400 stroke-[3]" />
                  )}{" "}
                  Special Char
                </span>
                <span
                  className={`flex items-center gap-1.5 font-bold ${
                    passwordsMatch ? "text-emerald-700" : "text-neutral-500"
                  }`}
                >
                  {passwordsMatch ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-neutral-400 stroke-[3]" />
                  )}{" "}
                  Match
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#6CC5F5] hover:bg-[#58B6EB] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000] transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <span>Create 5GB Free Vault</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t-2 border-black text-center">
            <p className="text-xs font-semibold text-neutral-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-black font-black underline hover:text-[#0088CC]"
              >
                Sign in to your vault →
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto w-full text-center text-[11px] font-mono font-bold text-neutral-500 py-3 relative z-10 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Pre-signed Direct S3 Security • AES-256 Storage</span>
      </footer>
    </div>
  );
}
