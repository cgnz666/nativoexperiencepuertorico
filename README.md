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

Private services page photos (`services.html`):
Each service uses a pair of files, WebP first with a JPG fallback.
To change a photo, replace both files keeping the same names and a
portrait 4:5 crop, around 1100 x 1375 px:
- assets/service-catering.webp / .jpg
- assets/service-forest-yoga.webp / .jpg
- assets/service-massage.webp / .jpg
- assets/service-concierge.webp / .jpg

Bókun:
- Booking channel UUID: 53a6da0f-77c9-4ae5-84a4-155de87c7fe0
- Product List ID: 110434
