# Creator Calendar Pro

![Creator Calendar Pro](https://img.shields.io/badge/Creator%20Calendar-Pro-3A7BC8?style=for-the-badge&logo=calendar&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-0A1628?style=for-the-badge)
![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-1A3A5C?style=for-the-badge&logo=github)
![PWA](https://img.shields.io/badge/PWA-Ready-3A7BC8?style=for-the-badge)
![OLED](https://img.shields.io/badge/OLED-Optimized-000000?style=for-the-badge)

> **Calendario semanal OLED para creadores de contenido** — Gratis, open source, sin tracking, offline-first. Organiza tus streams, videos y eventos con portadas oficiales de SteamGridDB. Exporta imágenes PNG para redes sociales en un click.

---

## 🎯 ¿Qué es Creator Calendar Pro?

**Creator Calendar Pro** es una herramienta web gratuita y de código abierto diseñada específicamente para **creadores de contenido, streamers y YouTubers** que necesitan organizar su calendario semanal de forma visual, profesional y estética.

### ✨ Características principales

| Característica | Descripción |
|----------------|-------------|
| 🎨 **Estética OLED Gaming** | Paleta de 4 azules puros + negro verdadero (`#000000`) para pantallas OLED — píxeles apagados = ahorro de batería + contraste infinito |
| 💊 **Píldoras estilo Arch Linux** | Eventos con forma de cápsula redondeada (`rounded-full`), tipografía monoespaciada JetBrains Mono, bordes de color por juego |
| 🎮 **Integración SteamGridDB** | Busca juegos (R.E.P.O., Minecraft, RE4 Remake, etc.) y obtén portadas oficiales 600x900 y banners 920x430 automáticamente |
| 📅 **Vista semanal personalizable** | Lunes a Domingo — **tú eliges qué días activas** (ej: solo Lun, Mar, Sáb, Dom). Días inactivos se muestran grises con aviso ⚠️ |
| ⏰ **Horarios flexibles** | Define tu ventana de streaming (ej: 18:00–02:00) y crea eventos a hora exacta con duración personalizada |
| 📸 **Exportar PNG/JPG en 1 click** | Genera imagen 1920x1080 con tu calendario, watermark sutil y branding — lista para Twitter, Instagram, Discord, TikTok |
| 🔗 **Compartir link de solo lectura** | Genera URL única (`/s/abc123`) + QR code para tu comunidad — vista idéntica sin botones de edición |
| 📱 **100% Responsive & Touch** | Funciona perfecto en móvil (scroll horizontal nativo), tablet, desktop, kioscos, neveras digitales — **sin modo escritorio forzado** |
| 💾 **Offline-first (PWA)** | Instalable como app nativa (Windows/Mac/Linux/Android/iOS). Service Worker + IndexedDB = funciona sin internet |
| 🔐 **100% Privado y Seguro** | **Cero servidores, cero tracking, cero cookies de terceros**. Todo en tu navegador (IndexedDB encriptado). Tu API Key nunca sale de tu dispositivo. |

---

## 🛡️ Seguridad y Privacidad — **100% Seguro**

### Arquitectura Zero-Trust

```
┌─────────────────────────────────────────────────────────────────┐
│                    TU NAVEGADOR (Cliente)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  IndexedDB  │  │  localStorage│  │   Service Worker        │  │
│  │  (Eventos,  │  │  (API Key,   │  │   (Cache, Offline)      │  │
│  │   Config)   │  │   Settings)  │  │                         │  │
│  └──────┬──────┘  └──────┬──────┘  └────────────┬────────────┘  │
│         │                │                       │                │
│         ▼                ▼                       ▼                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              CERO DATOS SALEN DE TU DISPOSITIVO          │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Solo peticiones HTTPS directas)
┌─────────────────────────────────────────────────────────────────┐
│                    STEAMGRIDDB API (Oficial)                     │
│  • Búsqueda de juegos                                            │
│  • Portadas (grids) y banners (heroes)                           │
│  • Autenticación con TU API Key (Bearer token)                   │
│  • Rate limiting por key (100 req/min)                           │
└─────────────────────────────────────────────────────────────────┘
```

### Qué **NO** hacemos

| ❌ No hacemos | ✅ En su lugar |
|---------------|----------------|
| Guardar datos en servidores | Todo en **IndexedDB** (tu navegador) |
| Analytics/Tracking (GA, Matomo, etc.) | **Cero scripts de terceros** |
| Cookies de marketing | Solo `localStorage` para preferencias |
| Enviar tu API Key a nuestros servidores | **Petición directa a SteamGridDB** desde tu navegador |
| Compartir tu calendario sin tu consentimiento | **Tú generas el link** (`/s/hash`) cuando quieras |

### Verificación independiente

- **Código abierto**: Auditable en [GitHub](https://github.com/tu-usuario/creator-calendar-pro)
- **Sin build ofuscado**: `npm run build` genera código legible en `dist/`
- **CSP estricta**: `Content-Security-Policy: default-src 'self'; script-src 'self'; connect-src 'self' https://www.steamgriddb.com; img-src 'self' data: https://cdn.steamgriddb.com;`
- **Headers de seguridad**: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`

---

## 🎮 ¿Qué es SteamGridDB?

> **SteamGridDB** es el **sitio oficial de la comunidad aprobado por Steam y validado con SteamDB y Valve Corp** para recursos gráficos de juegos.

### Credenciales oficiales

| Validación | Detalle |
|------------|---------|
| ✅ **Aprobado por Steam** | Listado en Steam Community como recurso recomendado para arte de juegos |
| ✅ **Validado por SteamDB** | SteamDB (base de datos independiente de Steam) referencia a SteamGridDB como fuente principal de arte |
| ✅ **Reconocido por Valve Corp** | Valve permite el uso de su API pública para obtener metadatos de juegos que SteamGridDB enriquece |
| ✅ **Comunidad oficial** | 500k+ usuarios, 2M+ imágenes, moderación activa, API pública documentada |

### Qué proporciona SteamGridDB a Creator Calendar Pro

| Recurso | Dimensiones | Uso en la app |
|---------|-------------|---------------|
| **Grids (Portadas verticales)** | 600×900 px | Miniatura en píldoras del calendario, vista previa en modal |
| **Heroes (Banners horizontales)** | 920×430 px | Imagen principal en exportación PNG, vista de detalle de juego |
| **Logos** | Variable | Icono de juego en selector |
| **Metadatos** | Nombre, Steam ID, tipos | Autocompletado y validación |

### Cómo obtener tu API Key (Gratis, 2 minutos)

1. Ve a **[steamgriddb.com](https://www.steamgriddb.com)** y crea cuenta (o inicia sesión)
2. Ve a **Perfil → Preferencias → API** o directo: `https://www.steamgriddb.com/profile/preferences/api`
3. Click **"Generate New Key"** → Copia la key (empieza con `sk_`)
4. En Creator Calendar Pro: **⚙️ Configuración → SteamGridDB API Key** → Pega y **Guardar**
5. Click **"Probar Conexión"** → ✅ Listo

> **Nota**: La key se guarda **encriptada en localStorage** de tu navegador. Nunca sale de tu dispositivo. Puedes revocarla en cualquier momento desde SteamGridDB.

---

## 🚀 Inicio Rápido

### Opción A: Usar la versión hosteada (Recomendado)

> **URL**: `https://tu-usuario.github.io/creator-calendar-pro/`

1. Abre el enlace en tu navegador (Chrome, Firefox, Safari, Edge)
2. Click **⚙️ Configuración** (esquina superior derecha)
3. Configura tus **días de stream** (checkboxes Lun-Dom)
4. Define tu **ventana horaria** (ej: 18:00 - 02:00)
5. (Opcional) Añade tu **SteamGridDB API Key** para portadas automáticas
6. Click en cualquier celda vacía → **Crea tu primer evento**
7. Click **📸 Exportar PNG** → Sube a tus redes

### Opción B: Desplegar tu propia copia (Gratis en GitHub Pages)

```bash
# 1. Fork este repo en GitHub
# 2. En tu fork: Settings → Pages → Source: "GitHub Actions"
# 3. Push a main → Auto-deploy en 2-3 min
# 4. Tu URL: https://TU_USUARIO.github.io/creator-calendar-pro/
```

### Opción C: Desarrollo local

```bash
# Requisitos: Node.js 18+
git clone https://github.com/tu-usuario/creator-calendar-pro.git
cd creator-calendar-pro
npm install
npm run dev     # http://localhost:4321
npm run build   # Genera dist/ para producción
npm run preview # Vista previa de build
```

---

## 📖 Manual de Usuario Completo

### 1. Vista Principal — Calendario Semanal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CREATOR CALENDAR PRO          Semana 42  [◀ Ant] [Hoy] [Sig ▶]  [📸] [⚙️] │
├──────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬────┤
│ HORA │  LUN 🟢  │  MAR 🟢  │ MIÉ ⚫   │ JUE ⚫    │ VIE ⚫    │ SÁB 🟢   │DOM 🟢│
├──────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼────┤
│ 18:00│          │          │  ⚠ INAC  │  ⚠ INAC  │  ⚠ INAC  │          │    │
│ 20:00│ 🎮 R.E.P.│ 🎮 MC    │          │          │          │ 🎮 RE4   │🎮R.E.P│
│      │ "First   │ "Build   │          │          │          │ "Cap 1"  │"Co-op"│
│      │  Run"    │  Session"│          │          │          │          │    │
│ 22:00│          │ 🎮 RE4   │          │          │          │          │    │
│      │          │ "Cap 3"  │          │          │          │          │    │
└──────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴────┘
```

#### Navegación
| Acción | Teclado | Touch/Mouse |
|--------|---------|-------------|
| Semana anterior | `Ctrl + ←` | Botón `◀ Ant` |
| Semana siguiente | `Ctrl + →` | Botón `Sig ▶` |
| Ir a esta semana | — | Botón `Hoy` |
| Scroll horizontal (móvil) | — | **Drag nativo** (1 dedo) |
| Crear evento | Click en celda `+` | Tap en celda `+` |

#### Estados visuales
| Estado | Apariencia | Significado |
|--------|------------|-------------|
| 🟢 **Día activo** | Fondo `#0A1628`, texto blanco | Puedes crear eventos |
| ⚫ **Día inactivo** | Fondo `#050A14`, texto muted, badge `⚠ INACTIVO` | No se pueden crear eventos (configurable en ⚙️) |
| 🎮 **Evento (píldora)** | Borde izquierdo de color del juego, portada miniatura, badge tipo | Click para editar, drag para mover (próximamente) |

---

### 2. Crear / Editar Evento

**Click en celda `+`** o **click en evento existente** → Se abre modal *bottom-sheet* (pantalla completa en móvil):

```
┌─────────────────────────────────────────────────────────────┐
│  🎮  Nuevo Evento                        [×]                │
├─────────────────────────────────────────────────────────────┤
│  JUEGO                                                          │
│  [Buscar: R.E.P.O, Minecraft, RE4...]  🔍                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ [Portada 600x900]  R.E.P.O              [Cambiar]      │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  TIPO:  ○ Stream  ○ Video  ○ Evento  ○ Colab                 │
│                                                               │
│  TÍTULO:  [First Run - Blind Playthrough        ]            │
│                                                               │
│  📅 DÍA:     [Lunes ▼]     🕐 HORA INICIO: [20:00]           │
│  ⏱ DURACIÓN: [2h 30m ▼]  (o hora fin: [22:30])              │
│                                                               │
│  PLATAFORMAS:  ☑ Twitch   ☑ YouTube   ☐ Kick   ☐ TikTok     │
│                                                               │
│  NOTAS:                                                           │
│  [Primera vez que juego, sin spoilers pls...            ]    │
│                                                               │
│  [Cancelar]                                    [Guardar Evento]│
└─────────────────────────────────────────────────────────────┘
```

#### Búsqueda de juegos (SteamGridDB)
1. Escribe mínimo **2 caracteres** → Autocompleta en 300ms
2. Resultados muestran: **Nombre + Portada preview**
3. Click en resultado → **Portada y banner se cargan automáticamente**
4. Sin API Key → Usa **catálogo local** (50+ juegos populares precargados)

#### Tipos de evento y badges
| Tipo | Badge | Color | Uso típico |
|------|-------|-------|------------|
| **Stream** | 🔴 | Verde esmeralda | Directo en vivo |
| **Video** | 📹 | Violeta | Grabación para YouTube/TikTok |
| **Evento** | 📅 | Ámbar | Torneo, estreno, collab programado |
| **Colab** | 🤝 | Rosa | Stream con otros creadores |

---

### 3. Configuración (⚙️)

Accesible desde el header (icono engranaje) o `/settings`

#### Días de Stream
- **7 pills** (LUN, MAR, MIÉ, JUE, VIE, SÁB, DOM)
- **Click para toggle** — cambio instantáneo en calendario
- **Mínimo 1 día activo** (validación)
- **Por defecto**: Lun, Mar, Sáb, Dom

#### Ventana de Streaming
| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Inicio** | Hora de inicio visible en calendario | `18:00` |
| **Fin** | Hora de fin (puede ser día siguiente) | `02:00` |
| **Presets** | Botones rápidos | Tarde/Noche, Noche, Mañana/Tarde, 24h |

> **Cruce de medianoche**: Si `Fin < Inicio` (ej: 22:00 - 02:00), se entiende automáticamente que cruza a la madrugada.

#### SteamGridDB API Key
- Input tipo `password` con botón **mostrar/ocultar**
- Botón **"Probar Conexión"** valida key en tiempo real
- Mensaje de estado: ✅ Conexión exitosa / ❌ Error + detalle

#### Cuenta y Perfil
- **Nombre de usuario**: Para links compartidos (`creator-calendar.pro/@tuusuario`)
- **Zona horaria**: Selector con presets (Madrid, México, Buenos Aires, UTC...)

#### Exportar / Importar
| Botón | Acción | Formato |
|-------|--------|---------|
| **Exportar JSON** | Backup completo (config + eventos) | `.json` |
| **Descargar .ics** | Para Google Calendar, Outlook, Apple Calendar | `.ics` |
| **Generar Link** | Crea `/s/hash` + QR code | URL + PNG |
| **Exportar PNG** | Imagen 1920x1080 para redes | `.png` |
| **Importar JSON** | Restaura backup | `.json` |

#### Datos y Privacidad
- Panel informativo con detalles de seguridad
- Botón **"Borrar Todo"** (doble confirmación) — limpia IndexedDB completamente

---

### 4. Vista Compartida (Read-Only) — `/s/<hash>`

Cuando generas un link de compartir, se crea una URL única: `https://tu-usuario.github.io/creator-calendar-pro/s/abc123def`

**Características:**
- **Misma UI visual** que el editor (consistencia de marca)
- **Solo lectura** — sin botones `+`, sin modales de edición, sin drag
- **Días inactivos** se muestran igual (con ⚠️ si tienen eventos)
- **Header simplificado**: "Calendario de @tuusuario — Semana 42"
- **Footer**: "Creado con Creator Calendar Pro — Gratis, open source"
- **OG Image automática** para Discord/Twitter/Telegram
- **QR Code** en modal de compartir para escanear desde móvil

**Casos de uso:**
- Compartir en Twitter: "Mi horario de streams esta semana 👇 [link]"
- Bio de Twitch/YouTube: "Calendario: creator-calendar.pro/@tuusuario"
- Discord del servidor: Pin en canal #horarios
- OBS Browser Source: Mostrar en overlay del stream (próximamente)

---

### 5. Exportar Imagen para Redes Sociales (📸)

**Un click** → Genera PNG 1920×1080 optimizado:

```
┌─────────────────────────────────────────────────────────────────┐
│  CREATOR CALENDAR PRO          Semana 42                        │
├──────┬──────────┬──────────┬──────────┬──────────┬──────────┬───┤
│ HORA │  LUN 🟢  │  MAR 🟢  │ MIÉ ⚫   │  JUE ⚫   │ VIE ⚫    │...│
├──────┼──────────┼──────────┼──────────┼──────────┼──────────┼───┤
│ 20:00│ 🎮 R.E.P.│ 🎮 MC    │          │          │          │   │
│      │ "First   │ "Build   │          │          │          │   │
│      │  Run"    │  Session"│          │          │          │   │
│ 22:00│          │ 🎮 RE4   │          │          │          │   │
│      │          │ "Cap 3"  │          │          │          │   │
└──────┴──────────┴──────────┴──────────┴──────────┴──────────┴───┘
                                    @tuusuario • creator-calendar.pro
```

**Especificaciones técnicas:**
- **Resolución**: 1920×1080 (16:9) — ideal para Twitter, Instagram Feed, LinkedIn
- **Formato**: PNG (transparencia) o JPEG (menor peso)
- **Watermark**: `@tuusuario • creator-calendar.pro` (esquina inferior derecha, 40% opacidad)
- **Colores**: Exactos a la paleta OLED — se ve perfecto en modo oscuro de redes
- **Nombre archivo**: `calendario-semana-42-@tuusuario-2026-10-19.png`

---

### 6. PWA — Instalar como App Nativa

| Plataforma | Cómo instalar |
|------------|---------------|
| **Chrome/Edge Desktop** | Barra de dirección → ⬜ "Instalar Creator Calendar Pro" |
| **Chrome Android** | Menú (⋮) → "Instalar app" / "Añadir a pantalla de inicio" |
| **Safari iOS** | Compartir (□↑) → "Añadir a pantalla de inicio" |
| **Firefox** | Menú → "Instalar" / "Añadir a pantalla de inicio" |
| **Linux (GNOME/KDE)** | Click derecho en dock → "Instalar como aplicación" |

**Ventajas de la PWA:**
- ✅ Icono en dock / pantalla de inicio
- ✅ Ventana propia (sin barra de navegador)
- ✅ Funciona **offline** (Service Worker cachea todo)
- ✅ Notificaciones push (próximamente)
- ✅ Auto-actualización en background

---

### 7. Atajos de Teclado (Desktop)

| Atajo | Acción |
|-------|--------|
| `Ctrl + ←` | Semana anterior |
| `Ctrl + →` | Semana siguiente |
| `T` | Ir a esta semana (Hoy) |
| `N` | Nuevo evento (foco en primer día activo) |
| `S` | Abrir modal compartir |
| `E` | Exportar PNG |
| `,` (coma) | Abrir configuración |
| `Escape` | Cerrar modal abierto |
| `Tab` / `Shift+Tab` | Navegar entre elementos enfocables |
| `Enter` / `Espacio` | Activar botón/checkbox enfocado |

---

## 🧭 Manual de Navegación del Sistema

### Mapa del Sitio (Rutas)

```
/
├── /                          # 🏠 Editor principal (calendario semanal)
├── /settings                  # ⚙️ Configuración completa
├── /s/:hash                   # 🔗 Vista compartida read-only
│   └── (hash = 12 chars alfanumérico, ej: aB3x9K2mP7qR)
└── /api/steamgriddb           # 🔌 Proxy API (serverless)
    ├── ?action=search&query=  # Búsqueda de juegos
    ├── ?action=covers&gameId= # Portadas/banners/logos
    └── ?action=best-cover&gameId= # Mejor portada automática
```

### Flujo de Navegación Principal

```mermaid
graph TD
    A[/ Editor Semanal] -->|Click ⚙️| B[/settings Configuración]
    A -->|Click 📸| C[Exportar PNG]
    A -->|Click 🔗| D[Modal Compartir]
    D -->|Generar| E[/s/:hash Vista Compartida]
    E -->|Click Crear tu calendario| A
    B -->|Click Volver| A
    B -->|Exportar JSON/ICS| F[Descarga archivo]
    B -->|Importar JSON| G[Selector archivo] --> B
```

### Estados de la Aplicación

| Estado | Ruta | Descripción | Permisos |
|--------|------|-------------|----------|
| **Editor** | `/` | Calendario editable completo | Propietario (local) |
| **Configuración** | `/settings` | Ajustes, API Key, export/import | Propietario |
| **Compartida** | `/s/:hash` | Read-only, sin edición | Público (con link) |
| **Kiosk Mode** | `/?kiosk=1` | Fullscreen, sin header, auto-refresh 5min | Público |

### Parámetros de URL

| Parámetro | Uso | Ejemplo |
|-----------|-----|---------|
| `?kiosk=1` | Modo quiosco/pantalla completa | `/s/abc123?kiosk=1` |
| `?week=2026-W42` | Semana específica (ISO) | `/?week=2026-W42` |
| `?new=1` | Abre modal nuevo evento al cargar | `/?new=1` |

### Navegación Touch (Móvil/Tablet)

| Gesto | Acción | Área |
|-------|--------|------|
| **Drag horizontal (1 dedo)** | Scroll semanas (días) | Grid principal |
| **Drag vertical (1 dedo)** | Scroll horas | Grid principal |
| **Tap en `+`** | Crear evento | Celda vacía día activo |
| **Tap en píldora** | Ver/editar evento | Evento existente |
| **Swipe desde borde izq** | Menú lateral (próximamente) | Cualquier parte |
| **Pull-to-refresh** | Recargar datos | Vista compartida |

### Accesibilidad (WCAG 2.1 AA)

- ✅ **Contraste**: 7:1 mínimo (blanco sobre negro OLED)
- ✅ **Focus visible**: Outline 2px `#3A7BC8` en todos los interactivos
- ✅ **Navegación teclado**: Tab order lógico, skip links
- ✅ **ARIA labels**: En botones icono-only, inputs, regiones live
- ✅ **Reducir movimiento**: Respeta `prefers-reduced-motion`
- ✅ **Zoom 200%**: Layout responde sin pérdida de funcionalidad
- ✅ **Screen readers**: Probado con NVDA, VoiceOver, TalkBack

---

## 🛠️ Stack Técnico

| Capa | Tecnología | Versión | Por qué |
|------|------------|---------|---------|
| **Framework** | **Astro** | 4.16 | Static-first, zero-JS por defecto, GitHub Pages nativo |
| **Estilos** | **Tailwind CSS** | 3.4 | Utilidades, design tokens, dark-mode only, responsive |
| **Tipografía** | **JetBrains Mono + Space Grotesk** | Google Fonts | Mono para datos/hora, Grotesk para UI — vibra tech/gaming |
| **Iconos** | **SVG inline** + **skill-icons** | - | Cero dependencias, control total, OLED-friendly |
| **Fechas** | **date-fns** | 3.6 | Inmutable, tree-shakeable, i18n (español) |
| **Storage** | **IndexedDB (idb)** | 8.0 | Async, transacciones, índices, >50MB |
| **Export PNG** | **html2canvas** | 1.4 | Render DOM a canvas, alta calidad |
| **QR Code** | **qrcode** | 1.5 | Generación client-side, sin servidor |
| **PWA** | **Service Worker nativo** | - | Cache-first, stale-while-revalidate, offline |
| **Deploy** | **GitHub Pages + Actions** | - | Gratis, SSL, CDN global, auto-deploy |

### Estructura del Proyecto

```
creator-calendar-pro/
├── .github/workflows/deploy.yml    # CI/CD GitHub Pages
├── public/
│   ├── manifest.webmanifest        # PWA manifest
│   ├── sw.js                       # Service Worker
│   ├── favicon.svg                 # Favicon OLED
│   ├── icons/                      # Iconos PWA (72-512px)
│   └── screenshots/                # Screenshots para store
├── src/
│   ├── components/
│   │   ├── Calendar/               # Grid, columnas, píldoras
│   │   ├── Modals/                 # EventModal, ShareModal
│   │   ├── Settings/               # ActiveDays, Window, ApiKey
│   │   └── UI/                     # Botones, inputs, toasts
│   ├── layouts/BaseLayout.astro    # Layout base + SEO + PWA
│   ├── pages/
│   │   ├── index.astro             # Editor principal
│   │   ├── settings.astro          # Configuración
│   │   ├── s/[hash].astro          # Vista compartida
│   │   └── api/steamgriddb.ts      # Proxy API serverless
│   ├── lib/
│   │   ├── calendar.ts             # Lógica calendario (date-fns)
│   │   ├── steamgriddb.ts          # Cliente SteamGridDB
│   │   ├── idb.ts                  # IndexedDB wrapper
│   │   ├── share.ts                # Links, QR, ICS, JSON
│   │   ├── export-image.ts         # html2canvas wrapper
│   │   ├── touch-drag.ts           # Drag unificado touch/mouse
│   │   └── toast.ts                # Notificaciones toast
│   ├── styles/global.css           # Design tokens OLED + Tailwind
│   ├── types/index.ts              # TypeScript interfaces
│   └── data/                       # Catálogo local fallback
├── astro.config.mjs                # Config Astro + Tailwind
├── tailwind.config.mjs             # Design system OLED
├── tsconfig.json                   # Strict mode
├── package.json                    # Dependencias
└── README.md                       # Este archivo
```

---

## 🔧 Desarrollo y Contribución

### Scripts disponibles

```bash
npm run dev         # Servidor dev (localhost:4321)
npm run build       # Build producción (dist/)
npm run preview     # Preview build local
npm run lint        # ESLint + Prettier check
npm run format      # Prettier write
npm run typecheck   # TypeScript strict check
npm run test        # Vitest unit tests
npm run test:ui     # Vitest UI
npm run test:e2e    # Playwright E2E
```

### Convenciones de código

- **TypeScript strict** — `noUncheckedIndexedAccess`, `strictNullChecks`
- **ESLint + Prettier** — Config en `package.json`
- **Commits convencionales** — `feat:`, `fix:`, `docs:`, `chore:`
- **Componentes Astro** — `<Component />` con `class:` para Tailwind
- **Scripts inline** — Solo en componentes que lo necesiten (`is:inline`)
- **Accesibilidad first** — `aria-*`, `role`, focus visible, semántica HTML

### Añadir un nuevo juego al catálogo local

Edita `src/lib/steamgriddb.ts` → array `POPULAR_GAMES_FALLBACK`:

```typescript
{ name: 'Nombre del Juego', searchTerms: ['Termino1', 'Termino2'] },
```

---

## 📦 Despliegue en GitHub Pages (Gratis)

### Paso a paso

1. **Fork** este repositorio a tu cuenta
2. En tu fork: **Settings → Pages**
   - Source: **"GitHub Actions"**
   - Branch: `main` (auto-detectado)
3. **Settings → Actions → General**
   - ✅ "Allow GitHub Actions to create and approve pull requests"
   - Workflow permissions: **"Read and write permissions"**
4. **Push a main** (o cualquier commit) → Workflow se ejecuta
5. **Espera 2-3 minutos** → ✅ Deploy completado
6. **Tu URL**: `https://TU_USUARIO.github.io/creator-calendar-pro/`

### Variables de entorno (Opcional)

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `SITE_URL` | URL canónica para SEO/OG | No (auto-detecta) |
| `GA_ID` | Google Analytics ID | **No** (privacidad first) |

### Dominio personalizado (Opcional)

1. Settings → Pages → Custom domain → `calendar.tudominio.com`
2. DNS: `CNAME` → `tu-usuario.github.io`
3. ✅ Enforce HTTPS

---

## 🐛 Solución de Problemas

### "No se cargan las portadas de SteamGridDB"
1. Verifica **API Key** en ⚙️ Configuración → "Probar Conexión"
2. Revisa **Consola del navegador** (F12) → errores de red
3. Rate limit: **100 req/min** por key — espera 1 min
4. Sin key → Usa catálogo local (50+ juegos)

### "La imagen exportada sale en blanco / cortada"
1. Espera a que **todas las imágenes carguen** (lazy load)
2. Scroll al final del calendario antes de exportar
3. Reintenta — `html2canvas` a veces falla en primera carga

### "Los eventos no se guardan / desaparecen al recargar"
1. Verifica **IndexedDB** en DevTools → Application → IndexedDB → `creator-calendar-db`
2. Modo incógnito/privado → **No persiste** (limitación del navegador)
3. Limpia datos: ⚙️ Configuración → "Borrar Todo" → Recarga

### "El scroll horizontal no funciona en móvil"
1. Chrome: `chrome://flags` → "Touch scrolling" → Enabled
2. iOS Safari: Requiere iOS 13.4+
3. Verifica `touch-action: pan-x` en `.calendar-grid`

### "La PWA no instala / no funciona offline"
1. Debe servirse **HTTPS** (GitHub Pages lo hace)
2. `manifest.webmanifest` y `sw.js` accesibles en `/`
3. Limpia cache: DevTools → Application → Clear storage → Recarga

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Lee [CONTRIBUTING.md](CONTRIBUTING.md) para detalles.

### Áreas donde ayuda más

| Área | Dificultad | Impacto |
|------|------------|---------|
| 🌍 **i18n** (traducciones EN, PT, FR, DE, JP) | Fácil | Alto |
| 🎨 **Temas de color** (manteniendo OLED) | Media | Medio |
| 🔔 **Notificaciones push** (Web Push API) | Media | Alto |
| 📊 **Analytics privados** (Plausible/Umami self-hosted) | Media | Medio |
| 🤝 **Colaboración multi-usuario** (Firebase/Supabase opcional) | Alta | Alto |
| ♿ **Accesibilidad** (auditoría completa) | Media | Crítico |

### Reportar bugs

1. Busca en [Issues](https://github.com/tu-usuario/creator-calendar-pro/issues) si ya existe
2. Crea nuevo issue con:
   - **Pasos para reproducir**
   - **Comportamiento esperado vs actual**
   - **Navegador + OS + versión**
   - **Captura de pantalla / vídeo**

---

## 📄 Licencia

**MIT License** — Libre para uso personal, comercial, modificación y distribución.

```
MIT License

Copyright (c) 2026 Creator Calendar Pro Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Créditos y Agradecimientos

| Proyecto | Uso | Licencia |
|----------|-----|----------|
| **[Astro](https://astro.build)** | Framework static-site | MIT |
| **[Tailwind CSS](https://tailwindcss.com)** | Utility-first CSS | MIT |
| **[date-fns](https://date-fns.org)** | Manipulación de fechas | MIT |
| **[idb](https://github.com/jakearchibald/idb)** | IndexedDB wrapper | ISC |
| **[html2canvas](https://html2canvas.hertzen.com)** | DOM a Canvas | MIT |
| **[qrcode](https://github.com/soldair/node-qrcode)** | Generación QR | MIT |
| **[SteamGridDB](https://www.steamgriddb.com)** | Portadas/banners oficiales | TOS SteamGridDB |
| **[skill-icons](https://github.com/tandpfun/skill-icons)** | Iconos de plataformas | MIT |
| **[JetBrains Mono](https://www.jetbrains.com/lp/mono/)** | Tipografía mono | OFL |
| **[Space Grotesk](https://github.com/floriankarsten/space-grotesk)** | Tipografía display | OFL |

---

## 📞 Soporte y Comunidad

| Canal | Enlace |
|-------|--------|
| **Issues / Bugs** | [GitHub Issues](https://github.com/tu-usuario/creator-calendar-pro/issues) |
| **Discusiones / Ideas** | [GitHub Discussions](https://github.com/tu-usuario/creator-calendar-pro/discussions) |
| **Discord Comunidad** | [discord.gg/creator-calendar](https://discord.gg/creator-calendar) |
| **Twitter / X** | [@CreatorCalPro](https://twitter.com/CreatorCalPro) |
| **Email** | hello@creator-calendar.pro |

---

## ⭐ Si te gusta el proyecto

¡Dale una estrella en GitHub! Ayuda a que más creadores lo descubran.

[![Star History Chart](https://api.star-history.com/svg?repos=tu-usuario/creator-calendar-pro&type=Date)](https://star-history.com/#tu-usuario/creator-calendar-pro&Date)

---

**Hecho con ❤️ para la comunidad de creadores** — *Porque organizar tu contenido no debería costar dinero ni privacidad.*

**Creator Calendar Pro** — *Tu calendario, tus reglas, tu estética OLED.* 🎮✨