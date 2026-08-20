#!/usr/bin/env python3
"""Switch owned playlists to a given privacy status, matched by title.

The portfolio site reads playlists through unauthenticated ytmusicapi, which
cannot see private playlists. Categories that should appear on the site have to
be unlisted first.
"""

from __future__ import annotations

import argparse
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


def owned_playlists(access_token: str) -> dict[str, dict[str, Any]]:
    playlists: dict[str, dict[str, Any]] = {}
    page_token = ""

    while True:
        response = youtube_data_get(
            access_token,
            "playlists",
            {
                "part": "snippet,status",
                "mine": "true",
                "maxResults": 50,
                **({"pageToken": page_token} if page_token else {}),
            },
        )
        for item in response.get("items", []):
            if isinstance(item, dict) and item.get("id"):
                playlists[str(item["snippet"]["title"])] = item

        page_token = str(response.get("nextPageToken") or "")
        if not page_token:
            break

    return playlists


def set_privacy(access_token: str, item: dict[str, Any], privacy: str) -> None:
    snippet = item["snippet"]
    response = requests.put(
        f"{YOUTUBE_DATA_API}/playlists",
        params={"part": "snippet,status"},
        headers={"Authorization": f"Bearer {access_token}"},
        json={
            "id": item["id"],
            # The API replaces the whole snippet, so the title must be resent.
            "snippet": {"title": snippet["title"], "description": snippet.get("description", "")},
            "status": {"privacyStatus": privacy},
        },
        timeout=20,
    )
    if response.status_code >= 400:
        data = response.json()
        message = data.get("error", {}).get("message") if isinstance(data, dict) else response.text
        raise RuntimeError(str(message))


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("titles", nargs="+", help="Exact playlist titles to update.")
    parser.add_argument("--privacy", choices=("private", "unlisted", "public"), default="unlisted")
    parser.add_argument("--auth", default=os.environ.get("YTMUSIC_AUTH_FILE", "oauth.json"))
    parser.add_argument("--apply", action="store_true", help="Without this the run only reports.")
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
    owned = owned_playlists(access_token)

    for title in args.titles:
        item = owned.get(title)
        if item is None:
            print(f"{title}: not found", file=sys.stderr)
            continue

        current = item["status"]["privacyStatus"]
        if current == args.privacy:
            print(f"{title}: already {current}")
            continue
        if not args.apply:
            print(f"{title}: {current} -> {args.privacy} (dry run)")
            continue

        try:
            set_privacy(access_token, item, args.privacy)
        except Exception as exc:
            print(f"{title}: failed ({exc})", file=sys.stderr)
        else:
            print(f"{title}: {current} -> {args.privacy}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
