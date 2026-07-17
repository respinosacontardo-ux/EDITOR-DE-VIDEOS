---
name: video-use-install
description: Install the free-tools edition of video-use — wire up ffmpeg + local Whisper (faster-whisper). No API keys, no paid services.
---

# video-use install (free-tools edition)

Use this file only for first-time install. For daily editing, read `SKILL.md`. Always read `helpers/` — that's where the scripts live.

## What you're doing

You're setting up a conversation-driven video editor for the user. After install, the user drops raw footage into any folder, starts their agent there, and says "edit these into a launch video." You do the rest by reading `SKILL.md`.

Three things must exist on this machine — all free:

1. This skill directory (`.claude/skills/video-use/`) with `SKILL.md` and `helpers/` as siblings.
2. `ffmpeg` + `ffprobe` on `$PATH` (plus optional `yt-dlp` for online sources).
3. Python deps installed, including `faster-whisper` for local transcription.

There is **no API key step**. Transcription runs locally with Whisper.

## Steps

### 1. Install Python deps

```bash
pip install -r .claude/skills/video-use/requirements.txt
```

That installs `faster-whisper`, `librosa`, `matplotlib`, `pillow`, `numpy`. No console scripts — helpers are invoked directly as `python helpers/<name>.py`.

### 2. Install ffmpeg (+ optional yt-dlp)

`ffmpeg` and `ffprobe` are hard requirements. `yt-dlp` is only needed to pull sources from URLs. Animation engines (HyperFrames, Remotion, Manim) are installed lazily the first time a project needs them — all open source.

```bash
# Debian / Ubuntu
sudo apt-get update && sudo apt-get install -y ffmpeg

# macOS
command -v ffmpeg >/dev/null || brew install ffmpeg

# Arch
# sudo pacman -S ffmpeg

# yt-dlp (optional, free)
pip install yt-dlp
```

If the package manager requires a sudo prompt, tell the user the exact command and wait. Do not invent a password.

### 3. Whisper model

Nothing to do manually. The first run of `transcribe.py` downloads the model (default `small`, ~460 MB) into the Hugging Face cache and reuses it forever after. Model size guide:

| Model | Size | Best for |
|---|---|---|
| `tiny` / `base` | 75–140 MB | quick drafts, weak machines |
| `small` (default) | ~460 MB | good balance on CPU |
| `medium` | ~1.5 GB | better accuracy, slower |
| `large-v3` | ~3 GB | best accuracy; GPU recommended |

### 4. Verify end-to-end

Run one real thing. Transcription is free, so a real test costs nothing but time:

```bash
python .claude/skills/video-use/helpers/timeline_view.py --help >/dev/null && echo "helpers OK"
ffprobe -version | head -1
python -c "import faster_whisper; print('faster-whisper OK')"
```

Optionally transcribe a short clip to confirm the full pipeline:

```bash
python .claude/skills/video-use/helpers/transcribe.py <some_short_clip.mp4> --model base
```

### 5. Hand off

Tell the user, in one short message:

- The skill is installed at `.claude/skills/video-use/` and everything it uses is free and local.
- They should start their agent in (or point it at) their footage folder.
- A good first message is: *"edit these into a launch video"* or *"inventory these takes and propose a strategy."*
- All outputs land in `<videos_dir>/edit/` — sources stay untouched.

## Cold-start reminders

- Keep `SKILL.md` and `helpers/` as siblings — the skill references helpers by relative path.
- `ffmpeg` from static builds works fine. Any modern (≥ 4.x) build is enough.
- `yt-dlp` is optional. Install lazily the first time a user asks to pull from a URL.
- Node.js/npm are only needed for HyperFrames or Remotion slots. HyperFrames currently requires Node.js 22+.
- On a machine without a GPU, prefer `small` or `base`; warn the user that `large-v3` on CPU can take several × real-time.
- Never suggest a paid transcription or TTS service. If asked for voiceover generation, use free/local options (e.g. Piper TTS, espeak-ng, Coqui TTS) and confirm the choice with the user.
