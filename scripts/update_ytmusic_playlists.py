#!/usr/bin/env python3
"""Refresh the localized playlist JSON used by the portfolio site."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any

from fetch_ytmusic_playlist import (
    DEFAULT_OUTPUT,
    build_oauth_credentials,
    build_ytmusic_payload,
    collection_payload,
    empty_payload,
    fetch_youtube_data_playlist,
    load_dotenv,
    load_oauth_token,
    project_path,
    write_json,
)
from ytmusicapi import YTMusic


DATE_KEYS = ("publishedAt", "uploadedAt", "addedAt")


def read_payload(path: Path) -> dict[str, Any]:
    if not path.is_file():
        return empty_payload()

    data = json.loads(path.read_text(encoding="utf-8"))
    return data if isinstance(data, dict) else empty_payload()


def playlist_items(collection: dict[str, Any]) -> list[dict[str, Any]]:
    playlists = collection.get("playlists")
    if isinstance(playlists, list) and playlists:
        return [item for item in playlists if isinstance(item, dict)]
    return [collection] if collection.get("playlistId") else []


def configured_groups(payload: dict[str, Any]) -> dict[str, list[str]]:
    by_lang = payload.get("byLang") if isinstance(payload.get("byLang"), dict) else {}
    groups: dict[str, list[str]] = {}

    for lang, collection in by_lang.items():
        if not isinstance(collection, dict):
            continue

        playlist_ids: list[str] = []
        for playlist in playlist_items(collection):
            playlist_id = str(playlist.get("playlistId") or "")
            if playlist_id and playlist_id not in playlist_ids:
                playlist_ids.append(playlist_id)
        if playlist_ids:
            groups[str(lang)] = playlist_ids

    if groups:
        return groups

    playlist_ids = []
    for playlist in playlist_items(payload):
        playlist_id = str(playlist.get("playlistId") or "")
        if playlist_id and playlist_id not in playlist_ids:
            playlist_ids.append(playlist_id)

    return {"en": playlist_ids} if playlist_ids else {}


def existing_date_map(payload: dict[str, Any]) -> dict[tuple[str, str], dict[str, str]]:
    dates: dict[tuple[str, str], dict[str, str]] = {}
    collections = [payload]
    by_lang = payload.get("byLang") if isinstance(payload.get("byLang"), dict) else {}
    collections.extend(collection for collection in by_lang.values() if isinstance(collection, dict))

    for collection in collections:
        for playlist in playlist_items(collection):
            playlist_id = str(playlist.get("playlistId") or "")
            for track in playlist.get("tracks") or []:
                if not isinstance(track, dict):
                    continue
                video_id = str(track.get("videoId") or "")
                if not playlist_id or not video_id:
                    continue
                track_dates = {key: str(track[key]) for key in DATE_KEYS if track.get(key)}
                if track_dates:
                    dates[(playlist_id, video_id)] = track_dates
    return dates


def apply_dates(playlist: dict[str, Any], dates: dict[tuple[str, str], dict[str, str]]) -> None:
    playlist_id = str(playlist.get("playlistId") or "")
    for track in playlist.get("tracks") or []:
        if not isinstance(track, dict):
            continue
        track_dates = dates.get((playlist_id, str(track.get("videoId") or "")))
        if not track_dates:
            continue
        for key, value in track_dates.items():
            track[key] = value


def fetch_music_playlist(playlist_id: str, limit: int, language: str) -> dict[str, Any]:
    ytmusic = YTMusic(language=language)
    playlist = ytmusic.get_playlist(playlist_id, limit=max(limit, 1))
    return build_ytmusic_payload(playlist_id, playlist)


def fetch_date_map(
    playlist_ids: list[str],
    oauth_token: dict[str, Any] | None,
    limit: int,
) -> dict[tuple[str, str], dict[str, str]]:
    dates: dict[tuple[str, str], dict[str, str]] = {}
    if not oauth_token:
        return dates

    for playlist_id in playlist_ids:
        payload = fetch_youtube_data_playlist(playlist_id, oauth_token, max(limit, 1))
        for track in payload.get("tracks") or []:
            if not isinstance(track, dict):
                continue
            video_id = str(track.get("videoId") or "")
            if not video_id:
                continue
            track_dates = {key: str(track[key]) for key in DATE_KEYS if track.get(key)}
            if track_dates:
                dates[(playlist_id, video_id)] = track_dates
    return dates


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=DEFAULT_OUTPUT, help="Existing playlist JSON used as config.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="Output playlist JSON.")
    parser.add_argument("--auth", default=os.environ.get("YTMUSIC_AUTH_FILE", "oauth.json"), help="OAuth token JSON.")
    parser.add_argument(
        "--limit",
        type=int,
        default=int(os.environ.get("YTMUSIC_PLAYLIST_LIMIT", "200")),
        help="Maximum tracks per playlist.",
    )
    parser.add_argument("--language", default=os.environ.get("YTMUSIC_LANGUAGE", "en"))
    parser.add_argument(
        "--oauth-credentials",
        default=os.environ.get("YTMUSIC_OAUTH_CREDENTIALS_JSON")
        or os.environ.get("YTMUSIC_OAUTH_CREDENTIALS_FILE", ""),
    )
    parser.add_argument("--oauth-client-id", default=os.environ.get("YTMUSIC_OAUTH_CLIENT_ID", ""))
    parser.add_argument("--oauth-client-secret", default=os.environ.get("YTMUSIC_OAUTH_CLIENT_SECRET", ""))
    return parser


def main() -> int:
    load_dotenv()
    args = build_parser().parse_args()
    input_path = project_path(str(args.input))
    output_path = project_path(str(args.output))
    existing_payload = read_payload(input_path)
    groups = configured_groups(existing_payload)

    if not groups:
        print(f"No playlists configured in {input_path}.", file=sys.stderr)
        return 1

    auth_path = project_path(args.auth) if args.auth else None
    oauth_token: dict[str, Any] | None = None
    if auth_path and auth_path.is_file():
        try:
            oauth_token = load_oauth_token(auth_path, build_oauth_credentials(args))
        except Exception as exc:
            print(f"Date enrichment disabled: {exc}", file=sys.stderr)

    all_playlist_ids = []
    for playlist_ids in groups.values():
        for playlist_id in playlist_ids:
            if playlist_id not in all_playlist_ids:
                all_playlist_ids.append(playlist_id)

    dates = existing_date_map(existing_payload)
    try:
        dates.update(fetch_date_map(all_playlist_ids, oauth_token, args.limit))
    except Exception as exc:
        print(f"Date enrichment failed; keeping existing dates where available: {exc}", file=sys.stderr)

    fetched_by_id: dict[str, dict[str, Any]] = {}
    for playlist_id in all_playlist_ids:
        try:
            playlist = fetch_music_playlist(playlist_id, args.limit, args.language)
        except Exception as exc:
            if not oauth_token:
                print(f"Failed to fetch {playlist_id}: {exc}", file=sys.stderr)
                return 1
            playlist = fetch_youtube_data_playlist(playlist_id, oauth_token, max(args.limit, 1))
            print(f"Used YouTube Data API fallback for {playlist_id}: {exc}", file=sys.stderr)

        apply_dates(playlist, dates)
        fetched_by_id[playlist_id] = playlist

    by_lang: dict[str, dict[str, Any]] = {}
    all_playlists: list[dict[str, Any]] = []
    for lang, playlist_ids in groups.items():
        lang_playlists = [fetched_by_id[playlist_id] for playlist_id in playlist_ids if playlist_id in fetched_by_id]
        if not lang_playlists:
            continue
        by_lang[lang] = collection_payload(lang_playlists)
        all_playlists.extend(lang_playlists)

    payload = collection_payload(all_playlists)
    payload["byLang"] = by_lang
    write_json(output_path, payload)

    summary = []
    for lang, collection in by_lang.items():
        playlists = collection.get("playlists") or []
        counts = ", ".join(f"{item['title']} ({len(item.get('tracks') or [])})" for item in playlists)
        summary.append(f"{lang}: {counts}")
    print(f"Wrote localized playlist data to {output_path}: {'; '.join(summary)}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
