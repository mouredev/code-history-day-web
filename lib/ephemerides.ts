// Importar solo el tipo desde la API
import type { Ephemeris } from '@/app/api/ephemerides/route'

/**
 * Obtiene la efeméride para una fecha específica usando la API
 * @param date - Fecha en formato YYYY-MM-DD
 * @returns Efeméride encontrada o null
 */
export async function getEphemerisForDate(date: string): Promise<Ephemeris | null> {
	try {
		const response = await fetch(`/api/ephemerides?date=${encodeURIComponent(date)}`)
		
		if (!response.ok) {
			if (response.status === 404) {
				return null
			}
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		
		const result = await response.json()
		
		if (!result.data) {
			return null
		}

		return result.data
	} catch (error) {
		console.error('💥 Error en getEphemerisForDate:', error)
		return null
	}
}

/**
 * Obtiene la efeméride para el día actual usando la fecha local del usuario
 * @returns Efeméride del día actual o null
 */
export async function getTodayEphemeris(): Promise<Ephemeris | null> {
	try {
		// Calcular la fecha local del usuario (no del servidor)
		const today = new Date()
		const localDate = today.getFullYear() + '-' + 
						String(today.getMonth() + 1).padStart(2, '0') + '-' + 
						String(today.getDate()).padStart(2, '0')
				
		// Usar la función existente pero con la fecha local
		return await getEphemerisForDate(localDate)
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

	return formatted
} 