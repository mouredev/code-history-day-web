# 🤖 Sistema de Generación Automática de Efemérides

Este directorio contiene el sistema completo para la generación automática de efemérides de programación usando OpenAI y Supabase.

## 📁 Archivos

- `generate-daily-ephemeris.js` - Script principal para generar efemérides
- `README.md` - Esta documentación

## 🚀 Configuración

### Variables de Entorno Requeridas

```bash
# OpenAI API Key (requerida)
OPENAI_API_KEY=sk-...

# Supabase (requeridas)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Opcional - para health checks
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Configuración en GitHub

Para que el workflow funcione, debes configurar estos **Secrets** en tu repositorio:

1. Ve a `Settings > Secrets and variables > Actions`
2. Añade los siguientes secrets:
   - `OPENAI_API_KEY` - Tu API key de OpenAI
   - `SUPABASE_SERVICE_KEY` - Service key de Supabase (no la anon key)
   - `SUPABASE_URL` - URL de tu proyecto Supabase
   - `SUPABASE_ANON_KEY` - (Opcional) Para health checks

## 📊 Estructura de la Base de Datos

El script espera una tabla `ephemerides` con esta estructura:

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

## 🛠️ Uso Manual

### Generar efeméride para mañana:
```bash
node scripts/generate-daily-ephemeris.js
```

### Generar para una fecha específica:
```bash
node scripts/generate-daily-ephemeris.js 2024-12-25
node scripts/generate-daily-ephemeris.js 2024-01-01
```

### Forzar generación (sobrescribir existente):
```bash
node scripts/generate-daily-ephemeris.js 2024-12-25 --force
```

## ⚙️ Automatización con GitHub Actions

El workflow `.github/workflows/daily-ephemeris.yml` se ejecuta:

- **Automáticamente**: Todos los días a las 9:00 UTC
- **Manualmente**: Desde la pestaña Actions en GitHub

### Ejecución Manual

1. Ve a la pestaña **Actions** en tu repositorio
2. Selecciona **"Generar Efeméride Diaria"**
3. Haz clic en **"Run workflow"**
4. Opcionalmente especifica:
   - Fecha específica (YYYY-MM-DD)
   - Marcar "force" para sobrescribir

## 🔍 Validaciones Implementadas

El script incluye múltiples validaciones para asegurar la calidad:

### 1. Validación de Contenido Relevante
```javascript
const TECH_KEYWORDS = [
  'programación', 'software', 'algoritmo', 'lenguaje de programación',
  'framework', 'biblioteca', 'API', 'base de datos', 'web', 'internet',
  // ... más palabras clave
];
```

### 2. Validación de Longitud
- Mínimo: 100 caracteres
- Máximo: 800 caracteres

### 3. Validación de Años
- Solo años entre 1940 y 2030
- Debe contener al menos un año válido

### 4. Detección de Duplicados
- Compara similitud con eventos existentes
- Umbral de similitud: 80%

### 5. Sistema de Reintentos
- Máximo 3 intentos por generación
- Cada intento usa un prompt diferente

## 📈 Monitoreo y Logs

### Logs Locales
El script genera logs detallados con emojis:
```
🚀 Iniciando generación de efeméride...
📅 Fecha objetivo: 26/01/2025
🔍 Verificando si ya existe efeméride...
✅ No existe efeméride previa
🤖 Generando contenido con OpenAI...
✅ Contenido generado exitosamente
💾 Guardando en Supabase...
✅ Efeméride guardada exitosamente
```

### Monitoreo en GitHub Actions
- ✅ Health checks automáticos
- 📊 Resúmenes de ejecución
- 🚨 Creación automática de issues en caso de fallo
- 📈 Métricas en el dashboard de Actions

## 🐛 Troubleshooting

### Error: "OpenAI API key not configured"
```bash
export OPENAI_API_KEY=sk-tu-api-key
```

### Error: "Supabase configuration missing"
```bash
export SUPABASE_URL=https://tu-proyecto.supabase.co
export SUPABASE_SERVICE_KEY=tu-service-key
```

### Error: "Failed to insert into database"
- Verificar que la tabla `ephemerides` existe
- Comprobar permisos del service key
- Revisar la estructura de la tabla

### Error: "Content validation failed"
El contenido generado no cumple los criterios de calidad:
- Intenta ejecutar de nuevo (usa reintentos automáticos)
- Revisa que OpenAI esté funcionando correctamente
- Verifica que el prompt esté bien configurado

### Error en GitHub Actions
1. Revisa los logs del workflow
2. Verifica que todos los secrets estén configurados
3. Comprueba que el script existe en `scripts/`
4. Ejecuta manualmente para debugging

## 🔧 Personalización

### Modificar Palabras Clave
Edita el array `TECH_KEYWORDS` en el script:
```javascript
const TECH_KEYWORDS = [
  'tu', 'palabra', 'clave', 'personalizada'
];
```

### Cambiar Umbrales de Validación
```javascript
// Longitud del contenido
const MIN_LENGTH = 100;
const MAX_LENGTH = 800;

// Similitud para duplicados
const SIMILARITY_THRESHOLD = 0.8;

// Máximo de reintentos
const MAX_RETRIES = 3;
```

### Personalizar Prompts
Modifica la función `generateEphemerisContent()` para cambiar cómo se genera el contenido.

## 📅 Programación del Workflow

El workflow está configurado para ejecutarse a las **9:00 UTC** (10:00 CET / 11:00 CEST).

Para cambiar la hora, modifica el cron en `.github/workflows/daily-ephemeris.yml`:
```yaml
schedule:
  - cron: '0 9 * * *'  # 9:00 UTC
  # - cron: '30 8 * * *'  # 8:30 UTC
  # - cron: '0 12 * * *'  # 12:00 UTC
```

## 🚀 Próximas Mejoras

- [ ] Soporte para múltiples idiomas
- [ ] Integración con más fuentes de datos históricas
- [ ] Sistema de moderación de contenido
- [ ] Métricas avanzadas y analytics
- [ ] Notificaciones por email/Slack en caso de fallo
- [ ] Backup automático de efemérides generadas

## 📞 Soporte

Si encuentras problemas:

1. Revisa esta documentación
2. Consulta los logs del script/workflow
3. Verifica la configuración de secrets
4. Crea un issue en el repositorio con los detalles del error

---

**Desarrollado con ❤️ por MoureDev** 