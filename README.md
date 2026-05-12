# istoc.com — AI-Native B2B Marketplace Stratejik Paneli

Statik HTML stratejik kontrol paneli. Pazar boyutlandırma (TAM/SAM/SOM),
pazarlama yol haritası, finansal planlama, GTM stratejisi, eylem planı,
süreç haritası, İK ve operasyon dahil 15 detay sayfası.

## Yapı

```
.
├── index.html                       # Landing — 6 ana section, modal-iframe sistemi
├── assets/
│   ├── style.css                    # Mobile-first design system (Roboto, 1rem min)
│   └── charts.js                    # ECharts auto-resize + responsive helpers
└── pages/
    ├── tam-sam-som.html             # Pazar boyutlandırma (master kaynak)
    ├── pazarlama-yol-haritasi.html
    ├── pazarlama-kpi.html
    ├── capex-opex.html
    ├── gelir-gider.html
    ├── basabas-analizi.html
    ├── finansal-tablolar.html
    ├── toplam-maliyetler.html
    ├── yatirim-sureci.html
    ├── gtm-stratejisi.html
    ├── eylem-plani-3ay.html
    ├── eylem-plani-6ay.html
    ├── surec-haritasi.html
    ├── ik-kalifikasyonlari.html
    ├── timesheets.html
    └── universite-saha-ordusu.html
```

## Teknoloji

- Roboto (Google Fonts CDN)
- Flowbite 2.5 (CSS+JS CDN)
- ECharts 5.5 (CDN)
- Phosphor Icons (CDN)
- Vanilla HTML + CSS değişkenleri + vanilla JS
- Build adımı **yok** — tarayıcıda doğrudan açılır

## Yerel test

```bash
# Doğrudan dosyadan
open index.html

# Veya basit HTTP sunucusu
python3 -m http.server 8080
# → http://localhost:8080
```

## GitHub Pages yayınlama

```bash
# 1) Bu klasörde git init
git init
git add .
git commit -m "İstoç stratejik panel — ilk yayın"

# 2) GitHub repo'ya bağla
git branch -M main
git remote add origin https://github.com/karacaismail/istocpazar.git
git push -u origin main

# 3) GitHub web: Settings → Pages
#    Source: Deploy from a branch
#    Branch: main / (root)
#    Save → ~1 dk sonra https://karacaismail.github.io/istocpazar/ yayında
```

## Mobile-first

iPhone SE (375×667) baz alındı. Breakpoint'ler 640 / 768 / 1024 / 1280 px.
Tablolar mobilde kart-stack pattern (yatay scroll yok).

## Veri tutarlılığı

Tüm sayfa **TAM/SAM/SOM master**'a senkronize:
- Ay 3 medyan ödeyen üye: 50 (SOM %1.7)
- Ay 6 medyan: 230 (SOM %7.7)
- Ay 12 medyan: 780 (SOM %26 — Nisan 2027)
- Ay 20 medyan: 1.500 (SOM %50 — Aralık 2027)
- ARPU karma: $200/ay = $2.400/yıl
- Başabaş üye sayısı: ~407 (~Ay 8-9)

## Lisans

Özel proje — istoc.com için hazırlandı.
