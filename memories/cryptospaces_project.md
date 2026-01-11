# CryptoSpaces Projekt - Stand 2026-01-04 07:23

## Projektstruktur
- **Hauptverzeichnis:** `/workspace/crypto-screener/dist/`
- **Hauptseite:** `index.html` (CryptoBubbles Visualisierung)
- **Top 100 Seite:** `top100.html` (Coin-Kursliste mit Animationen)

## Letzte Deploy-URL
https://xhvtn7yxki9l.space.minimax.io

## Implementierte Features

### index.html (Startseite)
- CryptoBubbles Visualisierung (100 Coins)
- Effekt-Toggles (Vortex, HotBuys, Fire, Ice, etc.)
- 5cRally View mit denselben Effekten
- Hover-Tooltip mit Coin-Daten und Close-Button
- Links zu CoinGecko/CoinMarketCap im Tooltip
- Menü-Link zu Top 100 Seite

### top100.html - Alle Features

#### Basis-Features
- Live-Tabelle der Top 100 Coins (CoinGecko API)
- Sortierung, Filterung, Suche
- Detail-Drawer pro Coin
- Watchlist & Alerts (LocalStorage)

#### 🚀 Rocket Animation (Start Button)
- 10 Sekunden Animation
- Diagonaler Flug
- Partikel basierend auf 24h-Performance

#### 📈 Chart-Rocket Animation (Chart Button)
- **Dauer:** 30 Sekunden
- **Visualisiert:** 7 Tage Volumen komprimiert
- **Flugrichtung:** Links unten → Rechts oben
- **Punkt-Spur:** Bleibt nach Animation sichtbar
- **Triebwerkseffekte:**
  - Position: calc(xPercent% - 20px) links, calc(yPercent% - 80px) unten
  - Rotation: 190°
  - Größe skaliert mit Volumendaten
  - Flammen-Kern mit Blur-Effekt
- **Exhaust-Partikel:** Farbe/Intensität volumenabhängig

#### 📰 News-Rocket Animation (News Button) - NEU
- **Overlay:** 92vw × 88vh News Space
- **Datenquelle:** CryptoCompare News API (mit Fallback)
- **Zeitraum:** Letzte 90 Tage (3 Monate)
- **Rakete:** Fliegt diagonal, verteilt News-Buttons im Raum
- **Positionierung:**
  - X-Achse = Zeit (links = vor 90 Tagen, rechts = heute)
  - Y-Achse = Impact/Relevanz
- **Farbkodierung:**
  - Grün (positive): Sentiment > 0.2
  - Rot (negative): Sentiment < -0.2
  - Blau (neutral): dazwischen
- **Interaktion:**
  - Klick auf News-Node öffnet Detail-Card
  - Detail-Card zeigt: Titel, Quelle, Datum, Summary
  - "Open Source" Button öffnet Link in neuem Tab
- **Filter-Controls:**
  - Zeitraum: 90d / 30d / 7d
  - Timeline-Slider
- **Schließen:** X-Button oder ESC-Taste

## Technische Details
- Datenquelle Coins: CoinGecko API
- Datenquelle News: CryptoCompare News API
- Update-Intervall: 60 Sekunden
- Animation: requestAnimationFrame
- Styling: Inline CSS mit Orbitron/JetBrains Mono Fonts
- State Management: Isolierte Module pro Overlay

## Button-Übersicht (Top100 Tabelle)
| Button | Farbe | Funktion |
|--------|-------|----------|
| 🚀 Start | Blau | Day-Flight Animation |
| 📈 Chart | Lila | 7-Day Volume Trail |
| 📰 News | Grün | News Space Overlay |
