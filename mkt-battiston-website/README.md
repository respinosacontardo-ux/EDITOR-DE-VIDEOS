# MKT BATTISTON — Sitio Web

Página web de una sola página (SPA) para presentar los softwares de automatización
con IA de MKT BATTISTON: YouTube, TikPro (TikTok), WhatsApp Pro, Facebook e Instagram.

## Tecnologías

- **React 18** + **Vite**
- **Tailwind CSS** (tema oscuro premium, acento violeta `#7C3AED`)
- **Framer Motion** (animaciones al hacer scroll, contadores, acordeones)

## Estructura

- `src/data/content.js` — **Todo el contenido del sitio** (textos, softwares,
  especificaciones, tabla comparativa, link de WhatsApp). Para cambiar textos,
  editá solo este archivo.
- `src/components/` — Componentes: Navbar, Hero, Ventajas, secciones de
  software, tabla comparativa, CTA final, footer y mockups visuales.

## Comandos

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # generar versión de producción en dist/
```

## Publicación

La versión ya compilada está en la carpeta **`docs/`** en la raíz del
repositorio. Para publicarla gratis con GitHub Pages:

1. En GitHub: **Settings → Pages**
2. En "Source" elegí **Deploy from a branch**
3. Seleccioná la rama y la carpeta **`/docs`**
4. Guardá — en unos minutos el sitio queda online

Después de modificar el código, regenerá la copia publicada:

```bash
npm run build && rm -rf ../docs && cp -r dist ../docs
```
