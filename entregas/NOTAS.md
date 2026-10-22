# Entrega — Reels para Instagram (formato 1080×1920, 30fps, audio normalizado -14 LUFS)

| Archivo | Duración | Contenido |
|---|---|---|
| REEL-1-ANUNCIO-PRINCIPAL.mp4 | 30s | Anuncio combinado: gancho + demo (vídeo empleado automático) + beneficio "1000-3000 mensajes/día" + CTA + tarjeta final |
| REEL-2-EMPLEADO-AUTOMATICO.mp4 | 32s | Vídeo "empleado que trabaja para vos" pulido + tarjeta final |
| REEL-3-HERRAMIENTA-MENSAJES.mp4 | 46s | Vídeo "herramienta que te va a salvar la vida" pulido (silencios recortados) + tarjeta |
| REEL-4-DEMO-PANTALLA.mp4 | 39s | Demo de pantalla con voz en off, pulido (2,3s de aire muerto eliminados) + tarjeta |

Tarjeta final: "¿QUIERES ESTE SISTEMA PARA TU NEGOCIO? — Envíame un mensaje con la palabra INFO".
Para cambiar el texto o poner un @ / WhatsApp concreto: editar
`edit/animations/slot_cta/src/OverlayCard.tsx` y re-renderizar (o pedírselo a Claude).

## Sesión 2026-07-20

| Archivo | Duración | Contenido |
|---|---|---|
| REEL-6-ANUNCIO-LICENCIA.mp4 | 43s | Anuncio combinado nuevo: gancho + demo empleado (V3) → dato 1000-3000 mensajes/día (V1) → ángulo "sin membresía mensual, licencia por un año" (V2, no usado en REEL-1) → CTA + tarjeta final. 1080×1920 30fps, -14 LUFS |

Tarjeta CTA de esta sesión: `edit/animations/slot_cta_reel6/` (PIL, script `make_card.py` incluido para regenerarla con otro texto).

| REEL-7-SISTEMA-CLIENTES.mp4 | 36s | Edición pro estilo tendencia del vídeo nuevo (18-07): pausas recortadas, punch-zooms alternados (incl. en el corte de escena interno a los 10s), subtítulos karaoke palabra a palabra (resaltado azul), tarjetas animadas sincronizadas con la voz (PUBLICIDAD ✕, AGENCIA DE MARKETING ✕, contador 1.000→3.000 clientes/día, burbuja INFO) + tarjeta CTA final. 1080×1920 30fps, -14 LUFS |

Fuentes de la edición del REEL-7 en `edit/reel7/` (alineación de palabras, subtítulos .ass y scripts).

| REEL-8-SISTEMA-CLIENTES-V2.mp4 | 36s | Versión recargada del REEL-7 estilo reels de tendencia: título gancho animado, teléfono con chats entrando en vivo, badge 24/7 giratorio, chip "TODO EN AUTOMÁTICO", tachados con sacudida y emojis, contador 1.000→3.000 con cohete y confeti, flashes blancos en cada corte, barra de progreso y captions grandes 1-2 palabras (activa en amarillo, keywords en azul) |

| REEL-9-SISTEMA-CLIENTES-PRO.mp4 | 36s | Versión definitiva mejorada del mismo vídeo: transiciones whip-zoom con desenfoque de movimiento + flash suave, gancho con borde luminoso pulsante y subrayado animado, teléfono realista (header, avatares, indicador "escribiendo…", 3 chats entrando), badge 24/7, chip EN AUTOMÁTICO, gráfico de barras animado CLIENTES/DÍA, tachados con sacudida, contador 1.000→3.000 con confeti, burbuja INFO, viñeta, barra de progreso y captions con pop animado por palabra |

| PRESENTACION-MKT-BATTISTON.mp4 | 57s | Video presentación hecho con REMOTION siguiendo la identidad exacta de la web (respinosacontardo-ux.github.io/web): fondo galaxia, naranja #ff5a1f/cian #22d3ee, logo y SVGs del sitio. Secciones: intro marca → stats 24/7·100%·5+ → 4 ventajas → suite de 5 softwares (IG, FB, WhatsApp Pro, TikPro, YouTube) con tarjetas animadas → demo real del software (clip "1.000-3.000 mensajes") en marco con glow → CTA WhatsApp. Música ambiental + whooshes sintetizados, -14 LUFS |

| AD-META-MKT-BATTISTON.mp4 | 39s | ANUNCIO para Meta Ads hecho con Remotion, combinando los 2 vídeos nuevos con la marca de la web: pitch a cámara con captions karaoke (naranja/cian) → L-cut a la CAPTURA REAL del software 4K con paneo, chips de features y contador 2.000→3.000 aterrizando en "tres mil" → tira de los 5 softwares "PARA EMPRESAS Y NEGOCIOS" → CTA "DEJAME UN MENSAJE" + botón WhatsApp → cierre de marca. Voz continua de principio a fin, música ambiental debajo, -14 LUFS |

| PLANNER-2027-META.mp4 | 11s | Video de producto (Planner mensual 2027 imprimible A5) listo para Meta Ads: se reemplazó el audio original (canción de tendencia con derechos → riesgo de bloqueo/silenciado en Meta) por una pista lo-fi acogedora ORIGINAL sintetizada localmente (100% libre de derechos), realce sutil de color pastel, escalado a 1080×1920 (9:16) y audio normalizado a -14 LUFS |

| AGENDAS-2027-META.mp4 | 29s | Anuncio para Meta de las Agendas Digitales 2027: corte de 57s→28.7s con los mejores momentos (portadas aura, vista anual, vision board, trackers, calendarios, journaling), overlays informativos animados por sección (Vision Board+Metas, trackers, 12 portadas mensuales, diseños aura, calendarios, plan de ahorros/journaling), barra de progreso, música libre de derechos ORIGINAL (dreamy/soft-pop) y CTA final "Conseguí la tuya · $6.990". 1080×1920, -14 LUFS. Audio original con derechos reemplazado. |

| AGENDAS-IMPRIMIBLES-SIN-TEXTO.mp4 | 58s | Video de agendas 2027 imprimibles con el BLOQUE DE TEXTO AZUL ELIMINADO (ffmpeg delogo sobre la caja fija x38-540/y716-830), escalado a 1080x1920, grade sutil. Base lista para ponerle voz en off. Audio original conservado (a reemplazar/duckear cuando llegue la voz). |
| GUION-VOZ-CHILENA.txt | - | Guion de voz en off en español chileno (~58s) para generar en ElevenLabs, con versión limpia, versión con timecodes y ajustes recomendados. |

| PROMO-PAPELIA-MUSICA-LIBRE.mp4 | 20s | Promo "Super Pack Agendas 2027" (papeliadigital.store) con la MÚSICA CAMBIADA por una pista libre de derechos ORIGINAL (bright/bouncy, 112 BPM). Se conservan todos los textos y la marca del video. Escalado a 1080x1350 (4:5 feed), grade sutil, -14 LUFS. Audio original (con derechos) reemplazado. |

| PLANNER-2026-VOZ-MARCELA.mp4 | 49s | Video "2026 Planner" con la VOZ DE ELEVENLABS (Marcela, chilena) que el usuario descargó, + subtítulos nuevos karaoke sincronizados a esa voz (tapan los viejos). El video se ralentizó ~9.7% (setpts) para calzar con la voz de 48.8s. 1080x1920, voz a -14 LUFS. Precio en CTA: 6.990. |

