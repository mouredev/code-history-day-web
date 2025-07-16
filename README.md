# 💻 Code History Day

Una aplicación web que muestra cada día una efeméride histórica relacionada con programación, desarrollo de software y tecnología. Con una interfaz terminal retro y un sistema de generación automática de contenido usando IA.

![Code History Day](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)

## 🎯 Características

- **🗓️ Efemérides Diarias**: Cada día una nueva efeméride histórica sobre programación
- **🖥️ Interfaz Terminal Retro**: Experiencia inmersiva con efectos de terminal clásico
- **📱 Responsive**: Adaptado para escritorio y dispositivos móviles
- **🤖 Generación Automática**: Contenido generado diariamente usando OpenAI
- **📊 Base de Datos**: Almacenamiento persistente en Supabase
- **🔗 Compartir en X**: Funcionalidad integrada para compartir efemérides
- **🌙 Tema Oscuro**: Diseño elegante con efectos de glow y animaciones

## 🚀 Tecnologías Utilizadas

### Frontend
- **Next.js 15.2.4** - Framework React para aplicaciones web
- **TypeScript 5.x** - Tipado estático para JavaScript
- **Tailwind CSS 3.4.17** - Framework de utilidades CSS
- **Lucide React** - Iconos SVG optimizados
- **next-themes** - Soporte para temas

### Backend y Base de Datos
- **Supabase** - Base de datos PostgreSQL y autenticación
- **OpenAI API** - Generación automática de contenido
- **Next.js API Routes** - Endpoints del servidor

### Herramientas de Desarrollo
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Prefijos CSS automáticos
- **ESLint** - Linting de código

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18.0 o superior
- npm o yarn
- Cuenta en Supabase
- API Key de OpenAI

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/code-history-day.git
cd code-history-day
```

### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (para generación automática)
OPENAI_API_KEY=sk-...
```

### 4. Configurar la base de datos
Crea la tabla `ephemerides` en tu proyecto de Supabase:

```sql
CREATE TABLE ephemerides (
  id BIGSERIAL PRIMARY KEY,
  day INTEGER NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  event TEXT NOT NULL,
  display_date TEXT NOT NULL,
  historical_day INTEGER,
  historical_month INTEGER,
  historical_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice único para evitar duplicados por fecha
CREATE UNIQUE INDEX ephemerides_date_unique 
ON ephemerides (day, month, year);
```

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Producción
```bash
npm run build
npm start
# o
yarn build
yarn start
```

### Linting
```bash
npm run lint
# o
yarn lint
```

## 🤖 Generación Automática de Efemérides

El proyecto incluye un sistema completo para generar efemérides automáticamente:

### Generar efeméride para mañana
```bash
node scripts/generate-daily-ephemeris.js
```

### Generar para una fecha específica
```bash
node scripts/generate-daily-ephemeris.js 2024-12-25
```

### Automatización con GitHub Actions
El proyecto incluye un workflow que genera efemérides automáticamente todos los días a las 9:00 UTC.

