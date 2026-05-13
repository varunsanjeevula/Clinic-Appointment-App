"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Activity, CheckCircle2, AlertCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type ViewState = "login" | "signup" | "verify_signup" | "forgot_password" | "verify_reset";

export default function AuthPage() {
  const router = useRouter();
  const [view, setView] = useState<ViewState>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const resetForm = () => {
    setError("");
    setSuccess("");
    setOtp("");
  };

  const handleSwitchView = (newView: ViewState) => {
    resetForm();
    if (newView === "login" || newView === "signup") {
      setPassword("");
      setConfirmPassword("");
    }
    setView(newView);
  };

  const handleSendOTP = async (type: "signup" | "reset_password") => {
    setError("");
    setIsLoading(true);

    try {
      if (type === "signup") {
        if (!name || !email || !password || !confirmPassword) throw new Error("Please fill all fields");
        if (password !== confirmPassword) throw new Error("Passwords do not match");
        if (password.length < 6) throw new Error("Password must be at least 6 characters");
      } else {
        if (!email) throw new Error("Please enter your email address");
      }

      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess("OTP sent successfully! Please check your email.");
      setTimeout(() => {
        handleSwitchView(type === "signup" ? "verify_signup" : "verify_reset");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push("/");
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleVerifySignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Auto login after signup
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleVerifyReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!password || password !== confirmPassword) throw new Error("Passwords do not match");

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        handleSwitchView("login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden selection:bg-teal-500/30 dark:bg-background">
      
      {/* ---------------- LEFT PANEL (BRANDING) ---------------- */}
      <div className="hidden lg:flex w-1/2 relative bg-teal-900 overflow-hidden items-center justify-center p-12">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-600/30 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-400/20 blur-[120px]" />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="relative z-10 text-white max-w-xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20 mb-8 shadow-2xl">
              <Activity className="w-10 h-10 text-teal-300" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Reinventing <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-400">
                Patient Care.
              </span>
            </h1>
            <p className="text-lg text-teal-100/80 leading-relaxed font-medium mb-12">
              MedQueue seamlessly bridges the gap between intelligent AI triage and priority-based appointment scheduling. Experience the future of clinic management.
            </p>

            {/* Testimonial / Trust Badge */}
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-teal-900 bg-teal-${i*200} flex items-center justify-center text-xs font-bold text-teal-900 bg-teal-100`}>
                    D{i}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Trusted by 50+ Top Doctors</p>
                <div className="flex text-amber-400 text-sm mt-0.5">
                  {"★★★★★"}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ---------------- RIGHT PANEL (FORM) ---------------- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-8 sm:p-12 relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">MedQueue</span>
        </div>

        <div className="w-full max-w-md relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* ---------------- LOGIN VIEW ---------------- */}
              {view === "login" && (
                <form onSubmit={handleLogin} className="space-y-8">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">Welcome back</h2>
                    <p className="text-slate-500 mt-2">Please enter your details to sign in.</p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700">Email Address</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                        <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all rounded-xl" placeholder="you@example.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold text-slate-700">Password</Label>
                        <button type="button" onClick={() => handleSwitchView("forgot_password")} className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                        <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all rounded-xl" placeholder="••••••••" />
                      </div>
                    </div>
                  </div>

                  {error && <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-3 border border-red-100"><AlertCircle className="w-5 h-5"/>{error}</div>}

                  <Button type="submit" disabled={isLoading} className="w-full bg-slate-900 hover:bg-teal-600 text-white h-12 rounded-xl text-base font-semibold shadow-lg shadow-slate-200 transition-all duration-300">
                    {isLoading ? "Signing in..." : "Sign In"} <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>

                  <p className="text-center text-slate-500">
                    Don't have an account?{" "}
                    <button type="button" onClick={() => handleSwitchView("signup")} className="font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                      Create account
                    </button>
                  </p>
                </form>
              )}

              {/* ---------------- SIGNUP VIEW ---------------- */}
              {view === "signup" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h2>
                    <p className="text-slate-500 mt-2">Join us to manage your health intelligently.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700">Full Name</Label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                        <Input required value={name} onChange={e => setName(e.target.value)} className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all rounded-xl" placeholder="John Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700">Email Address</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                        <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all rounded-xl" placeholder="you@example.com" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Password</Label>
                        <div className="relative group">
                          <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                          <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all rounded-xl" placeholder="••••••••" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Confirm</Label>
                        <div className="relative group">
                          <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                          <Input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all rounded-xl" placeholder="••••••••" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-3 border border-red-100"><AlertCircle className="w-5 h-5"/>{error}</div>}

                  <Button onClick={() => handleSendOTP("signup")} disabled={isLoading} className="w-full bg-slate-900 hover:bg-teal-600 text-white h-12 rounded-xl text-base font-semibold shadow-lg shadow-slate-200 transition-all duration-300">
                    {isLoading ? "Preparing secure OTP..." : "Continue"} <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>

                  <p className="text-center text-slate-500">
                    Already have an account?{" "}
                    <button type="button" onClick={() => handleSwitchView("login")} className="font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                      Sign in
                    </button>
                  </p>
                </div>
              )}

              {/* ---------------- VERIFY SIGNUP / RESET VIEWS (Condensed) ---------------- */}
              {(view === "verify_signup" || view === "verify_reset" || view === "forgot_password") && (
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
                      <Mail className="w-8 h-8 text-teal-600" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                      {view === "forgot_password" ? "Reset Password" : "Verify Email"}
                    </h2>
                    <p className="text-slate-500 mt-2">
                      {view === "forgot_password" 
                        ? "Enter your email to receive a recovery code." 
                        : `We sent a secure code to ${email}`}
                    </p>
                  </div>

                  <form onSubmit={view === "verify_signup" ? handleVerifySignup : view === "verify_reset" ? handleVerifyReset : (e) => { e.preventDefault(); handleSendOTP("reset_password"); }} className="space-y-6">
                    {view === "forgot_password" && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Email Address</Label>
                        <div className="relative group">
                          <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                          <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all rounded-xl" placeholder="you@example.com" />
                        </div>
                      </div>
                    )}

                    {(view === "verify_signup" || view === "verify_reset") && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-slate-700 text-center block">Secure Code</Label>
                          <Input required value={otp} onChange={e => setOtp(e.target.value)} className="text-center text-3xl tracking-[0.4em] font-mono h-16 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all rounded-xl" placeholder="------" maxLength={6} />
                        </div>
                        {view === "verify_reset" && (
                           <div className="space-y-4 pt-4 border-t border-slate-100">
                             <div className="space-y-2">
                               <Label className="text-sm font-semibold text-slate-700">New Password</Label>
                               <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all rounded-xl" placeholder="••••••••" />
                             </div>
                             <div className="space-y-2">
                               <Label className="text-sm font-semibold text-slate-700">Confirm Password</Label>
                               <Input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all rounded-xl" placeholder="••••••••" />
                             </div>
                           </div>
                        )}
                      </div>
                    )}

                    {error && <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-3 border border-red-100"><AlertCircle className="w-5 h-5"/>{error}</div>}
                    {success && <div className="p-4 bg-teal-50 text-teal-700 text-sm rounded-xl flex items-center gap-3 border border-teal-100"><CheckCircle2 className="w-5 h-5"/>{success}</div>}

                    <Button type="submit" disabled={isLoading || ((view === "verify_signup" || view === "verify_reset") && otp.length !== 6)} className="w-full bg-slate-900 hover:bg-teal-600 text-white h-12 rounded-xl text-base font-semibold shadow-lg shadow-slate-200 transition-all duration-300">
                      {isLoading ? "Processing..." : view === "forgot_password" ? "Send Recovery Code" : "Verify & Continue"}
                    </Button>

                    <button type="button" onClick={() => handleSwitchView(view === "forgot_password" ? "login" : view === "verify_signup" ? "signup" : "forgot_password")} className="w-full flex items-center justify-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
