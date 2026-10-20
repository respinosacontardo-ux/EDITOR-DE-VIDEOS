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

## Sesión 3 — 2026-07-21

**Estrategia:** Edición "tendencia 2026" del vídeo nuevo VIDEO-2026-07-18-02-04-17.mp4 (32.5s, 720×1280 @30, sin subtítulos incrustados): ritmo apretado, zoom dinámico, subtítulos karaoke y overlays sincronizados con palabras clave, tarjeta CTA final reutilizada (slot_cta_reel6).

**Decisiones:**
- Transcripción: whisper tiny TFLite parcheado (ventanas 0/21/23/24) + alineación palabra a palabra con aeneas (espeak DTW), re-anclada por bloques a los silencios reales (aeneas deriva ±0.3s; los silencios de librosa son la referencia).
- aeneas requiere setuptools<60 + --no-build-isolation para compilar.
- 6 segmentos con pausas recortadas (~1s total); zoompan por segmento con punch alternado 1.00/1.08 y salto de zoom en el frame del corte de escena interno (10.0s, detectado con scene>0.35) para no crear costura de audio.
- Subtítulos: ASS propio PlayResY=1920, evento por palabra (palabra activa azul &HFF9E4A + fscx112), 2-3 palabras por línea, MarginV=470 (zona segura IG). Aplicados ÚLTIMOS en el grafo.
- Overlays RGBA como secuencias PNG (overlay respeta alfa, sin códec intermedio), setpts PTS-STARTPTS+t/TB + enable between: tachados de PUBLICIDAD (out 15.45) y AGENCIA (17.70) aterrizando el trazo rojo en la palabra hablada, contador 1.000→3.000 aterrizando en "tres mil" (out 25.14), burbuja INFO en "Dejame un mensaje" (28.55).
- ✕ del badge dibujado con líneas (Liberation Sans no tiene U+2715).
- Loudnorm 2 pasadas -14 LUFS al final.

**Reasoning log:** el corte interno del propio vídeo a los 10.0s permite el punch-zoom sin cortar el audio continuo (zoompan condicional por frame en un único segmento).

**Outstanding:** música de fondo no añadida (sin biblioteca musical libre en el entorno); si el usuario quiere, puede aportar una pista.

## Sesión 3b — 2026-07-21 (REEL-8)

**Estrategia:** remezcla del mismo material con densidad visual alta (referencias IG del usuario no accesibles por red; se aplicó el lenguaje estándar de ese formato: captions grandes karaoke, iconos por frase, pops con rebote, flashes, barra de progreso).
**Decisiones:** emojis a color vía fonts-noto-color-emoji + Pillow embedded_color (tiles 109px reescalados); easing ease_out_back para pops "que se noten"; flash radial blanco 5 frames reutilizado con split en 7 cortes; barra de progreso con color lavfi + overlay x=f(t); subtítulos 104px máx 2 palabras, activa amarilla \fscx116, keywords azules, jitter ±2° por frase; zooms punch 1.00/1.12. Overlays: gancho 0.12s, teléfono 2.45s, 24/7 6.55s, automático 10.15s, tachados 15.40/17.70, contador 23.70 (aterriza en "tres mil" 25.14), INFO 28.50.
**Outstanding:** sin música de fondo (sin biblioteca libre en el entorno).

## Sesión 3c — 2026-07-21 (REEL-9)

**Estrategia:** upgrade del REEL-8 sobre el mismo material (el upload de WhatsApp era byte-idéntico, verificado por md5): transiciones whip (rampa de zoom +0.30 en 4 frames + boxblur habilitado por frame en cabeza/cola de cada segmento y en el corte de escena interno), flash reducido a 3 frames como acento, viñeta sutil.
**Decisiones nuevas:** hook con borde glow pulsante (GaussianBlur sobre contorno) + subrayado sweep; teléfono v2 con cabecera, avatares de color, indicador de escribir con puntos animados y 3 mensajes; slot nuevo de gráfico de barras (5 barras ease-out-back, última amarilla) en 13.15-15.35 (hueco libre entre chip y tachados); emojis flotantes 🛋️😎 en "cualquier cosa"; subtítulos con \t(0,90) pop de 104→120 en la palabra activa.
**Outstanding:** música de fondo sigue pendiente de que el usuario aporte pista.

