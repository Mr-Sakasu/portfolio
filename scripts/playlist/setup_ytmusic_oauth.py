#!/usr/bin/env python3
"""Create a ytmusicapi OAuth token file using project-local credentials."""

from __future__ import annotations

import argparse
import os
import sys

from fetch_ytmusic_playlist import build_oauth_credentials, load_dotenv, project_path
from ytmusicapi.setup import setup_oauth


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        default=os.environ.get("YTMUSIC_AUTH_FILE", ".ytmusic-oauth.json"),
        help="OAuth token output path. Defaults to YTMUSIC_AUTH_FILE or .ytmusic-oauth.json.",
    )
    parser.add_argument(
        "--oauth-credentials",
        default=os.environ.get("YTMUSIC_OAUTH_CREDENTIALS_JSON")
        or os.environ.get("YTMUSIC_OAUTH_CREDENTIALS_FILE", ""),
        help=(
            "Google OAuth client credentials JSON file or JSON string. "
            "Defaults to YTMUSIC_OAUTH_CREDENTIALS_JSON or YTMUSIC_OAUTH_CREDENTIALS_FILE."
        ),
    )
    parser.add_argument(
        "--oauth-client-id",
        default=os.environ.get("YTMUSIC_OAUTH_CLIENT_ID", ""),
        help="OAuth client id. Defaults to YTMUSIC_OAUTH_CLIENT_ID.",
    )
    parser.add_argument(
        "--oauth-client-secret",
        default=os.environ.get("YTMUSIC_OAUTH_CLIENT_SECRET", ""),
        help="OAuth client secret. Defaults to YTMUSIC_OAUTH_CLIENT_SECRET.",
    )
    parser.add_argument(
        "--open-browser",
        action="store_true",
        help="Open the OAuth verification page automatically.",
    )
    return parser


def main() -> int:
    load_dotenv()
    args = build_parser().parse_args()

    try:
        oauth_credentials = build_oauth_credentials(args)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 1

    if oauth_credentials is None:
        print(
            "OAuth credentials are required. Set YTMUSIC_OAUTH_CREDENTIALS_FILE "
            "or YTMUSIC_OAUTH_CLIENT_ID/YTMUSIC_OAUTH_CLIENT_SECRET.",
            file=sys.stderr,
        )
        return 1

    output_path = project_path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    setup_oauth(
        client_id=oauth_credentials.client_id,
        client_secret=oauth_credentials.client_secret,
        filepath=str(output_path),
        open_browser=args.open_browser,
    )
    print(f"Wrote OAuth token to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