Para configurarlo:
1. Ve a `Settings > Secrets and variables > Actions`
2. Añade los siguientes secrets:
   - `OPENAI_API_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

## 📁 Estructura del Proyecto

```
code_history_day/
├── app/                    # Páginas y API routes (Next.js 13+ App Router)
│   ├── api/               # API endpoints
│   │   └── ephemerides/   # API para efemérides
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── ui/               # Componentes UI reutilizables
│   └── theme-provider.tsx # Proveedor de temas
├── lib/                   # Utilidades y funciones
│   ├── ephemerides.ts     # Lógica de efemérides
│   ├── browser-utils.ts   # Utilidades del navegador
│   └── utils.ts           # Utilidades generales
├── scripts/               # Scripts de automatización
│   ├── generate-daily-ephemeris.js
│   └── README.md
├── public/                # Archivos estáticos
└── styles/               # Estilos adicionales
```

## 🎨 Funcionalidades Principales

### Interfaz Terminal Retro
- Efectos de tipeo animado
- Cursor parpadeante
- Gradientes y efectos de glow
- Terminal interactivo

### Sistema de Efemérides
- Carga automática de la efeméride del día
- Formateo inteligente de fechas
- Manejo de errores y estados de carga
- Soporte para fechas históricas

### Compartir en Redes
- Integración con X (Twitter)
- Formateo optimizado para redes sociales
- Truncado inteligente de texto

### Responsive Design
- Adaptado para móviles y escritorio
- Detección automática de dispositivos
- Comandos de teclado contextuales

## 🔧 Personalización

### Modificar Estilos
Los estilos están implementados con Tailwind CSS y pueden modificarse en:
- `tailwind.config.ts` - Configuración de Tailwind
- `app/globals.css` - Estilos globales
- `components/` - Estilos específicos de componentes

### Añadir Nuevas Funcionalidades
- **API Routes**: Añadir en `app/api/`
- **Componentes**: Crear en `components/`
- **Utilidades**: Agregar en `lib/`

## 📊 Monitoreo y Logs

El sistema incluye logging detallado:
- Logs del servidor en desarrollo
- Monitoreo en GitHub Actions
- Manejo de errores en la interfaz

## 🐛 Troubleshooting

### Errores Comunes

**Error: "Supabase configuration missing"**
```bash
# Verificar variables de entorno
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_KEY
```

**Error: "OpenAI API key not configured"**
```bash
# Configurar API key
export OPENAI_API_KEY=sk-tu-api-key
```

**Error de conexión a la base de datos**
- Verificar que la tabla `ephemerides` existe
- Comprobar permisos del service key
- Revisar la URL de Supabase

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

### Netlify
```bash
# Build
npm run build

# Desplegar carpeta .next
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## ![https://mouredev.com](https://raw.githubusercontent.com/mouredev/mouredev/master/mouredev_emote.png) Hola, mi nombre es Brais Moure.
### Freelance fullstack iOS & Android engineer

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UCxPD7bsocoAMq8Dj18kmGyQ?style=social)](https://youtube.com/mouredevapps?sub_confirmation=1)
[![Twitch Status](https://img.shields.io/twitch/status/mouredev?style=social)](https://twitch.com/mouredev)
[![Discord](https://img.shields.io/discord/729672926432985098?style=social&label=Discord&logo=discord)](https://mouredev.com/discord)
[![Twitter Follow](https://img.shields.io/twitter/follow/mouredev?style=social)](https://twitter.com/mouredev)
![GitHub Followers](https://img.shields.io/github/followers/mouredev?style=social)
![GitHub Followers](https://img.shields.io/github/stars/mouredev?style=social)

Soy ingeniero de software desde 2010. Desde 2018 combino mi trabajo desarrollando Apps con la creación de contenido formativo sobre programación y tecnología en diferentes redes sociales como **[@mouredev](https://moure.dev)**.

Si quieres unirte a nuestra comunidad de desarrollo, aprender programación, mejorar tus habilidades y ayudar a la continuidad del proyecto, puedes encontrarnos en:

[![Twitch](https://img.shields.io/badge/Twitch-Programación_en_directo-9146FF?style=for-the-badge&logo=twitch&logoColor=white&labelColor=101010)](https://twitch.tv/mouredev)
[![Discord](https://img.shields.io/badge/Discord-Servidor_de_la_comunidad-5865F2?style=for-the-badge&logo=discord&logoColor=white&labelColor=101010)](https://mouredev.com/discord) [![Pro](https://img.shields.io/badge/Cursos-mouredev.pro-FF5500?style=for-the-badge&logo=gnometerminal&logoColor=white&labelColor=101010)](https://mouredev.pro)
[![Link](https://img.shields.io/badge/Links_de_interés-moure.dev-14a1f0?style=for-the-badge&logo=Linktree&logoColor=white&labelColor=101010)](https://moure.dev) [![Web](https://img.shields.io/badge/GitHub-MoureDev-087ec4?style=for-the-badge&logo=github&logoColor=white&labelColor=101010)](https://github.com/mouredev)
