"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Gift, Sparkles, Ticket, Calendar, Users, Trophy, Flame, Check, Share2, Copy, Zap, Star, Award, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const TIERS = [
  { name: "Bronze", icon: "🥉", min: 0, max: 1000, color: "from-orange-700 to-amber-900", perks: ["5% off birthdays", "1 pt per ₦100", "Flash sale access"] },
  { name: "Silver", icon: "🥈", min: 1000, max: 2500, color: "from-slate-400 to-slate-600", perks: ["10% off birthdays", "1.5 pts per ₦100", "Free delivery Mondays"] },
  { name: "Gold", icon: "🥇", min: 2500, max: 5000, color: "from-amber-400 to-yellow-600", perks: ["15% off birthdays", "2 pts per ₦100", "Free delivery always", "Skip-the-queue"] },
  { name: "King", icon: "👑", min: 5000, max: Infinity, color: "from-violet-400 to-purple-700", perks: ["25% off birthdays", "3 pts per ₦100", "Concierge", "Personal chef events"] },
];

const LEADERBOARD = [
  { rank: 1, name: "Aisha M.", points: 18420, avatar: "AM", streak: 47 },
  { rank: 2, name: "Emeka O.", points: 15680, avatar: "EO", streak: 38 },
  { rank: 3, name: "Ngozi E.", points: 14250, avatar: "NE", streak: 31 },
  { rank: 4, name: "Tunde A.", points: 11920, avatar: "TA", streak: 28 },
  { rank: 5, name: "Fatima B.", points: 9840, avatar: "FB", streak: 22 },
];

