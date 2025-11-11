#!/usr/bin/env python3
"""Lightweight guard to ensure Dramatis Personae includes every canon record."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANON_FILE = ROOT / "fieldguide" / "_canon.json"
DRAMATIS_FILE = ROOT / "fieldguide" / "dramatis-personae" / "index.html"


def load_canon() -> list[dict]:
    data = json.loads(CANON_FILE.read_text(encoding="utf-8"))
    characters = data.get("characters")
    if not isinstance(characters, list):
        raise ValueError("Canon file must define a 'characters' array")
    return characters


def dramatis_text() -> str:
    return DRAMATIS_FILE.read_text(encoding="utf-8")


def main() -> int:
    characters = load_canon()
    page = dramatis_text()

    missing: list[str] = []
    for record in characters:
        name = record.get("name")
        if not name:
            continue
        aliases = record.get("aliases", [])
        search_terms = [name]
        if isinstance(aliases, list):
            search_terms.extend(alias for alias in aliases if alias)
        elif isinstance(aliases, str):
            search_terms.append(aliases)

        if not any(term in page for term in search_terms):
            missing.append(name)

    if missing:
        print("Canon check failed: missing entries in fieldguide/dramatis-personae/index.html", file=sys.stderr)
        for name in missing:
            print(f" - {name}", file=sys.stderr)
        print("Run tools/check_dramatis_personae.py after editing the dramatis page.", file=sys.stderr)
        return 1

    print("Dramatis Personae canon check passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
