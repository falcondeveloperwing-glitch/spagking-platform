"use client";
import { motion } from "framer-motion";
import { Heart, Star, Clock, Plus, Flame, Leaf, Zap } from "lucide-react";
import { MealImage } from "./brand";
import { useStore } from "@/lib/store";
import { formatNaira, type Meal } from "@/lib/data";
import { toast } from "sonner";

export function MealCard({ meal, index = 0 }: { meal: Meal; index?: number }) {
  const addToCart = useStore(s => s.addToCart);
  const toggleFav = useStore(s => s.toggleFavorite);
  const favorites = useStore(s => s.favorites);
  const setCartOpen = useStore(s => s.setCartOpen);
  const isFav = favorites.includes(meal.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      mealId: meal.id, name: meal.name, emoji: meal.emoji, image: meal.image,
      price: meal.price + meal.sizes[0].price, qty: 1, size: meal.sizes[0].name,
    });
    toast.success(`${meal.name} added to cart`);
    setCartOpen(true);
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFav(meal.id);
    toast.success(isFav ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), type: "spring", stiffness: 120 }}
      whileHover={{ y: -6 }}
      onClick={() => useStore.getState().setSelectedMeal(meal.id)}
      className="group relative cursor-pointer rounded-2xl glass-card card-hover overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <MealImage src={meal.image} emoji={meal.emoji} alt={meal.name} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {meal.tags.includes("flash") && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white shadow-lg">
              <Zap className="w-2.5 h-2.5" /> FLASH
            </span>
          )}
          {meal.tags.includes("new") && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-lg">
              NEW
            </span>
          )}
          {meal.tags.includes("combo") && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500 text-white shadow-lg">
              COMBO
            </span>
          )}
        </div>

        <button onClick={handleFav}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${isFav ? "bg-red-500/90 text-white" : "bg-black/40 text-white hover:bg-black/60"}`}>
          <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
        </button>

        {/* Rating pill */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md">
          <Star className="w-3 h-3 text-[var(--gold)] fill-[var(--gold)]" />
          <span className="text-[11px] font-semibold text-white">{meal.rating}</span>
          <span className="text-[10px] text-white/70">({meal.reviews})</span>
        </div>
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-sm leading-snug line-clamp-1">{meal.name}</h3>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
            <Clock className="w-3 h-3" /> {meal.prepTime}m
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          {meal.spicy && <Flame className="w-3 h-3 text-red-400" />}
          {meal.vegetarian && <Leaf className="w-3 h-3 text-emerald-400" />}
          <span className="text-[10px] text-muted-foreground">{meal.category}</span>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="leading-none">
            {meal.oldPrice && <div className="text-[10px] text-muted-foreground line-through">{formatNaira(meal.oldPrice)}</div>}
            <div className="font-display font-bold text-base text-gold-gradient">{formatNaira(meal.price)}</div>
          </div>
          <button onClick={handleAdd}
            className="w-9 h-9 rounded-xl btn-gold flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
