# Mis Gastos

PWA (Progressive Web App) instalable para control personal de gastos, con estética recibo/streetwear.
Esta es la versión **compartida** (100% local, sin Google Sheets) que usan otras personas de forma
independiente. La versión personal, con sincronización a Sheets, está en el repo `mis-gastos-timeless`.

**App en vivo:** https://albertoherrera19.github.io/mis-gastos/

## Funciones
- Registro de gastos (monto, nota opcional, categoría) — guardado en `localStorage`.
- 8 categorías base + categorías personalizadas con emoji.
- 8 temas de color.
- Gráfico circular (donut) interactivo por categoría del mes actual.
- Comparativo de barras por mes con lista de totales.
- Instalable y con soporte offline (service worker).

## Archivos
- `index.html`, `style.css`, `app.js` — la app.
- `manifest.json`, `service-worker.js`, `icon-192.png`, `icon-512.png` — PWA.
