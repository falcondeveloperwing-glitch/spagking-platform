"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Music2, Instagram, Facebook, Youtube, Play, Heart, MessageCircle, Share2, Bookmark, ThumbsUp, ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

const TIKTOK_VIDEOS = [
  { title: "Behind the scenes: SpagKing kitchen", views: "284K", likes: "32.1K", chef: "Chef Ade", duration: "0:45", color: "from-amber-500/40 to-orange-700/40" },
  { title: "Suya Spaghetti recipe reveal 🔥", views: "421K", likes: "58.3K", chef: "Chef Ade", duration: "1:12", color: "from-rose-500/40 to-pink-700/40" },
  { title: "Customer's first bite reaction 😍", views: "189K", likes: "24.7K", chef: "SpagKing", duration: "0:23", color: "from-violet-500/40 to-purple-700/40" },
  { title: "60-second Jollof masterclass", views: "612K", likes: "89.2K", chef: "Chef Bisi", duration: "1:00", color: "from-emerald-500/40 to-green-700/40" },
  { title: "Flash mob in the VI branch 💃", views: "1.2M", likes: "156K", chef: "SpagKing", duration: "0:38", color: "from-cyan-500/40 to-blue-700/40" },
  { title: "Spicy challenge — can you handle it?", views: "347K", likes: "42.8K", chef: "Chef Ade", duration: "0:52", color: "from-red-500/40 to-rose-700/40" },
];

const INSTAGRAM_POSTS = [
  { emoji: "🍝", caption: "Today's special: Royal Bolognese 👑", likes: 1240, color: "from-amber-500/30 to-orange-700/30" },
  { emoji: "🍛", caption: "Jollof season is here 🍛", likes: 2890, color: "from-rose-500/30 to-pink-700/30" },
  { emoji: "🌯", caption: "Shawarma Saturday vibes ✨", likes: 1820, color: "from-violet-500/30 to-purple-700/30" },
  { emoji: "🍔", caption: "Royale Burger dropped today 👑🍔", likes: 3240, color: "from-yellow-500/30 to-amber-700/30" },
  { emoji: "🥤", caption: "Fresh Zobo — made daily ❤️", likes: 980, color: "from-red-500/30 to-rose-700/30" },
  { emoji: "🍨", caption: "Dessert date night 💕", likes: 1560, color: "from-pink-500/30 to-fuchsia-700/30" },
  { emoji: "🍜", caption: "Ramen collab dropping soon 👀", likes: 4120, color: "from-orange-500/30 to-red-700/30" },
  { emoji: "🥘", caption: "Egusi & pounded yam — proper Naija 🇳🇬", likes: 2180, color: "from-emerald-500/30 to-teal-700/30" },
  { emoji: "🎂", caption: "Birthday cake combos available 🎂", likes: 1340, color: "from-cyan-500/30 to-blue-700/30" },
];

const FACEBOOK_POSTS = [
  { type: "event", title: "SpagKing Food Festival 2026", date: "Aug 24 · 4:00 PM", desc: "Join us for the biggest food festival in Lagos. Live music, cooking demos, free samples, and exclusive festival-only menu!", going: 1240, interested: 3820 },
  { type: "promo", title: "Weekend Special — Buy 2 Get 1 Free", date: "Ends Sunday", desc: "On all spaghetti dishes. Tag a friend who needs to try SpagKing 👇", going: 0, interested: 0 },
  { type: "announcement", title: "New branch opening in Lekki Phase 2!", date: "Sep 1", desc: "We're expanding. Get 30% off opening week if you're one of the first 500 customers.", going: 0, interested: 0 },
];

const YOUTUBE_VIDEOS = [
  { title: "How we make the SpagKing Royal Bolognese", views: "412K views", duration: "8:24", desc: "Chef Ade walks you through our signature dish, step by step." },
  { title: "Restaurant tour — Victoria Island flagship", views: "189K views", duration: "5:12", desc: "Step inside our flagship branch and meet the team." },
  { title: "Behind SpagKing: From kitchen to your door", views: "267K views", duration: "12:45", desc: "The full journey of a SpagKing order, filmed in real time." },
  { title: "Chef interview: Ade's journey to SpagKing", views: "98K views", duration: "18:30", desc: "Our head chef shares his story, philosophy, and favourite dish." },
];