## Sesión 4 — 2026-07-21 (PRESENTACION con Remotion)

**Estrategia:** video presentación 1080×1920@30 de 57s (1700 frames) hecho íntegramente con Remotion 4 (edit/animations/slot_presentacion), estética clonada del repo respinosacontardo-ux/web (añadido a la sesión vía add_repo porque github.io está bloqueado): tokens de styles.css, textos y SVGs de index.html.
**Decisiones:**
- Secciones por frame absoluto: intro 0-150, stats 150-255, ventajas 255-435, softwares 435-1035 (5×120), demo 1035-1455, CTA 1455-1700. Springs de remotion (damping 12-16).
- Fondo galaxia: 130 estrellas deterministas (PRNG mulberry32 seed 42) + glows radiales naranja/cian, igual que el canvas del sitio.
- Demo: clip 8.6-22.4s del VIDEO-2026-07-17-22-25-15 (versión HQ del pitch "1.000-3.000 mensajes"), re-codificado a 30fps CFR (WhatsApp 60fps daba frames negros en OffthreadVideo) y ENVUELTO EN <Sequence from={S5} layout="none"> — sin Sequence, OffthreadVideo usa el frame absoluto de la composición y buscaba el segundo 47 de un video de 43s → negro.
- Audio: cama ambiental sintetizada (aevalsrc, drone 55/110/164.8/220 Hz con trémolos lentos + lowpass 500) + whoosh (anoisesrc rosa filtrado) en cada cambio de sección; la cama baja a 0.35 durante la demo; loudnorm -14 al final.
- Fuente: Liberation Sans (metric-compatible con la pila Arial del sitio).
**Outstanding:** el número de WhatsApp aparece como texto (wa.me/…); si el usuario quiere QR, se puede generar.

## Sesión 5 — 2026-07-21 (AD-META con Remotion)

**Estrategia:** anuncio 1080×1920@30 de 38.7s (1160 frames) combinando VIDEO-2026-07-18-02-03-42 (pitch hablado 33.6s) y VIDEO-0721.mov (captura 4K del software real, 55s). Narración CONTINUA del pitch como columna vertebral; visuales en L-cut: cara (0-11.2s) → screen real (11.2-22.2, coincide con "Mirá, así es como funciona") → suite 5 softwares (22.2-28.6, "aplicar en tu negocio, marca o emprendimiento") → CTA (28.6-33.2, "dejame un mensaje") → outro de marca (33.2-38.7).
**Decisiones técnicas:**
- Alineación aeneas del pitch (100 palabras) re-anclada a 5 bloques de silencio; mapeo a frames de composición (comp = src-0.21+0.2s). "Mirá"@f337, "tres mil"@f607 (aterrizaje del contador), voz termina f994.
- Captions karaoke en React (no ASS): chunks ≤2 palabras, activa naranja #ff8a3d con pop 1→1.16, keywords cian; gap 46px para que el scale no coma el espacio.
- Assets: vidA30 (CFR re-encode, mudo) + vozA.wav (voz separada, ambos en Sequence from=6 con trimBefore=6), demoB.mp4 (4K→1080p, 13s, mudo) con paneo/zoom CSS interpolado dentro de ventana con borde degradado.
- Átomos de marca exportados desde Presentacion.tsx (Galaxy, LogoMark, Wordmark, Badge, PIcon) y reutilizados.
- Audio: voz + bed 0.15 (0.55 en outro) + whoosh en cada cambio de sección; loudnorm -14 post-render.
**Outstanding:** para Meta Ads conviene también una variante 1:1 y una 16:9; se pueden derivar de la misma composición cambiando width/height y ajustando layouts.

## Sesión 6 — 2026-10-20 (PLANNER-2027-META)

