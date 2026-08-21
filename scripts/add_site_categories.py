#!/usr/bin/env python3
"""Add the new liked-video categories to the portfolio's playlist JSON.

Reads the category playlists through the YouTube Data API and splices them
into src/data/ytmusic-playlist.json, preserving the existing curation. Safe to
re-run: a playlist already present in a locale keeps its position.

By default it also re-reads the playlists already in the file, because the ja
artist chart derives its bar heights from their track counts and would otherwise
keep showing whatever those counts were when the entry was first written.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from typing import Any

from categorize_liked_videos import list_owned_playlists
from fetch_ytmusic_playlist import (
    DEFAULT_OUTPUT,
    build_oauth_credentials,
    collection_payload,
    fetch_youtube_data_playlist,
    load_dotenv,
    load_oauth_token,
    project_path,
    write_json,
)


# "Liked: Jpop" and "Liked: Kpop" still exist on the channel but are kept off
# the site on purpose: Jpop duplicated all nine artist playlists at 351 tracks,
# and Kpop is a stub. Do not re-add them here without asking.
NEW_CATEGORIES = {
    "Liked: Zn": "PLiz-kupUIzB5Wl6V7K-nHcq0OUOafpUDn",
    "Liked: En": "PLiz-kupUIzB6AgBtn-rl0VEtX_wiyZiEY",
}

# The umbrella lists go to the locale whose music they hold. Kpop has no locale
# of its own, so it surfaces in all three rather than being hidden.
PLACEMENT = {
    "ja": [],
    "zh": ["Liked: Zn"],
    "en": ["Liked: En"],
}

# Artist playlists are created by categorize_liked_videos.py, which knows their
# titles but not this file, so they are discovered by prefix rather than listed.
ARTIST_PREFIX = "Liked: JPOP - "
ARTIST_LANG = "ja"


def fetch_with_backoff(playlist_id: str, token: dict[str, Any], limit: int) -> dict[str, Any]:
    """Paging trips the per-100-second read limit, which clears on its own."""
    delay = 30
    for attempt in range(5):
        try:
            return fetch_youtube_data_playlist(playlist_id, token, limit)
        except RuntimeError as exc:
            if "quota" not in str(exc).lower() or attempt == 4:
                raise
            print(f"  rate limited, waiting {delay}s", file=sys.stderr)
            time.sleep(delay)
            delay *= 2
    raise RuntimeError("unreachable")


def refresh(
    item: dict[str, Any],
    cache: dict[str, dict[str, Any]],
    token: dict[str, Any],
    args: argparse.Namespace,
) -> dict[str, Any]:
    """Re-read one already-present playlist, keeping its slot in the locale."""
    playlist_id = item.get("playlistId")
    if not playlist_id:
        return item
    if playlist_id in cache:
        return cache[playlist_id]
    if playlist_id in NEW_CATEGORIES.values():
        return item  # already fetched above
    try:
        fresh = fetch_with_backoff(playlist_id, token, args.limit)
    except RuntimeError as exc:
        # A quota wall mid-refresh must not blank a playlist that is already
        # rendering, so keep the stale copy and say so.
        print(f"  kept stale {item.get('title')}: {exc}", file=sys.stderr)
        return item
    was = len(item.get("tracks") or [])
    now = len(fresh.get("tracks") or [])
    print(f"refreshed {item.get('title')}: {was} -> {now} tracks")
    cache[playlist_id] = fresh
    time.sleep(args.pause)
    return fresh


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT))
    parser.add_argument("--auth", default=os.environ.get("YTMUSIC_AUTH_FILE", "oauth.json"))
    parser.add_argument("--limit", type=int, default=400)
    parser.add_argument("--pause", type=float, default=15.0, help="Seconds between playlists.")
    parser.add_argument(
        "--no-discover-artists",
        dest="discover_artists",
        action="store_false",
        help=f"Skip adding owned playlists titled '{ARTIST_PREFIX}...' that the file lacks.",
    )
    parser.add_argument(
        "--no-refresh-existing",
        dest="refresh_existing",
        action="store_false",
        help="Leave playlists already in the file untouched (keeps their stale track counts).",
    )
    parser.add_argument(
        "--oauth-credentials",
        default=os.environ.get("YTMUSIC_OAUTH_CREDENTIALS_JSON")
        or os.environ.get("YTMUSIC_OAUTH_CREDENTIALS_FILE", ""),
        help="Defaults to YTMUSIC_OAUTH_CREDENTIALS_JSON/FILE, normally set in .env.",
    )
    parser.add_argument("--oauth-client-id", default=os.environ.get("YTMUSIC_OAUTH_CLIENT_ID", ""))
    parser.add_argument("--oauth-client-secret", default=os.environ.get("YTMUSIC_OAUTH_CLIENT_SECRET", ""))
    return parser


def main() -> int:
    load_dotenv()
    args = build_parser().parse_args()

    try:
        token = load_oauth_token(project_path(args.auth), build_oauth_credentials(args))
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 1
    if not token:
        print(f"Could not load OAuth token from {args.auth}.", file=sys.stderr)
        return 1

    path = project_path(args.output)
    data = json.loads(path.read_text(encoding="utf-8"))
    by_lang = data.get("byLang") or {}

    needed = {title for titles in PLACEMENT.values() for title in titles}
    fetched: dict[str, dict[str, Any]] = {}
    for title in sorted(needed):
        playlist_id = NEW_CATEGORIES[title]
        fetched[title] = fetch_with_backoff(playlist_id, token, args.limit)
        print(f"fetched {title}: {len(fetched[title].get('tracks') or [])} tracks")
        time.sleep(args.pause)

    if args.discover_artists:
        owned = list_owned_playlists(token["access_token"])
        collection = by_lang.get(ARTIST_LANG) or {}
        existing = list(collection.get("playlists") or [])
        present = {item.get("playlistId") for item in existing}
        for title in sorted(owned):
            if not title.startswith(ARTIST_PREFIX) or owned[title] in present:
                continue
            try:
                fresh = fetch_with_backoff(owned[title], token, args.limit)
            except RuntimeError as exc:
                print(f"  skipped new {title}: {exc}", file=sys.stderr)
                continue
            print(f"discovered {title}: {len(fresh.get('tracks') or [])} tracks")
            existing.append(fresh)
            time.sleep(args.pause)
        collection["playlists"] = existing
        by_lang[ARTIST_LANG] = collection

    all_playlists: list[dict[str, Any]] = []
    refreshed: dict[str, dict[str, Any]] = {}
    for lang, titles in PLACEMENT.items():
        collection = by_lang.get(lang) or {}
        existing = list(collection.get("playlists") or [])
        if args.refresh_existing:
            existing = [refresh(item, refreshed, token, args) for item in existing]
        present = {item.get("playlistId") for item in existing}
        additions = [fetched[title] for title in titles if NEW_CATEGORIES[title] not in present]
        merged = additions + existing
        by_lang[lang] = collection_payload(merged)
        all_playlists.extend(merged)
        print(f"{lang}: {len(existing)} -> {len(merged)} playlists")

    payload = collection_payload(all_playlists)
    payload["byLang"] = by_lang
    write_json(path, payload)
    print(f"wrote {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
