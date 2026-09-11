#!/usr/bin/env python3
"""Remove videos from owned playlists, matched by video id.

Removals used to be done by hand against the API (see the
artifacts/english-undress-rehearsal-*.json left behind by one), which is easy to
get wrong: playlistItems.delete takes the *item* id, not the video id, and the
same video can sit in a playlist more than once. This looks both up.

Deleting is 50 units per item, the same as an insert, so a removal competes with
the categorization backlog for the day's quota. Reads are 1 unit, and a dry run
is reads only.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
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

from set_playlist_privacy import owned_playlists


def playlist_items(access_token: str, playlist_id: str) -> list[dict[str, Any]]:
    """Every item in a playlist, paged. Unavailable videos are included."""
    items: list[dict[str, Any]] = []
    page_token = ""

    while True:
        response = youtube_data_get(
            access_token,
            "playlistItems",
            {
                "part": "id,snippet",
                "playlistId": playlist_id,
                "maxResults": 50,
                **({"pageToken": page_token} if page_token else {}),
            },
        )
        items.extend(item for item in response.get("items", []) if isinstance(item, dict))

        page_token = str(response.get("nextPageToken") or "")
        if not page_token:
            break

    return items


def delete_item(access_token: str, playlist_item_id: str) -> None:
    response = requests.delete(
        f"{YOUTUBE_DATA_API}/playlistItems",
        params={"id": playlist_item_id},
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=20,
    )
    # A successful delete answers 204 with an empty body.
    if response.status_code >= 400:
        data = response.json() if response.content else {}
        message = data.get("error", {}).get("message") if isinstance(data, dict) else response.text
        raise RuntimeError(str(message))


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("video_ids", nargs="+", help="YouTube video ids to remove.")
    parser.add_argument(
        "--playlist",
        action="append",
        default=[],
        required=True,
        help="Playlist title to remove from. Repeatable.",
    )
    parser.add_argument("--auth", default=os.environ.get("YTMUSIC_AUTH_FILE", "oauth.json"))
    parser.add_argument("--apply", action="store_true", help="Without this the run only reports.")
    parser.add_argument("--report", default="", help="Optional path for a JSON record of the run.")
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

    access_token = str(token["access_token"])
    try:
        owned = owned_playlists(access_token)
    except Exception as exc:
        # An expired refresh token surfaces here rather than at load_oauth_token,
        # which only refreshes when the access token is close to expiring.
        print(f"Could not list playlists: {exc}", file=sys.stderr)
        return 1

    wanted = set(args.video_ids)
    record: list[dict[str, Any]] = []
    failures = 0

    for title in args.playlist:
        playlist = owned.get(title)
        if playlist is None:
            print(f"{title}: not found", file=sys.stderr)
            failures += 1
            continue

        playlist_id = str(playlist["id"])
        matches = [
            item
            for item in playlist_items(access_token, playlist_id)
            if str(item["snippet"]["resourceId"].get("videoId", "")) in wanted
        ]

        if not matches:
            print(f"{title}: no match")
            continue

        for item in matches:
            snippet = item["snippet"]
            video_id = str(snippet["resourceId"]["videoId"])
            entry = {
                "playlist": title,
                "playlistId": playlist_id,
                "playlistItemId": str(item["id"]),
                "videoId": video_id,
                "title": str(snippet.get("title", "")),
                "position": snippet.get("position"),
                "deleted": False,
            }

            if not args.apply:
                print(f"{title}: would remove {video_id} — {entry['title']} (dry run)")
            else:
                try:
                    delete_item(access_token, entry["playlistItemId"])
                except Exception as exc:
                    print(f"{title}: {video_id} failed ({exc})", file=sys.stderr)
                    entry["error"] = str(exc)
                    failures += 1
                else:
                    entry["deleted"] = True
                    print(f"{title}: removed {video_id} — {entry['title']}")

            record.append(entry)

    missing = wanted - {entry["videoId"] for entry in record}
    for video_id in sorted(missing):
        print(f"{video_id}: not present in any named playlist", file=sys.stderr)

    if args.report:
        report_path = project_path(args.report)
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(
            json.dumps({"removed": record, "notFound": sorted(missing)}, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )

    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
