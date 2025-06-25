/**
 * Utilidades para detectar el sistema operativo
 */

export interface OSInfo {
	isMac: boolean
	isWindows: boolean
	isLinux: boolean
	isMobile: boolean
}

/**
 * Detecta información del sistema operativo
 */
export const getOSInfo = (): OSInfo => {
	if (typeof window === 'undefined') {
		return {
			isMac: false,
			isWindows: false,
			isLinux: false,
			isMobile: false
		}
	}

	const userAgent = navigator.userAgent.toLowerCase()
	
	// Usar navigator.userAgentData si está disponible, sino userAgent
	const platformInfo = (navigator as any).userAgentData?.platform?.toLowerCase() || userAgent
	
	// Detectar dispositivos móviles
	const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || 
		(navigator as any).userAgentData?.mobile === true ||
		window.innerWidth <= 768

	return {
		isMac: platformInfo.includes('mac') || userAgent.includes('mac'),
		isWindows: platformInfo.includes('win') || userAgent.includes('windows'),
		isLinux: platformInfo.includes('linux') || userAgent.includes('linux'),
		isMobile
	}
}

/**
 * Obtiene el comando correcto para cerrar pestaña según el sistema operativo
 */
export const getCloseTabCommand = (): string => {
	if (typeof window === 'undefined') return 'Ctrl+W'
	
	const osInfo = getOSInfo()
	
	// El comando solo depende del sistema operativo
	if (osInfo.isMac) {
		return 'Cmd+W'
	} else if (osInfo.isWindows || osInfo.isLinux) {
		return 'Ctrl+W'
	}
	
	// Fallback
	return 'Ctrl+W'
}

/**
 * Obtiene información detallada del sistema operativo para debugging
 */
export const getDetailedOSInfo = () => {
	if (typeof window === 'undefined') return 'Server-side rendering'
	
	const osInfo = getOSInfo()
	const userAgent = navigator.userAgent
	const platformInfo = (navigator as any).userAgentData?.platform || 'Not available'
	
	return {
		osInfo,
		userAgent,
		platformInfo,
		closeCommand: getCloseTabCommand()
	}
} 