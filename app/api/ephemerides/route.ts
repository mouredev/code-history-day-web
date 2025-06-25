import { NextRequest, NextResponse } from 'next/server'

// Configuración de Supabase desde variables de entorno del servidor
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY



if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
	throw new Error('Faltan las variables de entorno SUPABASE_URL y/o SUPABASE_SERVICE_KEY')
}

// Tipo para la tabla ephemerides
export interface Ephemeris {
	id: number
	day: number
	month: number
	year: number
	event: string
	display_date: string | null
	historical_day: number | null
	historical_month: number | null
	historical_year: number | null
	created_at: string | null
	updated_at: string | null
}

// Función para hacer peticiones a Supabase desde el servidor
async function makeSupabaseRequest(endpoint: string, options: RequestInit = {}) {
	if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
		throw new Error('Variables de entorno de Supabase no configuradas')
	}
	
	const url = `${SUPABASE_URL}/rest/v1${endpoint}`
	
	const response = await fetch(url, {
		...options,
		headers: {
			'apikey': SUPABASE_SERVICE_KEY,
			'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
			'Content-Type': 'application/json',
			'Prefer': 'return=representation',
			...options.headers,
		},
	})

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	}

	return response.json()
}

// Función para obtener la efeméride para una fecha específica
async function getEphemerisForDate(date: string): Promise<Ephemeris | null> {
	try {
		console.log('🔍 Buscando efeméride para fecha:', date)
		
		const data = await makeSupabaseRequest(`/ephemerides?display_date=eq.${date}`)

		console.log('📊 Respuesta de Supabase:', data)

		if (!data || data.length === 0) {
			console.log('❌ No se encontró efeméride para la fecha:', date)
			return null
		}

		const ephemeris = data[0]
		console.log('✅ Efeméride encontrada:', ephemeris)
		return ephemeris
	} catch (error) {
		console.error('💥 Error en getEphemerisForDate:', error)
		return null
	}
}

// Función para obtener la efeméride para el día actual
async function getTodayEphemeris(): Promise<Ephemeris | null> {
	const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
	console.log('📅 Fecha de hoy calculada:', today)
	
	// Para testing, vamos a buscar también la fecha del 25 de junio
	const testDate = '2025-06-25'
	console.log('🧪 También probando con fecha de test:', testDate)
	
	// Primero intentar con la fecha de hoy
	let result = await getEphemerisForDate(today)
	
	// Si no encuentra nada, probar con la fecha de test
	if (!result) {
		console.log('⚠️ No se encontró efeméride para hoy, probando fecha de test...')
		result = await getEphemerisForDate(testDate)
	}
	
	return result
}



// Handler para GET requests
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const date = searchParams.get('date')

		// Si se especifica una fecha, obtener esa efeméride específica
		if (date) {
			const ephemeris = await getEphemerisForDate(date)
			
			if (!ephemeris) {
				return NextResponse.json(
					{ error: 'No se encontró efeméride para la fecha especificada' },
					{ status: 404 }
				)
			}
			
			return NextResponse.json({ data: ephemeris })
		}



		// Por defecto, obtener la efeméride de hoy
		const todayEphemeris = await getTodayEphemeris()
		
		if (!todayEphemeris) {
			return NextResponse.json(
				{ error: 'No se encontró efeméride para hoy' },
				{ status: 404 }
			)
		}

		return NextResponse.json({ data: todayEphemeris })

	} catch (error) {
		console.error('Error en API de efemérides:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		)
	}
} 