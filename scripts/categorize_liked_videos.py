#!/usr/bin/env python3
"""Classify liked YouTube videos and optionally create private category playlists."""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from collections import OrderedDict
from pathlib import Path
from typing import Any

import requests

from fetch_ytmusic_playlist import (
    YOUTUBE_DATA_API,
    build_oauth_credentials,
    load_dotenv,
    load_oauth_token,
    project_path,
    youtube_data_get,
)


CATEGORY_TITLES = OrderedDict(
    [
        ("Zn", "Liked: Zn"),
        ("En", "Liked: En"),
        ("Jpop", "Liked: Jpop"),
    ]
)

CPOP_KEYWORDS = {
    "c-pop",
    "cpop",
    "mandopop",
    "chinese",
    "華語",
    "国语",
    "國語",
    "中文",
    "抖音",
    "周杰倫",
    "周杰伦",
    "林俊傑",
    "林俊杰",
    "鄧紫棋",
    "邓紫棋",
    "五月天",
    "告五人",
    "田馥甄",
    "孫燕姿",
    "孙燕姿",
    "方大同",
    "王力宏",
    "相信音樂",
}

JPOP_KEYWORDS = {
    "j-pop",
    "jpop",
    "anime",
    "アニメ",
    "歌ってみた",
    "弾いてみた",
    "カバー",
    "ボカロ",
    "vocaloid",
    "初音ミク",
    "official髭男dism",
    "髭男",
    "ado",
    "yoasobi",
    "aimer",
    "eve",
    "king gnu",
    "radwimps",
}

YORUSHIKA_KEYWORDS = {"yorushika", "ヨルシカ", "n-buna", "ナブナ"}
ZUTOMAYO_KEYWORDS = {"zutomayo", "ずっと真夜中", "ずとまよ", "zutto mayonaka"}
YONEZU_KEYWORDS = {"yonezu", "kenshi yonezu", "米津玄師", "米津", "ハチ", "hachi"}

HIRAGANA_KATAKANA_RE = re.compile(r"[\u3040-\u30ff]")
CJK_RE = re.compile(r"[\u3400-\u9fff]")
LATIN_RE = re.compile(r"[a-zA-Z]")


def text_blob(video: dict[str, Any]) -> str:
    snippet = video.get("snippet") if isinstance(video.get("snippet"), dict) else {}
    parts = [
        str(snippet.get("title") or ""),
        str(snippet.get("channelTitle") or ""),
        " ".join(str(tag) for tag in snippet.get("tags", []) if isinstance(tag, str)),
        " ".join(str(topic) for topic in video.get("topicDetails", {}).get("topicCategories", [])),
    ]
    return " ".join(parts)


def has_any(text: str, keywords: set[str]) -> bool:
    lowered = text.lower()
    return any(keyword.lower() in lowered for keyword in keywords)


def is_music(video: dict[str, Any]) -> bool:
    snippet = video.get("snippet") if isinstance(video.get("snippet"), dict) else {}
    topics = video.get("topicDetails", {}).get("topicCategories", [])
    blob = text_blob(video)

    if str(snippet.get("categoryId") or "") == "10":
        return True
    if any("Music" in str(topic) for topic in topics):
        return True
    return has_any(blob, JPOP_KEYWORDS | CPOP_KEYWORDS | YORUSHIKA_KEYWORDS | ZUTOMAYO_KEYWORDS | YONEZU_KEYWORDS)


def classify(video: dict[str, Any]) -> str | None:
    blob = text_blob(video)
    has_kana = bool(HIRAGANA_KATAKANA_RE.search(blob))
    has_cjk = bool(CJK_RE.search(blob))
    has_latin = bool(LATIN_RE.search(blob))

    if has_any(blob, CPOP_KEYWORDS) or (has_cjk and not has_kana and not has_any(blob, YONEZU_KEYWORDS)):
        return "Zn"

    if has_kana or has_any(blob, JPOP_KEYWORDS | YORUSHIKA_KEYWORDS | ZUTOMAYO_KEYWORDS | YONEZU_KEYWORDS):
        return "Jpop"
    if has_latin and not has_cjk:
        return "En"
    return None


