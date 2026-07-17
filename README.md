# EDITOR-DE-VIDEOS

Editor de vídeo conversacional para Claude Code, basado en la skill [video-use](https://github.com/browser-use/video-use) de browser-use, **adaptada para usar solo herramientas gratuitas y locales**.

## ¿Qué cambia respecto al original?

| Original | Esta versión |
|---|---|
| ElevenLabs Scribe (API de pago) | **Whisper local** (`faster-whisper`, gratis, sin API key) |
| Requiere `ELEVENLABS_API_KEY` | Sin claves ni cuentas de ningún tipo |
| Diarización de hablantes automática | Sin diarización (Whisper no diariza; se indica manualmente si hace falta) |

Todo lo demás es igual: cortes por transcripción palabra a palabra, etalonaje con ffmpeg, subtítulos incrustados, animaciones superpuestas (PIL, Manim, Remotion, HyperFrames — todas open source) y el flujo *preguntar → confirmar → ejecutar → iterar*.

## Instalación

```bash
# 1. Dependencias Python (todas gratuitas)
pip install -r .claude/skills/video-use/requirements.txt

# 2. ffmpeg (requisito imprescindible)
sudo apt-get install -y ffmpeg        # Debian/Ubuntu
# brew install ffmpeg                 # macOS

# 3. Opcional: descargar vídeos de URLs
pip install yt-dlp
```

El modelo de Whisper se descarga automáticamente la primera vez que transcribes (por defecto `small`, ~460 MB) y queda cacheado. Guía completa en `.claude/skills/video-use/install.md`.

## Uso

Abre Claude Code en la carpeta donde tengas tu material y pide, por ejemplo:

> "edita estas tomas y hazme un vídeo de lanzamiento"

Claude leerá la skill (`.claude/skills/video-use/SKILL.md`), transcribirá con Whisper, te propondrá una estrategia y no tocará nada hasta que la confirmes. Todos los resultados van a `<carpeta_de_videos>/edit/` — el material original nunca se modifica.

### Helpers (se pueden usar también a mano)

```bash
cd .claude/skills/video-use

python helpers/transcribe.py video.mp4 --language es      # transcripción local con Whisper
python helpers/transcribe_batch.py /ruta/a/videos          # transcripción en lote
python helpers/pack_transcripts.py --edit-dir edit         # transcripciones → takes_packed.md
python helpers/timeline_view.py video.mp4 10 25            # fotogramas + forma de onda (PNG)
python helpers/render.py edit/edl.json -o final.mp4        # renderizado del corte
python helpers/grade.py in.mp4 -o out.mp4 --list-presets   # etalonaje de color
```

## Estructura

```
.claude/skills/video-use/
├── SKILL.md          ← la skill (metodología completa de edición)
├── install.md        ← guía de instalación (sin API keys)
├── requirements.txt  ← faster-whisper, librosa, matplotlib, pillow, numpy
└── helpers/
    ├── transcribe.py        ← Whisper local, timestamps por palabra
    ├── transcribe_batch.py  ← lote (carga el modelo una sola vez)
    ├── pack_transcripts.py  ← transcripciones → markdown legible
    ├── timeline_view.py     ← filmstrip + waveform para decidir cortes
    ├── render.py            ← extracción por segmentos → concat → overlays → subtítulos
    └── grade.py             ← cadenas de filtros ffmpeg para color
```
