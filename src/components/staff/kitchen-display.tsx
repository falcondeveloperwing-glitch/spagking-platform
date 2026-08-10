"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, type KitchenTicket, type KitchenTicketStatus } from "@/lib/store";
import { formatNaira } from "@/lib/data";
import { toast } from "sonner";
import { Clock, ChefHat, Check, X, Flame, AlertCircle } from "lucide-react";

const STATUS_CONFIG: Record<KitchenTicketStatus, { label: string; cls: string; border: string }> = {
  new: { label: "NEW", cls: "bg-[var(--gold)]/15 text-[var(--gold)]", border: "border-[var(--gold)]/30" },
  preparing: { label: "PREPARING", cls: "bg-[var(--warning)]/15 text-[var(--warning)]", border: "border-[var(--warning)]/30" },
  ready: { label: "READY", cls: "bg-[var(--success)]/15 text-[var(--success)]", border: "border-[var(--success)]/30" },
  served: { label: "SERVED", cls: "bg-muted text-muted-foreground", border: "border-border" },
  cancelled: { label: "CANCELLED", cls: "bg-[var(--error)]/15 text-[var(--error)]", border: "border-[var(--error)]/30" },
};

function elapsedMin(ts: number) {
  const mins = Math.floor((Date.now() - ts) / 60000);
  return mins < 1 ? "just now" : `${mins}m ago`;
}

function isOverdue(ts: number) {
  return Date.now() - ts > 600000; // 10 minutes
}

export function KitchenDisplay() {
  const tickets = useStore(s => s.kitchenTickets);
  const updateTicket = useStore(s => s.updateKitchenTicket);

  const activeTickets = tickets.filter(t => t.status === "new" || t.status === "preparing");
  const readyTickets = tickets.filter(t => t.status === "ready");
  const completedTickets = tickets.filter(t => t.status === "served" || t.status === "cancelled");

  const handleStart = (id: string) => {
    updateTicket(id, "preparing");
    toast.success("Order preparation started");
  };
  const handleReady = (id: string) => {
    updateTicket(id, "ready");
    toast.success("Order marked ready for serving");
  };
  const handleServed = (id: string) => {
    updateTicket(id, "served");
    toast.success("Order served");
  };
  const handleCancel = (id: string) => {
    updateTicket(id, "cancelled");
    toast.info("Order cancelled");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Kitchen Display</h1>
          <p className="text-sm text-muted-foreground">{activeTickets.length} active · {readyTickets.length} ready · {completedTickets.length} completed</p>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-3">
          <div className="font-display font-bold text-lg text-[var(--gold)] num">{tickets.filter(t => t.status === "new").length}</div>
          <div className="text-[10px] text-muted-foreground uppercase">New</div>
        </div>
        <div className="glass-card rounded-xl p-3">
          <div className="font-display font-bold text-lg text-[var(--warning)] num">{tickets.filter(t => t.status === "preparing").length}</div>
          <div className="text-[10px] text-muted-foreground uppercase">Preparing</div>
        </div>
        <div className="glass-card rounded-xl p-3">
          <div className="font-display font-bold text-lg text-[var(--success)] num">{readyTickets.length}</div>
          <div className="text-[10px] text-muted-foreground uppercase">Ready</div>
        </div>
        <div className="glass-card rounded-xl p-3">
          <div className="font-display font-bold text-lg num">{completedTickets.length}</div>
          <div className="text-[10px] text-muted-foreground uppercase">Completed</div>
        </div>
      </div>

      {/* Column layout — real kitchen display feel */}
      <div className="grid lg:grid-cols-4 gap-3">
        {/* NEW column */}
        <KanbanColumn title="New" icon={Flame} color="text-[var(--gold)]" count={tickets.filter(t => t.status === "new").length}>
          {tickets.filter(t => t.status === "new").length === 0 ? (
            <EmptyColumn text="No new tickets" />
          ) : (
            <AnimatePresence>
              {tickets.filter(t => t.status === "new").map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} onStart={handleStart} onReady={handleReady} onServe={handleServed} onCancel={handleCancel} />
              ))}
            </AnimatePresence>
          )}
        </KanbanColumn>

        {/* PREPARING column */}
        <KanbanColumn title="Preparing" icon={Clock} color="text-[var(--warning)]" count={tickets.filter(t => t.status === "preparing").length}>
          {tickets.filter(t => t.status === "preparing").length === 0 ? (
            <EmptyColumn text="Nothing cooking" />
          ) : (
            <AnimatePresence>
              {tickets.filter(t => t.status === "preparing").map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} onStart={handleStart} onReady={handleReady} onServe={handleServed} onCancel={handleCancel} />
              ))}
            </AnimatePresence>
          )}
        </KanbanColumn>

        {/* READY column */}
        <KanbanColumn title="Ready" icon={Check} color="text-[var(--success)]" count={readyTickets.length}>
          {readyTickets.length === 0 ? (
            <EmptyColumn text="Nothing ready" />
          ) : (
            <AnimatePresence>
              {readyTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} onStart={handleStart} onReady={handleReady} onServe={handleServed} onCancel={handleCancel} />
              ))}
            </AnimatePresence>
          )}
        </KanbanColumn>

        {/* COMPLETED column */}
        <KanbanColumn title="Completed" icon={Check} color="text-muted-foreground" count={completedTickets.length}>
          {completedTickets.length === 0 ? (
            <EmptyColumn text="No completed orders" />
          ) : (
            completedTickets.slice(0, 5).map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} onStart={handleStart} onReady={handleReady} onServe={handleServed} onCancel={handleCancel} />
            ))
          )}
        </KanbanColumn>
      </div>
    </div>
  );
}

