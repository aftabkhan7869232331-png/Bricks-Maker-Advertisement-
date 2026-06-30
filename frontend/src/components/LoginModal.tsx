import React, { useState } from "react";
import { X, ShieldCheck, Mail, Lock, CheckCircle2, Sparkles } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string, role: "Admin" | "User" | "Staff") => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);

    // Simulate login in 1100ms
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Determine role from presets
      let derivedRole: "Admin" | "User" | "Staff" = "Admin";
      if (email === "staff@brickmaker.com" && password === "staff123") {
        derivedRole = "Staff";
      } else if (email === "user@brickmaker.com" && password === "user123") {
        derivedRole = "User";
      }

      setTimeout(() => {
        onSuccess(email, derivedRole);
        setIsSuccess(false);
        setEmail("");
        setPassword("");
        onClose();
      }, 1500);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
      />

      {/* Modal Card */}
      <div 
        className="relative w-full max-w-md p-6 rounded-2xl border border-amber-500/20 bg-[#09090b] shadow-2xl overflow-hidden animate-fade-in"
        style={{
          boxShadow: "0 20px 50px rgba(251, 191, 36, 0.08)",
          animation: "fadeIn 0.3s ease-out forwards"
        }}
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
            <ShieldCheck size={16} />
            <span className="tracking-wide uppercase text-[11px]">Secure Platform Access</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-scale-in">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
              <CheckCircle2 size={32} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Access Token Initialized</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Welcome back to Brick-Maker Studio. Synergizing active campaigns...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white tracking-tight">Access Your Suite</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Enter your administrative credentials to manage private campaign budgets.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Administrative Email
                </label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="architect@brickmaker.com"
                    className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-amber-500/50 text-white text-xs outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Platform Password
                </label>
                <div className="relative">
                  <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-amber-500/50 text-white text-xs outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={13} className="animate-spin text-black" />
                    <span>Authorizing Portal...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    <span>Authorize & Decrypt Portal</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick pre-fill presets for testing */}
            <div className="pt-3 border-t border-white/5 space-y-1.5">
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">
                Quick testing presets (click to pre-fill)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("admin@brickmaker.com");
                    setPassword("admin123");
                  }}
                  className="py-1 px-2.5 rounded-md bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold transition-all text-center cursor-pointer"
                >
                  Admin Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("staff@brickmaker.com");
                    setPassword("staff123");
                  }}
                  className="py-1 px-2.5 rounded-md bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 text-[10px] font-bold transition-all text-center cursor-pointer"
                >
                  Staff Profile
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-between text-[10px] text-gray-500">
              <span className="hover:text-amber-400 cursor-pointer">Recover Secret Keys</span>
              <span>Loom v3.5-Active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple local spinner inside login button
function RefreshCw({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}
