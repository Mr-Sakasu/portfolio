#!/usr/bin/env python3
"""Fetch a YouTube Music playlist into static JSON for the Astro homepage."""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse

import requests
from ytmusicapi import OAuthCredentials, YTMusic


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "src" / "data" / "ytmusic-playlist.json"
YOUTUBE_DATA_API = "https://www.googleapis.com/youtube/v3"
OAUTH_TOKEN_KEYS = {"access_token", "refresh_token", "scope", "token_type", "expires_at", "expires_in"}


def load_dotenv(path: Path = ROOT / ".env") -> None:
    if not path.is_file():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line.removeprefix("export ").strip()

        key, separator, value = line.partition("=")
        if not separator:
            continue

        key = key.strip()
        value = value.strip()
        if not key or key in os.environ:
            continue

        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]

        os.environ[key] = value


def project_path(raw_path: str) -> Path:
    path = Path(raw_path).expanduser()
    return path if path.is_absolute() else ROOT / path


def extract_playlist_id(raw_value: str | None) -> str:
    if not raw_value:
        return ""

    value = raw_value.strip()
    if not value:
        return ""

    parsed = urlparse(value)
    if parsed.scheme and parsed.netloc:
        playlist_ids = parse_qs(parsed.query).get("list", [])
        if playlist_ids:
            value = playlist_ids[0]

    return value[2:] if value.startswith("VL") else value


def pick_thumbnail(thumbnails: Any) -> str:
    if not isinstance(thumbnails, list):
        return ""

    valid_thumbnails = [item for item in thumbnails if isinstance(item, dict) and item.get("url")]
    if not valid_thumbnails:
        return ""

    selected = max(
        valid_thumbnails,
        key=lambda item: int(item.get("width") or 0) * int(item.get("height") or 0),
    )
    return str(selected.get("url") or "")


def pick_youtube_thumbnail(thumbnails: Any) -> str:
    if not isinstance(thumbnails, dict):
        return ""

    for key in ("maxres", "standard", "high", "medium", "default"):
        thumbnail = thumbnails.get(key)
        if isinstance(thumbnail, dict) and thumbnail.get("url"):
            return str(thumbnail["url"])

    return ""


def artist_names(artists: Any) -> str:
    if not isinstance(artists, list):
        return ""

    names = [str(artist.get("name")) for artist in artists if isinstance(artist, dict) and artist.get("name")]
    return ", ".join(names)


def playlist_author(playlist: dict[str, Any]) -> str:
    author = playlist.get("author")
    if isinstance(author, dict) and author.get("name"):
        return str(author["name"])

    collaborators = playlist.get("collaborators")
    if isinstance(collaborators, dict) and collaborators.get("text"):
        return str(collaborators["text"])

    return ""


def simplify_track(track: dict[str, Any], playlist_id: str) -> dict[str, Any]:
    video_id = str(track.get("videoId") or "")
    album = track.get("album") if isinstance(track.get("album"), dict) else {}

    return {
        "videoId": video_id,
        "title": str(track.get("title") or "Untitled"),
        "artists": artist_names(track.get("artists")),
        "album": str(album.get("name") or ""),
        "duration": str(track.get("duration") or ""),
        "thumbnail": pick_thumbnail(track.get("thumbnails")),
        "url": f"https://music.youtube.com/watch?v={video_id}&list={playlist_id}" if video_id else "",
    }


