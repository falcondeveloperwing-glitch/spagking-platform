"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Clock, Flame, Leaf, Heart, Plus, Minus, ShoppingCart, Check, AlertTriangle, Play } from "lucide-react";
import { useStore } from "@/lib/store";
import { meals, formatNaira } from "@/lib/data";
import { MealImage } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function CustomerMealDetails() {
  const selectedMealId = useStore(s => s.selectedMealId);
  const setSelectedMeal = useStore(s => s.setSelectedMeal);
  const addToCart = useStore(s => s.addToCart);
  const setCartOpen = useStore(s => s.setCartOpen);
  const toggleFav = useStore(s => s.toggleFavorite);
  const favorites = useStore(s => s.favorites);

  const meal = meals.find(m => m.id === selectedMealId);
  const [size, setSize] = useState(meal?.sizes[0].name || "Regular");
  const [toppings, setToppings] = useState<string[]>([]);
  const [qty, setQty] = useState(1);

  if (!meal) {
    return <div className="text-center py-20">Meal not found</div>;
  }

  const isFav = favorites.includes(meal.id);
  const sizeObj = meal.sizes.find(s => s.name === size)!;
  const toppingsTotal = toppings.reduce((sum, t) => sum + (meal.toppings.find(x => x.name === t)?.price || 0), 0);
  const unitPrice = meal.price + sizeObj.price + toppingsTotal;
  const totalPrice = unitPrice * qty;

  const relatedMeals = meals.filter(m => m.category === meal.category && m.id !== meal.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart({
      mealId: meal.id, name: meal.name, emoji: meal.emoji, image: meal.image,
      price: unitPrice, qty, size, toppings: toppings.length ? toppings : undefined,
    });
    toast.success(`${qty} × ${meal.name} added to cart`);
    setCartOpen(true);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    useStore.getState().setCustomerView("checkout");
  };

  const toggleTopping = (t: string) => {
    setToppings(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  return (
    <div className="space-y-5">
      <button onClick={() => setSelectedMeal(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to menu
      </button>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Image */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl overflow-hidden glass-card aspect-[4/3] lg:aspect-square">
          <MealImage src={meal.image} emoji={meal.emoji} alt={meal.name} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button onClick={() => toggleFav(meal.id)}
            className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${isFav ? "bg-red-500/90 text-white" : "bg-black/40 text-white hover:bg-black/60"}`}>
            <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
          </button>
          <div className="absolute top-4 left-4 flex gap-1.5">
            {meal.tags.includes("recommended") && <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[var(--gold)] text-black">RECOMMENDED</span>}
            {meal.tags.includes("popular") && <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white">POPULAR</span>}
            {meal.tags.includes("new") && <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-violet-500 text-white">NEW</span>}
          </div>
        </motion.div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{meal.category}</span>
              {meal.spicy && <span className="inline-flex items-center gap-1 text-xs text-red-400"><Flame className="w-3 h-3" /> Spicy</span>}
              {meal.vegetarian && <span className="inline-flex items-center gap-1 text-xs text-emerald-400"><Leaf className="w-3 h-3" /> Vegetarian</span>}
            </div>
            <h1 className="font-display text-3xl font-extrabold mb-2">{meal.name}</h1>
            <p className="text-sm text-muted-foreground">{meal.description}</p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)]" />
              <span className="font-semibold">{meal.rating}</span>
              <span className="text-xs text-muted-foreground">({meal.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" /> {meal.prepTime} min
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              🔥 {meal.calories} cal
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground">Sold:</span> {meal.sold.toLocaleString()}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="customize">
            <TabsList className="grid grid-cols-3 bg-muted/50">
              <TabsTrigger value="customize">Customize</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="customize" className="space-y-4 mt-4">
              {/* Sizes */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Choose size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {meal.sizes.map(s => (
                    <button key={s.name} onClick={() => setSize(s.name)}
                      className={`p-3 rounded-xl border text-left transition-all ${size === s.name ? "glass-gold border-[var(--gold)]/40" : "border-border/50 bg-muted/30 hover:border-border"}`}>
                      <div className="text-xs font-semibold">{s.name}</div>
                      <div className="text-[11px] text-muted-foreground">{s.price === 0 ? "Base" : `+${formatNaira(s.price)}`}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toppings */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Extra toppings</h3>
                <div className="grid grid-cols-2 gap-2">
                  {meal.toppings.map(t => {
                    const active = toppings.includes(t.name);
                    return (
                      <button key={t.name} onClick={() => toggleTopping(t.name)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${active ? "glass-gold border-[var(--gold)]/40" : "border-border/50 bg-muted/30 hover:border-border"}`}>
                        <span className="text-xs font-medium">{t.name}</span>
                        <span className="flex items-center gap-1.5">
                          <span className="text-[11px] text-muted-foreground">+{formatNaira(t.price)}</span>
                          {active && <Check className="w-3.5 h-3.5 text-[var(--gold)]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Allergens */}
              {meal.allergens.length > 0 && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-amber-400">Allergen info</div>
                    <div className="text-xs text-muted-foreground">Contains: {meal.allergens.join(", ")}</div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="ingredients" className="mt-4 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{meal.longDescription}</p>
              <div>
                <h4 className="text-sm font-semibold mb-2">Key ingredients</h4>
                <div className="flex flex-wrap gap-2">
                  {meal.ingredients.map(ing => (
                    <span key={ing} className="px-3 py-1 rounded-full text-xs bg-muted/60 text-muted-foreground">{ing}</span>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4 space-y-3">
              {[
                { name: "Adaobi N.", rating: 5, comment: "Best spaghetti I've had in Lagos! The portion was generous and the sauce was perfect.", date: "2 days ago" },
                { name: "Tunde A.", rating: 4, comment: "Tasty but the delivery was a bit late. Food was still hot though.", date: "1 week ago" },
                { name: "Fatima M.", rating: 5, comment: "My go-to spot. The Royal Bolognese is unmatched.", date: "2 weeks ago" },
              ].map((r, i) => (
                <div key={i} className="glass-card rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{r.name}</span>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {Array.from({ length: 5 }).map((_, j) => <Star key={j} className={`w-3 h-3 ${j < r.rating ? "text-[var(--gold)] fill-[var(--gold)]" : "text-muted-foreground/30"}`} />)}
                  </div>
                  <p className="text-xs text-muted-foreground">{r.comment}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related meals */}
      {relatedMeals.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-xl mb-3">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {relatedMeals.map((m, i) => (
              <button key={m.id} onClick={() => { setSelectedMeal(m.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="text-left group">
                <div className="relative aspect-square rounded-xl overflow-hidden glass-card card-hover">
                  <MealImage src={m.image} emoji={m.emoji} alt={m.name} className="w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-xs font-semibold text-white line-clamp-1">{m.name}</div>
                    <div className="text-[10px] text-[var(--gold)] font-bold">{formatNaira(m.price)}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* === Live activity badge === */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--error)]/15 text-[var(--error)] text-[9px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--error)] pulse-dot text-[var(--error)]" /> LIVE
          </span>
          <span className="text-xs font-semibold">Kitchen activity for this meal</span>
        </div>
        {(() => {
          // Deterministic "people ordered" count from meal id (avoids hydration mismatch)
          const ordered = ((meal.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % 20) + 12);
          return [
            { icon: "🔥", text: `${ordered} people ordered this meal today`, color: "text-foreground" },
            { icon: "👨‍🍳", text: `Chef Ibrahim is preparing fresh bowls right now`, color: "text-foreground" },
            { icon: "🛵", text: `Riders are delivering this around Lagos`, color: "text-foreground" },
            { icon: "✨", text: `Fresh ingredients arrived this morning`, color: "text-foreground" },
          ];
        })().map((a, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
            className="flex items-center gap-2.5 text-xs">
            <span className="text-base">{a.icon}</span>
            <span className={a.color}>{a.text}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* === Chef's story === */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gold-soft flex items-center justify-center text-3xl shrink-0">👨‍🍳</div>
          <div className="flex-1">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Chef's story</div>
            <h3 className="font-display font-semibold mb-1.5">Crafted by Chef Ibrahim</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              "I created the {meal.name} after years of perfecting the recipe. The secret is in the slow-cooked sauce and the gold-dust garnish that finishes every plate. When you taste it, you're tasting years of passion for Nigerian-Italian fusion. Every bowl is a piece of my story."
            </p>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 text-[var(--gold)] fill-[var(--gold)]" /> 4.9 chef rating</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">12 years at SpagKing</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* === Video preparation (demo) === */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-semibold mb-3 flex items-center gap-2">▶️ Watch how it's made</h3>
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-[var(--gold)]/15 via-[#050505] to-[#050505] cursor-pointer group"
          onClick={() => toast.success("Playing preparation video…")}>
          <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-30 group-hover:scale-110 transition-transform duration-500">{meal.emoji}</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold-lg">
              <Play className="w-7 h-7 text-black fill-black ml-1" />
            </motion.div>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-medium">2:34 · Preparation</span>
            <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-medium num">142K views</span>
          </div>
        </div>
      </motion.div>

      {/* === Frequently ordered together === */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="min-w-0 max-w-full overflow-hidden">
        <h3 className="font-display font-semibold mb-3">Frequently ordered together</h3>
        <div className="glass-card rounded-2xl p-4 overflow-hidden max-w-full">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 max-w-full">
            {/* Main meal */}
            <div className="shrink-0 w-32">
              <div className="relative aspect-square rounded-xl overflow-hidden glass-card">
                <MealImage src={meal.image} emoji={meal.emoji} alt={meal.name} className="w-full h-full" />
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="text-[10px] font-semibold text-white line-clamp-1 drop-shadow">{meal.name}</div>
                  <div className="text-[9px] text-[var(--gold)] font-bold">{formatNaira(meal.price)}</div>
                </div>
              </div>
            </div>
            <span className="text-2xl text-muted-foreground shrink-0">+</span>
            {/* Pairing 1 */}
            <div className="shrink-0 w-32">
              <div className="relative aspect-square rounded-xl overflow-hidden glass-card">
                <MealImage src={meals[40].image} emoji={meals[40].emoji} alt={meals[40].name} className="w-full h-full" />
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="text-[10px] font-semibold text-white line-clamp-1 drop-shadow">{meals[40].name}</div>
                  <div className="text-[9px] text-[var(--gold)] font-bold">{formatNaira(meals[40].price)}</div>
                </div>
              </div>
            </div>
            <span className="text-2xl text-muted-foreground shrink-0">+</span>
            {/* Pairing 2 */}
            <div className="shrink-0 w-32">
              <div className="relative aspect-square rounded-xl overflow-hidden glass-card">
                <MealImage src={meals[16].image} emoji={meals[16].emoji} alt={meals[16].name} className="w-full h-full" />
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="text-[10px] font-semibold text-white line-clamp-1 drop-shadow">{meals[16].name}</div>
                  <div className="text-[9px] text-[var(--gold)] font-bold">{formatNaira(meals[16].price)}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-muted-foreground">Bundle total</div>
              <div className="font-display font-bold text-lg text-gold-neon num">{formatNaira(meal.price + meals[40].price + meals[16].price)}</div>
              <div className="text-[10px] text-[var(--success)]">Save {formatNaira(800)} when bundled</div>
            </div>
            <button onClick={() => {
              useStore.getState().addToCart({ mealId: meal.id, name: meal.name, emoji: meal.emoji, image: meal.image, price: meal.price, qty: 1, size: meal.sizes[0].name });
              useStore.getState().addToCart({ mealId: meals[40].id, name: meals[40].name, emoji: meals[40].emoji, image: meals[40].image, price: meals[40].price, qty: 1, size: meals[40].sizes[0].name });
              useStore.getState().addToCart({ mealId: meals[16].id, name: meals[16].name, emoji: meals[16].emoji, image: meals[16].image, price: meals[16].price, qty: 1, size: meals[16].sizes[0].name });
              toast.success("Bundle added to cart!");
              useStore.getState().setCartOpen(true);
            }} className="btn-gold px-4 py-2 rounded-xl text-xs font-semibold">Add bundle</button>
          </div>
        </div>
      </motion.div>

      {/* === Pairing suggestions === */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="font-display font-semibold mb-3">Pairing suggestions</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { emoji: "🥤", name: "Fresh Zobo", reason: "Cuts the richness perfectly", price: 1200 },
            { emoji: "🍹", name: "Chapman Cocktail", reason: "Refreshes between bites", price: 1800 },
            { emoji: "☕", name: "Iced Caramel Macchiato", reason: "For the after-meal kick", price: 2500 },
          ].map((p, i) => (
            <button key={i} onClick={() => toast.success(`${p.name} added`)}
              className="glass-card rounded-2xl p-3 text-left card-hover">
              <div className="text-3xl mb-1.5">{p.emoji}</div>
              <div className="text-xs font-semibold">{p.name}</div>
              <div className="text-[10px] text-muted-foreground mb-1.5">{p.reason}</div>
              <div className="text-xs font-bold text-[var(--gold)] num">{formatNaira(p.price)}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* === Customer photos === */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="font-display font-semibold mb-3">Customer photos</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {[meal.image, meals[1].image, meals[2].image, meals[3].image, meals[4].image].map((img, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden glass-card card-hover cursor-pointer"
              onClick={() => toast.success("Viewing customer photo")}>
              <MealImage src={img} emoji={meal.emoji} alt={`Customer photo ${i+1}`} className="w-full h-full" />
              <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] text-white">
                @{["adaobi","tunde","fatima","emeka","grace"][i]}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">📸 1,247 customers shared photos of this meal</p>
      </motion.div>

      {/* Sticky bottom bar */}
      <div className="sticky bottom-20 sm:bottom-4 z-30">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-3 flex items-center gap-3 max-w-2xl mx-auto">
          <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted">
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Total</div>
            <div className="font-display font-bold text-lg text-gold-gradient">{formatNaira(totalPrice)}</div>
          </div>
          <Button onClick={handleAddToCart} variant="outline" className="h-11 hidden sm:flex">
            <ShoppingCart className="w-4 h-4" /> Add
          </Button>
          <Button onClick={handleBuyNow} className="btn-gold h-12 px-5">
            Buy now
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
