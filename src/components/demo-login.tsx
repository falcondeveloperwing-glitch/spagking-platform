"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpagKingLogo } from "@/components/brand";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import {
  Crown, User, ShoppingCart, Boxes, Users, Bike, ShieldCheck, BarChart3,
  Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Sparkles, Star, CheckCircle2,
} from "lucide-react";

const roles: { role: Role; name: string; desc: string; icon: any; accent: string }[] = [
  { role: "customer", name: "Customer", desc: "Order food, track delivery, earn rewards", icon: User, accent: "from-amber-500 to-yellow-600" },
  { role: "cashier", name: "Cashier", desc: "POS terminal, walk-in orders, receipts", icon: ShoppingCart, accent: "from-emerald-500 to-green-600" },
  { role: "manager", name: "Manager", desc: "Branch operations, staff, performance", icon: BarChart3, accent: "from-rose-500 to-pink-600" },
  { role: "inventory", name: "Inventory Officer", desc: "Stock, suppliers, purchase orders", icon: Boxes, accent: "from-cyan-500 to-blue-600" },
  { role: "hr", name: "HR Officer", desc: "Staff, payroll, attendance, leaves", icon: Users, accent: "from-violet-500 to-purple-600" },
  { role: "rider", name: "Delivery Rider", desc: "Live assignments, GPS, earnings", icon: Bike, accent: "from-orange-500 to-red-600" },
  { role: "admin", name: "Administrator", desc: "Branches, roles, integrations, audit", icon: ShieldCheck, accent: "from-slate-500 to-gray-600" },
  { role: "ceo", name: "CEO / Executive", desc: "Executive dashboard, P&L, growth", icon: Crown, accent: "from-amber-400 to-yellow-700" },
];

type AuthStep = "welcome" | "login" | "register" | "forgot" | "otp" | "success";

