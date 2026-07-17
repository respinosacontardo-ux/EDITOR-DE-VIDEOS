"""Transcribe a video locally with Whisper (faster-whisper). 100% free, no API keys.

Extracts mono 16kHz audio via ffmpeg, runs faster-whisper with word-level
timestamps, and writes a Scribe-compatible JSON to
<edit_dir>/transcripts/<video_stem>.json so the rest of the pipeline
(pack_transcripts.py, render.py, timeline_view.py) works unchanged:

    {"words": [{"type": "word"|"spacing"|"audio_event",
                "text": str, "start": float, "end": float,
                "speaker_id": "speaker_0"}, ...]}

'spacing' entries are emitted for every inter-word gap so sub-second
silence data is preserved (the editor uses gaps as cut candidates).

Cached: if the output file already exists, transcription is skipped.

Notes:
- Whisper does not diarize. All words are tagged speaker_0. If you need
  speaker labels, note them manually or use a free local diarizer.
- To keep fillers (um, eh, este...), we disable conditioning on previous
  text and optionally seed an initial prompt containing fillers.

Usage:
    python helpers/transcribe.py <video_path>
    python helpers/transcribe.py <video_path> --model small
    python helpers/transcribe.py <video_path> --language es
    python helpers/transcribe.py <video_path> --edit-dir /custom/edit
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path

DEFAULT_MODEL = "small"

# Seeding the decoder with fillers nudges Whisper toward verbatim output
# (it otherwise tends to drop "um"/"eh"). Language-agnostic mix.
VERBATIM_PROMPT = "Umm, let me think like, hmm... okay so, eh, este, o sea, pues."


def extract_audio(video_path: Path, dest: Path) -> None:
    cmd = [
        "ffmpeg", "-y", "-i", str(video_path),
        "-vn", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le",
        str(dest),
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def load_model(model_size: str = DEFAULT_MODEL, device: str = "auto", compute_type: str = "auto"):
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        sys.exit(
            "faster-whisper is not installed. Install it (free) with:\n"
            "  pip install faster-whisper"
        )
    return WhisperModel(model_size, device=device, compute_type=compute_type)


def run_whisper(
    model,
    audio_path: Path,
    language: str | None = None,
    beam_size: int = 5,
    verbatim: bool = True,
) -> dict:
    """Run faster-whisper and return a Scribe-compatible payload."""
    segments, info = model.transcribe(
        str(audio_path),
        language=language,
        beam_size=beam_size,
        word_timestamps=True,
        condition_on_previous_text=False,
        initial_prompt=VERBATIM_PROMPT if verbatim else None,
        vad_filter=False,
    )

    words: list[dict] = []
    full_text: list[str] = []
    prev_end: float | None = None

    for seg in segments:
        for w in seg.words or []:
            text = (w.word or "").strip()
            if not text:
                continue
            start = round(float(w.start), 3)
            end = round(float(w.end), 3)
            if prev_end is not None and start > prev_end:
                words.append({
                    "type": "spacing",
                    "text": " ",
                    "start": prev_end,
                    "end": start,
                })
            words.append({
                "type": "word",
                "text": text,
                "start": start,
                "end": end,
                "speaker_id": "speaker_0",
                "probability": round(float(w.probability), 3),
            })
            full_text.append(text)
            prev_end = end

    return {
        "engine": "faster-whisper",
        "language_code": getattr(info, "language", None),
        "language_probability": round(float(getattr(info, "language_probability", 0.0)), 3),
        "text": " ".join(full_text),
        "words": words,
    }


def transcribe_one(
    video: Path,
    edit_dir: Path,
    model=None,
    model_size: str = DEFAULT_MODEL,
    language: str | None = None,
    beam_size: int = 5,
    verbose: bool = True,
) -> Path:
    """Transcribe a single video. Returns path to transcript JSON.

    Cached: returns existing path immediately if the transcript already exists.
    Pass a pre-loaded `model` to avoid reloading per file (batch use).
    """
    transcripts_dir = edit_dir / "transcripts"
    transcripts_dir.mkdir(parents=True, exist_ok=True)
    out_path = transcripts_dir / f"{video.stem}.json"

    if out_path.exists():
        if verbose:
            print(f"cached: {out_path.name}")
        return out_path

    if verbose:
        print(f"  extracting audio from {video.name}", flush=True)

    t0 = time.time()
    with tempfile.TemporaryDirectory() as tmp:
        audio = Path(tmp) / f"{video.stem}.wav"
        extract_audio(video, audio)
        if model is None:
            if verbose:
                print(f"  loading whisper model '{model_size}'", flush=True)
            model = load_model(model_size)
        if verbose:
            print(f"  transcribing {video.stem}.wav (local, free)", flush=True)
        payload = run_whisper(model, audio, language=language, beam_size=beam_size)

    out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False))
    dt = time.time() - t0

    if verbose:
        kb = out_path.stat().st_size / 1024
        n_words = sum(1 for w in payload["words"] if w["type"] == "word")
        print(f"  saved: {out_path.name} ({kb:.1f} KB) in {dt:.1f}s")
        print(f"    words: {n_words}, language: {payload.get('language_code')}")

    return out_path


def main() -> None:
    ap = argparse.ArgumentParser(description="Transcribe a video locally with Whisper (free)")
    ap.add_argument("video", type=Path, help="Path to video file")
    ap.add_argument(
        "--edit-dir",
        type=Path,
        default=None,
        help="Edit output directory (default: <video_parent>/edit)",
    )
    ap.add_argument(
        "--model",
        type=str,
        default=DEFAULT_MODEL,
        help=f"Whisper model size: tiny/base/small/medium/large-v3 (default: {DEFAULT_MODEL}). "
             "Bigger = more accurate, slower on CPU.",
    )
    ap.add_argument(
        "--language",
        type=str,
        default=None,
        help="Optional ISO language code (e.g., 'es', 'en'). Omit to auto-detect.",
    )
    ap.add_argument("--beam-size", type=int, default=5, help="Decoder beam size (default: 5)")
    args = ap.parse_args()

    video = args.video.resolve()
    if not video.exists():
        sys.exit(f"video not found: {video}")

    edit_dir = (args.edit_dir or (video.parent / "edit")).resolve()

    transcribe_one(
        video=video,
        edit_dir=edit_dir,
        model_size=args.model,
        language=args.language,
        beam_size=args.beam_size,
    )


if __name__ == "__main__":
    main()
