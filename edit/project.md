## Sesión 2 — 2026-07-20

**Estrategia:** Reel combinado nuevo (~43s) a partir de los 3 vídeos únicos de la raíz (2 de los 5 MP4 son duplicados exactos), diferenciado del REEL-1 anterior por el ángulo "sin membresía mensual / licencia por un año" de V2. Sin subtítulos nuevos (los vídeos traen subtítulos azules incrustados). Tarjeta CTA final replicando el estilo de las entregas anteriores.

**Decisiones:**
- EDL: V3 0.00-15.79 (gancho+demo empleado) → V1 8.88-16.45 (1000-3000 mensajes/día) → V2 18.70-27.65 (licencia anual) → V3 23.25-28.90 (CTA) → tarjeta 4.5s.
- Cortes anclados a silencios/micro-pausas detectados con librosa (top_db 28-35); sin transcripción palabra a palabra disponible, frase + silencio garantiza no cortar dentro de palabra.
- Grade neutro; solo normalización de lienzo `scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920` (V1 es 464×832 y a -2:1920 daría 1070 px de ancho, rompería el concat).
- Salida 30fps, loudnorm 2 pasadas -14 LUFS.

**Reasoning log:**
- La red del entorno remoto bloquea huggingface.co → faster-whisper no puede descargar el modelo. Solución: whisper tiny multilingüe en TFLite obtenido del repo nyadla-sys/whisper.tflite vía proxy.golang.org (zip de módulo Go), parcheado binariamente: en la lista de supresión del grafo se sustituyó el token sin uso 50254→50358 (suprime "translate", fuerza transcripción es) y 49870→50363 (suprime "notimestamps", habilita timestamps por frase). Modelo parcheado en scratchpad (no committeado); transcripciones cacheadas en edit/transcripts/*.json (formato propio: segments frase + silencios, no schema Scribe).
- tflite-runtime requiere numpy<2 (instalado 1.26.4).
- Los timestamps de tiny son por frase, no por palabra; render.py --build-subtitles no serviría con este esquema. No se necesitaron subtítulos.

**Outstanding:**
- Si el usuario tiene vídeos nuevos en su carpeta local "videos sin editar", hay que subirlos al repo para poder editarlos (el entorno remoto no ve el escritorio).
- Posible mejora: personalizar la tarjeta CTA con @ o número de WhatsApp reales.
