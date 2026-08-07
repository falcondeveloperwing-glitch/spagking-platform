"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Clock, Calendar, DollarSign, Star, Plus, Search, Fingerprint, GraduationCap, AlertCircle, TrendingUp, BarChart3 } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { employees, formatNaira } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const attendanceTrend = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  present: Math.floor(28 + Math.random() * 6),
  absent: Math.floor(Math.random() * 4),
}));

const payrollByDept = [
  { dept: "Kitchen", amount: 2_450_000 },
  { dept: "Front", amount: 1_820_000 },
  { dept: "Mgmt", amount: 3_200_000 },
  { dept: "Delivery", amount: 980_000 },
  { dept: "Finance", amount: 1_150_000 },
  { dept: "HR", amount: 720_000 },
  { dept: "Inv", amount: 640_000 },
];

export function StaffDashboard() {
  const [tab, setTab] = useState<"directory" | "attendance" | "shifts" | "leave" | "payroll" | "training" | "performance">("directory");
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState<string>("All");

  const depts = ["All", "Kitchen", "Front of House", "Management", "Delivery", "Finance", "HR", "Inventory"];
  const filtered = employees.filter(e =>
    (dept === "All" || e.department === dept) &&
    (e.name.toLowerCase().includes(query.toLowerCase()) || e.role.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI title="Total Staff" value={employees.length.toString()} sub="across 3 branches" icon={Users} accent="from-amber-500/20" />
        <KPI title="Present Today" value="28" sub="80% attendance" icon={Fingerprint} accent="from-emerald-500/20" />
        <KPI title="On Leave" value="3" sub="2 annual · 1 sick" icon={Calendar} accent="from-violet-500/20" />
        <KPI title="Monthly Payroll" value={formatNaira(10_960_000)} sub="due 28th" icon={DollarSign} accent="from-cyan-500/20" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-bold mb-1">Weekly attendance</h3>
          <p className="text-xs text-muted-foreground mb-3">Present vs absent</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={attendanceTrend} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <Tooltip contentStyle={{ background: "rgba(20,20,20,0.95)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: 12, color: "#fff" }} />
              <Line type="monotone" dataKey="present" stroke="#10B981" strokeWidth={2.5} dot={{ fill: "#10B981", r: 3 }} />
              <Line type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2} dot={{ fill: "#EF4444", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-bold mb-1">Payroll by department</h3>
          <p className="text-xs text-muted-foreground mb-3">Monthly · ₦</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={payrollByDept} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="dept" stroke="rgba(255,255,255,0.4)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
              <Tooltip cursor={{ fill: "rgba(212,160,23,0.08)" }} contentStyle={{ background: "rgba(20,20,20,0.95)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: 12, color: "#fff" }} />
              <Bar dataKey="amount" fill="#D4A017" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: "directory", label: "Directory", icon: Users },
          { id: "attendance", label: "Attendance", icon: Fingerprint },
          { id: "shifts", label: "Shift Planner", icon: Clock },
          { id: "leave", label: "Leave Requests", icon: Calendar },
          { id: "payroll", label: "Payroll", icon: DollarSign },
          { id: "training", label: "Training", icon: GraduationCap },
          { id: "performance", label: "Performance", icon: TrendingUp },
          { id: "disciplinary", label: "Disciplinary", icon: AlertCircle },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${tab === t.id ? "btn-gold" : "glass text-muted-foreground"}`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* Directory */}
      {tab === "directory" && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-3 flex items-center gap-2 border-b border-border/50 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search staff…" className="pl-10 h-9 bg-input/50" />
            </div>
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {depts.map(d => (
                <button key={d} onClick={() => setDept(d)}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium ${dept === d ? "btn-gold" : "bg-muted/40 text-muted-foreground"}`}>{d}</button>
              ))}
            </div>
            <Button size="sm" className="btn-gold" onClick={() => toast.success("New employee form opened")}><Plus className="w-3.5 h-3.5" /> Add</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left p-3 font-medium">Employee</th>
                  <th className="text-left p-3 font-medium hidden sm:table-cell">Role</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Branch</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Perf.</th>
                  <th className="text-right p-3 font-medium">Salary</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 15).map(e => (
                  <tr key={e.id} className="border-t border-border/30 hover:bg-muted/20">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img src={e.avatar} alt={e.name} className="w-8 h-8 rounded-lg bg-muted" />
                        <div>
                          <div className="font-medium text-xs">{e.name}</div>
                          <div className="text-[10px] text-muted-foreground">{e.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      <div className="text-xs font-medium">{e.role}</div>
                      <div className="text-[10px] text-muted-foreground">{e.department}</div>
                    </td>
                    <td className="p-3 hidden md:table-cell text-xs text-muted-foreground">{e.branch.replace("SpagKing ", "")}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${e.status === "active" ? "bg-emerald-500/20 text-emerald-400" : e.status === "on-leave" ? "bg-amber-500/20 text-amber-400" : e.status === "off-duty" ? "bg-muted text-muted-foreground" : "bg-red-500/20 text-red-400"}`}>
                        {e.status.replace("-", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Progress value={e.performance} className="w-12 h-1.5" />
                        <span className="text-[10px]">{e.performance}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-right text-xs font-semibold text-[var(--gold)]">{formatNaira(e.salary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendance */}
      {tab === "attendance" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {employees.slice(0, 12).map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <img src={e.avatar} alt={e.name} className="w-10 h-10 rounded-lg bg-muted" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{e.name}</div>
                  <div className="text-[10px] text-muted-foreground">{e.role}</div>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${i % 5 === 0 ? "bg-amber-400" : "bg-emerald-400 pulse-dot text-emerald-400"}`} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-muted/30 p-2">
                  <div className="text-[10px] text-muted-foreground">Clock In</div>
                  <div className="font-semibold">{i % 5 === 0 ? "—" : `0${7 + (i % 2)}:${(i * 7) % 60 < 10 ? "0" : ""}${(i * 7) % 60}`}</div>
                </div>
                <div className="rounded-lg bg-muted/30 p-2">
                  <div className="text-[10px] text-muted-foreground">Clock Out</div>
                  <div className="font-semibold">{i % 5 === 0 ? "—" : "Pending"}</div>
                </div>
                <div className="rounded-lg bg-muted/30 p-2 col-span-2">
                  <div className="text-[10px] text-muted-foreground">This week</div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{e.attendance}% present</span>
                    <span className="text-[10px] text-muted-foreground">{e.shift.split(" ")[0]}</span>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-3 text-xs"
                onClick={() => toast.success(`${i % 5 === 0 ? "Clocked in" : "Clocked out"}: ${e.name}`)}>
                <Fingerprint className="w-3.5 h-3.5" /> {i % 5 === 0 ? "Clock In" : "Clock Out"}
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Shifts */}
      {tab === "shifts" && (
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold">Weekly shift planner</h3>
            <Button size="sm" className="btn-gold" onClick={() => toast.success("Shift template applied")}><Plus className="w-3.5 h-3.5" /> Assign shift</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/30 text-muted-foreground">
                <tr>
                  <th className="text-left p-2 font-medium">Employee</th>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <th key={d} className="p-2 font-medium text-center">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 8).map((e, i) => (
                  <tr key={e.id} className="border-t border-border/30">
                    <td className="p-2 font-medium">{e.name.split(" ")[0]}</td>
                    {Array.from({ length: 7 }).map((_, j) => {
                      const shifts = ["M", "E", "N", "—", "M", "E", "—"];
                      const s = shifts[(j + i) % 7];
                      const colors: Record<string, string> = { M: "bg-amber-500/20 text-amber-400", E: "bg-violet-500/20 text-violet-400", N: "bg-cyan-500/20 text-cyan-400", "—": "bg-muted/30 text-muted-foreground" };
                      return <td key={j} className="p-1 text-center"><span className={`inline-block w-7 py-1 rounded font-bold ${colors[s]}`}>{s}</span></td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-3 mt-4 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500/30" /> Morning (7am-3pm)</span>
            <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-violet-500/30" /> Evening (3pm-11pm)</span>
            <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-cyan-500/30" /> Night (11pm-7am)</span>
            <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-muted/50" /> Off</span>
          </div>
        </div>
      )}

      {/* Leave */}
      {tab === "leave" && (
        <div className="space-y-3">
          {[
            { name: "Chidi Okoro", type: "Annual leave", days: 7, from: "Aug 12", to: "Aug 18", status: "pending" },
            { name: "Aisha Bello", type: "Sick leave", days: 2, from: "Aug 8", to: "Aug 9", status: "approved" },
            { name: "Tunde Sani", type: "Compassionate", days: 3, from: "Aug 15", to: "Aug 17", status: "pending" },
            { name: "Ngozi Eze", type: "Annual leave", days: 14, from: "Sep 1", to: "Sep 14", status: "approved" },
            { name: "Bashir Yusuf", type: "Study leave", days: 5, from: "Aug 20", to: "Aug 24", status: "rejected" },
          ].map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-4 flex items-center gap-3 flex-wrap">
              <div className="w-10 h-10 rounded-lg bg-[var(--gold)]/15 flex items-center justify-center"><Calendar className="w-5 h-5 text-[var(--gold)]" /></div>
              <div className="flex-1 min-w-[140px]">
                <div className="text-sm font-semibold">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.type} · {r.days} days · {r.from} → {r.to}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${r.status === "approved" ? "bg-emerald-500/20 text-emerald-400" : r.status === "pending" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"}`}>{r.status.toUpperCase()}</span>
              {r.status === "pending" && (
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success("Leave approved")}>Approve</Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-red-400" onClick={() => toast.success("Leave rejected")}>Reject</Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Payroll */}
      {tab === "payroll" && (
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold">Payroll summary · August 2026</h3>
              <p className="text-xs text-muted-foreground">Total: {formatNaira(10_960_000)} · 35 employees</p>
            </div>
            <Button size="sm" className="btn-gold" onClick={() => toast.success("Payroll run scheduled for 28th")}>Run payroll</Button>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {employees.slice(0, 15).map(e => {
              const net = Math.round(e.salary * 0.91);
              const tax = Math.round(e.salary * 0.07);
              const pension = Math.round(e.salary * 0.02);
              return (
                <div key={e.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <img src={e.avatar} alt={e.name} className="w-9 h-9 rounded-lg bg-muted" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{e.name}</div>
                    <div className="text-[10px] text-muted-foreground">{e.role} · Tax {formatNaira(tax)} · Pension {formatNaira(pension)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[var(--gold)]">{formatNaira(net)}</div>
                    <div className="text-[10px] text-muted-foreground">net pay</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Training */}
      {tab === "training" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: "Food Safety & Hygiene", enrolled: 18, completed: 14, due: "Aug 30", icon: "🥽" },
            { title: "Customer Service Excellence", enrolled: 12, completed: 8, due: "Sep 5", icon: "💼" },
            { title: "POS & Cash Handling", enrolled: 8, completed: 8, due: "Done", icon: "💳" },
            { title: "Allergen Awareness", enrolled: 22, completed: 19, due: "Aug 25", icon: "⚠️" },
            { title: "Fire Safety Drill", enrolled: 35, completed: 28, due: "Sep 1", icon: "🔥" },
            { title: "Wine & Beverage Pairing", enrolled: 6, completed: 3, due: "Sep 15", icon: "🍷" },
          ].map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-4">
              <div className="text-3xl mb-2">{t.icon}</div>
              <h4 className="font-semibold text-sm mb-1">{t.title}</h4>
              <p className="text-xs text-muted-foreground mb-3">Due {t.due}</p>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">{t.completed}/{t.enrolled} completed</span>
                <span className="font-semibold text-[var(--gold)]">{Math.round(t.completed / t.enrolled * 100)}%</span>
              </div>
              <Progress value={(t.completed / t.enrolled) * 100} className="h-1.5" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Performance */}
      {tab === "performance" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {employees.slice(0, 9).map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <img src={e.avatar} alt={e.name} className="w-10 h-10 rounded-lg bg-muted" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{e.name}</div>
                  <div className="text-[10px] text-muted-foreground">{e.role}</div>
                </div>
                <div className="flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" />
                  <span className="text-sm font-bold">{e.rating}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Metric label="Performance" value={e.performance} color="bg-emerald-500" />
                <Metric label="Attendance" value={e.attendance} color="bg-amber-500" />
                <Metric label="Punctuality" value={Math.min(100, e.attendance + 2)} color="bg-cyan-500" />
                <Metric label="Customer ratings" value={Math.round(e.rating * 20)} color="bg-violet-500" />
              </div>
              <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Last review: {Math.floor(Math.random() * 30) + 1} days ago</span>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success("Review form opened")}>Review</Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Disciplinary records */}
      {tab === "disciplinary" && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-3 flex items-center justify-between border-b border-border/50">
            <h3 className="font-semibold text-sm">Disciplinary Records</h3>
            <Button size="sm" className="btn-gold" onClick={() => toast.success("New disciplinary record form opened")}><Plus className="w-3.5 h-3.5" /> Log Incident</Button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs text-muted-foreground">
              <tr>
                <th className="text-left p-3 font-medium">Employee</th>
                <th className="text-left p-3 font-medium hidden sm:table-cell">Incident</th>
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-left p-3 font-medium">Severity</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Action</th>
                <th className="text-right p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Tunde Sani", incident: "Late arrival (3rd time)", date: "Aug 5", severity: "warning", action: "Verbal warning", status: "resolved" },
                { name: "Bisi Adewale", incident: "Improper food handling", date: "Aug 3", severity: "serious", action: "Written warning + retraining", status: "in-progress" },
                { name: "Hassan Aliyu", incident: "No-show without notice", date: "Jul 28", severity: "serious", action: "1-day suspension", status: "resolved" },
                { name: "Grace Eze", incident: "Customer complaint (rude behaviour)", date: "Jul 22", severity: "warning", action: "Verbal warning", status: "resolved" },
              ].map((r, i) => (
                <tr key={i} className="border-t border-border/30 hover:bg-muted/20">
                  <td className="p-3 text-xs font-medium">{r.name}</td>
                  <td className="p-3 hidden sm:table-cell text-xs text-muted-foreground">{r.incident}</td>
                  <td className="p-3 text-xs">{r.date}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${r.severity === "serious" ? "bg-[var(--error)]/15 text-[var(--error)]" : "bg-[var(--warning)]/15 text-[var(--warning)]"}`}>
                      {r.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 hidden md:table-cell text-xs text-muted-foreground">{r.action}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${r.status === "resolved" ? "bg-[var(--success)]/15 text-[var(--success)]" : "bg-[var(--warning)]/15 text-[var(--warning)]"}`}>
                      {r.status === "resolved" ? "RESOLVED" : "IN PROGRESS"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-0.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.6 }} className={`h-full ${color}`} />
      </div>
    </div>
  );
}

function KPI({ title, value, sub, icon: Icon, accent }: { title: string; value: string; sub: string; icon: any; accent: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className={`glass-card rounded-2xl p-4 bg-gradient-to-br ${accent} to-transparent`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{title}</span>
        <Icon className="w-4 h-4 text-[var(--gold)]" />
      </div>
      <div className="font-display font-bold text-xl sm:text-2xl mb-0.5">{value}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </motion.div>
  );
}