def simplify_youtube_item(item: dict[str, Any], playlist_id: str) -> dict[str, Any]:
    snippet = item.get("snippet") if isinstance(item.get("snippet"), dict) else {}
    resource = snippet.get("resourceId") if isinstance(snippet.get("resourceId"), dict) else {}
    content_details = item.get("contentDetails") if isinstance(item.get("contentDetails"), dict) else {}
    video_id = str(resource.get("videoId") or content_details.get("videoId") or item.get("id") or "")
    snippet_published_at = str(snippet.get("publishedAt") or "")
    video_published_at = str(content_details.get("videoPublishedAt") or "")
    is_playlist_item = bool(resource.get("videoId") or content_details.get("videoId"))

    track = {
        "videoId": video_id,
        "title": str(snippet.get("title") or "Untitled"),
        "artists": str(snippet.get("videoOwnerChannelTitle") or snippet.get("channelTitle") or ""),
        "album": "",
        "duration": "",
        "thumbnail": pick_youtube_thumbnail(snippet.get("thumbnails")),
        "url": f"https://www.youtube.com/watch?v={video_id}&list={playlist_id}" if video_id else "",
    }
    if video_published_at or (snippet_published_at and not is_playlist_item):
        published_at = video_published_at or snippet_published_at
        track["publishedAt"] = published_at
        track["uploadedAt"] = published_at
    if snippet_published_at and is_playlist_item:
        track["addedAt"] = snippet_published_at
    return track


def empty_payload() -> dict[str, Any]:
    return {
        "configured": False,
        "playlists": [],
        "playlistId": "",
        "title": "",
        "description": "",
        "author": "",
        "trackCount": 0,
        "duration": "",
        "thumbnail": "",
        "url": "",
        "updatedAt": "",
        "tracks": [],
    }


def collection_payload(playlists: list[dict[str, Any]]) -> dict[str, Any]:
    if not playlists:
        return empty_payload()

    primary = playlists[0].copy()
    primary["configured"] = True
    primary["playlists"] = playlists
    return primary


def write_json(output_path: Path, payload: dict[str, Any]) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def read_json_source(raw_value: str, source_name: str) -> dict[str, Any]:
    value = raw_value.strip()
    if not value:
        return {}

    source_path = project_path(value)
    if source_path.is_file():
        return json.loads(source_path.read_text(encoding="utf-8"))

    if value.startswith("{"):
        return json.loads(value)

    raise ValueError(f"{source_name} must be a JSON file path or JSON object string.")


def oauth_client_from_payload(payload: dict[str, Any]) -> tuple[str, str]:
    candidates = [
        payload,
        payload.get("installed") if isinstance(payload.get("installed"), dict) else {},
        payload.get("web") if isinstance(payload.get("web"), dict) else {},
    ]

    for candidate in candidates:
        if not isinstance(candidate, dict):
            continue

        client_id = str(candidate.get("client_id") or candidate.get("clientId") or "")
        client_secret = str(candidate.get("client_secret") or candidate.get("clientSecret") or "")
        if client_id and client_secret:
            return client_id, client_secret

    raise ValueError("OAuth credentials JSON must include client_id and client_secret.")


def build_oauth_credentials(args: argparse.Namespace) -> OAuthCredentials | None:
    client_id = str(args.oauth_client_id or "")
    client_secret = str(args.oauth_client_secret or "")
    credentials_source = str(args.oauth_credentials or "")

    if credentials_source:
        source_client_id, source_client_secret = oauth_client_from_payload(
            read_json_source(credentials_source, "OAuth credentials")
        )
        client_id = client_id or source_client_id
        client_secret = client_secret or source_client_secret

    if not client_id and not client_secret:
        return None

    if not client_id or not client_secret:
        raise ValueError("OAuth auth requires both client_id and client_secret.")

    return OAuthCredentials(client_id, client_secret)


