// Importar solo el tipo desde la API
import type { Ephemeris } from '@/app/api/ephemerides/route'

/**
 * Obtiene la efeméride para una fecha específica usando la API
 * @param date - Fecha en formato YYYY-MM-DD
 * @returns Efeméride encontrada o null
 */
export async function getEphemerisForDate(date: string): Promise<Ephemeris | null> {
	try {
		console.log('🔍 Buscando efeméride para fecha:', date)
		
		const response = await fetch(`/api/ephemerides?date=${encodeURIComponent(date)}`)
		
		if (!response.ok) {
			if (response.status === 404) {
				console.log('❌ No se encontró efeméride para la fecha:', date)
				return null
			}
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		
		const result = await response.json()
		
		console.log('📊 Respuesta de la API:', result)

		if (!result.data) {
			console.log('❌ No hay datos en la respuesta')
			return null
		}

		console.log('✅ Efeméride encontrada:', result.data)
		return result.data
	} catch (error) {
		console.error('💥 Error en getEphemerisForDate:', error)
		return null
	}
}

/**
 * Obtiene la efeméride para el día actual usando la API
 * @returns Efeméride del día actual o null
 */
export async function getTodayEphemeris(): Promise<Ephemeris | null> {
	try {
		console.log('📅 Obteniendo efeméride de hoy desde la API...')
		
		const response = await fetch('/api/ephemerides')
		
		if (!response.ok) {
			if (response.status === 404) {
				console.log('❌ No se encontró efeméride para hoy')
				return null
			}
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		
		const result = await response.json()
		
		console.log('📊 Respuesta de la API para hoy:', result)

		if (!result.data) {
			console.log('❌ No hay datos en la respuesta')
			return null
		}

		console.log('✅ Efeméride de hoy encontrada:', result.data)
		return result.data
	} catch (error) {
		console.error('💥 Error en getTodayEphemeris:', error)
		return null
	}
}



/**
 * Formatea una efeméride para mostrar en la aplicación
 * @param ephemeris - Efeméride desde la base de datos
 * @returns Objeto formateado para la aplicación
 */
export function formatEphemerisForDisplay(ephemeris: Ephemeris) {
	// Usar historical_date si está disponible, sino usar los campos individuales
	const displayYear = ephemeris.historical_year || ephemeris.year
	const displayMonth = ephemeris.historical_month || ephemeris.month
	const displayDay = ephemeris.historical_day || ephemeris.day

	console.log('🎨 Formateando efeméride:', {
		original: ephemeris,
		display: { displayYear, displayMonth, displayDay }
	})

	// Formatear la fecha para mostrar
	const date = new Date(displayYear, displayMonth - 1, displayDay)
	const formattedDate = date.toLocaleDateString("es-ES", {
		day: "numeric",
		month: "long",
	})

	const formatted = {
		date: formattedDate,
		year: displayYear,
		event: ephemeris.event,
	}

	console.log('✨ Efeméride formateada:', formatted)
	return formatted
} 