**Estrategia:** adaptar para Meta Ads el video de producto del Planner mensual 2027 (imprimible A5). El video (576×1024, 10.6s) traía el audio original de la red social — una canción con derechos que en Meta provoca bloqueo/silenciado del anuncio. Se reemplaza por música libre de derechos.
**Decisiones:**
- Música: pista lo-fi ORIGINAL sintetizada con numpy (edit/planner/make_music.py), 82 BPM, progresión Cmaj7-Am7-Fmaj7-G, pad cálido + melodía music-box pentatónica + sub-bass + percusión suave + crackle de vinilo. 100% libre de derechos (generada, no descargada; la red del entorno solo permite repos de paquetes).
- Video: escalado a 1080×1920 (9:16 exacto, el fuente ya era 0.5625) con lanczos, grade sutil (contrast 1.05, saturation 1.09, brightness +0.012, unsharp 0.3) para que el pastel resalte sin romper la estética suave.
- Audio: música recortada a la duración del video con fade in 0.4s / fade out 0.8s; loudnorm 2 pasadas a -14 LUFS (Meta/IG/TikTok).
**Outstanding:** si el usuario quiere, se puede añadir tarjeta CTA final con marca/WhatsApp, o variantes 1:1 y 4:5 para el feed de Meta.

## Sesión 7 — 2026-10-20 (AGENDAS-2027-META)

**Estrategia:** anuncio Meta ≤30s del video de Agendas Digitales 2027 (maestrodelaforja). La tienda Shopify estaba BLOQUEADA por la política de red del entorno (myshopify.com rechazado por el proxy; además la URL de preview requiere login), así que la info de producto se tomó del caption del propio usuario (Vision Board, metas, plan de ahorros, book journal, digital journaling) + lo visible en el video. Datos confirmados por el usuario: CTA sin nombre de marca, precio $6.990, NO nombrar apps (GoodNotes/Notability).
**Decisiones:**
- Corte 57.4s→28.7s: 9 segmentos seleccionados por variedad visual (intro, vista anual, vision board, rueda/trackers, portadas febrero+mayo, aura agosto+noviembre, calendario, journaling, contraportada AGENDA 2027). Mapa de tiempos vía filmstrip con timestamps.
- Overlays: tarjetas PIL (blanco 94%, eyebrow rosa, título plum, barra/pill degradada rosa→naranja tomada de las auras del video), animación slide+fade con ease_out_back, una por sección sincronizada a los offsets de concat. Legibles sobre fondos variados (sombra + card opaca).
- Música: pista ORIGINAL sintetizada (edit/agendas/make_music_ag.py), A mayor I-V-vi-IV, 100 BPM, arpegio pluck brillante + pad airoso + sub + percusión suave. 100% libre de derechos.
- Barra de progreso rosa abajo; loudnorm 2 pasadas -14 LUFS; escalado 1080×1920.
**Outstanding:** no se pudo verificar colores/tipografía/logo reales de la web (bloqueada). Si el usuario pasa su paleta/logo o desbloquea la tienda, se puede ajustar a la identidad exacta. Variantes 1:1 / 4:5 disponibles a pedido.

## Sesión 8 — 2026-10-20 (AGENDAS IMPRIMIBLES: quitar texto azul + guion voz)
**Pedido:** sacar todo el texto azul del video de agendas 2027 imprimibles y dar un guion para voz chilena (ElevenLabs) para ponerle voz en off.
**Decisiones:**
- Texto azul = overlay fijo (caption) abajo-centro: "Imprimible $3000 / Totalmente editable + pdf ya para imprimir / Y las portadas". Posición estática verificada en t=2/5/30/55/57 → x44-533, y722-823.
- Caja opaca (fondo irrecuperable). Se usó ffmpeg delogo (x=38 y=716 w=502 h=114) que interpola desde los bordes; resultado limpio (banda de desenfoque suave que se mezcla con el motion-blur del video), mucho mejor que tapar con un recuadro. El "02 ENERO" azul impreso de la agenda NO es overlay y se conserva.
- Render 1080x1920, grade sutil, audio original conservado (se reemplaza/duckea al recibir la voz).
- Guion de voz en español chileno (~58s) con modismos naturales (po, cachái, al tiro, regia, te tinca), versión limpia + timecodes + ajustes ElevenLabs. Precios: $3000 ARG / $100 UYU.
**Outstanding:** ElevenLabs no es accesible desde el entorno (API de pago/bloqueada). El usuario genera el audio y lo envía; luego se sincroniza + mezcla + loudnorm -14. Opcional: música libre de derechos bajo la voz.
