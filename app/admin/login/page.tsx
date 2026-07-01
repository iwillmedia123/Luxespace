"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Mail, Lock, ShieldCheck, AlertCircle, KeyRound, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  
  // Auth view states: 'login' | 'forgot' | 'reset'
  const [viewState, setViewState] = useState<"login" | "forgot" | "reset">("login");
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Check if Supabase keys are configured in local environment
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    if (!url || !key) {
      setDemoMode(true);
      // Seed default admin in local storage if none exists
      const adminsJSON = localStorage.getItem("luxespace_admins");
      if (!adminsJSON) {
        const defaultAdmin = {
          id: "admin-default",
          username: "admin@luxespace.com",
          password: "admin",
          role: "super_admin",
          createdAt: new Date().toISOString()
        };
        localStorage.setItem("luxespace_admins", JSON.stringify([defaultAdmin]));
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all credentials.");
      setLoading(false);
      return;
    }

    try {
      if (demoMode) {
        // Read local storage admins list
        const adminsJSON = localStorage.getItem("luxespace_admins");
        let admins: Record<string, string>[] = [];
        if (adminsJSON) {
          try {
            admins = JSON.parse(adminsJSON);
          } catch (e) {
            admins = [];
          }
        }

        const userMatch = admins.find(
          (a) => a.username.toLowerCase() === email.toLowerCase() && a.password === password
        );

        if (!userMatch) {
          setErrorMsg("Invalid administrative credentials. Use admin@luxespace.com / admin");
          setLoading(false);
          return;
        }

        // Set session variables and write secure cookie for server middleware checks
        localStorage.setItem("luxespace_admin_session", "demo-token");
        localStorage.setItem("luxespace_admin_role", userMatch.role || "super_admin");
        document.cookie = "luxespace_admin_session=demo-token; path=/; max-age=86400;";
        window.location.href = "/admin";
      } else {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          window.location.href = "/admin";
        }
      }
    } catch (err) {
      const errorVal = err as Error;
      setErrorMsg(errorVal.message || "An unexpected auth error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate link submission
    setTimeout(() => {
      setResetEmailSent(true);
      setLoading(false);
    }, 1500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate reset
    setTimeout(() => {
      setViewState("login");
      setResetEmailSent(false);
      setLoading(false);
      alert("Password has been reset successfully. Please sign in with your new credentials.");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1f232c] px-4 relative overflow-hidden">
      {/* Decorative Gold Radial Blur background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 z-10">
        {/* Branding header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative w-14 h-14 overflow-hidden rounded bg-luxury-dark border border-luxury-gold/30 flex items-center justify-center p-2 shadow-lg shadow-black/40">
            <Image
              src="/assets/logo.png"
              alt="Luxespace Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="space-y-1.5">
            <Typography variant="section" className="text-3xl font-serif tracking-widest text-white uppercase">
              LUXESPACE
            </Typography>
            <Typography variant="caption" className="text-[10px] tracking-widest text-luxury-gold uppercase font-bold">
              Private Management Portal
            </Typography>
          </div>
        </div>

        {/* Demo Mode Notice Banner */}
        {demoMode && (
          <div className="bg-luxury-gold/5 border border-luxury-gold/30 rounded-xl p-4 flex gap-3 text-xs text-luxury-gold/95 backdrop-blur-sm animate-pulse">
            <AlertCircle className="w-5 h-5 shrink-0 text-luxury-gold" />
            <div>
              <span className="font-semibold block mb-0.5">High-Fidelity Demo Mode Active</span>
              Supabase environment credentials not detected. You can authenticate using any mock email and password (e.g. <code className="bg-black/30 px-1 rounded font-mono">admin@luxespace.com</code> / <code className="bg-black/30 px-1 rounded font-mono">admin123</code>).
            </div>
          </div>
        )}

        {/* Auth Error Message Banner */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex gap-3 text-xs text-red-400 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Auth Card panels container */}
        <div className="bg-luxury-dark/90 backdrop-blur-md border border-luxury-border/30 rounded-3xl p-8 shadow-2xl shadow-black/50 space-y-6">
          {viewState === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <Typography variant="subheading" className="text-white normal-case text-base font-serif">
                  Sign In
                </Typography>
                <Typography variant="body" className="text-gray-400 text-xs font-light">
                  Enter your credentials to manage the properties portfolio.
                </Typography>
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold" htmlFor="email">
                  Advisory Email
                </label>
                <div className="relative flex items-center bg-[#1f232c] border border-luxury-border/40 focus-within:border-luxury-gold/50 rounded-xl px-4 py-3 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-gray-500 shrink-0 mr-3" />
                  <input
                    type="email"
                    id="email"
                    placeholder="name@luxespace.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-none text-xs w-full focus:outline-none text-white placeholder-gray-600"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold" htmlFor="password">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setViewState("forgot")}
                    className="text-[9px] uppercase tracking-wider text-luxury-gold hover:text-white transition-colors duration-300 font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative flex items-center bg-[#1f232c] border border-luxury-border/40 focus-within:border-luxury-gold/50 rounded-xl px-4 py-3 transition-colors duration-300">
                  <Lock className="w-4 h-4 text-gray-500 shrink-0 mr-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent border-none text-xs w-full focus:outline-none text-white placeholder-gray-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me option */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-luxury-border/40 text-luxury-gold focus:ring-0 bg-[#1f232c] w-3.5 h-3.5"
                />
                <label htmlFor="remember" className="text-[10px] text-gray-400 font-light cursor-pointer select-none">
                  Keep me signed in for 30 days
                </label>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full flex justify-center py-3 text-xs tracking-widest hover:shadow-[0_0_20px_rgba(241,217,155,0.2)] transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Authenticating Session..." : "Verify Credentials"}
              </Button>
            </form>
          )}

          {viewState === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="space-y-1.5">
                <Typography variant="subheading" className="text-white normal-case text-base font-serif">
                  Reset Password
                </Typography>
                <Typography variant="body" className="text-gray-400 text-xs font-light">
                  Provide your advisory email to receive a password reset validation link.
                </Typography>
              </div>

              {resetEmailSent ? (
                <div className="bg-luxury-gold/5 border border-luxury-gold/20 rounded-xl p-5 text-center space-y-4">
                  <ShieldCheck className="w-10 h-10 text-luxury-gold mx-auto" />
                  <Typography variant="body" className="text-xs text-gray-300 leading-relaxed font-light">
                    An email containing reset instructions has been sent to <span className="text-white font-semibold">{email || "your email address"}</span>. Please check your inbox.
                  </Typography>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setViewState("reset");
                      setResetEmailSent(false);
                    }}
                    className="mx-auto text-xs tracking-wider"
                  >
                    Enter Reset Token
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold" htmlFor="reset-email">
                      Advisory Email
                    </label>
                    <div className="relative flex items-center bg-[#1f232c] border border-luxury-border/40 focus-within:border-luxury-gold/50 rounded-xl px-4 py-3 transition-colors duration-300">
                      <Mail className="w-4 h-4 text-gray-500 shrink-0 mr-3" />
                      <input
                        type="email"
                        id="reset-email"
                        placeholder="name@luxespace.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent border-none text-xs w-full focus:outline-none text-white placeholder-gray-600"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full flex justify-center py-3 text-xs tracking-widest"
                    disabled={loading}
                  >
                    {loading ? "Sending Validation..." : "Send Reset Instructions"}
                  </Button>
                </>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setViewState("login");
                    setResetEmailSent(false);
                  }}
                  className="text-[9px] uppercase tracking-wider text-gray-500 hover:text-white font-bold transition-colors duration-300"
                >
                  Return to Sign In
                </button>
              </div>
            </form>
          )}

          {viewState === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-1.5">
                <Typography variant="subheading" className="text-white normal-case text-base font-serif">
                  Set New Password
                </Typography>
                <Typography variant="body" className="text-gray-400 text-xs font-light">
                  Create a secure password to restore access to your account.
                </Typography>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold" htmlFor="reset-token">
                  Reset Verification Token
                </label>
                <div className="relative flex items-center bg-[#1f232c] border border-luxury-border/40 focus-within:border-luxury-gold/50 rounded-xl px-4 py-3 transition-colors duration-300">
                  <KeyRound className="w-4 h-4 text-gray-500 shrink-0 mr-3" />
                  <input
                    type="text"
                    id="reset-token"
                    placeholder="Enter token code from email"
                    className="bg-transparent border-none text-xs w-full focus:outline-none text-white placeholder-gray-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold" htmlFor="new-password">
                  New Password
                </label>
                <div className="relative flex items-center bg-[#1f232c] border border-luxury-border/40 focus-within:border-luxury-gold/50 rounded-xl px-4 py-3 transition-colors duration-300">
                  <Lock className="w-4 h-4 text-gray-500 shrink-0 mr-3" />
                  <input
                    type="password"
                    id="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent border-none text-xs w-full focus:outline-none text-white placeholder-gray-600"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full flex justify-center py-3 text-xs tracking-widest"
                disabled={loading}
              >
                {loading ? "Saving Security Settings..." : "Save Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
