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
