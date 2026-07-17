"""Batch-transcribe every video in a directory with local Whisper. Free, no API keys.

Walks <videos_dir> for common video extensions, runs faster-whisper on
each, writes transcripts to <videos_dir>/edit/transcripts/<name>.json.

The model is loaded ONCE and files are processed sequentially —
faster-whisper already saturates all CPU cores per file, so parallel
workers would just fight for cores and RAM.

Cached per-file: any source that already has a transcript is skipped.

Usage:
    python helpers/transcribe_batch.py <videos_dir>
    python helpers/transcribe_batch.py <videos_dir> --model small
    python helpers/transcribe_batch.py <videos_dir> --language es
    python helpers/transcribe_batch.py <videos_dir> --edit-dir /custom/edit
"""

from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

from transcribe import DEFAULT_MODEL, load_model, transcribe_one

VIDEO_EXTS = {".mp4", ".MP4", ".mov", ".MOV", ".mkv", ".MKV", ".avi", ".AVI", ".m4v"}


def find_videos(videos_dir: Path) -> list[Path]:
    videos = sorted(
        p for p in videos_dir.iterdir()
        if p.is_file() and p.suffix in VIDEO_EXTS
    )
    return videos


def main() -> None:
    ap = argparse.ArgumentParser(description="Batch transcription of a videos directory (local Whisper)")
    ap.add_argument("videos_dir", type=Path, help="Directory containing source videos")
    ap.add_argument(
        "--edit-dir",
        type=Path,
        default=None,
        help="Edit output directory (default: <videos_dir>/edit)",
    )
    ap.add_argument(
        "--model",
        type=str,
        default=DEFAULT_MODEL,
        help=f"Whisper model size (default: {DEFAULT_MODEL})",
    )
    ap.add_argument(
        "--language",
        type=str,
        default=None,
        help="Optional ISO language code. Omit to auto-detect per file.",
    )
    ap.add_argument("--beam-size", type=int, default=5, help="Decoder beam size (default: 5)")
    args = ap.parse_args()

    videos_dir = args.videos_dir.resolve()
    if not videos_dir.is_dir():
        sys.exit(f"not a directory: {videos_dir}")

    edit_dir = (args.edit_dir or (videos_dir / "edit")).resolve()
    (edit_dir / "transcripts").mkdir(parents=True, exist_ok=True)

    videos = find_videos(videos_dir)
    if not videos:
        sys.exit(f"no videos found in {videos_dir}")

    already_cached = [v for v in videos if (edit_dir / "transcripts" / f"{v.stem}.json").exists()]
    pending = [v for v in videos if v not in already_cached]

    print(f"found {len(videos)} videos ({len(already_cached)} cached, {len(pending)} to transcribe)")
    if not pending:
        print("nothing to do")
        return

    print(f"loading whisper model '{args.model}' (once, shared across files)")
    model = load_model(args.model)

    t0 = time.time()
    errors: list[tuple[Path, str]] = []
    for v in pending:
        try:
            out = transcribe_one(
                video=v,
                edit_dir=edit_dir,
                model=model,
                language=args.language,
                beam_size=args.beam_size,
                verbose=False,
            )
            print(f"  + {v.stem}  →  {out.name}")
        except Exception as e:
            errors.append((v, str(e)))
            print(f"  x {v.stem}  FAILED: {e}")

    dt = time.time() - t0
    print(f"\ndone in {dt:.1f}s")
    if errors:
        print(f"{len(errors)} failures:")
        for v, msg in errors:
            print(f"  {v.name}: {msg}")
        sys.exit(1)


if __name__ == "__main__":
    main()