def load_oauth_token(auth_path: Path | None, oauth_credentials: OAuthCredentials | None) -> dict[str, Any] | None:
    if auth_path is None or not auth_path.is_file():
        return None

    data = json.loads(auth_path.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or "access_token" not in data or "refresh_token" not in data:
        return None

    expires_at = int(data.get("expires_at") or 0)
    if expires_at and expires_at - int(time.time()) < 60:
        if oauth_credentials is None:
            raise ValueError("OAuth token is expiring, but OAuth client credentials were not provided.")

        fresh_token = oauth_credentials.refresh_token(str(data["refresh_token"]))
        data.update(fresh_token)
        if fresh_token.get("expires_in"):
            data["expires_at"] = int(time.time()) + int(fresh_token["expires_in"])

    cleaned = {key: data[key] for key in OAUTH_TOKEN_KEYS if key in data}
    auth_path.write_text(json.dumps(cleaned, indent=2) + "\n", encoding="utf-8")
    return cleaned


def youtube_data_get(access_token: str, resource: str, params: dict[str, Any]) -> dict[str, Any]:
    response = requests.get(
        f"{YOUTUBE_DATA_API}/{resource}",
        params=params,
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=20,
    )
    data = response.json()

    if response.status_code >= 400:
        error = data.get("error", {}) if isinstance(data, dict) else {}
        message = error.get("message") or response.text
        raise RuntimeError(str(message))

    return data


def list_youtube_data_playlists(oauth_token: dict[str, Any], limit: int = 10) -> list[dict[str, Any]]:
    data = youtube_data_get(
        str(oauth_token["access_token"]),
        "playlists",
        {
            "part": "snippet,contentDetails,status",
            "mine": "true",
            "maxResults": min(max(limit, 1), 50),
        },
    )
    return [item for item in data.get("items", []) if isinstance(item, dict)]


def fetch_youtube_liked_videos(oauth_token: dict[str, Any], limit: int) -> dict[str, Any]:
    access_token = str(oauth_token["access_token"])
    tracks: list[dict[str, Any]] = []
    page_token = ""
    total_results = 0

    while len(tracks) < limit:
        response = youtube_data_get(
            access_token,
            "videos",
            {
                "part": "snippet,contentDetails",
                "myRating": "like",
                "maxResults": min(limit - len(tracks), 50),
                **({"pageToken": page_token} if page_token else {}),
            },
        )
        page_info = response.get("pageInfo") if isinstance(response.get("pageInfo"), dict) else {}
        total_results = int(page_info.get("totalResults") or total_results or 0)
        tracks.extend(
            simplify_youtube_item(item, "LL")
            for item in response.get("items", [])
            if isinstance(item, dict)
        )
        page_token = str(response.get("nextPageToken") or "")
        if not page_token:
            break

    return {
        "configured": True,
        "playlistId": "LL",
        "title": "Liked videos",
        "description": "",
        "author": "",
        "trackCount": total_results or len(tracks),
        "duration": "",
        "thumbnail": tracks[0].get("thumbnail", "") if tracks else "",
        "url": "https://www.youtube.com/playlist?list=LL",
        "updatedAt": datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "tracks": tracks,
    }


def fetch_youtube_data_playlist(playlist_id: str, oauth_token: dict[str, Any], limit: int) -> dict[str, Any]:
    if playlist_id == "LL":
        return fetch_youtube_liked_videos(oauth_token, limit)

    access_token = str(oauth_token["access_token"])
    playlist_response = youtube_data_get(
        access_token,
        "playlists",
        {
            "part": "snippet,contentDetails,status",
            "id": playlist_id,
            "maxResults": 1,
        },
    )
    playlist_items = [item for item in playlist_response.get("items", []) if isinstance(item, dict)]
    if not playlist_items:
        raise RuntimeError(f"Playlist not found or not accessible: {playlist_id}")

    playlist_item = playlist_items[0]
    playlist_snippet = playlist_item.get("snippet") if isinstance(playlist_item.get("snippet"), dict) else {}
    playlist_details = (
        playlist_item.get("contentDetails") if isinstance(playlist_item.get("contentDetails"), dict) else {}
    )

    tracks: list[dict[str, Any]] = []
    page_token = ""
    while len(tracks) < limit:
        items_response = youtube_data_get(
            access_token,
            "playlistItems",
            {
                "part": "snippet,contentDetails",
                "playlistId": playlist_id,
                "maxResults": min(limit - len(tracks), 50),
                **({"pageToken": page_token} if page_token else {}),
            },
        )
        tracks.extend(
            simplify_youtube_item(item, playlist_id)
            for item in items_response.get("items", [])
            if isinstance(item, dict)
        )
        page_token = str(items_response.get("nextPageToken") or "")
        if not page_token:
            break

    return {
        "configured": True,
        "playlistId": playlist_id,
        "title": str(playlist_snippet.get("title") or "YouTube Music Playlist"),
        "description": str(playlist_snippet.get("description") or ""),
        "author": "",
        "trackCount": int(playlist_details.get("itemCount") or len(tracks)),
        "duration": "",
        "thumbnail": pick_youtube_thumbnail(playlist_snippet.get("thumbnails")),
        "url": f"https://www.youtube.com/playlist?list={playlist_id}",
        "updatedAt": datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "tracks": tracks,
    }


def build_ytmusic_payload(playlist_id: str, playlist: dict[str, Any]) -> dict[str, Any]:
    return {
        "configured": True,
        "playlistId": playlist_id,
        "title": str(playlist.get("title") or "YouTube Music Playlist"),
        "description": str(playlist.get("description") or ""),
        "author": "",
        "trackCount": int(playlist.get("trackCount") or len(playlist.get("tracks") or [])),
        "duration": str(playlist.get("duration") or ""),
        "thumbnail": pick_thumbnail(playlist.get("thumbnails")),
        "url": f"https://music.youtube.com/playlist?list={playlist_id}",
        "updatedAt": datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "tracks": [
            simplify_track(track, playlist_id)
            for track in playlist.get("tracks", [])
            if isinstance(track, dict)
        ],
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "playlists",
        nargs="*",
        help=(
            "YouTube Music/YouTube playlist URLs or playlist IDs. "
            "Defaults to YTMUSIC_PLAYLIST_ID or YTMUSIC_PLAYLIST_URL."
        ),
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=int(os.environ.get("YTMUSIC_PLAYLIST_LIMIT", "12")),
        help="Maximum number of tracks to store. Defaults to YTMUSIC_PLAYLIST_LIMIT or 12.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"Output JSON path. Defaults to {DEFAULT_OUTPUT}.",
    )
    parser.add_argument(
        "--auth",
        default=os.environ.get("YTMUSIC_AUTH_FILE", ""),
        help="Optional ytmusicapi auth JSON path for private playlists. Defaults to YTMUSIC_AUTH_FILE.",
    )
    parser.add_argument(
        "--oauth-credentials",
        default=os.environ.get("YTMUSIC_OAUTH_CREDENTIALS_JSON")
        or os.environ.get("YTMUSIC_OAUTH_CREDENTIALS_FILE", ""),
        help=(
            "Optional Google OAuth client credentials JSON file or JSON string. "
            "Defaults to YTMUSIC_OAUTH_CREDENTIALS_JSON or YTMUSIC_OAUTH_CREDENTIALS_FILE."
        ),
    )
    parser.add_argument(
        "--oauth-client-id",
        default=os.environ.get("YTMUSIC_OAUTH_CLIENT_ID", ""),
        help="Optional OAuth client id. Defaults to YTMUSIC_OAUTH_CLIENT_ID.",
    )
    parser.add_argument(
        "--oauth-client-secret",
        default=os.environ.get("YTMUSIC_OAUTH_CLIENT_SECRET", ""),
        help="Optional OAuth client secret. Defaults to YTMUSIC_OAUTH_CLIENT_SECRET.",
    )
    parser.add_argument(
        "--language",
        default=os.environ.get("YTMUSIC_LANGUAGE", "en"),
        help="YouTube Music response language. Defaults to en.",
    )
    parser.add_argument(
        "--source",
        choices=("auto", "ytmusic", "youtube-data"),
        default=os.environ.get("YTMUSIC_FETCH_SOURCE", "auto"),
        help="Fetch backend. Defaults to YTMUSIC_FETCH_SOURCE or auto.",
    )
    return parser


def requested_playlist_ids(args: argparse.Namespace) -> list[str]:
    raw_values = list(args.playlists)
    env_value = os.environ.get("YTMUSIC_PLAYLIST_ID") or os.environ.get("YTMUSIC_PLAYLIST_URL") or ""

    if not raw_values and env_value:
        raw_values = [item.strip() for item in env_value.split(",")]

    playlist_ids: list[str] = []
    for raw_value in raw_values:
        playlist_id = extract_playlist_id(raw_value)
        if playlist_id and playlist_id not in playlist_ids:
            playlist_ids.append(playlist_id)

    return playlist_ids


def fetch_payload(
    playlist_id: str,
    args: argparse.Namespace,
    auth: str | None,
    oauth_credentials: OAuthCredentials | None,
    oauth_token: dict[str, Any] | None,
) -> dict[str, Any] | None:
    payload: dict[str, Any] | None = None
    ytmusic_error: Exception | None = None

    if args.source in {"auto", "ytmusic"} and not (oauth_token and oauth_credentials is None):
        try:
            ytmusic = YTMusic(auth=auth, language=args.language, oauth_credentials=oauth_credentials)
            playlist = ytmusic.get_playlist(playlist_id, limit=max(args.limit, 1))
            payload = build_ytmusic_payload(playlist_id, playlist)
        except Exception as exc:
            ytmusic_error = exc
            if args.source == "ytmusic":
                raise RuntimeError(f"Failed to fetch playlist {playlist_id}: {exc}") from exc

    if payload is None and oauth_token and args.source in {"auto", "youtube-data"}:
        try:
            payload = fetch_youtube_data_playlist(playlist_id, oauth_token, max(args.limit, 1))
        except Exception as exc:
            if ytmusic_error:
                print(f"Failed to fetch playlist {playlist_id} with ytmusicapi: {ytmusic_error}", file=sys.stderr)
            raise RuntimeError(f"Failed to fetch playlist {playlist_id} with YouTube Data API: {exc}") from exc

    if payload is None:
        if ytmusic_error:
            raise RuntimeError(f"Failed to fetch playlist {playlist_id}: {ytmusic_error}") from ytmusic_error
        raise RuntimeError("No usable authentication source was available for this playlist.")

    return payload


def main() -> int:
    load_dotenv()
    args = build_parser().parse_args()
    playlist_ids = requested_playlist_ids(args)

    auth_path = project_path(args.auth) if args.auth else None
    auth = str(auth_path) if auth_path and auth_path.exists() else None

    if args.auth and not auth:
        print(f"Auth file not found: {auth_path}", file=sys.stderr)
        return 1

    try:
        oauth_credentials = build_oauth_credentials(args)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 1

    try:
        oauth_token = load_oauth_token(auth_path, oauth_credentials)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 1

    if not playlist_ids:
        if oauth_token and args.source in {"auto", "youtube-data"}:
            try:
                playlists = list_youtube_data_playlists(oauth_token, limit=1)
            except Exception as exc:
                print(f"Failed to list playlists with YouTube Data API: {exc}", file=sys.stderr)
                return 1

            if playlists:
                playlist_id = str(playlists[0].get("id") or "")
                title = playlists[0].get("snippet", {}).get("title", "selected playlist")
                playlist_ids = [playlist_id]
                print(f"No playlist configured. Selected first YouTube playlist: {title}.")

        if not playlist_ids:
            write_json(args.output, empty_payload())
            print(f"No playlist configured. Wrote empty payload to {args.output}.")
            return 0

    payloads: list[dict[str, Any]] = []
    for playlist_id in playlist_ids:
        try:
            payload = fetch_payload(playlist_id, args, auth, oauth_credentials, oauth_token)
        except Exception as exc:
            print(str(exc), file=sys.stderr)
            return 1
        payloads.append(payload)

    payload = collection_payload(payloads)
    write_json(args.output, payload)
    playlist_summary = ", ".join(f"{item['title']} ({len(item['tracks'])})" for item in payloads)
    print(f"Wrote {len(payloads)} playlist(s) to {args.output}: {playlist_summary}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
