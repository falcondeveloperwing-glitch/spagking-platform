"use client";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { LandingNav } from "./landing-nav";
import { MealImage } from "@/components/brand";
import { FadeIn, TextReveal, Stagger, StaggerItem, NumberCount } from "@/components/shared/anim";
import { meals, formatNaira } from "@/lib/data";
import { reviews } from "@/content/reviews";
import { socialPosts } from "@/content/social";
import { branches } from "@/content/branches";
import { gallery } from "@/content/gallery";
import { restaurant } from "@/content/restaurant";
import { brand } from "@/content/brand";
import { ArrowRight, Star, Clock, MapPin, Phone, Flame, Leaf, Sparkles, Crown, Heart, Users, Truck, ShieldCheck, Utensils, ChevronRight, Instagram, Music2, Facebook, Youtube, MessageCircle } from "lucide-react";

export function LandingPage() {
  const setAppView = useStore(s => s.setAppView);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  const featuredMeals = meals.filter(m => m.tags.includes("recommended")).slice(0, 4);
  const bestSellers = [...meals].sort((a, b) => b.sold - a.sold).slice(0, 6);
  const galleryImages = gallery.slice(0, 8);

  const goToAuth = () => setAppView("auth");
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-brand text-foreground overflow-x-hidden">
      <LandingNav />

      {/* ============ HERO ============ */}
      <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image with parallax */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <MealImage src="/spagking-assets/food/spagking-stir-fry-spaghetti.jpg" emoji="🍝" alt="SpagKing signature stir-fry spaghetti" className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent" />
        </motion.div>

        {/* Floating gold particles */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {[
            { left: "15%", top: "30%", delay: 0 },
            { left: "85%", top: "25%", delay: 1.5 },
            { left: "70%", top: "70%", delay: 0.8 },
            { left: "25%", top: "75%", delay: 2.2 },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[var(--gold)]"
              style={{ left: p.left, top: p.top, boxShadow: "0 0 8px rgba(255,215,0,0.6)" }}
              animate={{ y: [0, -30, 0], opacity: [0, 0.7, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-gold text-xs font-medium mb-6"
          >
            <Crown className="w-3.5 h-3.5 text-[var(--gold)]" />
            No 1 Food Brand in Lokoja · Now in Lagos
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl sm:text-7xl font-bold tracking-tight leading-[1.02] mb-5"
          >
            A Different<br />
            <span className="text-gold-neon">Experience</span><br />
            With Food.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Signature stir-fry spaghetti, Oriental Pasta, Shawarma & more — crafted with passion, served with excellence. Now delivering across Lagos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button onClick={goToAuth} className="btn-gold px-7 py-3.5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2">
              Order Now <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => scrollTo("menu")} className="px-7 py-3.5 rounded-xl text-sm font-semibold glass border border-border/50 hover:border-[var(--gold)]/30 transition-colors inline-flex items-center justify-center gap-2">
              Explore Menu <Utensils className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center gap-6 mt-10 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" /> 4.8 rating</span>
            <span className="opacity-40">·</span>
            <span className="inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[var(--gold)]" /> 1,480+ followers</span>
            <span className="opacity-40">·</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[var(--gold)]" /> 4 branches</span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-foreground/30 flex items-start justify-center p-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-foreground/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* ============ CINEMATIC SCROLL EXPERIENCE ============ */}
      <CinematicScrollSection />

      {/* ============ THE SPAGKING EXPERIENCE ============ */}
      <section id="story" className="py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-xs font-medium mb-4">
              <Sparkles className="w-3 h-3 text-[var(--gold)]" /> The SpagKing Experience
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Colorful and Cozy —<br /><span className="text-gold-gradient">your favourite meal is waiting.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {restaurant.story.split("\n\n")[1] || "Born in Lokoja as the No 1 Food Brand, SpagKing built its name on signature stir-fry spaghetti and has since expanded across Lagos — Lekki Phase 1, Maroko/Oniru, and Surulere."}
            </p>
          </motion.div>

          {/* Value props */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Flame, title: "Bold Flavours", desc: "Well-seasoned, spicy spaghetti packed with rich flavours. Never bland." },
              { icon: Leaf, title: "Fresh Daily", desc: "Fresh ingredients sourced every morning. Quality you can taste." },
              { icon: Truck, title: "Fast Delivery", desc: "Hot food delivered to your door across Lagos in under 30 minutes." },
              { icon: Heart, title: "Community First", desc: "A different experience with food. We feed our neighbourhoods." },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card rounded-2xl p-5 text-center card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-soft flex items-center justify-center mx-auto mb-3">
                  <v.icon className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <h3 className="font-display font-semibold text-base mb-1.5">{v.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SIGNATURE FOOD ============ */}
      <section id="menu" className="py-20 sm:py-32 px-4 sm:px-6 bg-foreground/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-xs font-medium mb-4">
              <Utensils className="w-3 h-3 text-[var(--gold)]" /> Signature Menu
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              The dishes we're <span className="text-gold-gradient">famous for.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From our OG Stir Fry Spaghetti to the Oriental Pasta — every plate is crafted to satisfy your craving.
            </p>
          </motion.div>

          {/* Featured meals grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12">
            {featuredMeals.map((meal, i) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group cursor-pointer"
                onClick={goToAuth}
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden glass-card card-hover mb-3">
                  <MealImage src={meal.image} emoji={meal.emoji} alt={meal.name} className="w-full h-full transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-sm font-semibold text-white line-clamp-1">{meal.name}</div>
                    <div className="text-[var(--gold)] font-bold text-sm num">{formatNaira(meal.price)}</div>
                  </div>
                  {meal.tags.includes("recommended") && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[var(--gold)] text-black">CHEF'S PICK</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Best sellers — horizontal scroll */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-display font-semibold text-xl mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-[var(--warning)]" /> Best Sellers
            </h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {bestSellers.map((meal, i) => (
                <div key={meal.id} className="w-48 sm:w-56 shrink-0" onClick={goToAuth}>
                  <div className="relative aspect-square rounded-xl overflow-hidden glass-card card-hover mb-2">
                    <MealImage src={meal.image} emoji={meal.emoji} alt={meal.name} className="w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gold-gradient text-black text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-xs font-semibold text-white line-clamp-1">{meal.name}</div>
                      <div className="text-[var(--gold)] font-bold text-xs num">{formatNaira(meal.price)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="text-center mt-8">
            <button onClick={goToAuth} className="btn-gold px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
              View Full Menu <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ============ REAL CUSTOMER LOVE ============ */}
      <section id="reviews" className="py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-xs font-medium mb-4">
              <Heart className="w-3 h-3 text-[var(--gold)]" /> Customer Love
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              What people are <span className="text-gold-gradient">saying.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Reviews from public Instagram posts and TikTok. Verbatim quotes — never fabricated.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass-card rounded-2xl p-5 card-hover"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? "text-[var(--gold)] fill-[var(--gold)]" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {review.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">{review.meal}</div>
                    <div className="text-[10px] text-muted-foreground">{review.source} · {review.date}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ COMMUNITY + GALLERY ============ */}
      <section id="community" className="py-20 sm:py-32 px-4 sm:px-6 bg-foreground/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-xs font-medium mb-4">
              <Users className="w-3 h-3 text-[var(--gold)]" /> SpagKing Community
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Join the <span className="wordmark text-3xl">SpagKing</span> family
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Follow @{brand.social.instagram} for behind-the-scenes, chef moments, and customer reactions.
            </p>
          </motion.div>

          {/* Gallery grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
            {galleryImages.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="relative aspect-square rounded-xl overflow-hidden glass-card group cursor-pointer"
              >
                <MealImage src={img.url} emoji={img.emoji} alt={img.caption} className="w-full h-full transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <span className="text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">{img.caption}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social posts */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {socialPosts.slice(0, 4).map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="w-64 shrink-0 glass-card rounded-2xl overflow-hidden card-hover"
              >
                <div className="relative aspect-square">
                  <MealImage src={post.image} emoji={post.emoji} alt={post.caption} className="w-full h-full" />
                  {post.permalink && (
                    <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs line-clamp-2 mb-2">{post.caption}</p>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likes}</span>
                    <span className="inline-flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.comments}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href={brand.social.instagramUrl || "https://www.instagram.com/spagking_/"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium glass border border-border/50 hover:border-[var(--gold)]/30 transition-colors"
            >
              <Instagram className="w-4 h-4 text-[var(--gold)]" /> Follow @{brand.social.instagram}
            </a>
          </div>
        </div>
      </section>

      {/* ============ BRANCHES ============ */}
      <section id="branches" className="py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-xs font-medium mb-4">
              <MapPin className="w-3 h-3 text-[var(--gold)]" /> Find Us
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Visit a <span className="text-gold-gradient">SpagKing</span> near you
            </h2>
            <p className="text-muted-foreground">From Lokoja to Lagos — 4 branches and counting.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {branches.map((branch, i) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass-card rounded-2xl p-5 card-hover"
              >
                {branch.photo && (
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                    <MealImage src={branch.photo} emoji="🏪" alt={branch.name} className="w-full h-full" />
                  </div>
                )}
                <h3 className="font-display font-semibold text-sm mb-1">{branch.shortName}</h3>
                <p className="text-[11px] text-muted-foreground mb-2 line-clamp-2">{branch.address || "Address pending verification"}</p>
                <div className="space-y-1 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-[var(--gold)]" /> {branch.openingHours}</div>
                  {branch.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-[var(--gold)]" /> {branch.phone}</div>}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                  <span className="inline-flex items-center gap-1 text-[10px]"><Star className="w-3 h-3 text-[var(--gold)] fill-[var(--gold)]" /> {branch.rating}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${branch.status === "open" ? "bg-[var(--success)]/15 text-[var(--success)]" : branch.status === "busy" ? "bg-[var(--warning)]/15 text-[var(--warning)]" : "bg-[var(--error)]/15 text-[var(--error)]"}`}>
                    {branch.status.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ORDER NOW CTA ============ */}
      <section className="py-20 sm:py-32 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center relative rounded-3xl overflow-hidden p-8 sm:p-12 bg-gold-shimmer text-black"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.4),transparent_50%)]" />
          <div className="relative">
            <Crown className="w-10 h-10 mx-auto mb-4 opacity-80" />
            <h2 className="font-display text-3xl sm:text-5xl font-bold mb-3">
              Your favourite meal<br />is waiting for you.
            </h2>
            <p className="text-sm sm:text-base opacity-80 max-w-md mx-auto mb-6">
              Order now for delivery, pickup, or dine-in. Earn loyalty points with every order.
            </p>
            <button onClick={goToAuth} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-black text-white text-sm font-semibold hover:scale-105 transition-transform">
              Start Your Order <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-border/40 px-4 sm:px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/spagking-logo.svg" alt="SpagKing" className="w-8 h-8" />
                <span className="wordmark text-lg">SpagKing</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                {brand.tagline}
              </p>
              <div className="flex gap-2">
                {brand.social.instagramUrl && (
                  <a href={brand.social.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:glass-gold transition-colors" aria-label="Instagram">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                <div className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:glass-gold transition-colors" aria-label="TikTok">
                  <Music2 className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:glass-gold transition-colors" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:glass-gold transition-colors" aria-label="YouTube">
                  <Youtube className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Explore</h4>
              <ul className="space-y-2">
                {NAV_LINKS.map(link => (
                  <li key={link.target}>
                    <button onClick={() => document.getElementById(link.target)?.scrollIntoView({ behavior: "smooth" })} className="text-xs text-muted-foreground hover:text-[var(--gold)] transition-colors">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Branches */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Branches</h4>
              <ul className="space-y-2">
                {branches.map(b => (
                  <li key={b.id} className="text-xs text-muted-foreground">
                    {b.shortName} · {b.city}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contact</h4>
              <ul className="space-y-2">
                {restaurant.phone && <li className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="w-3 h-3 text-[var(--gold)]" /> {restaurant.phone}</li>}
                <li className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="w-3 h-3 text-[var(--gold)]" /> Mon – Sat · 8AM – 10PM</li>
                <li className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="w-3 h-3 text-[var(--gold)]" /> Lokoja · Lagos</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[10px] text-muted-foreground">
              © 2026 SpagKing · {brand.tagline.split(".")[0]}
            </p>
            <button onClick={goToAuth} className="text-[10px] text-muted-foreground hover:text-[var(--gold)] transition-colors inline-flex items-center gap-1">
              Sign in <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

const NAV_LINKS = [
  { label: "Home", target: "hero" },
  { label: "Story", target: "story" },
  { label: "Menu", target: "menu" },
  { label: "Reviews", target: "reviews" },
  { label: "Community", target: "community" },
  { label: "Branches", target: "branches" },
];

// =====================================================
// CINEMATIC SCROLL EXPERIENCE
// A scroll-driven visual story through the SpagKing experience.
// Architecture supports swapping the poster images for real video.
// To add production video: replace <MealImage> with <video> and set
// the `videoSrc` prop. The scroll-driven parallax will still work.
// =====================================================

const SCROLL_SCENES = [
  { id: 1, title: "Walk In", subtitle: "Warm. Welcoming. unmistakably SpagKing.", image: "/spagking-assets/branches/lekki-branch.jpg", emoji: "🏪" },
  { id: 2, title: "Choose Your Table", subtitle: "Find your spot. Relax. We've got the rest.", image: "/spagking-assets/branches/lokoja-branch.jpg", emoji: "🪑" },
  { id: 3, title: "Order Your Way", subtitle: "Signature stir-fry, jollof, shawarma — your craving, our craft.", image: "/spagking-assets/food/spagking-stir-fry-spaghetti.jpg", emoji: "📱" },
  { id: 4, title: "Straight to the Kitchen", subtitle: "Every order goes directly to our chefs in real time.", image: "/spagking-assets/community/post-5.jpg", emoji: "👨‍🍳" },
  { id: 5, title: "Made Fresh", subtitle: "Premium ingredients, prepared to order, never pre-made.", image: "/spagking-assets/food/jollof-rice-special.jpg", emoji: "🔥" },
  { id: 6, title: "Served Right", subtitle: "Hot, fresh, and delivered to your table or your door.", image: "/spagking-assets/food/special-shawarma.jpg", emoji: "🍽️" },
  { id: 7, title: "Experience SpagKing", subtitle: "More than a meal. It's the SpagKing experience.", image: "/spagking-assets/food/spagking-bolognese.jpg", emoji: "👑" },
];

function CinematicScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const setAppView = useStore(s => s.setAppView);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = scrolled / (sectionHeight - viewportHeight);
      const sceneIndex = Math.min(
        Math.floor(progress * SCROLL_SCENES.length),
        SCROLL_SCENES.length - 1
      );
      setActiveScene(sceneIndex);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={containerRef} className="relative" style={{ height: `${SCROLL_SCENES.length * 80}vh` }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background media — swap MealImage for <video> in production */}
        <AnimatePresence mode="popLayout">
          {SCROLL_SCENES.map((scene, i) => (
            activeScene === i && (
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 z-0"
              >
                <MealImage src={scene.image} emoji={scene.emoji} alt={scene.title} className="w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Scene content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-16 max-w-4xl">
          {/* Scene counter */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-bold text-[var(--gold)] num">
              {String(activeScene + 1).padStart(2, "0")}
            </span>
            <span className="text-xs text-muted-foreground/50">/ {String(SCROLL_SCENES.length).padStart(2, "0")}</span>
            <div className="w-12 h-px bg-[var(--gold)]/30 ml-2" />
          </div>

          {/* Scene title — word-by-word reveal */}
          <AnimatePresence mode="wait">
            {SCROLL_SCENES.map((scene, i) => (
              activeScene === i && (
                <motion.div key={scene.id}>
                  <motion.h2
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-4xl sm:text-7xl font-bold tracking-tight leading-[1.05] mb-4"
                  >
                    {scene.title.split(" ").map((word, wi) => (
                      <motion.span
                        key={wi}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: wi * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-block"
                        style={{ marginRight: "0.25em" }}
                      >
                        {word === "SpagKing" ? <span className="text-gold-gradient">SpagKing</span> : word}
                      </motion.span>
                    ))}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-base sm:text-xl text-muted-foreground max-w-md leading-relaxed"
                  >
                    {scene.subtitle}
                  </motion.p>
                </motion.div>
              )
            ))}
          </AnimatePresence>

          {/* Final CTA on last scene */}
          {activeScene === SCROLL_SCENES.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8"
            >
              <button onClick={() => setAppView("auth")} className="btn-gold px-7 py-3.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
                Start Your Order <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Progress bar */}
          <div className="absolute bottom-12 left-6 right-6 sm:left-16 sm:right-16 max-w-md">
            <div className="h-0.5 bg-foreground/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gold-gradient"
                animate={{ width: `${((activeScene + 1) / SCROLL_SCENES.length) * 100}%` }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[9px] text-muted-foreground/50">
              {SCROLL_SCENES.map((s, i) => (
                <span key={s.id} className={activeScene === i ? "text-[var(--gold)] font-medium" : ""}>
                  {s.title.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint on first scene */}
        {activeScene === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-5 h-8 rounded-full border border-foreground/20 flex items-start justify-center p-1.5"
            >
              <div className="w-1 h-1.5 rounded-full bg-foreground/40" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
