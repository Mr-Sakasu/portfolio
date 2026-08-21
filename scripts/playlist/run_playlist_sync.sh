#!/usr/bin/env bash
# Drain the remaining liked-video categorization backlog, then refresh the site JSON.
#
# Credentials come from the gitignored .env at the repo root, which the Python
# scripts load themselves. Nothing secret belongs in this file.
#
# QUOTA: the YouTube Data API allows 10,000 units/day, resetting at 00:00 Pacific
# (16:00 JST). Inserts cost 50 units each, reads cost 1. --max-adds 150 therefore
# caps a run at ~7,500 units and cannot overrun the daily budget on its own.
# Run this AT MOST ONCE PER DAY. It is idempotent: already-present videos are
# skipped, so a later run simply picks up wherever the previous one stopped.
#
# The privacy flip (Liked: Jpop/Zn/En/Kpop -> unlisted) is already done and is
# deliberately not repeated here; it cost 200 units per run for no further gain.

set -uo pipefail

ROOT="/home/sakasu/dev/portfolio"
PY="$ROOT/.venv/bin/python3"
LOG="$ROOT/artifacts/playlist-sync.log"

mkdir -p "$ROOT/artifacts"
cd "$ROOT/scripts/playlist" || exit 1

echo "=== $(date -Is) starting ===" >>"$LOG"

run() {
  echo "--- $1" >>"$LOG"
  shift
  "$@" >>"$LOG" 2>&1
  echo "    exit=$?" >>"$LOG"
}

# 1. Add the videos still missing from their categories (50 units per add).
run "categorize_liked_videos" "$PY" categorize_liked_videos.py \
  --report artifacts/liked-video-categories-v6.json \
  --create --max-adds 150

# 2. Re-read the playlists into src/data/generated/ytmusic-playlist.json so the portfolio
#    reflects whatever step 1 just added (~20 units). Runs last for that reason.
run "add_site_categories" "$PY" add_site_categories.py

echo "=== $(date -Is) finished ===" >>"$LOG"
