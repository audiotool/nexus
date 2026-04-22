#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Generate src/api/presets/generated.ts from presets.csv.

Reads the sibling `presets.csv` and emits a TypeScript file with:

- `gmInstrumentPresetIdByProgram` -- 128-entry program-number -> preset id
  map for GM melodic instruments (bank 000, programs 0-127).
- `gmDrumPresetIdByProgram` -- 8-entry program-number -> preset id map for
  GS-standard drum kits (bank 128, programs 0, 8, 16, 24, 25, 32, 40, 48).
- `gmInstruments` / `gmDrums` -- fully typed metadata arrays (`GmInstrument[]`,
  `GmDrum[]`) including display name, category, tags, description and id.
  Useful for building preset pickers without fetching preset binaries.

All entries are required to be `gakki` device presets; if a future CSV
ever breaks that invariant the script aborts with a clear error so the
downstream `NexusPreset<"gakki">` return type remains sound.

Regenerate with `npm run gen:presets` (or `uv run src/api/presets/generate.py`).
"""

from __future__ import annotations

import csv
import re
import sys
from dataclasses import dataclass
from pathlib import Path

HERE = Path(__file__).resolve().parent
CSV_PATH = HERE / "presets.csv"
OUT_PATH = HERE / "generated.ts"
SLUGS_PATH = HERE / "gm-slugs.ts"

EXPECTED_DEVICE_TYPE = "gakki"
EXPECTED_INSTRUMENT_PROGRAMS = set(range(128))
EXPECTED_DRUM_PROGRAMS = {0, 8, 16, 24, 25, 32, 40, 48}


@dataclass
class Entry:
    program: int
    slug: str
    display_name: str
    category: str
    tags: list[str]
    description: str
    preset_id: str


def kebab(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s


def drum_slug(display_name: str) -> str:
    """Slug for a GM drum kit.

    The CSV names them "Standard Drum Kit", "Jazz Drum Kit", etc. We drop the
    redundant "drum" token so slugs read as "standard-kit", "jazz-kit", ...
    That matches the hand-written `gmDrumProgramBySlug` in `gm-slugs.ts`.
    """
    return kebab(re.sub(r"\bdrum\b", "", display_name, flags=re.IGNORECASE))


def parse_tags(raw: str) -> list[str]:
    if not raw.strip():
        return []
    return [t.strip() for t in raw.split(",") if t.strip()]


def ts_string(s: str) -> str:
    """Emit a TypeScript double-quoted string literal."""
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def read_entries(rows: list[dict[str, str]], bank: str) -> list[Entry]:
    entries: list[Entry] = []
    seen_programs: set[int] = set()
    is_drum_bank = bank == "128"
    for row in rows:
        if row.get("sf Bank", "").strip() != bank:
            continue
        device_type = row.get("Preset deviceType", "").strip()
        uuid = row.get("Preset UUID", "").strip()
        if device_type != EXPECTED_DEVICE_TYPE:
            sys.exit(
                f"ERROR: row for preset {uuid!r} has bank {bank!r} but "
                f"deviceType={device_type!r} (expected {EXPECTED_DEVICE_TYPE!r}). "
                "The TS API promises NexusPreset<'gakki'>; aborting."
            )
        if not uuid:
            sys.exit(f"ERROR: row has bank {bank!r} but missing Preset UUID")
        try:
            program = int(row.get("sf Preset", "").strip())
        except ValueError:
            sys.exit(
                f"ERROR: row for preset {uuid!r} has non-integer "
                f"sf Preset={row.get('sf Preset')!r}"
            )
        if program in seen_programs:
            sys.exit(f"ERROR: duplicate program {program} in bank {bank}")
        seen_programs.add(program)
        display_name = row.get("Preset displayName", "")
        entries.append(
            Entry(
                program=program,
                slug=(
                    drum_slug(display_name) if is_drum_bank else kebab(display_name)
                ),
                display_name=display_name.strip(),
                category=row.get("Preset Category", "").strip(),
                tags=parse_tags(row.get("Preset Tags", "")),
                description=row.get("Preset Description", "").strip(),
                preset_id=f"presets/{uuid}",
            )
        )
    entries.sort(key=lambda e: e.program)
    return entries


def emit_id_map(name: str, doc: str, entries: list[Entry]) -> list[str]:
    out: list[str] = []
    out.append(doc)
    out.append(f"export const {name}: Record<number, string> = {{\n")
    for e in entries:
        out.append(f"  {e.program}: {ts_string(e.preset_id)},\n")
    out.append("}\n\n")
    return out


def slug_doc_table(entries: list[Entry]) -> str:
    """Render a Markdown/JSDoc table of `| GM | Slug | Short description |`.

    Used inside `gm-slugs.ts` to document the `GmInstrumentSlug` / `GmDrumSlug`
    union members. Each line is prefixed with ` * ` so it slots into a JSDoc
    comment. Fancy quotes from the CSV are flattened so Markdown renders cleanly
    in IDE tooltips.
    """
    lines: list[str] = []
    lines.append(" * | GM (program) | Slug | Short description |")
    lines.append(" * | ---: | :--- | :--- |")
    for e in entries:
        desc = e.description.strip() or e.display_name
        desc = (
            desc.replace("\u201c", '"')
            .replace("\u201d", '"')
            .replace("\u2018", "'")
            .replace("\u2019", "'")
            .replace("|", "\\|")
        )
        lines.append(f" * | {e.program} | `{e.slug}` | {desc} |")
    return "\n".join(lines)


def replace_between_markers(src: str, marker: str, body: str) -> str:
    """Replace the content between `<!-- marker:start -->` and `<!-- marker:end -->`.

    Keeps the marker lines themselves so the file remains idempotent.
    """
    start = f"<!-- {marker}:start -->"
    end = f"<!-- {marker}:end -->"
    pattern = re.compile(
        rf"({re.escape(start)})(.*?)({re.escape(end)})",
        flags=re.DOTALL,
    )
    if not pattern.search(src):
        sys.exit(
            f"ERROR: could not find `{marker}` markers in gm-slugs.ts. "
            f"Expected `{start}` ... `{end}`."
        )
    return pattern.sub(lambda m: f"{m.group(1)}\n{body}\n * {m.group(3)}", src)


def sync_slug_docs(instruments: list[Entry], drums: list[Entry]) -> None:
    src = SLUGS_PATH.read_text()
    src = replace_between_markers(src, "gm-instrument-table", slug_doc_table(instruments))
    src = replace_between_markers(src, "gm-drum-table", slug_doc_table(drums))
    SLUGS_PATH.write_text(src)


def emit_entries(
    name: str,
    type_name: str,
    doc: str,
    entries: list[Entry],
) -> list[str]:
    out: list[str] = []
    out.append(doc)
    out.append(f"export const {name}: readonly {type_name}[] = [\n")
    for e in entries:
        tags_ts = (
            "["
            + ", ".join(ts_string(t) for t in e.tags)
            + "]"
        )
        out.append("  {\n")
        out.append(f"    program: {e.program},\n")
        out.append(f"    slug: {ts_string(e.slug)},\n")
        out.append(f"    displayName: {ts_string(e.display_name)},\n")
        out.append(f"    category: {ts_string(e.category)},\n")
        out.append(f"    tags: {tags_ts},\n")
        if e.description:
            out.append(f"    description: {ts_string(e.description)},\n")
        out.append(f"    id: {ts_string(e.preset_id)},\n")
        out.append("  },\n")
    out.append(f"] as const satisfies readonly {type_name}[]\n\n")
    return out


def main() -> int:
    with CSV_PATH.open(newline="") as f:
        rows = list(csv.DictReader(f))

    instruments = read_entries(rows, "000")
    drums = read_entries(rows, "128")

    instrument_programs = {e.program for e in instruments}
    if instrument_programs != EXPECTED_INSTRUMENT_PROGRAMS:
        missing = EXPECTED_INSTRUMENT_PROGRAMS - instrument_programs
        extra = instrument_programs - EXPECTED_INSTRUMENT_PROGRAMS
        sys.exit(
            "ERROR: GM instrument program coverage is not exactly 0..127. "
            f"Missing: {sorted(missing)} Extra: {sorted(extra)}"
        )

    drum_programs = {e.program for e in drums}
    if drum_programs != EXPECTED_DRUM_PROGRAMS:
        sys.exit(
            "ERROR: GM drum program coverage does not match the expected "
            f"GS kit set ({sorted(EXPECTED_DRUM_PROGRAMS)}). "
            f"Got: {sorted(drum_programs)}"
        )

    out: list[str] = []
    out.append("// GENERATED by src/api/presets/generate.py. Do not edit by hand.\n")
    out.append("// Regenerate with: npm run gen:presets\n\n")
    out.append(
        'import type { GmDrum, GmInstrument } from "./gm-slugs"\n\n'
    )

    out.extend(
        emit_id_map(
            "gmInstrumentPresetIdByProgram",
            (
                "/** General MIDI melodic instrument preset ids, keyed by 0-indexed\n"
                " * GM program number (0..127). All values are `gakki` presets. */\n"
            ),
            instruments,
        )
    )
    out.extend(
        emit_id_map(
            "gmDrumPresetIdByProgram",
            (
                "/** General MIDI drum kit preset ids, keyed by GM program number.\n"
                " * Only the sparse GS-standard slots are populated: 0, 8, 16, 24, 25,\n"
                " * 32, 40, 48. All values are `gakki` presets. */\n"
            ),
            drums,
        )
    )
    out.extend(
        emit_entries(
            "gmInstruments",
            "GmInstrument",
            (
                "/** Full catalog of the 128 General MIDI melodic presets on `gakki`,\n"
                " * sorted by program number. Intended for preset-picker UIs. */\n"
            ),
            instruments,
        )
    )
    out.extend(
        emit_entries(
            "gmDrums",
            "GmDrum",
            (
                "/** Full catalog of the 8 General MIDI drum-kit presets on `gakki`,\n"
                " * sorted by program number. */\n"
            ),
            drums,
        )
    )

    OUT_PATH.write_text("".join(out))
    sync_slug_docs(instruments, drums)
    root = HERE.parent.parent.parent
    print(
        f"wrote {OUT_PATH.relative_to(root)} "
        f"({len(instruments)} instruments, {len(drums)} drums)"
    )
    print(f"synced slug docs in {SLUGS_PATH.relative_to(root)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
