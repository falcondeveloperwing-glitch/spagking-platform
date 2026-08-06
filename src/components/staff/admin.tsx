"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, ShieldCheck, Percent, DollarSign, Settings, QrCode, Plug, FileText, Plus, Search, Edit, Trash2, Check, X, MapPin, Clock } from "lucide-react";
import { branches, employees, formatNaira } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function AdminDashboard() {
  const [tab, setTab] = useState<"branches" | "users" | "roles" | "taxes" | "settings" | "tables" | "integrations" | "audit">("branches");

  return (
    <div className="space-y-5">
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: "branches", label: "Branches", icon: Building2 },
          { id: "users", label: "Users", icon: Users },
          { id: "roles", label: "Roles & Permissions", icon: ShieldCheck },
          { id: "taxes", label: "Taxes & Discounts", icon: Percent },
          { id: "settings", label: "Business Settings", icon: Settings },
          { id: "tables", label: "Tables & QR", icon: QrCode },
          { id: "integrations", label: "Integrations", icon: Plug },
          { id: "audit", label: "Audit Logs", icon: FileText },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${tab === t.id ? "btn-gold" : "glass text-muted-foreground"}`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* Branches */}
      {tab === "branches" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {branches.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-gold-gradient flex items-center justify-center"><Building2 className="w-5 h-5 text-black" /></div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${b.status === "open" ? "bg-emerald-500/20 text-emerald-400" : b.status === "busy" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"}`}>{b.status.toUpperCase()}</span>
              </div>
              <h3 className="font-display font-bold text-base mb-1">{b.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{b.address}</p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Manager</span><span>{b.manager}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{b.phone}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Today's revenue</span><span className="font-bold text-[var(--gold)]">{formatNaira(b.revenueToday)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Today's orders</span><span>{b.ordersToday}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Rating</span><span className="text-[var(--gold)]">★ {b.rating}</span></div>
              </div>
              <div className="flex gap-1.5 mt-3">
                <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => toast.success(`Editing ${b.name}`)}><Edit className="w-3 h-3" /> Edit</Button>
                <Button size="sm" variant="ghost" className="text-xs text-red-400" onClick={() => toast.success("Branch deactivated")}><Trash2 className="w-3 h-3" /></Button>
              </div>
            </motion.div>
          ))}
          <button onClick={() => toast.success("New branch form opened")}
            className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center gap-2 border-dashed border-2 border-border/50 hover:border-[var(--gold)]/40 transition-colors min-h-[260px]">
            <Plus className="w-8 h-8 text-[var(--gold)]" />
            <span className="text-sm font-medium">Add new branch</span>
          </button>
        </div>
      )}

      {/* Users */}
      {tab === "users" && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-3 flex items-center gap-2 border-b border-border/50">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search users…" className="pl-10 h-9 bg-input/50" />
            </div>
            <Button size="sm" className="btn-gold" onClick={() => toast.success("New user form opened")}><Plus className="w-3.5 h-3.5" /> Add User</Button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs text-muted-foreground">
              <tr>
                <th className="text-left p-3 font-medium">User</th>
                <th className="text-left p-3 font-medium hidden sm:table-cell">Role</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Branch</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.slice(0, 12).map(e => (
                <tr key={e.id} className="border-t border-border/30 hover:bg-muted/20">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img src={e.avatar} alt={e.name} className="w-8 h-8 rounded-lg bg-muted" />
                      <div>
                        <div className="font-medium text-xs">{e.name}</div>
                        <div className="text-[10px] text-muted-foreground">{e.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden sm:table-cell text-xs">{e.role}</td>
                  <td className="p-3 hidden md:table-cell text-xs text-muted-foreground">{e.branch.replace("SpagKing ", "")}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${e.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"}`}>{e.status.toUpperCase()}</span>
                  </td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success("Edit user")}>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Roles */}
      {tab === "roles" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { role: "Administrator", users: 2, color: "from-red-500/20", perms: ["Full access", "All modules", "Audit logs", "Settings"] },
            { role: "CEO / Executive", users: 1, color: "from-amber-500/20", perms: ["Executive dashboard", "Reports", "All branches", "P&L"] },
            { role: "Manager", users: 3, color: "from-rose-500/20", perms: ["Branch ops", "POS", "Staff", "Reports", "CRM"] },
            { role: "Cashier", users: 6, color: "from-emerald-500/20", perms: ["POS", "Walk-in orders", "Refunds", "Cash drawer"] },
            { role: "Inventory Officer", users: 2, color: "from-cyan-500/20", perms: ["Inventory", "Suppliers", "POs", "Waste log"] },
            { role: "HR Officer", users: 1, color: "from-violet-500/20", perms: ["Staff", "Payroll", "Leave", "Performance"] },
            { role: "Delivery Rider", users: 12, color: "from-orange-500/20", perms: ["Delivery", "Own earnings", "GPS"] },
            { role: "Customer", users: 250, color: "from-sky-500/20", perms: ["Order food", "Track", "Loyalty", "Reviews"] },
          ].map((r, i) => (
            <motion.div key={r.role} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className={`glass-card rounded-2xl p-4 bg-gradient-to-br ${r.color} to-transparent`}>
              <div className="flex items-start justify-between mb-2">
                <ShieldCheck className="w-5 h-5 text-[var(--gold)]" />
                <span className="text-[10px] text-muted-foreground">{r.users} users</span>
              </div>
              <h3 className="font-display font-bold text-sm mb-2">{r.role}</h3>
              <div className="space-y-1 mb-3">
                {r.perms.map(p => (
                  <div key={p} className="text-[10px] flex items-center gap-1.5">
                    <Check className="w-2.5 h-2.5 text-emerald-400" /> {p}
                  </div>
                ))}
              </div>
              <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => toast.success(`Editing ${r.role} permissions`)}>Edit permissions</Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Taxes & Discounts */}
      {tab === "taxes" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-bold mb-3">Tax configuration</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <div className="text-sm font-semibold">VAT (7.5%)</div>
                  <div className="text-[10px] text-muted-foreground">Applied to all orders</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <div className="text-sm font-semibold">Service charge (5%)</div>
                  <div className="text-[10px] text-muted-foreground">Dine-in only</div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <div className="text-sm font-semibold">Tourism levy (2%)</div>
                  <div className="text-[10px] text-muted-foreground">Optional</div>
                </div>
                <Switch />
              </div>
              <Button size="sm" className="btn-gold w-full" onClick={() => toast.success("Tax settings saved")}><Plus className="w-3.5 h-3.5" /> Add custom tax</Button>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-bold mb-3">Active discounts & coupons</h3>
            <div className="space-y-2">
              {[
                { code: "SPAG10", desc: "10% off all spaghetti", uses: 248, status: "active" },
                { code: "KING20", desc: "20% off orders above ₦10k", uses: 142, status: "active" },
                { code: "WELCOME", desc: "25% off first order", uses: 89, status: "active" },
                { code: "LAGOS15", desc: "15% off Lagos customers", uses: 67, status: "active" },
                { code: "GOLD50", desc: "50% off Gold members", uses: 23, status: "paused" },
              ].map(c => (
                <div key={c.code} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30">
                  <div className="w-10 h-10 rounded-lg bg-gold-gradient flex items-center justify-center text-black text-[10px] font-bold">{c.code.slice(0, 4)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold">{c.code}</div>
                    <div className="text-[10px] text-muted-foreground line-clamp-1">{c.desc}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold">{c.uses} uses</div>
                    <span className={`text-[9px] font-bold ${c.status === "active" ? "text-emerald-400" : "text-muted-foreground"}`}>{c.status.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" className="w-full mt-3" onClick={() => toast.success("New coupon form opened")}><Plus className="w-3.5 h-3.5" /> Create coupon</Button>
          </div>
        </div>
      )}

      {/* Settings */}
      {tab === "settings" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-bold mb-3">Business profile</h3>
            <div className="space-y-3">
              <Field label="Business name" value="SpagKing Foods Ltd" />
              <Field label="RC Number" value="RC 1234567" />
              <Field label="TIN" value="12345678-0001" />
              <Field label="Headquarters" value="12 Adeola Odeku St, Victoria Island, Lagos" />
              <Field label="Currency" value="₦ Nigerian Naira (NGN)" />
              <Field label="Timezone" value="Africa/Lagos (WAT)" />
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-bold mb-3">Opening hours</h3>
            <div className="space-y-2">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                <div key={day} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30">
                  <span className="text-sm">{day}</span>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked={day !== "Sunday"} />
                    <span className="text-xs text-muted-foreground">{day === "Sunday" ? "Closed" : "8:00 AM – 11:00 PM"}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button size="sm" className="btn-gold w-full mt-3" onClick={() => toast.success("Settings saved")}>Save changes</Button>
          </div>
        </div>
      )}

      {/* Tables & QR */}
      {tab === "tables" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold">Tables · Victoria Island</h3>
              <Button size="sm" className="btn-gold" onClick={() => toast.success("Add table")}><Plus className="w-3.5 h-3.5" /> Add</Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 24 }).map((_, i) => {
                const statuses = ["available", "occupied", "reserved", "cleaning"];
                const status = statuses[i % 4];
                return (
                  <div key={i} className={`relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    status === "available" ? "border-emerald-500/40 bg-emerald-500/10" :
                    status === "occupied" ? "border-red-500/40 bg-red-500/10" :
                    status === "reserved" ? "border-amber-500/40 bg-amber-500/10" : "border-muted bg-muted/20"
                  } hover:scale-105`}>
                    <span className="text-xs font-bold">T-{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[8px] text-muted-foreground capitalize">{status}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-bold mb-3">QR code management</h3>
            <div className="text-center mb-4">
              <div className="w-40 h-40 mx-auto rounded-2xl bg-white p-3 mb-3">
                <svg viewBox="0 0 25 25" className="w-full h-full">
                  <rect width="25" height="25" fill="white" />
                  {Array.from({ length: 625 }).map((_, i) => ((i * 7 + (i % 25) * 11) % 3 === 0 ? <rect key={i} x={i % 25} y={Math.floor(i / 25)} width="1" height="1" fill="#0B0B0B" /> : null))}
                </svg>
              </div>
              <div className="text-sm font-semibold">Table T-12 · Victoria Island</div>
              <div className="text-[10px] text-muted-foreground">Last scanned 2 hours ago · 47 scans today</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.success("Downloaded QR batch")}><QrCode className="w-3.5 h-3.5" /> Download all</Button>
              <Button size="sm" className="btn-gold" onClick={() => toast.success("Print queue started")}>Print batch</Button>
            </div>
          </div>
        </div>
      )}

      {/* Integrations */}
      {tab === "integrations" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: "Paystack", desc: "Payment processing", icon: "💳", status: "connected", color: "text-sky-400" },
            { name: "Flutterwave", desc: "Payment processing", icon: "💸", status: "connected", color: "text-amber-400" },
            { name: "Twilio SMS", desc: "SMS notifications", icon: "📱", status: "connected", color: "text-emerald-400" },
            { name: "SendGrid", desc: "Email campaigns", icon: "📧", status: "connected", color: "text-cyan-400" },
            { name: "WhatsApp Business", desc: "Customer chat", icon: "💬", status: "connected", color: "text-emerald-400" },
            { name: "Google Maps", desc: "Delivery routing", icon: "🗺️", status: "connected", color: "text-red-400" },
            { name: "Meta Business", desc: "Instagram ads", icon: "📷", status: "disconnected", color: "text-pink-400" },
            { name: "Taxify API", desc: "On-demand riders", icon: "🚗", status: "disconnected", color: "text-amber-400" },
            { name: "QuickBooks", desc: "Accounting sync", icon: "📊", status: "disconnected", color: "text-emerald-400" },
          ].map((int, i) => (
            <motion.div key={int.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="glass-card rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{int.icon}</div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${int.status === "connected" ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                  {int.status === "connected" ? "● CONNECTED" : "○ OFF"}
                </span>
              </div>
              <h3 className="font-semibold text-sm">{int.name}</h3>
              <p className="text-[10px] text-muted-foreground mb-3">{int.desc}</p>
              <Button size="sm" variant={int.status === "connected" ? "outline" : "default"} className={`w-full text-xs ${int.status === "disconnected" ? "btn-gold" : ""}`}
                onClick={() => toast.success(int.status === "connected" ? `${int.name} disconnected` : `${int.name} connected`)}>
                {int.status === "connected" ? "Disconnect" : "Connect"}
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Audit logs */}
      {tab === "audit" && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-3 border-b border-border/50">
            <h3 className="font-display font-bold">Audit logs</h3>
            <p className="text-[10px] text-muted-foreground">All admin & system actions · last 7 days</p>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {[
              { user: "Ngozi Eze", action: "Updated tax configuration (VAT 7.5%)", time: "5 min ago", level: "info" },
              { user: "Dr. Kunle Mohammed", action: "Approved payroll run · ₦10.96M", time: "1 hour ago", level: "success" },
              { user: "Emeka Okoro", action: "Refund approved · SK48291 · ₦4,500", time: "3 hours ago", level: "warning" },
              { user: "System", action: "Auto-reorder triggered for 5 items", time: "5 hours ago", level: "info" },
              { user: "Aisha Bello", action: "Created new user account: Bisi Adewale", time: "8 hours ago", level: "info" },
              { user: "Ngozi Eze", action: "Deactivated coupon: SUMMER25", time: "1 day ago", level: "warning" },
              { user: "System", action: "Backup completed · 2.4 GB", time: "1 day ago", level: "success" },
              { user: "Bashir Sani", action: "Stock adjustment · -12 units Mushroom Truffle", time: "2 days ago", level: "warning" },
              { user: "Dr. Kunle Mohammed", action: "Login from new device · iPhone 15 Pro", time: "2 days ago", level: "error" },
              { user: "Ngozi Eze", action: "Updated business hours for VI branch", time: "3 days ago", level: "info" },
            ].map((log, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border-t border-border/30 hover:bg-muted/20">
                <div className={`w-2 h-2 rounded-full ${
                  log.level === "success" ? "bg-emerald-400" : log.level === "warning" ? "bg-amber-400" : log.level === "error" ? "bg-red-400" : "bg-cyan-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs"><span className="font-semibold">{log.user}</span> {log.action}</div>
                  <div className="text-[10px] text-muted-foreground">{log.time}</div>
                </div>
                <Button size="sm" variant="ghost" className="h-6 text-[10px]">View</Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</label>
      <Input defaultValue={value} className="h-9 bg-input/50 mt-1" />
    </div>
  );
}
