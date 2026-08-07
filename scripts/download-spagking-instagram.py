#!/usr/bin/env python3
"""
Extract real image URLs from SpagKing Instagram posts via the page_reader.
Handles the multi-object JSON response by regex-extracting image URLs directly.
"""
import json, subprocess, re, urllib.request
from pathlib import Path

ASSETS = Path("/home/z/my-project/public/spagking-assets")
(ASSETS / "instagram").mkdir(parents=True, exist_ok=True)

POSTS = [
    ("shawarma-post.jpg", "https://www.instagram.com/p/DUFtAwugGFi"),
    ("stir-fry-post.jpg", "https://www.instagram.com/p/DQMyvl1jL7y"),
    ("oriental-pasta-post.jpg", "https://www.instagram.com/reel/DbOF1GXKglS"),
    ("brand-post.jpg", "https://www.instagram.com/p/DWKAjv5gDrx"),
    ("lekki-branches-post.jpg", "https://www.instagram.com/p/DYcHdvqgXPy"),
    ("surulere-post.jpg", "https://www.instagram.com/p/DbBOMCvKtRf"),
    ("monday-menu-post.jpg", "https://www.instagram.com/reel/DM7oXBPK-8G"),
    ("spicy-spag-post.jpg", "https://www.instagram.com/reel/DZU1SkvAShX"),
]

def read_page_raw(url):
    """Return raw stdout from page_reader (contains JSON with metadata)."""
    try:
        r = subprocess.run(
            ["z-ai", "function", "-n", "page_reader", "-a", json.dumps({"url": url})],
            capture_output=True, text=True, timeout=90
        )
        return r.stdout
    except Exception as e:
        print(f"  read error: {e}")
        return ""

def extract_image_url(raw):
    """Regex-extract the Instagram CDN image URL from raw output."""
    # Look for scontent*.cdninstagram.com jpg URLs (og:image / twitter:image)
    m = re.search(r'https://scontent[\w.-]*\.cdninstagram\.com/[^"\\\s]+\.jpg[^"\\\s]*', raw)
    if m:
        url = m.group(0)
        # Unescape any \u0026 style escapes
        url = url.replace("\\u0026", "&")
        return url
    return None

def download(url, filepath):
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "image/*,*/*",
        })
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        with open(filepath, "wb") as f: f.write(data)
        return len(data)
    except Exception as e:
        print(f"  download error: {e}")
        return 0

def main():
    print("Extracting real SpagKing Instagram photos...")
    ok = 0
    for i, (filename, post_url) in enumerate(POSTS, 1):
        filepath = ASSETS / "instagram" / filename
        if filepath.exists() and filepath.stat().st_size > 5000:
            print(f"[{i}/{len(POSTS)}] {filename} exists, skipping")
            ok += 1; continue
        print(f"[{i}/{len(POSTS)}] Reading {post_url}")
        raw = read_page_raw(post_url)
        img_url = extract_image_url(raw)
        if not img_url:
            print("  no CDN image URL found"); continue
        print(f"  found: {img_url[:80]}...")
        size = download(img_url, filepath)
        if size > 5000:
            print(f"  saved {filename} ({size//1024}KB)")
            ok += 1
        else:
            print(f"  download too small or failed")
    print(f"\nDone: {ok}/{len(POSTS)} real Instagram photos saved to {ASSETS/'instagram'}")

if __name__ == "__main__":
    main()