export function DemoLogin() {
  const login = useStore(s => s.login);
  const [tab, setTab] = useState<"demo" | "auth">("demo");
  const [authStep, setAuthStep] = useState<AuthStep>("login");
  const [showPwd, setShowPwd] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRole = (role: Role) => {
    setLoading(true);
    setTimeout(() => {
      login(role);
      toast.success(`Welcome back! Logged in as ${role}`, {
        description: "Loading your personalised workspace…",
      });
    }, 600);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (authStep === "login") { handleRole("customer"); return; }
      if (authStep === "register") { setAuthStep("otp"); setLoading(false); toast.success("Account created! Enter the OTP sent to your phone."); return; }
      if (authStep === "forgot") { setAuthStep("otp"); setLoading(false); toast.success("OTP sent to your registered phone."); return; }
      if (authStep === "otp") {
        if (otp.length < 6) { toast.error("Please enter the 6-digit code"); setLoading(false); return; }
        setAuthStep("success");
        setLoading(false);
        setTimeout(() => handleRole("customer"), 1400);
        return;
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-matte flex flex-col">
      {/* Floating ambient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-[480px] h-[480px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(212,160,23,0.25), transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-[520px] h-[520px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(212,160,23,0.18), transparent 70%)" }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.6, 0.4, 0.6] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Top bar */}
      <header className="relative z-10 px-6 sm:px-10 py-5 flex items-center justify-between">
        <SpagKingLogo size={44} />
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
          Premium Restaurant OS · Lagos · Abuja · Port Harcourt
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 pb-12">
        <div className="w-full max-w-6xl">
          <AnimatePresence mode="wait">
            {tab === "demo" ? (
              <motion.div key="demo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-10">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold text-xs font-medium mb-5">
                    <Crown className="w-3.5 h-3.5 text-[var(--gold)]" />
                    Demo Mode · All features unlocked
                  </motion.div>
                  <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight mb-3">
                    Choose your <span className="text-gold-gradient">SpagKing</span> experience
                  </h1>
                  <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                    One platform, eight role-based dashboards. Tap any role to instantly explore a fully-loaded workspace with realistic Nigerian demo data.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {roles.map((r, i) => (
                    <motion.button
                      key={r.role}
                      initial={{ opacity: 0, y: 24, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.05 * i, type: "spring", stiffness: 200 }}
                      whileHover={{ y: -6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRole(r.role)}
                      disabled={loading}
                      className="group relative text-left p-5 rounded-2xl glass-card card-hover overflow-hidden"
                    >
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${r.accent} opacity-0 group-hover:opacity-[0.12]`} />
                      <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${r.accent} flex items-center justify-center mb-4 shadow-lg`}>
                        <r.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="relative font-display font-bold text-base mb-1">{r.name}</h3>
                      <p className="relative text-xs text-muted-foreground leading-snug">{r.desc}</p>
                      <div className="relative mt-4 flex items-center gap-1 text-xs font-medium text-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity">
                        Enter dashboard <ArrowRight className="w-3 h-3" />
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <button onClick={() => setTab("auth")} className="text-sm text-muted-foreground hover:text-[var(--gold)] transition-colors inline-flex items-center gap-1.5">
                    Or go through the full customer authentication flow
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto">
                <button onClick={() => setTab("demo")} className="text-xs text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to role selection
                </button>

                <div className="glass-card rounded-3xl p-7 sm:p-8">
                  {/* Step indicator */}
                  {authStep !== "success" && (
                    <div className="flex items-center gap-2 mb-6 text-xs">
                      {["login", "register", "forgot", "otp"].includes(authStep) && (
                        ["Sign In", "Sign Up", "Reset", "Verify"].map((label, i) => {
                          const stepMap = ["login", "register", "forgot", "otp"];
                          const activeIdx = stepMap.indexOf(authStep);
                          return (
                            <div key={label} className="flex items-center gap-2">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i <= activeIdx ? "bg-gold-gradient text-black" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                              <span className={i === activeIdx ? "text-foreground font-medium" : "text-muted-foreground"}>{label}</span>
                              {i < 3 && <span className="w-4 h-px bg-border" />}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {authStep === "success" ? (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-6">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                          className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                          <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                        </motion.div>
                        <h2 className="font-display text-2xl font-bold mb-1">Verified!</h2>
                        <p className="text-sm text-muted-foreground">Taking you to your dashboard…</p>
                      </motion.div>
                    ) : (
                      <motion.form key={authStep} onSubmit={handleAuth} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="space-y-4">
                        <div className="mb-2">
                          <h2 className="font-display text-2xl font-bold mb-1">
                            {authStep === "login" && "Welcome back"}
                            {authStep === "register" && "Create your account"}
                            {authStep === "forgot" && "Reset password"}
                            {authStep === "otp" && "Verify your number"}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {authStep === "login" && "Sign in to your SpagKing account"}
                            {authStep === "register" && "Join SpagKing and start ordering"}
                            {authStep === "forgot" && "We'll send a code to your registered phone"}
                            {authStep === "otp" && "Enter the 6-digit code we sent you"}
                          </p>
                        </div>

                        {authStep === "otp" ? (
                          <div className="flex flex-col items-center gap-4 py-4">
                            <InputOTP value={otp} onChange={(v) => setOtp(v)} maxLength={6}>
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                            <p className="text-xs text-muted-foreground">Demo hint: enter any 6 digits</p>
                            <Button type="submit" className="btn-gold w-full h-11" disabled={loading}>
                              {loading ? "Verifying…" : "Verify & Continue"} <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            {authStep === "register" && (
                              <div className="grid grid-cols-2 gap-3">
                                <Field icon={User} placeholder="First name" defaultValue="Chidi" />
                                <Field icon={User} placeholder="Last name" defaultValue="Okafor" />
                              </div>
                            )}
                            <Field icon={Mail} placeholder="Email address" type="email" defaultValue="chidi@gmail.com" />
                            {authStep !== "forgot" && (
                              <div className="relative">
                                <Field icon={Lock} placeholder="Password" type={showPwd ? "text" : "password"} defaultValue="demo1234" />
                                <button type="button" onClick={() => setShowPwd(!showPwd)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            )}
                            {authStep === "register" && <Field icon={Phone} placeholder="Phone (+234…)" defaultValue="+234 802 111 2222" />}

                            {authStep === "login" && (
                              <div className="flex items-center justify-between text-xs">
                                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                                  <input type="checkbox" className="accent-[var(--gold)]" defaultChecked /> Remember me
                                </label>
                                <button type="button" onClick={() => setAuthStep("forgot")} className="text-[var(--gold)] hover:underline">Forgot password?</button>
                              </div>
                            )}

                            <Button type="submit" className="btn-gold w-full h-11" disabled={loading}>
                              {loading ? "Please wait…" : (
                                <>
                                  {authStep === "login" && "Sign In"}
                                  {authStep === "register" && "Create Account"}
                                  {authStep === "forgot" && "Send Reset Code"}
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              )}
                            </Button>

                            {authStep !== "forgot" && (
                              <>
                                <div className="relative my-2">
                                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                                  <div className="relative flex justify-center text-[10px] uppercase tracking-wider"><span className="bg-card px-3 text-muted-foreground">or continue with</span></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <Button type="button" variant="outline" onClick={() => handleRole("customer")} className="h-10">
                                    <GoogleIcon /> Google
                                  </Button>
                                  <Button type="button" variant="outline" onClick={() => handleRole("customer")} className="h-10">
                                    <Phone className="w-4 h-4" /> Phone
                                  </Button>
                                </div>
                              </>
                            )}

                            <div className="text-center text-sm text-muted-foreground pt-2">
                              {authStep === "login" ? (
                                <>New to SpagKing? <button type="button" onClick={() => setAuthStep("register")} className="text-[var(--gold)] font-medium hover:underline">Create account</button></>
                              ) : authStep === "register" ? (
                                <>Already have an account? <button type="button" onClick={() => setAuthStep("login")} className="text-[var(--gold)] font-medium hover:underline">Sign in</button></>
                              ) : (
                                <button type="button" onClick={() => setAuthStep("login")} className="text-[var(--gold)] font-medium hover:underline">← Back to sign in</button>
                              )}
                            </div>
                          </>
                        )}
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 text-[var(--gold)]" /> 4.8 rating</span>
                  <span>·</span>
                  <span>250+ customers</span>
                  <span>·</span>
                  <span>3 branches</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10 px-6 py-5 text-center text-xs text-muted-foreground">
        © 2026 SpagKing Foods Ltd · RC 1234567 · Lagos, Nigeria · All rights reserved
      </footer>
    </div>
  );
}

function Field({ icon: Icon, ...props }: { icon: any } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input {...props} className="pl-10 h-11 bg-input/50 border-border/50" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
