"use client"

import { useState, useEffect } from "react"
import { Calendar, Code, Terminal, Clock, Share2 } from "lucide-react"
import { XLogo } from "@/components/ui/x-logo"
import { getCloseTabCommand, getOSInfo } from "@/lib/browser-utils"
import { getTodayEphemeris, formatEphemerisForDisplay } from "@/lib/ephemerides"
import type { Ephemeris } from "@/app/api/ephemerides/route"

export default function ProgrammingEphemeris() {
  const [currentTime, setCurrentTime] = useState("")
  const [todayEphemeris, setTodayEphemeris] = useState<Ephemeris | null>(null)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [closeCommand, setCloseCommand] = useState("Ctrl+W")
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [terminalInput, setTerminalInput] = useState("")
  const [isTerminalFocused, setIsTerminalFocused] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)

  useEffect(() => {
    // Actualizar hora cada segundo
    const timeInterval = setInterval(() => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("es-ES", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      )
    }, 1000)

    // Obtener información del sistema operativo
    const osInfo = getOSInfo()
    setCloseCommand(getCloseTabCommand())
    setIsMobile(osInfo.isMobile)

    // Obtener efeméride del día desde Supabase
    const loadTodayEphemeris = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const ephemeris = await getTodayEphemeris()
        setTodayEphemeris(ephemeris)
      } catch (err) {
        console.error('Error cargando efeméride:', err)
        setError('Error al cargar la efeméride del día')
      } finally {
        setIsLoading(false)
      }
    }

    loadTodayEphemeris()

    return () => clearInterval(timeInterval)
  }, [])

  useEffect(() => {
    if (!todayEphemeris || isLoading) return

    const formattedEphemeris = formatEphemerisForDisplay(todayEphemeris)
    const fullText = `${formattedEphemeris.date} de ${formattedEphemeris.year}:

${formattedEphemeris.event}`

    let index = 0
    setDisplayText("")
    setIsTyping(true)

    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(typingInterval)
      }
    }, 30)

    return () => clearInterval(typingInterval)
  }, [todayEphemeris, isLoading])

  // Función para manejar el input del terminal
  const handleTerminalKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault() // Prevenir salto de línea
      // Aquí se pueden añadir comandos específicos en el futuro
      console.log('Comando ejecutado:', terminalInput)
      setTerminalInput("")
      setCursorPosition(0)
    }
  }

  // Función para manejar el cambio en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    // Limitar a un máximo de caracteres para evitar desbordamiento
    const maxChars = isMobile ? 20 : 50
    if (newValue.length <= maxChars) {
      setTerminalInput(newValue)
      // Actualizar la posición del cursor después de un pequeño delay
      setTimeout(() => {
        const target = e.target as HTMLInputElement
        setCursorPosition(target.selectionStart || 0)
      }, 0)
    }
  }

  // Función para manejar el movimiento del cursor (teclado)
  const handleCursorMoveKeyboard = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setTimeout(() => {
      const target = e.target as HTMLInputElement
      setCursorPosition(target.selectionStart || 0)
    }, 0)
  }

  // Función para manejar el movimiento del cursor (mouse)
  const handleCursorMoveMouse = (e: React.MouseEvent<HTMLInputElement>) => {
    setTimeout(() => {
      const target = e.target as HTMLInputElement
      setCursorPosition(target.selectionStart || 0)
    }, 0)
  }

  // Función para manejar el click en el terminal
  const handleTerminalClick = () => {
    setIsTerminalFocused(true)
  }

  // Función para compartir en X
  const handleShareX = () => {
    if (!todayEphemeris) return

    const formattedEphemeris = formatEphemerisForDisplay(todayEphemeris)
    
    // Truncar solo el evento a 200 caracteres si es necesario
    let eventText = formattedEphemeris.event
    if (eventText.length > 200) {
      eventText = eventText.substring(0, 197) + '...'
    }
    
    const tweetText = `💻 ${eventText}

ℹ️ Cada día una nueva efeméride en `
    
    const url = window.location.href
    const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`
    
    window.open(xUrl, '_blank', 'width=550,height=420')
  }

  // Función para renderizar el contenido de la efeméride
  const renderEphemerisContent = () => {
    if (isLoading) {
      return (
        <div className="text-green-400 leading-relaxed">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            Cargando efeméride del día...
            <span className="animate-pulse text-green-300 font-bold">█</span>
          </pre>
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-red-400 leading-relaxed">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {error}
          </pre>
        </div>
      )
    }

    if (!todayEphemeris) {
      return (
        <div className="text-yellow-400 leading-relaxed">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            No hay efeméride disponible para hoy.
          </pre>
        </div>
      )
    }

    return (
      <div className="text-green-400 leading-relaxed">
        <pre className="whitespace-pre-wrap font-mono text-sm">
          {displayText}
          {isTyping && <span className="animate-pulse text-green-300 font-bold">█</span>}
        </pre>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-emerald-900/20 to-teal-900/30 animate-pulse"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-bounce-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/5 rounded-full blur-2xl animate-spin-slow"></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
          linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
        `,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* Main Content with Backdrop Blur */}
      <div className="relative z-10 min-h-screen text-green-400 font-mono p-4">
        <div className="max-w-4xl mx-auto">
          {/* Terminal Header with Glass Effect */}
          <div className="flex items-center gap-2 mb-6 text-green-300 backdrop-blur-sm bg-black/20 rounded-lg p-3 border border-green-500/20">
            <Terminal className="w-5 h-5 animate-pulse" />
            <span className="text-sm">code-history v0.1.0</span>
            <div className="ml-auto flex items-center gap-2 text-sm font-light">
              <Clock className="w-4 h-4" />
              {currentTime}
            </div>
          </div>

          {/* Terminal Content */}
          <div className="space-y-4">
            {/* Welcome Message */}
            <div className="text-green-300 backdrop-blur-sm bg-black/10 rounded p-2">
              <span className="text-green-500 font-bold">user@mouredev:~$</span>
              <span className="ml-2">./code-history --day</span>
            </div>

            {/* System Info with Glow Effect */}
            <div className="text-green-400 text-sm space-y-1 backdrop-blur-sm bg-black/10 rounded-lg p-4 border border-green-500/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 min-w-[8px] min-h-[8px] bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
                Iniciando sistema de efemérides de programación...
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 min-w-[8px] min-h-[8px] bg-green-500 rounded-full flex-shrink-0"></span>
                Conectando con la base de datos... <span className="text-green-300 font-bold">[OK]</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 min-w-[8px] min-h-[8px] bg-green-500 rounded-full flex-shrink-0"></span>
                Cargando datos históricos... <span className="text-green-300 font-bold">[OK]</span>
              </div>
              <div className="flex items-center gap-2 text-green-300">
                <span className="w-2 h-2 min-w-[8px] min-h-[8px] bg-green-300 rounded-full animate-pulse flex-shrink-0"></span>
                Sistema listo. Descubre la historia de la programación día a día.
              </div>
            </div>

            {/* Separator with Glow */}
            <div className="relative my-6">
              <div className="border-t border-green-800"></div>
              <div className="absolute inset-0 border-t border-green-400/20 blur-sm"></div>
            </div>

            {/* Today's Date with Glass Effect */}
            <div className="flex items-start gap-2 text-green-300 backdrop-blur-md bg-black/20 rounded-lg p-3 border border-green-500/20">
              <Calendar className="w-4 h-4 min-w-[16px] min-h-[16px] animate-pulse flex-shrink-0 mt-0.5" />
              <span className="font-light">
                Fecha actual:{" "}
                <span className="font-normal text-green-200">
                  {new Date().toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </span>
            </div>

            {/* Ephemeris Content with Enhanced Glass Effect */}
                          <div className="backdrop-blur-md bg-gradient-to-br from-gray-900/40 to-black/60 border border-green-500/30 rounded-xl p-6 mt-6 shadow-2xl shadow-green-500/10">
                <div className="flex items-start gap-2 text-green-300 mb-4">
                  <Code className="w-5 h-5 min-w-[20px] min-h-[20px] animate-pulse flex-shrink-0 mt-0.5" />
                  <span className="font-bold text-lg bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                    EFEMÉRIDE DEL DÍA
                  </span>
                </div>

                {renderEphemerisContent()}
                
                {/* Botón de compartir en X */}
                {todayEphemeris && !isLoading && (
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleShareX}
                      className="flex items-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 hover:border-green-400/50 rounded-lg transition-all duration-200 group backdrop-blur-sm"
                      title="Compartir en X"
                    >
                      <XLogo className="text-green-400 group-hover:text-green-300" size={16} />
                      <span className="text-green-400 group-hover:text-green-300 text-sm font-medium">
                        Compartir
                      </span>
                    </button>
                  </div>
                )}
              </div>

            {/* Footer with Subtle Glow */}
            <div className="mt-8 text-green-600 text-xs backdrop-blur-sm bg-black/10 rounded-lg p-2">
              {/* Interactive Terminal */}
              <div 
                className="text-green-500 mb-4 backdrop-blur-sm bg-black/10 rounded text-base cursor-text"
                onClick={handleTerminalClick}
              >
                                <div className="flex items-center">
                  <span className="font-bold whitespace-nowrap text-green-500">user@mouredev:~$</span>
                  <div className="ml-2 flex-1 relative">
                    <div className="relative">
                      <div className="text-green-300 font-mono whitespace-nowrap overflow-hidden max-w-full">
                        <span>{terminalInput.slice(0, cursorPosition)}</span>
                        <span className="animate-pulse font-bold">█</span>
                        <span>{terminalInput.slice(cursorPosition)}</span>
                      </div>
                      <input
                        type="text"
                        value={terminalInput}
                        onChange={handleInputChange}
                        onKeyPress={handleTerminalKeyPress}
                        onKeyUp={handleCursorMoveKeyboard}
                        onClick={handleCursorMoveMouse}
                        onFocus={() => setIsTerminalFocused(true)}
                        onBlur={() => setIsTerminalFocused(false)}
                        className="absolute inset-0 bg-transparent border-none outline-none text-transparent caret-transparent w-full"
                        style={{ caretColor: 'transparent' }}
                        maxLength={isMobile ? 20 : 50}
                        autoFocus
                      />
                    </div>
                    {/* Indicador de límite de caracteres */}
                    {terminalInput.length >= (isMobile ? 18 : 45) && (
                      <div className="absolute -bottom-4 right-0 text-xs text-yellow-400 opacity-70">
                        {terminalInput.length}/{isMobile ? 20 : 50}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                {!isMobile && (
                  <div className="flex items-center justify-center gap-2">
                    <span>{">"}</span>
                    <span>Pulsa {closeCommand} para salir</span>
                  </div>
                )}
                <div className="mt-2 text-green-500/70">
                  © 2025{" "}
                  <a 
                    href="https://moure.dev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-green-400 transition-colors duration-200 underline decoration-green-500/50 hover:decoration-green-400"
                  >
                    MoureDev by Brais Moure
                  </a>
                </div>
                <div className="mt-2 text-green-500/70">
                  Desarrollado con <span className="text-red-400 animate-pulse">❤️</span> desde Galicia para el mundo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
