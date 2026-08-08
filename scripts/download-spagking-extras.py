#!/usr/bin/env python3
"""Download branch/community/chef photos for SpagKing."""
import json, subprocess, urllib.request
from pathlib import Path

ASSETS = Path("/home/z/my-project/public/spagking-assets")
(ASSETS / "branches").mkdir(parents=True, exist_ok=True)
(ASSETS / "community").mkdir(parents=True, exist_ok=True)
(ASSETS / "chefs").mkdir(parents=True, exist_ok=True)
(ASSETS / "branding").mkdir(parents=True, exist_ok=True)

SEARCHES = [
    # Branch photos
    ("branches/lekki-branch.jpg", "modern Nigerian restaurant interior with warm lighting"),
    ("branches/lekki-exterior.jpg", "restaurant storefront at night in Lagos Nigeria"),
    ("branches/lokoja-branch.jpg", "cozy restaurant dining area with colorful decor"),
    ("branches/surulere-branch.jpg", "Nigerian restaurant counter with menu board"),
    # Community / happy customers
    ("community/post-1.jpg", "happy customer eating spaghetti at restaurant"),
    ("community/post-2.jpg", "Nigerian food flat lay on table top"),
    ("community/post-3.jpg", "friends enjoying meal together at restaurant"),
    ("community/post-4.jpg", "Nigerian food delivery rider with bag"),
    ("community/post-5.jpg", "chef cooking in restaurant kitchen wok stir fry"),
    # Chef photos
    ("chefs/chef-ibrahim.jpg", "African male chef portrait in kitchen"),
    ("chefs/chef-bisi.jpg", "African female chef portrait smiling"),
    # Branding / banner
    ("branding/hero-banner.jpg", "delicious Nigerian spaghetti dish dark background gourmet"),
]

def search(query, count=3, gl="us"):
    try:
        r = subprocess.run(["z-ai","image-search","-q",query,"--count",str(count),"--gl",gl,"--no-rank"],
                            capture_output=True, text=True, timeout=120)
        out = r.stdout
        i = out.find("{")
        if i == -1: return []
        d = json.loads(out[i:])
        if d.get("success") and d.get("results"):
            return [x["original_url"] for x in d["results"] if x.get("original_url")]
    except Exception as e:
        print(f"  err: {e}")
    return []

def dl(url, fp):
    try:
        req = urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        with open(fp, "wb") as f: f.write(data)
        return True
    except Exception as e:
        print(f"  dl fail: {e}")
        return False

ok = 0
for i,(fn,q) in enumerate(SEARCHES,1):
    fp = ASSETS / fn
    if fp.exists() and fp.stat().st_size > 1000:
        print(f"[{i}/{len(SEARCHES)}] {fn} exists"); ok += 1; continue
    print(f"[{i}/{len(SEARCHES)}] {q}")
    urls = search(q)
    if not urls:
        print("  none"); continue
    if dl(urls[0], fp):
        print(f"  ok {fp.stat().st_size//1024}KB"); ok += 1
    elif len(urls)>1 and dl(urls[1], fp):
        print(f"  ok backup"); ok += 1
print(f"\nDone: {ok}/{len(SEARCHES)}")