export function CustomerLoyalty() {
  const user = useStore(s => s.user);
  const loyaltyPoints = useStore(s => s.loyaltyPoints);
  const loyaltyTier = useStore(s => s.loyaltyTier);
  const checkInStreak = useStore(s => s.checkInStreak);
  const lastCheckIn = useStore(s => s.lastCheckIn);
  const spinAvailable = useStore(s => s.spinAvailable);
  const scratchAvailable = useStore(s => s.scratchAvailable);
  const referralCode = useStore(s => s.referralCode);
  const referralsCount = useStore(s => s.referralsCount);
  const dailyCheckIn = useStore(s => s.dailyCheckIn);
  const spinWheel = useStore(s => s.spinWheel);
  const scratchCard = useStore(s => s.scratchCard);
  const unlockedBadges = useStore(s => s.unlockedBadges);

  const [spinModal, setSpinModal] = useState<{ open: boolean; spinning: boolean; result?: { label: string; points: number; type: string } }>({ open: false, spinning: false });
  const [scratchModal, setScratchModal] = useState<{ open: boolean; revealed: boolean; result?: { label: string; points: number } }>({ open: false, revealed: false });

  const todayCheckedIn = lastCheckIn === new Date().toDateString();
  const currentTierIdx = TIERS.findIndex(t => t.name === loyaltyTier);
  const nextTier = TIERS[currentTierIdx + 1];
  const progress = nextTier ? ((loyaltyPoints - TIERS[currentTierIdx].min) / (nextTier.min - TIERS[currentTierIdx].min)) * 100 : 100;

  const handleCheckIn = () => {
    if (todayCheckedIn) { toast.info("Already checked in today — come back tomorrow!"); return; }
    dailyCheckIn();
    toast.success(`Daily check-in complete! +${50 + (checkInStreak + 1 >= 7 ? 100 : (checkInStreak + 1) * 10)} points`);
  };

  const handleSpin = () => {
    if (!spinAvailable) { toast.info("Come back tomorrow to spin again!"); return; }
    setSpinModal({ open: true, spinning: true });
    setTimeout(() => {
      const result = spinWheel();
      setSpinModal({ open: true, spinning: false, result: result as any });
      if (result.type === "points") toast.success(`${result.label} added to your account!`);
      else if (result.type === "coupon") toast.success("You won a coupon! 🎉");
      else toast.info(result.label);
    }, 2800);
  };

  const handleScratch = () => {
    if (!scratchAvailable) { toast.info("Come back tomorrow for another scratch card!"); return; }
    setScratchModal({ open: true, revealed: false });
    setTimeout(() => {
      const result = scratchCard();
      setScratchModal({ open: true, revealed: true, result: result || { label: "Come back tomorrow", points: 0 } });
      if (result && result.points > 0) toast.success(`${result.label} added!`);
    }, 600);
  };

  const copyReferral = () => {
    navigator.clipboard?.writeText(referralCode);
    toast.success("Referral code copied!");
  };

  return (
    <div className="space-y-6">
      {/* Hero tier card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gold-shimmer text-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.4),transparent_50%)]" />
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs font-bold opacity-70 mb-1">SPAGKING REWARDS</div>
              <div className="font-display text-3xl sm:text-4xl font-bold num">{loyaltyPoints.toLocaleString()} pts</div>
              <div className="text-sm opacity-80 mt-1">Welcome back, {user?.name?.split(" ")[0]}</div>
            </div>
            <div className="text-right">
              <div className="text-4xl mb-1">{TIERS[currentTierIdx].icon}</div>
              <div className="font-display font-bold text-sm">{loyaltyTier.toUpperCase()}</div>
            </div>
          </div>

          {nextTier && (
            <div className="mt-4">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="opacity-80">{nextTier.min - loyaltyPoints} pts to {nextTier.name}</span>
                <span className="font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-black/20 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-black rounded-full" />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tier ladder */}
      <section>
        <h3 className="font-display font-semibold text-lg mb-3">Loyalty tiers</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {TIERS.map((t, i) => {
            const isCurrent = t.name === loyaltyTier;
            const isUnlocked = loyaltyPoints >= t.min;
            return (
              <motion.div key={t.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className={`relative rounded-2xl p-4 overflow-hidden ${isCurrent ? "ring-2 ring-[var(--gold)] glass-gold" : "glass-card"}`}>
                {isCurrent && <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-gold-gradient text-black">CURRENT</span>}
                <div className="text-3xl mb-2">{t.icon}</div>
                <div className="font-display font-bold text-base">{t.name}</div>
                <div className="text-[10px] text-muted-foreground mb-3 num">{t.min.toLocaleString()}{t.max !== Infinity ? ` - ${t.max.toLocaleString()}` : "+"} pts</div>
                <ul className="space-y-1">
                  {t.perks.map(p => (
                    <li key={p} className={`text-[10px] flex items-start gap-1 ${isUnlocked ? "text-foreground" : "text-muted-foreground/60"}`}>
                      <Check className={`w-2.5 h-2.5 mt-0.5 shrink-0 ${isUnlocked ? "text-[var(--success)]" : "text-muted-foreground/40"}`} />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Daily rewards grid */}
      <section>
        <h3 className="font-display font-semibold text-lg mb-3">Daily rewards</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Daily check-in */}
          <RewardCard
            icon={Calendar}
            title="Daily Check-in"
            desc={`${checkInStreak}-day streak`}
            cta={todayCheckedIn ? "Checked in ✓" : "Check in"}
            disabled={todayCheckedIn}
            onClick={handleCheckIn}
            accent="from-[var(--success)]/15"
            badge={todayCheckedIn ? `${50 + (checkInStreak >= 7 ? 100 : checkInStreak * 10)} pts earned` : `+${50 + (checkInStreak + 1 >= 7 ? 100 : (checkInStreak + 1) * 10)} pts`}
          />
          {/* Spin the wheel */}
          <RewardCard
            icon={Gift}
            title="Spin the Wheel"
            desc={spinAvailable ? "1 spin available" : "Come back tomorrow"}
            cta={spinAvailable ? "Spin now" : "Used today"}
            disabled={!spinAvailable}
            onClick={handleSpin}
            accent="from-[var(--gold)]/15"
            badge="Up to 200 pts"
          />
          {/* Scratch card */}
          <RewardCard
            icon={Ticket}
            title="Scratch Card"
            desc={scratchAvailable ? "1 card available" : "Come back tomorrow"}
            cta={scratchAvailable ? "Scratch" : "Used today"}
            disabled={!scratchAvailable}
            onClick={handleScratch}
            accent="from-[#A78BFA]/15"
            badge="Up to 300 pts"
          />
          {/* Lucky coupon */}
          <RewardCard
            icon={Sparkles}
            title="Lucky Coupon"
            desc="Surprise discount"
            cta="Reveal"
            onClick={() => toast.success("You got 15% off your next order! Code: LUCKY15")}
            accent="from-[#FF80AB]/15"
            badge="Random"
          />
          {/* Birthday reward */}
          <RewardCard
            icon={Crown}
            title="Birthday Reward"
            desc="August 14"
            cta="View reward"
            onClick={() => toast.success("Happy birthday month! 25% off all month as Gold member 🎂")}
            accent="from-[var(--gold)]/15"
            badge="25% off"
          />
          {/* Referral */}
          <RewardCard
            icon={Users}
            title="Refer & Earn"
            desc={`${referralsCount} friends referred`}
            cta="Share code"
            onClick={() => toast.success("Share your code — earn 500 pts per friend who orders!")}
            accent="from-[#4FC3F7]/15"
            badge="500 pts/friend"
          />
        </div>
      </section>

      {/* Streak tracker */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold flex items-center gap-2"><Flame className="w-4 h-4 text-[var(--warning)]" /> Check-in streak</h3>
            <p className="text-xs text-muted-foreground">{checkInStreak} days in a row · keep it going!</p>
          </div>
          <div className="font-display font-bold text-2xl text-gold-neon num">{checkInStreak}</div>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => {
            const checked = i < checkInStreak;
            const isToday = i === checkInStreak - 1;
            return (
              <div key={i} className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-[10px] font-bold ${
                checked ? "bg-gold-gradient text-black" : isToday ? "glass-gold text-[var(--gold)] border-2 border-dashed border-[var(--gold)]/40" : "bg-foreground/[0.04] text-muted-foreground"
              }`}>
                <span className="text-xs">{d}</span>
                {checked && <Check className="w-3 h-3 mt-0.5" />}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Achievement badges */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-semibold flex items-center gap-2 mb-4"><Award className="w-4 h-4 text-[var(--gold)]" /> Achievement badges</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { id: "first-order", icon: "🎯", name: "First Order", desc: "Placed your first order" },
            { id: "spicy-lover", icon: "🌶️", name: "Spicy Lover", desc: "Ordered 5 spicy meals" },
            { id: "weekend-warrior", icon: "🎉", name: "Weekend Warrior", desc: "Ordered 3 weekends in a row" },
            { id: "foodie-explorer", icon: "🍜", name: "Foodie Explorer", desc: "Tried 10 different meals" },
            { id: "social-butterfly", icon: "💬", name: "Social Butterfly", desc: "Shared 5 posts" },
            { id: "king-vip", icon: "👑", name: "King VIP", desc: "Reached King tier" },
          ].map((b, i) => {
            const unlocked = unlockedBadges.includes(b.id);
            return (
              <motion.div key={b.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className={`text-center p-3 rounded-xl ${unlocked ? "glass-gold" : "bg-foreground/[0.03] opacity-50"}`}>
                <div className={`text-3xl mb-1 ${unlocked ? "" : "grayscale"}`}>{b.icon}</div>
                <div className="text-[10px] font-semibold leading-tight">{b.name}</div>
                {!unlocked && <div className="text-[8px] text-muted-foreground mt-0.5">Locked</div>}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Referral system */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-display font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-[var(--gold)]" /> Invite friends, earn together</h3>
            <p className="text-xs text-muted-foreground">Get <span className="text-[var(--gold)] font-medium">500 points</span> for every friend who places their first order. They get 15% off too!</p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display font-bold text-2xl text-gold-neon num">{referralsCount}</div>
            <div className="text-[10px] text-muted-foreground">friends referred</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-foreground/[0.04] border border-border/50">
          <Gift className="w-4 h-4 text-[var(--gold)] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-muted-foreground">Your referral code</div>
            <div className="font-mono text-sm font-semibold">{referralCode}</div>
          </div>
          <Button size="sm" variant="outline" onClick={copyReferral}><Copy className="w-3.5 h-3.5" /> Copy</Button>
          <Button size="sm" className="btn-gold" onClick={() => toast.success("Sharing…")}><Share2 className="w-3.5 h-3.5" /> Share</Button>
        </div>
      </motion.div>

      {/* Food challenge leaderboard */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--warning)]/15 text-[var(--warning)] text-[10px] font-bold mb-2">
              <Zap className="w-3 h-3" /> WEEKLY CHALLENGE
            </div>
            <h3 className="font-display font-semibold flex items-center gap-2"><Trophy className="w-4 h-4 text-[var(--gold)]" /> Spicy Champion</h3>
            <p className="text-xs text-muted-foreground">Order 3+ spicy meals this week to climb the leaderboard. Top 3 win free meals!</p>
          </div>
        </div>
        <div className="space-y-2">
          {LEADERBOARD.map((p, i) => (
            <motion.div key={p.rank} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className={`flex items-center gap-3 p-2.5 rounded-xl ${p.name === user?.name?.split(" ")[0] + " " + (user?.name?.split(" ")[1] || "") ? "glass-gold" : "bg-foreground/[0.03]"}`}>
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-gold-gradient text-black" : i < 3 ? "bg-foreground/10" : "bg-foreground/[0.04] text-muted-foreground"}`}>
                {i === 0 ? "👑" : i + 1}
              </span>
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${["from-amber-500 to-yellow-600","from-slate-400 to-slate-600","from-orange-700 to-amber-900","from-cyan-500 to-blue-600","from-rose-500 to-pink-600"][i]} flex items-center justify-center text-white text-[10px] font-bold`}>{p.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-[10px] text-muted-foreground">{p.streak} spicy meals this week</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[var(--gold)] num">{p.points.toLocaleString()}</div>
                <div className="text-[9px] text-muted-foreground">pts</div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-xl bg-foreground/[0.03] border border-dashed border-border/50 text-center">
          <p className="text-xs text-muted-foreground">You're ranked <span className="font-bold text-[var(--gold)]">#23</span> · Order <span className="font-bold">1 more spicy meal</span> to reach top 20!</p>
        </div>
      </motion.div>

      {/* === Spin wheel modal === */}
      <Dialog open={spinModal.open} onOpenChange={(v) => setSpinModal(m => ({ ...m, open: v }))}>
        <DialogContent className="max-w-sm bg-card border-border/50">
          <DialogHeader><DialogTitle className="text-center">Spin the Wheel</DialogTitle></DialogHeader>
          <div className="text-center py-4">
            <div className="relative w-56 h-56 mx-auto mb-6">
              {/* Wheel pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-[var(--gold)]" />
              {/* Wheel */}
              <motion.div
                animate={spinModal.spinning ? { rotate: 1440 } : { rotate: 0 }}
                transition={{ duration: 2.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full rounded-full border-4 border-[var(--gold)] relative overflow-hidden"
                style={{ boxShadow: "0 0 40px rgba(255,215,0,0.4)" }}
              >
                <WheelSegments />
              </motion.div>
              {/* Center hub */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center text-black z-10">
                <Crown className="w-6 h-6" />
              </div>
            </div>
            {spinModal.spinning ? (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Spinning...
              </div>
            ) : spinModal.result ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                <div className="text-5xl mb-2">{spinModal.result.type === "nothing" ? "😅" : "🎉"}</div>
                <h3 className="font-display font-bold text-xl mb-1">{spinModal.result.label}</h3>
                {spinModal.result.type === "points" && <p className="text-sm text-[var(--success)] font-medium">+{spinModal.result.points} points added!</p>}
                {spinModal.result.type === "coupon" && <p className="text-sm text-[var(--gold)] font-medium">Coupon added to your wallet!</p>}
                {spinModal.result.type === "nothing" && <p className="text-sm text-muted-foreground">Better luck next time!</p>}
              </motion.div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* === Scratch card modal === */}
      <Dialog open={scratchModal.open} onOpenChange={(v) => setScratchModal(m => ({ ...m, open: v }))}>
        <DialogContent className="max-w-sm bg-card border-border/50">
          <DialogHeader><DialogTitle className="text-center">Scratch Card</DialogTitle></DialogHeader>
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground mb-4">Scratch to reveal your reward!</p>
            <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden glass-gold mx-auto max-w-xs">
              {!scratchModal.revealed ? (
                <motion.div initial={{ opacity: 1 }} animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 0.6, repeat: 3 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#FFD700]/30 to-[#D4A017]/30 backdrop-blur-sm">
                  <Sparkles className="w-8 h-8 text-[var(--gold)] mb-2" />
                  <p className="text-xs font-medium">Tap to scratch...</p>
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}
                  className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl mb-2">{scratchModal.result?.points && scratchModal.result.points > 0 ? "🎉" : "😔"}</div>
                  <h3 className="font-display font-bold text-xl">{scratchModal.result?.label}</h3>
                  {scratchModal.result?.points && scratchModal.result.points > 0 && (
                    <p className="text-sm text-[var(--success)] font-medium mt-1">+{scratchModal.result.points} points added!</p>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RewardCard({ icon: Icon, title, desc, cta, onClick, disabled, accent, badge }: {
  icon: any; title: string; desc: string; cta: string; onClick: () => void; disabled?: boolean; accent: string; badge: string;
}) {
  return (
    <motion.button whileHover={!disabled ? { y: -3 } : {}} whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick} disabled={disabled}
      className="relative text-left">
      <div className={`glass-card rounded-2xl p-4 h-full ${disabled ? "opacity-60" : "card-hover"} bg-gradient-to-br ${accent} to-transparent`}>
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-foreground/[0.06] border border-border/50 flex items-center justify-center">
            <Icon className="w-5 h-5 text-[var(--gold)]" />
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold glass-gold text-[var(--gold)]">{badge}</span>
        </div>
        <h4 className="font-semibold text-sm mb-0.5">{title}</h4>
        <p className="text-[11px] text-muted-foreground mb-3">{desc}</p>
        <div className={`inline-flex items-center gap-1 text-xs font-medium ${disabled ? "text-muted-foreground" : "text-[var(--gold)]"}`}>
          {cta} {!disabled && <ArrowRight />}
        </div>
      </div>
    </motion.button>
  );
}

function ArrowRight() {
  return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function WheelSegments() {
  // 6 segments alternating gold/dark
  const colors = ["#FFD700", "#1C1C1C", "#FFD700", "#1C1C1C", "#FFD700", "#1C1C1C"];
  const labels = ["50", "100", "200", "COUPON", "10% OFF", "TRY AGAIN"];
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = 60;
        const startAngle = i * angle - 90;
        const endAngle = (i + 1) * angle - 90;
        const x1 = 50 + 45 * Math.cos((startAngle * Math.PI) / 180);
        const y1 = 50 + 45 * Math.sin((startAngle * Math.PI) / 180);
        const x2 = 50 + 45 * Math.cos((endAngle * Math.PI) / 180);
        const y2 = 50 + 45 * Math.sin((endAngle * Math.PI) / 180);
        const midAngle = (startAngle + endAngle) / 2;
        const tx = 50 + 28 * Math.cos((midAngle * Math.PI) / 180);
        const ty = 50 + 28 * Math.sin((midAngle * Math.PI) / 180);
        return (
          <g key={i}>
            <path d={`M 50 50 L ${x1} ${y1} A 45 45 0 0 1 ${x2} ${y2} Z`} fill={colors[i]} stroke="#050505" strokeWidth="0.5" />
            <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fontSize="6" fontWeight="bold" fill={colors[i] === "#FFD700" ? "#050505" : "#FFD700"}>
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
