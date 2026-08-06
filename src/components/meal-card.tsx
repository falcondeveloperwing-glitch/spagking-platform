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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      onClick={() => useStore.getState().setSelectedMeal(meal.id)}
      className="group relative cursor-pointer rounded-2xl glass-card overflow-hidden card-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <MealImage src={meal.image} emoji={meal.emoji} alt={meal.name} className="w-full h-full transition-transform duration-700 group-hover:scale-105" />

        {/* Gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Premium sheen on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Top-left badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {meal.tags.includes("flash") && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E5586E] text-white shadow-lg backdrop-blur-sm">
              <Zap className="w-2.5 h-2.5" /> FLASH
            </span>
          )}
          {meal.tags.includes("new") && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[var(--success)]/90 text-[#100D0A] shadow-lg backdrop-blur-sm">
              NEW
            </span>
          )}
          {meal.tags.includes("combo") && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#A78BFA] text-white shadow-lg backdrop-blur-sm">
              COMBO
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button onClick={handleFav}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${isFav ? "bg-[#E5586E]/90 text-white" : "bg-black/40 text-white hover:bg-black/60 hover:scale-110"}`}>
          <Heart className={`w-3.5 h-3.5 transition-transform ${isFav ? "fill-current scale-110" : ""}`} />
        </button>

        {/* Rating + prep time at bottom */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md">
            <Star className="w-2.5 h-2.5 text-[var(--gold)] fill-[var(--gold)]" />
            <span className="text-[10px] font-semibold text-white num">{meal.rating}</span>
            <span className="text-[9px] text-white/60">({meal.reviews})</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md">
            <Clock className="w-2.5 h-2.5 text-white/70" />
            <span className="text-[10px] font-medium text-white num">{meal.prepTime}m</span>
          </div>
        </div>
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-medium text-sm leading-snug line-clamp-1">{meal.name}</h3>
          <div className="flex items-center gap-1 shrink-0">
            {meal.spicy && <Flame className="w-3 h-3 text-[#E5586E]" />}
            {meal.vegetarian && <Leaf className="w-3 h-3 text-[var(--success)]" />}
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 mt-2.5">
          <div className="leading-none">
            {meal.oldPrice && <div className="text-[10px] text-muted-foreground line-through num">{formatNaira(meal.oldPrice)}</div>}
            <div className="font-display font-semibold text-base text-gold-gradient num">{formatNaira(meal.price)}</div>
          </div>
          <button onClick={handleAdd}
            className="w-9 h-9 rounded-xl btn-gold flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
            aria-label={`Add ${meal.name} to cart`}>
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