def fetch_liked_videos(access_token: str, limit: int | None) -> list[dict[str, Any]]:
    videos: list[dict[str, Any]] = []
    page_token = ""

    while limit is None or len(videos) < limit:
        max_results = 50 if limit is None else min(50, limit - len(videos))
        if max_results <= 0:
            break

        response = youtube_data_get(
            access_token,
            "videos",
            {
                "part": "snippet,contentDetails,topicDetails",
                "myRating": "like",
                "maxResults": max_results,
                **({"pageToken": page_token} if page_token else {}),
            },
        )
        videos.extend(item for item in response.get("items", []) if isinstance(item, dict))
        page_token = str(response.get("nextPageToken") or "")
        if not page_token:
            break

    return videos


def list_owned_playlists(access_token: str) -> dict[str, str]:
    playlists: dict[str, str] = {}
    page_token = ""

    while True:
        response = youtube_data_get(
            access_token,
            "playlists",
            {
                "part": "snippet",
                "mine": "true",
                "maxResults": 50,
                **({"pageToken": page_token} if page_token else {}),
            },
        )
        for item in response.get("items", []):
            if not isinstance(item, dict):
                continue
            title = item.get("snippet", {}).get("title")
            playlist_id = item.get("id")
            if title and playlist_id:
                playlists[str(title)] = str(playlist_id)

        page_token = str(response.get("nextPageToken") or "")
        if not page_token:
            break

    return playlists


def create_playlist(access_token: str, title: str, privacy: str) -> str:
    response = requests.post(
        f"{YOUTUBE_DATA_API}/playlists",
        params={"part": "snippet,status"},
        headers={"Authorization": f"Bearer {access_token}"},
        json={
            "snippet": {
                "title": title,
                "description": "Automatically categorized from liked videos.",
            },
            "status": {"privacyStatus": privacy},
        },
        timeout=20,
    )
    data = response.json()
    if response.status_code >= 400:
        message = data.get("error", {}).get("message") if isinstance(data, dict) else response.text
        raise RuntimeError(str(message))
    return str(data["id"])


def list_playlist_video_ids(access_token: str, playlist_id: str) -> set[str]:
    video_ids: set[str] = set()
    page_token = ""

    while True:
        response = youtube_data_get(
            access_token,
            "playlistItems",
            {
                "part": "snippet,contentDetails",
                "playlistId": playlist_id,
                "maxResults": 50,
                **({"pageToken": page_token} if page_token else {}),
            },
        )
        for item in response.get("items", []):
            if not isinstance(item, dict):
                continue
            snippet = item.get("snippet") if isinstance(item.get("snippet"), dict) else {}
            resource = snippet.get("resourceId") if isinstance(snippet.get("resourceId"), dict) else {}
            content_details = item.get("contentDetails") if isinstance(item.get("contentDetails"), dict) else {}
            video_id = resource.get("videoId") or content_details.get("videoId")
            if video_id:
                video_ids.add(str(video_id))

        page_token = str(response.get("nextPageToken") or "")
        if not page_token:
            break

    return video_ids


def add_video(access_token: str, playlist_id: str, video_id: str) -> None:
    response = requests.post(
        f"{YOUTUBE_DATA_API}/playlistItems",
        params={"part": "snippet"},
        headers={"Authorization": f"Bearer {access_token}"},
        json={
            "snippet": {
                "playlistId": playlist_id,
                "resourceId": {
                    "kind": "youtube#video",
                    "videoId": video_id,
                },
            }
        },
        timeout=20,
    )
    if response.status_code >= 400:
        data = response.json()
        message = data.get("error", {}).get("message") if isinstance(data, dict) else response.text
        raise RuntimeError(str(message))


def video_summary(video: dict[str, Any]) -> dict[str, str]:
    snippet = video.get("snippet") if isinstance(video.get("snippet"), dict) else {}
    return {
        "id": str(video.get("id") or ""),
        "title": str(snippet.get("title") or ""),
        "channel": str(snippet.get("channelTitle") or ""),
    }


def write_report(path: Path, groups: dict[str, list[dict[str, Any]]], skipped: list[dict[str, Any]]) -> None:
    payload = {
        "groups": {
            key: {
                "playlistTitle": CATEGORY_TITLES[key],
                "count": len(items),
                "items": [video_summary(item) for item in items],
            }
            for key, items in groups.items()
        },
        "skippedNonMusic": {
            "count": len(skipped),
            "items": [video_summary(item) for item in skipped],
        },
    }
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--auth", default="oauth.json", help="OAuth token JSON file.")
    parser.add_argument("--privacy", choices=("private", "unlisted", "public"), default="private")
    parser.add_argument("--create", action="store_true", help="Create/reuse playlists and add videos.")
    parser.add_argument("--limit", type=int, default=0, help="Limit liked videos fetched. 0 means all.")
    parser.add_argument(
        "--max-adds",
        type=int,
        default=150,
        help="Maximum playlistItems inserted across all playlists in one run. Keeps API quota under control.",
    )
    parser.add_argument(
        "--report",
        type=Path,
        default=Path("artifacts/liked-video-categories.json"),
        help="Dry-run/classification report path.",
    )
    parser.add_argument("--oauth-credentials", default="")
    parser.add_argument("--oauth-client-id", default="")
    parser.add_argument("--oauth-client-secret", default="")
    return parser


