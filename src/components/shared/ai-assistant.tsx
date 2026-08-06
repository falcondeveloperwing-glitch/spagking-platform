"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Sparkles, Send, X, Bot, User as UserIcon, TrendingUp, Package, Lightbulb, Users, BarChart3 } from "lucide-react";
import { useStore } from "@/lib/store";
import { meals, orders, formatNaira } from "@/lib/data";

interface Msg { role: "user" | "ai"; content: string; cards?: { title: string; value: string; trend?: string }[]; suggestions?: string[] }

const SUGGESTIONS = [
  { icon: Lightbulb, text: "Recommend meals for tonight" },
  { icon: Package, text: "Predict low stock items" },
  { icon: TrendingUp, text: "Forecast next week's sales" },
  { icon: Users, text: "Customer insights & segments" },
  { icon: BarChart3, text: "Sales trends this month" },
  { icon: Package, text: "Suggest reorder quantities" },
];

function aiResponse(query: string): Msg {
  const q = query.toLowerCase();
  if (q.includes("recommend") || q.includes("meal")) {
    const top = meals.filter(m => m.tags.includes("recommended")).slice(0, 3);
    return {
      role: "ai",
      content: `Based on today's trends and your past orders, here are my top 3 picks for tonight:`,
      suggestions: top.map(m => `${m.emoji} ${m.name} — ${formatNaira(m.price)} · ${m.rating}★`),
    };
  }
  if (q.includes("stock") || q.includes("reorder")) {
    const low = meals.filter(m => m.stock < 20).slice(0, 5);
    return {
      role: "ai",
      content: `I've analysed your inventory levels and sales velocity. ${low.length} items need reordering within 48 hours to avoid stockouts:`,
      cards: low.map(m => ({ title: m.name, value: `${m.stock} units left`, trend: `Reorder ${Math.ceil(m.sold / 30) * 7} units` })),
      suggestions: ["Generate purchase order", "Set auto-reorder alerts", "View supplier comparison"],
    };
  }
  if (q.includes("forecast") || q.includes("predict") || q.includes("sales")) {
    const today = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
    const total = today.reduce((s, o) => s + o.total, 0);
    return {
      role: "ai",
      content: `Based on the last 90 days of sales data and seasonality patterns, here's my forecast for next week:`,
      cards: [
        { title: "Projected Revenue", value: formatNaira(Math.round(total * 7 * 1.12)), trend: "+12% vs this week" },
        { title: "Peak Day", value: "Saturday", trend: "~2.3x average" },
        { title: "Top Category", value: "Spaghetti", trend: "45% of orders" },
        { title: "Suggested Prep", value: "+18% capacity", trend: "Saturday dinner" },
      ],
      suggestions: ["View hourly breakdown", "Plan staff shifts", "Optimise inventory"],
    };
  }
  if (q.includes("customer") || q.includes("insight")) {
    return {
      role: "ai",
      content: `Here's a snapshot of your customer base and key opportunities I've identified:`,
      cards: [
        { title: "VIP Customers", value: "47", trend: "Worth ₦18.2M LTV" },
        { title: "At-Risk", value: "23", trend: "No order in 30+ days" },
        { title: "Avg Satisfaction", value: "4.7★", trend: "+0.2 vs last month" },
        { title: "Repeat Rate", value: "68%", trend: "Industry-leading" },
      ],
      suggestions: ["Launch win-back campaign", "Send birthday offers", "Create VIP rewards"],
    };
  }
  return {
    role: "ai",
    content: `I'm your SpagKing AI assistant. I can help you recommend meals, predict stockouts, forecast sales, suggest reorder quantities, surface customer insights, and identify sales trends. What would you like to explore?`,
    suggestions: SUGGESTIONS.map(s => s.text),
  };
}

export function AIAssistant() {
  const open = useStore(s => s.aiOpen);
  const setOpen = useStore(s => s.setAiOpen);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", content: "Hi! I'm SpagKing AI — your restaurant intelligence assistant. I can recommend meals, predict low stock, forecast sales, and surface customer insights. How can I help today?", suggestions: SUGGESTIONS.slice(0, 3).map(s => s.text) },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { role: "user", content: text };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = aiResponse(text);
      setMessages(m => [...m, reply]);
      setTyping(false);
    }, 1200);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md p-0 bg-card/95 backdrop-blur-xl border-l border-border/50 flex flex-col">
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/50">
          <SheetTitle className="flex items-center gap-2">
            <div className="relative w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-card" />
            </div>
            <div>
              <div className="font-display font-bold leading-none">SpagKing AI</div>
              <div className="text-[10px] text-emerald-400 font-normal">● Online · Instant insights</div>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-muted" : "bg-gold-gradient"}`}>
                {m.role === "user" ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4 text-black" />}
              </div>
              <div className={`max-w-[85%] ${m.role === "user" ? "items-end" : "items-start"} flex flex-col gap-2`}>
                <div className={`rounded-2xl p-3 text-sm ${m.role === "user" ? "btn-gold rounded-tr-sm" : "glass-card rounded-tl-sm"}`}>
                  {m.content}
                </div>
                {m.cards && (
                  <div className="grid grid-cols-2 gap-2">
                    {m.cards.map((c, j) => (
                      <div key={j} className="glass-card rounded-xl p-2.5">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{c.title}</div>
                        <div className="font-display font-bold text-base text-gold-gradient">{c.value}</div>
                        {c.trend && <div className="text-[10px] text-emerald-400">{c.trend}</div>}
                      </div>
                    ))}
                  </div>
                )}
                {m.suggestions && (
                  <div className="flex flex-wrap gap-1.5">
                    {m.suggestions.map(s => (
                      <button key={s} onClick={() => send(s)} className="text-[11px] px-2.5 py-1.5 rounded-full glass-gold text-[var(--gold)] hover:scale-105 transition-transform text-left">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center">
                <Bot className="w-4 h-4 text-black" />
              </div>
              <div className="glass-card rounded-2xl rounded-tl-sm p-4 flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]"
                    animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick suggestions (when empty input) */}
        {!input && messages.length <= 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map(s => (
              <button key={s.text} onClick={() => send(s.text)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs hover:glass-gold transition-all">
                <s.icon className="w-3 h-3 text-[var(--gold)]" /> {s.text}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-border/50 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask SpagKing AI anything…"
            className="flex-1 bg-input/50 border border-border/50 rounded-xl px-3 h-10 text-sm focus:outline-none focus:border-[var(--gold)]/40"
          />
          <button onClick={() => send(input)} disabled={!input.trim()}
            className="w-10 h-10 rounded-xl btn-gold flex items-center justify-center disabled:opacity-40">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
