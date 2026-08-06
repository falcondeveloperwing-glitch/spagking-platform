"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import {
  Crown, User, ShoppingCart, Boxes, Users, Bike, ShieldCheck, BarChart3,
  Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Sparkles, Star, CheckCircle2,
  UtensilsCrossed,
} from "lucide-react";

const roles: { role: Role; name: string; desc: string; icon: any; tag: string }[] = [
  { role: "customer", name: "Customer", desc: "Order, track & earn rewards", icon: User, tag: "Guest experience" },
  { role: "cashier", name: "Cashier", desc: "POS terminal & walk-in orders", icon: ShoppingCart, tag: "Front of house" },
  { role: "manager", name: "Manager", desc: "Branch ops & performance", icon: BarChart3, tag: "Operations" },
  { role: "inventory", name: "Inventory", desc: "Stock, suppliers, POs", icon: Boxes, tag: "Supply chain" },
  { role: "hr", name: "HR Officer", desc: "Staff, payroll, leaves", icon: Users, tag: "People" },
  { role: "rider", name: "Rider", desc: "Live assignments & earnings", icon: Bike, tag: "Delivery" },
  { role: "admin", name: "Administrator", desc: "Branches, roles, audit", icon: ShieldCheck, tag: "Governance" },
  { role: "ceo", name: "CEO", desc: "Executive P&L & growth", icon: Crown, tag: "Leadership" },
];

type AuthStep = "login" | "register" | "forgot" | "otp" | "success";

