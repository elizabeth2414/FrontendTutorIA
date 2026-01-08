// src/services/ttsService.js

import { Capacitor } from '@capacitor/core';

/**
 * Servicio de Text-to-Speech compatible con web y móvil
 */
class TTSService {
  constructor() {
    this.isMobile = Capacitor.isNativePlatform();
    this.isInitialized = false;
    this.ttsPlugin = null;
  }

  /**
   * Inicializar el plugin de TTS (solo en móvil)
   */
  async init() {
    if (this.isInitialized) return;

    if (this.isMobile) {
      try {
        // Importar dinámicamente el plugin solo en móvil
        const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
        this.ttsPlugin = TextToSpeech;
        this.isInitialized = true;
      } catch (error) {
        console.error('❌ Error cargando plugin TTS:', error);
        console.warn('⚠️ Text-to-Speech no disponible en esta plataforma');
      }
    } else {
      // En web, verificar soporte del navegador
      if ('speechSynthesis' in window) {
        this.isInitialized = true;
      } else {
        console.warn('⚠️ Text-to-Speech no soportado en este navegador');
      }
    }
  }

  /**
   * Hablar texto en voz alta
   */
  async speak(text, options = {}) {
    await this.init();

    if (!text || text.trim() === '') {
      console.warn('⚠️ No hay texto para leer');
      return;
    }

    const defaultOptions = {
      language: 'es-ES',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      ...options
    };

    try {
      if (this.isMobile && this.ttsPlugin) {
        // Usar plugin nativo en móvil
        console.log('📱 Usando TTS nativo');
        await this.ttsPlugin.speak({
          text: text,
          lang: defaultOptions.language,
          rate: defaultOptions.rate,
          pitch: defaultOptions.pitch,
          volume: defaultOptions.volume,
          category: 'ambient',
        });
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        // Usar Web Speech API en navegador
        console.log('🌐 Usando Web Speech API');
        return new Promise((resolve, reject) => {
          // Cancelar cualquier reproducción anterior
          window.speechSynthesis.cancel();
          
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = defaultOptions.language;
          utterance.rate = defaultOptions.rate;
          utterance.pitch = defaultOptions.pitch;
          utterance.volume = defaultOptions.volume;

          utterance.onend = () => {
            console.log('✅ Lectura completada');
            resolve();
          };
          
          utterance.onerror = (error) => {
            console.error('❌ Error en TTS:', error);
            reject(error);
          };

          window.speechSynthesis.speak(utterance);
        });
      } else {
        console.warn('⚠️ Text-to-Speech no disponible en esta plataforma');
        throw new Error('Text-to-Speech no disponible');
      }
    } catch (error) {
      console.error('❌ Error en speak():', error);
      throw error;
    }
  }

  /**
   * Detener la lectura
   */
  async stop() {
    try {
      if (this.isMobile && this.ttsPlugin) {
        await this.ttsPlugin.stop();
      } else if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      console.log('⏹️ Lectura detenida');
    } catch (error) {
      console.error('❌ Error al detener:', error);
    }
  }

  /**
   * Verificar si está disponible
   */
  isAvailable() {
    return this.isMobile ? !!this.ttsPlugin : 'speechSynthesis' in window;
  }
}

// Exportar instancia única
export default new TTSService();