export function CustomerCommunity() {
  const [tab, setTab] = useState<"tiktok" | "instagram" | "facebook" | "youtube">("tiktok");
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[var(--gold)]/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-[11px] font-medium mb-3">
            <Sparkles className="w-3 h-3 text-[var(--gold)]" /> SpagKing Community
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
            Join the <span className="wordmark text-2xl">SpagKing</span> family
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg">Behind the scenes, kitchen moments, chef specials, customer reactions, food challenges, and more. Follow us across all platforms.</p>
          <div className="flex gap-4 mt-4">
            {[
              { icon: Music2, label: "TikTok", handle: "@spagking", count: "284K", color: "text-[#FF80AB]" },
              { icon: Instagram, label: "Instagram", handle: "@spagking.ng", count: "156K", color: "text-[#FF80AB]" },
              { icon: Facebook, label: "Facebook", handle: "SpagKing Foods", count: "8.4K", color: "text-[#4FC3F7]" },
              { icon: Youtube, label: "YouTube", handle: "SpagKing TV", count: "42K", color: "text-[var(--error)]" },
            ].map(s => (
              <div key={s.label} className="flex-1">
                <s.icon className={`w-5 h-5 mb-1 ${s.color}`} />
                <div className="font-display font-bold text-sm">{s.count}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Platform tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: "tiktok", label: "TikTok", icon: Music2 },
          { id: "instagram", label: "Instagram", icon: Instagram },
          { id: "facebook", label: "Facebook", icon: Facebook },
          { id: "youtube", label: "YouTube", icon: Youtube },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === t.id ? "btn-gold" : "glass text-muted-foreground"}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* TikTok feed */}
      {tab === "tiktok" && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {TIKTOK_VIDEOS.map((v, i) => {
            const id = `tiktok-${i}`;
            const isLiked = liked.has(id);
            return (
              <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="w-56 sm:w-64 shrink-0">
                <div className={`relative aspect-[9/16] rounded-2xl overflow-hidden bg-gradient-to-br ${v.color} glass-card card-hover cursor-pointer group`}>
                  {/* Video thumbnail */}
                  <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-60 group-hover:scale-110 transition-transform duration-500">🍝</div>
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  {/* Duration */}
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium num">{v.duration}</div>
                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-xs font-medium text-white line-clamp-2 mb-2">{v.title}</p>
                    <div className="flex items-center gap-3 text-[10px] text-white/80">
                      <span className="flex items-center gap-1"><Music2 className="w-2.5 h-2.5" /> {v.chef}</span>
                    </div>
                  </div>
                  {/* Right side actions */}
                  <div className="absolute right-2 bottom-16 flex flex-col gap-3">
                    <button onClick={(e) => { e.stopPropagation(); toggleLike(id); }} className="flex flex-col items-center gap-0.5">
                      <Heart className={`w-5 h-5 ${isLiked ? "text-[var(--error)] fill-[var(--error)]" : "text-white"}`} />
                      <span className="text-[9px] text-white num">{v.likes}</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); toast.success("Comment opened"); }} className="flex flex-col items-center gap-0.5">
                      <MessageCircle className="w-5 h-5 text-white" />
                      <span className="text-[9px] text-white">842</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); toast.success("Shared!"); }} className="flex flex-col items-center gap-0.5">
                      <Share2 className="w-5 h-5 text-white" />
                      <span className="text-[9px] text-white">Share</span>
                    </button>
                  </div>
                  {/* Top branding */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-bold flex items-center gap-1">
                    <Music2 className="w-2.5 h-2.5" /> SpagKing
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1.5 num">▶ {v.views} views</div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Instagram gallery */}
      {tab === "instagram" && (
        <div>
          {/* Stories row */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-3 mb-4">
            {["👑", "🔥", "🍜", "🎂", "🥤", "🌶️", "👨‍🍳", "🎉"].map((s, i) => (
              <button key={i} onClick={() => toast.success("Opening story…")} className="shrink-0 flex flex-col items-center gap-1.5">
                <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-br from-[#FF80AB] via-[#FFD700] to-[#A78BFA]">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-2xl">{s}</div>
                </div>
                <span className="text-[10px] text-muted-foreground">{i === 0 ? "You" : `Story ${i}`}</span>
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-1.5">
            {INSTAGRAM_POSTS.map((p, i) => {
              const id = `ig-${i}`;
              const isLiked = liked.has(id);
              return (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                  onClick={() => toast.success(`Viewing: ${p.caption}`)}
                  className={`relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br ${p.color} glass-card card-hover cursor-pointer group`}>
                  <div className="absolute inset-0 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">{p.emoji}</div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-3 text-white text-xs">
                      <span className="flex items-center gap-1"><Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-[var(--error)] text-[var(--error)]" : ""}`} /> <span className="num">{(p.likes + (isLiked ? 1 : 0)).toLocaleString()}</span></span>
                    </div>
                  </div>
                  {i === 0 && <div className="absolute top-1.5 right-1.5"><div className="w-4 h-4 rounded bg-gradient-to-br from-[#FF80AB] to-[#A78BFA] flex items-center justify-center"><span className="text-[8px] font-bold text-white">LIVE</span></div></div>}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Facebook updates */}
      {tab === "facebook" && (
        <div className="space-y-3 max-w-2xl mx-auto">
          {FACEBOOK_POSTS.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
                  <img src="/spagking-logo.svg" alt="" className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">SpagKing Foods</div>
                  <div className="text-[10px] text-muted-foreground">{p.date}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  p.type === "event" ? "bg-[#4FC3F7]/15 text-[#4FC3F7]" :
                  p.type === "promo" ? "bg-[var(--gold)]/15 text-[var(--gold)]" : "bg-[var(--success)]/15 text-[var(--success)]"
                }`}>{p.type.toUpperCase()}</span>
              </div>
              <h3 className="font-display font-semibold text-base mb-1">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{p.desc}</p>
              {p.type === "event" && (
                <div className="rounded-xl bg-gradient-to-br from-[#4FC3F7]/10 to-transparent border border-[#4FC3F7]/20 p-3 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[#4FC3F7]">📅 {p.date}</div>
                      <div className="text-muted-foreground mt-0.5">SpagKing VI Branch, Lagos</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold num">{p.going.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">going · {p.interested.toLocaleString()} interested</div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4 pt-3 border-t border-border/40 text-xs">
                <button onClick={() => toggleLike(`fb-${i}`)} className="flex items-center gap-1.5 text-muted-foreground hover:text-[#4FC3F7] transition-colors">
                  <ThumbsUp className={`w-3.5 h-3.5 ${liked.has(`fb-${i}`) ? "fill-[#4FC3F7] text-[#4FC3F7]" : ""}`} /> Like
                </button>
                <button onClick={() => toast.success("Comments opened")} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" /> Comment
                </button>
                <button onClick={() => toast.success("Shared!")} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                {p.type === "event" && (
                  <button onClick={() => toast.success("You're going! 🎉")} className="ml-auto btn-gold px-3 py-1 rounded-lg text-xs font-semibold">
                    I'm going
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* YouTube */}
      {tab === "youtube" && (
        <div className="grid sm:grid-cols-2 gap-4">
          {YOUTUBE_VIDEOS.map((v, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              onClick={() => toast.success(`Playing: ${v.title}`)}
              className="glass-card rounded-2xl overflow-hidden card-hover cursor-pointer group">
              <div className="relative aspect-video bg-gradient-to-br from-[var(--error)]/20 via-[#050505] to-[#050505] flex items-center justify-center">
                <div className="text-6xl opacity-30 group-hover:scale-110 transition-transform duration-500">▶</div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-[var(--error)]/80 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-medium num">{v.duration}</div>
              </div>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center shrink-0">
                    <img src="/spagking-logo.svg" alt="" className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-snug mb-1 line-clamp-2">{v.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">{v.desc}</p>
                    <div className="text-[10px] text-muted-foreground num">SpagKing TV · {v.views}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