export function DemoLogin() {
  const login = useStore(s => s.login);
  const [tab, setTab] = useState<"demo" | "auth">("demo");
  const [authStep, setAuthStep] = useState<AuthStep>("login");
  const [showPwd, setShowPwd] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState<Role | null>(null);

  const handleRole = (role: Role) => {
    setLoading(true);
    setTimeout(() => {
      login(role);
      toast.success(`Welcome back`, {
        description: `Signed in as ${role} · Loading your workspace`,
      });
    }, 500);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (authStep === "login") { handleRole("customer"); return; }
      if (authStep === "register") { setAuthStep("otp"); toast.success("Account created · Enter the OTP sent to your phone"); return; }
      if (authStep === "forgot") { setAuthStep("otp"); toast.success("OTP sent to your registered phone"); return; }
      if (authStep === "otp") {
        if (otp.length < 6) { toast.error("Please enter the 6-digit code"); return; }
        setAuthStep("success");
        setTimeout(() => handleRole("customer"), 1400);
        return;
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-brand relative overflow-hidden">
      {/* Ambient breathing orbs */}
      <div className="pointer-events-none fixed inset-0">
        <motion.div
          className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(232,184,74,0.14), transparent 70%)" }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 right-1/4 w-[560px] h-[560px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(232,184,74,0.10), transparent 70%)" }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 11, repeat: Infinity }}
        />
      </div>

      {/* Editorial split layout */}
      <div className="relative z-10 min-h-screen grid lg:grid-cols-[1.1fr_1fr]">
        {/* Left — brand showcase */}
        <div className="hidden lg:flex flex-col justify-between p-12 xl:p-16 border-r border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/spagking-logo.svg" alt="SpagKing" className="w-11 h-11" />
              <span className="wordmark text-2xl">SpagKing</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] pulse-dot text-[var(--success)]" />
              All systems operational
            </div>
          </div>

          <div className="max-w-md">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-[11px] font-medium mb-6">
              <Sparkles className="w-3 h-3 text-[var(--gold)]" />
              The Premium Restaurant OS
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
              className="font-display text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05]">
              Royalty in <br/>
              <span className="text-gold-neon">every bowl.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }}
              className="mt-5 text-muted-foreground text-base leading-relaxed">
              One platform, eight role-based experiences. From the cashier terminal to the CEO dashboard — SpagKing unifies your entire restaurant in a single, luxurious ecosystem.
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="mt-10 grid grid-cols-3 gap-4">
              {[
                { stat: "250+", label: "Active customers" },
                { stat: "4.8★", label: "Average rating" },
                { stat: "3", label: "Branches in NG" },
              ].map(s => (
                <div key={s.label}>
                  <div className="font-display font-semibold text-2xl text-gold-gradient">{s.stat}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><UtensilsCrossed className="w-3.5 h-3.5 text-[var(--gold)]" /> 60+ signature dishes</span>
            <span className="inline-flex items-center gap-1.5"><Bike className="w-3.5 h-3.5 text-[var(--gold)]" /> 30-min delivery</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[var(--gold)]" /> Paystack secured</span>
          </div>
        </div>

        {/* Right — authentication panel */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden flex flex-col items-center mb-8">
              <img src="/spagking-logo.svg" alt="SpagKing" className="w-16 h-16 mb-2" />
              <span className="wordmark text-2xl">SpagKing</span>
            </div>

            <AnimatePresence mode="wait">
              {tab === "demo" ? (
                <motion.div key="demo" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="mb-7">
                    <h2 className="font-display text-2xl font-semibold tracking-tight">Choose your experience</h2>
                    <p className="text-sm text-muted-foreground mt-1">Tap any role to instantly explore a fully-loaded workspace.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {roles.map((r, i) => (
                      <motion.button
                        key={r.role}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 * i, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onMouseEnter={() => setHovered(r.role)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => handleRole(r.role)}
                        disabled={loading}
                        className="group relative p-4 rounded-2xl glass-card text-left overflow-hidden card-hover"
                      >
                        {/* Hover gold wash */}
                        <div className={`absolute inset-0 bg-gold-soft opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        <div className="relative">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-9 h-9 rounded-xl bg-foreground/[0.06] border border-border/60 flex items-center justify-center group-hover:bg-gold-gradient group-hover:border-transparent transition-all duration-300">
                              <r.icon className="w-4 h-4 text-muted-foreground group-hover:text-[#100D0A] transition-colors duration-300" />
                            </div>
                            <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider font-medium">{r.tag}</span>
                          </div>
                          <h3 className="relative font-display font-semibold text-sm leading-tight">{r.name}</h3>
                          <p className="relative text-[11px] text-muted-foreground mt-0.5 leading-snug">{r.desc}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <button onClick={() => setTab("auth")} className="text-xs text-muted-foreground hover:text-[var(--gold)] transition-colors inline-flex items-center gap-1.5">
                      Or walk through the full customer authentication flow
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="auth" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <button onClick={() => setTab("demo")} className="text-xs text-muted-foreground hover:text-foreground mb-5 inline-flex items-center gap-1.5 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to role selection
                  </button>

                  <div className="glass-card rounded-3xl p-7">
                    {authStep !== "success" && (
                      <div className="flex items-center gap-2 mb-5 text-[10px]">
                        {["login", "register", "forgot", "otp"].map((s, i) => {
                          const activeIdx = ["login", "register", "forgot", "otp"].indexOf(authStep);
                          return (
                            <div key={s} className="flex items-center gap-2">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors ${i <= activeIdx ? "bg-gold-gradient text-[#100D0A]" : "bg-foreground/[0.06] text-muted-foreground"}`}>{i + 1}</span>
                              <span className={`text-[10px] uppercase tracking-wider ${i === activeIdx ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{s === "login" ? "Sign in" : s === "register" ? "Sign up" : s === "forgot" ? "Reset" : "Verify"}</span>
                              {i < 3 && <span className="w-3 h-px bg-border" />}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      {authStep === "success" ? (
                        <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-6">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, delay: 0.1 }}
                            className="w-16 h-16 mx-auto rounded-full bg-[var(--success)]/15 flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-9 h-9 text-[var(--success)]" />
                          </motion.div>
                          <h2 className="font-display text-xl font-semibold mb-1">Verified</h2>
                          <p className="text-sm text-muted-foreground">Taking you to your dashboard…</p>
                        </motion.div>
                      ) : (
                        <motion.form key={authStep} onSubmit={handleAuth} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="space-y-4">
                          <div>
                            <h2 className="font-display text-xl font-semibold mb-1">
                              {authStep === "login" && "Welcome back"}
                              {authStep === "register" && "Create your account"}
                              {authStep === "forgot" && "Reset password"}
                              {authStep === "otp" && "Verify your number"}
                            </h2>
                            <p className="text-xs text-muted-foreground">
                              {authStep === "login" && "Sign in to your SpagKing account"}
                              {authStep === "register" && "Join SpagKing and start ordering"}
                              {authStep === "forgot" && "We'll send a code to your registered phone"}
                              {authStep === "otp" && "Enter the 6-digit code we sent you"}
                            </p>
                          </div>

                          {authStep === "otp" ? (
                            <div className="flex flex-col items-center gap-4 py-3">
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
                              <p className="text-[10px] text-muted-foreground">Demo hint: enter any 6 digits</p>
                              <Button type="submit" className="btn-gold w-full h-11" disabled={loading}>
                                {loading ? "Verifying…" : <>Verify & continue <ArrowRight className="w-4 h-4" /></>}
                              </Button>
                            </div>
                          ) : (
                            <>
                              {authStep === "register" && (
                                <div className="grid grid-cols-2 gap-2.5">
                                  <Field icon={User} placeholder="First name" defaultValue="Chidi" />
                                  <Field icon={User} placeholder="Last name" defaultValue="Okafor" />
                                </div>
                              )}
                              <Field icon={Mail} placeholder="Email address" type="email" defaultValue="chidi@gmail.com" />
                              {authStep !== "forgot" && (
                                <div className="relative">
                                  <Field icon={Lock} placeholder="Password" type={showPwd ? "text" : "password"} defaultValue="demo1234" />
                                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              )}
                              {authStep === "register" && <Field icon={Phone} placeholder="Phone (+234…)" defaultValue="+234 802 111 2222" />}

                              {authStep === "login" && (
                                <div className="flex items-center justify-between text-xs">
                                  <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                                    <input type="checkbox" className="accent-[var(--gold)] w-3.5 h-3.5 rounded" defaultChecked /> Remember me
                                  </label>
                                  <button type="button" onClick={() => setAuthStep("forgot")} className="text-[var(--gold)] hover:underline">Forgot password?</button>
                                </div>
                              )}

                              <Button type="submit" className="btn-gold w-full h-11" disabled={loading}>
                                {loading ? "Please wait…" : (
                                  <>
                                    {authStep === "login" && "Sign in"}
                                    {authStep === "register" && "Create account"}
                                    {authStep === "forgot" && "Send reset code"}
                                    <ArrowRight className="w-4 h-4" />
                                  </>
                                )}
                              </Button>

                              {authStep !== "forgot" && (
                                <>
                                  <div className="relative my-1">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                                    <div className="relative flex justify-center text-[10px] uppercase tracking-wider"><span className="bg-card px-3 text-muted-foreground">or continue with</span></div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2.5">
                                    <Button type="button" variant="outline" onClick={() => handleRole("customer")} className="h-10 bg-foreground/[0.03] border-border/60 hover:border-[var(--gold)]/30">
                                      <GoogleIcon /> Google
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => handleRole("customer")} className="h-10 bg-foreground/[0.03] border-border/60 hover:border-[var(--gold)]/30">
                                      <Phone className="w-4 h-4" /> Phone
                                    </Button>
                                  </div>
                                </>
                              )}

                              <div className="text-center text-xs text-muted-foreground pt-1">
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

                  <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 text-[var(--gold)] fill-[var(--gold)]" /> 4.8 rating</span>
                    <span className="opacity-40">·</span>
                    <span>250+ customers</span>
                    <span className="opacity-40">·</span>
                    <span>3 branches</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <footer className="relative z-10 px-6 py-5 text-center text-[11px] text-muted-foreground border-t border-border/30">
        © 2026 SpagKing Foods Ltd · RC 1234567 · Lagos, Nigeria
      </footer>
    </div>
  );
}

function Field({ icon: Icon, ...props }: { icon: any } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input {...props} className="pl-10 h-11 bg-foreground/[0.03] border-border/50 focus:border-[var(--gold)]/40 transition-colors" />
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