function TicketCard({
  ticket, onStart, onReady, onServe, onCancel,
}: {
  ticket: KitchenTicket;
  onStart: (id: string) => void;
  onReady: (id: string) => void;
  onServe: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const cfg = STATUS_CONFIG[ticket.status];
  const overdue = ticket.status === "new" && isOverdue(ticket.createdAt);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-card rounded-2xl p-4 border-2 ${cfg.border} ${overdue ? "ring-2 ring-[var(--error)]/30" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-display font-bold text-base">{ticket.tableNumber}</div>
          <div className="text-[10px] text-muted-foreground capitalize">{ticket.orderType} · {ticket.station}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${cfg.cls}`}>{cfg.label}</span>
          {overdue && <span className="flex items-center gap-0.5 text-[9px] text-[var(--error)] font-bold"><AlertCircle className="w-2.5 h-2.5" /> OVERDUE</span>}
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1.5 mb-3">
        {ticket.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[var(--gold)] w-6">{item.qty}×</span>
            <span className="text-lg">{item.emoji}</span>
            <span className="flex-1">{item.name}</span>
            {item.notes && <span className="text-[9px] text-muted-foreground italic">"{item.notes}"</span>}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border/40">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" /> {elapsedMin(ticket.createdAt)}
        </span>
        <div className="flex gap-1.5">
          {ticket.status === "new" && (
            <>
              <button onClick={() => onStart(ticket.id)} className="px-3 py-1.5 rounded-lg btn-gold text-[10px] font-semibold">Start</button>
              <button onClick={() => onCancel(ticket.id)} className="px-2 py-1.5 rounded-lg bg-muted/40 text-[10px] text-muted-foreground hover:text-[var(--error)]">Cancel</button>
            </>
          )}
          {ticket.status === "preparing" && (
            <button onClick={() => onReady(ticket.id)} className="px-3 py-1.5 rounded-lg bg-[var(--success)]/15 text-[var(--success)] text-[10px] font-semibold hover:bg-[var(--success)]/25">Mark Ready</button>
          )}
          {ticket.status === "ready" && (
            <button onClick={() => onServe(ticket.id)} className="px-3 py-1.5 rounded-lg btn-gold text-[10px] font-semibold">Served</button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function KanbanColumn({ title, icon: Icon, color, count, children }: {
  title: string;
  icon: any;
  color: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1 pb-2 sticky top-0 z-10 bg-[var(--bg-0)]/80 backdrop-blur-sm">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        <span className="text-xs font-semibold uppercase tracking-wide">{title}</span>
        <span className={`ml-auto text-[10px] font-bold ${color} num`}>{count}</span>
      </div>
      <div className="space-y-2 min-h-[100px]">
        {children}
      </div>
    </div>
  );
}

function EmptyColumn({ text }: { text: string }) {
  return (
    <div className="glass-card rounded-xl p-4 text-center">
      <p className="text-[11px] text-muted-foreground/50">{text}</p>
    </div>
  );
}
