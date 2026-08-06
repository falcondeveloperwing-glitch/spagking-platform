"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, ShoppingBag, AlertTriangle, Bike, MessageSquare, UserCheck, RefreshCw, Info, CheckCheck } from "lucide-react";
import { useStore } from "@/lib/store";

const ICONS: Record<string, any> = {
  order: ShoppingBag, stock: AlertTriangle, refund: RefreshCw, delivery: Bike,
  feedback: MessageSquare, staff: UserCheck, system: Info,
};
const COLORS: Record<string, string> = {
  info: "text-blue-400 bg-blue-500/15",
  success: "text-emerald-400 bg-emerald-500/15",
  warning: "text-amber-400 bg-amber-500/15",
  error: "text-red-400 bg-red-500/15",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationBell() {
  const notifications = useStore(s => s.notifications);
  const markAllRead = useStore(s => s.markAllRead);
  const markRead = useStore(s => s.markRead);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors">
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[var(--gold)] text-black text-[9px] font-bold flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0 bg-card/95 backdrop-blur-xl border-border/50">
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <div>
            <h3 className="font-display font-bold text-sm">Notifications</h3>
            <p className="text-[10px] text-muted-foreground">{unread} unread</p>
          </div>
          <button onClick={markAllRead} className="text-[10px] text-[var(--gold)] font-medium inline-flex items-center gap-1 hover:underline">
            <CheckCheck className="w-3 h-3" /> Mark all read
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No notifications</div>
            ) : notifications.slice(0, 15).map((n) => {
              const Icon = ICONS[n.type] || Info;
              return (
                <motion.button key={n.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => markRead(n.id)}
                  className={`w-full flex items-start gap-3 p-3 border-b border-border/30 text-left hover:bg-muted/40 transition-colors ${!n.read ? "bg-[var(--gold)]/5" : ""}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${COLORS[n.level]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold line-clamp-1">{n.title}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(n.time)}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{n.body}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-[var(--gold)] shrink-0 mt-1" />}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
        <div className="p-2 border-t border-border/50">
          <button className="w-full text-center text-xs text-muted-foreground hover:text-foreground py-1.5">View all notifications</button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
