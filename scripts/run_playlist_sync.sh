#!/usr/bin/env bash
# Resume the liked-video categorization after the YouTube Data API quota resets.
#
# Credentials come from the gitignored .env at the repo root, which the Python
# scripts load themselves. Nothing secret belongs in this file.
#
# Ordered cheapest-first: the site JSON and the privacy flip must land before the
# bulk inserts, which will exhaust the day's quota on their own. Every step is
# idempotent, so re-running on later days simply drains what is left.

set -uo pipefail

ROOT="/home/sakasu/dev/portfolio"
PY="$ROOT/.venv/bin/python3"
LOG="$ROOT/artifacts/playlist-sync.log"

mkdir -p "$ROOT/artifacts"
cd "$ROOT/scripts" || exit 1

echo "=== $(date -Is) starting ===" >>"$LOG"

run() {
  echo "--- $1" >>"$LOG"
  shift
  "$@" >>"$LOG" 2>&1
  echo "    exit=$?" >>"$LOG"
}

# 1. Render the new categories on the portfolio (~20 units).
run "add_site_categories" "$PY" add_site_categories.py

# 2. Make them readable by the site's unauthenticated fetcher (200 units).
run "set_playlist_privacy" "$PY" set_playlist_privacy.py \
  "Liked: Jpop" "Liked: Zn" "Liked: En" "Liked: Kpop" \
  --privacy unlisted --apply

# 3. Drain the Jpop backlog (50 units per add; this is what runs out).
run "categorize_liked_videos" "$PY" categorize_liked_videos.py \
  \
  --report artifacts/liked-video-categories-v6.json \
  --create --max-adds 150

echo "=== $(date -Is) finished ===" >>"$LOG"