def main() -> int:
    load_dotenv()
    args = build_parser().parse_args()
    auth_path = project_path(args.auth)

    try:
        oauth_credentials = build_oauth_credentials(args)
        oauth_token = load_oauth_token(auth_path, oauth_credentials)
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 1

    if not oauth_token:
        print(f"Could not load OAuth token from {auth_path}.", file=sys.stderr)
        return 1

    access_token = str(oauth_token["access_token"])
    videos = fetch_liked_videos(access_token, None if args.limit <= 0 else args.limit)

    groups: dict[str, list[dict[str, Any]]] = {key: [] for key in CATEGORY_TITLES}
    skipped: list[dict[str, Any]] = []
    seen_video_ids: set[str] = set()

    for video in videos:
        video_id = str(video.get("id") or "")
        if not video_id or video_id in seen_video_ids:
            continue
        seen_video_ids.add(video_id)
        if not is_music(video):
            skipped.append(video)
            continue
        category = classify(video)
        if category is None:
            skipped.append(video)
            continue
        groups[category].append(video)

    write_report(project_path(str(args.report)), groups, skipped)

    print(f"Fetched {len(videos)} liked videos.")
    print(f"Skipped non-music/uncertain: {len(skipped)}")
    for key, title in CATEGORY_TITLES.items():
        print(f"{title}: {len(groups[key])}")

    if not args.create:
        print(f"Dry run only. Report written to {project_path(str(args.report))}.")
        return 0

    owned = list_owned_playlists(access_token)
    additions_left = max(args.max_adds, 0)
    total_added = 0
    created_or_used: list[str] = []
    playlist_state: dict[str, dict[str, Any]] = {}

    for key, title in CATEGORY_TITLES.items():
        items = groups[key]
        if not items:
            continue

        playlist_id = owned.get(title)
        if playlist_id:
            action = "reused"
        else:
            playlist_id = create_playlist(access_token, title, args.privacy)
            owned[title] = playlist_id
            action = "created"

        created_or_used.append(f"{title} ({action})")
        try:
            existing_ids = list_playlist_video_ids(access_token, playlist_id)
        except Exception:
            if action != "created":
                raise
            time.sleep(2)
            try:
                existing_ids = list_playlist_video_ids(access_token, playlist_id)
            except Exception as exc:
                print(f"{title}: playlist was just created; assuming it is empty for this run ({exc}).")
                existing_ids = set()
        pending = [
            str(video.get("id"))
            for video in items
            if video.get("id") and str(video.get("id")) not in existing_ids
        ]
        playlist_state[key] = {
            "title": title,
            "playlistId": playlist_id,
            "existingIds": existing_ids,
            "pending": pending,
            "added": 0,
        }

    active_keys = [key for key, state in playlist_state.items() if state["pending"]]
    cursor = 0

    while additions_left > 0 and active_keys:
        key = active_keys[cursor % len(active_keys)]
        state = playlist_state[key]
        video_id = state["pending"].pop(0)

        try:
            add_video(access_token, str(state["playlistId"]), video_id)
        except Exception as exc:
            print(f"{state['title']}: failed to add {video_id}: {exc}", file=sys.stderr)
            if "quota" in str(exc).lower():
                additions_left = 0
                active_keys = []
                print("Stopping because the YouTube Data API quota was reached.", file=sys.stderr)
                break
        else:
            state["existingIds"].add(video_id)
            state["added"] += 1
            additions_left -= 1
            total_added += 1
            time.sleep(0.08)

        active_keys = [active_key for active_key in active_keys if playlist_state[active_key]["pending"]]
        if active_keys:
            cursor = (cursor + 1) % len(active_keys)

    for state in playlist_state.values():
        print(f"{state['title']}: {state['added']} added, {len(state['existingIds'])} now present.")

    if additions_left <= 0:
        print(f"Reached --max-adds={args.max_adds}; rerun later to continue adding remaining videos.")

    print("Playlists: " + ", ".join(created_or_used))
    print(f"Total added this run: {total_added}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
