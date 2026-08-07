#!/usr/bin/env python3
"""
Download SpagKing food images from ZAI image-search results.
Searches for real Nigerian food photos and downloads them locally.
"""
import json
import subprocess
import os
import urllib.request
from pathlib import Path

ASSETS_DIR = Path("/home/z/my-project/public/spagking-assets")
FOOD_DIR = ASSETS_DIR / "food"
FOOD_DIR.mkdir(parents=True, exist_ok=True)

SEARCHES = [
    ("spagking-stir-fry-spaghetti.jpg", "Nigerian stir fry spaghetti with vegetables and chicken"),
    ("spagking-bolognese.jpg", "spaghetti bolognese with beef tomato sauce closeup"),
    ("spagking-arrabbiata.jpg", "spicy arrabbiata pasta with chili peppers"),
    ("spagking-seafood-spaghetti.jpg", "seafood spaghetti with prawns and mussels"),
    ("spagking-jollof-spag.jpg", "Nigerian jollof spaghetti with peppered sauce"),
    ("spagking-carbonara.jpg", "spaghetti carbonara with bacon and parmesan"),
    ("jollof-rice-special.jpg", "Nigerian jollof rice with chicken and plantain"),
    ("fried-rice-royale.jpg", "Nigerian fried rice with vegetables and liver"),
    ("coconut-rice-fish.jpg", "coconut rice with grilled fish Nigerian"),
    ("ofada-rice-ayamase.jpg", "ofada rice with ayamase green pepper sauce"),
    ("special-shawarma.jpg", "Nigerian chicken shawarma wrap with garlic sauce"),
    ("beef-shawarma.jpg", "beef shawarma wrap with vegetables"),
    ("spicy-suya-shawarma.jpg", "spicy suya shawarma wrap with pepper"),
    ("royale-burger.jpg", "double beef cheeseburger with bacon"),
    ("crispy-chicken-burger.jpg", "crispy fried chicken burger with slaw"),
    ("fresh-zobo.jpg", "Nigerian zobo hibiscus drink with ginger"),
    ("chapman-cocktail.jpg", "Nigerian Chapman mocktail with grenadine"),
    ("pineapple-smoothie.jpg", "fresh pineapple smoothie in glass"),
    ("egusi-soup-pounded-yam.jpg", "Nigerian egusi soup with pounded yam and meat"),
    ("banga-soup-starch.jpg", "Nigerian banga soup with catfish and starch"),
    ("pepper-soup-catfish.jpg", "Nigerian catfish pepper soup with spices"),
    ("puff-puff.jpg", "Nigerian puff puff fried dough balls"),
    ("chocolate-lava-cake.jpg", "chocolate lava cake with molten center and ice cream"),
    ("tiramisu.jpg", "tiramisu dessert with mascarpone and coffee"),
    ("ice-cream-sundae.jpg", "ice cream sundae with chocolate and caramel"),
]

def search_images(query, count=3, gl="us"):
    try:
        result = subprocess.run(
            ["z-ai", "image-search", "-q", query, "--count", str(count), "--gl", gl, "--no-rank"],
            capture_output=True, text=True, timeout=120
        )
        output = result.stdout
        json_start = output.find("{")
        if json_start == -1:
            return []
        json_str = output[json_start:]
        data = json.loads(json_str)
        if data.get("success") and data.get("results"):
            return [r["original_url"] for r in data["results"] if r.get("original_url")]
    except Exception as e:
        print(f"  Error searching {query}: {e}")
    return []

def download_image(url, filepath):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as response:
            data = response.read()
            with open(filepath, "wb") as f:
                f.write(data)
        return True
    except Exception as e:
        print(f"  Download failed: {e}")
        return False

def main():
    print(f"Downloading SpagKing food images to {FOOD_DIR}")
    print(f"Total meals: {len(SEARCHES)}")
    success = 0
    failed = 0
    for i, (filename, query) in enumerate(SEARCHES, 1):
        filepath = FOOD_DIR / filename
        if filepath.exists() and filepath.stat().st_size > 1000:
            print(f"[{i}/{len(SEARCHES)}] {filename} - already exists, skipping")
            success += 1
            continue
        print(f"[{i}/{len(SEARCHES)}] Searching: {query}")
        urls = search_images(query, count=3)
        if not urls:
            print(f"  No images found, will keep placeholder")
            failed += 1
            continue
        if download_image(urls[0], filepath):
            size_kb = filepath.stat().st_size // 1024
            print(f"  Downloaded {filename} ({size_kb}KB)")
            success += 1
        else:
            if len(urls) > 1 and download_image(urls[1], filepath):
                size_kb = filepath.stat().st_size // 1024
                print(f"  Downloaded {filename} from backup ({size_kb}KB)")
                success += 1
            else:
                failed += 1
    print(f"\nDone: {success} downloaded, {failed} failed")
    return success, failed

if __name__ == "__main__":
    main()
