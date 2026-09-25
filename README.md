# Nativo Experience Puerto Rico website

Files:
- index.html
- tours.html
- services.html
- styles.css
- services.css
- script.js
- tours.js
- services.js
- tours.json
- scripts/actualizar-tours.mjs
- .github/workflows/actualizar-tours.yml
- assets/

Tour catalogue (`tours.html`):
The cards are built from `tours.json`, which a scheduled GitHub Action
refreshes four times a day from the Bokun product list 110434. To add or
remove a tour from the website, change that product list in Bokun. No code
change is needed. The Action can also be run by hand from the Actions tab.

Ocean background:
- assets/ocean-loop.mp4 / .webm
- assets/ocean-poster.jpg (first frame, shown while the video loads and
  when the visitor asks for reduced motion)

Upload these exact asset filenames:
- assets/logo.png
- assets/hero-video.mp4
- assets/hero-poster.jpg
- assets/about.jpg

Private services page illustrations (`services.html`):
Line illustrations and icons live in `assets/services/` as SVG.
Scenes are 480 x 480, icons 24 x 24, in the site teal on sand.
To change one, replace the file keeping the same name.

Bókun:
- Booking channel UUID: 53a6da0f-77c9-4ae5-84a4-155de87c7fe0
- Product List ID: 110434

Convención de archivos:
- Un archivo que empieza con `z_` está desactualizado, lo sustituyó una versión nueva.
- Aplica a documentos y capturas, no al código ni a los assets del sitio.
- La regla completa está en CONVENCION_ARCHIVOS.md.
