// src/services/ttsService.js
// Servicio Text-to-Speech humano y amigable (web + móvil)

import { Capacitor } from '@capacitor/core';

class TTSService {
  constructor() {
    this.isMobile = Capacitor.isNativePlatform();
    this.isInitialized = false;
    this.ttsPlugin = null;

    // 🌐 Web Speech
    this.synthesis = typeof window !== 'undefined'
      ? window.speechSynthesis
      : null;

    this.vozActual = null;
  }

  /* ============================
     🔧 INIT
  ============================ */

  async init() {
    if (this.isInitialized) return;

    if (this.isMobile) {
      try {
        const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
        this.ttsPlugin = TextToSpeech;
        this.isInitialized = true;
      } catch (error) {
        console.error('❌ Error cargando plugin TTS:', error);
      }
    } else {
      if (this.synthesis) {
        this.cargarVozWeb();
        this.isInitialized = true;
      } else {
        console.warn('⚠️ Text-to-Speech no soportado');
      }
    }
  }

  /* ============================
     🎤 SELECCIÓN DE VOZ WEB
  ============================ */

  cargarVozWeb() {
    if (!this.synthesis) return;

    const cargar = () => {
      const voces = this.synthesis.getVoices();
      if (!voces.length) return;

      const vocesES = voces.filter(
        v => v.lang.startsWith('es')
      );

      const prioridades = [
        'Google español de Estados Unidos',
        'Google español',
        'Microsoft Helena',
        'Microsoft Sabina',
        'Paulina',
        'Monica',
      ];

      let mejor = null;
      for (const p of prioridades) {
        mejor = vocesES.find(v => v.name.includes(p));
        if (mejor) break;
      }

      this.vozActual = mejor || vocesES[0] || voces[0];
      console.log('🎤 Voz TTS web:', this.vozActual?.name);
    };

    if (this.synthesis.getVoices().length > 0) {
      cargar();
    } else {
      this.synthesis.addEventListener('voiceschanged', cargar);
    }
  }

  /* ============================
     🗣️ SPEAK
  ============================ */

  async speak(text, options = {}) {
    await this.init();

    if (!text || !text.trim()) return;

    // 🎛️ valores amigables por defecto
    const opts = {
      language: 'es-ES',
      rate: 0.98,   // más natural
      pitch: 1.12,  // cálido
      volume: 0.95,
      ...options,
    };

    try {
      /* 📱 MÓVIL */
      if (this.isMobile && this.ttsPlugin) {
        console.log('📱 TTS nativo');

        await this.ttsPlugin.speak({
          text,
          lang: opts.language,
          rate: opts.rate,
          pitch: opts.pitch,
          volume: opts.volume,
          category: 'ambient',
        });

        return;
      }

      /* 🌐 WEB */
      if (this.synthesis) {
        console.log('🌐 TTS Web');

        return new Promise((resolve, reject) => {
          this.synthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(
            text
              .replace(/\./g, '… ')
              .replace(/\!/g, '! ')
              .replace(/\?/g, '? ')
          );

          if (this.vozActual) {
            utterance.voice = this.vozActual;
          }

          utterance.lang = opts.language;
          utterance.rate = opts.rate;
          utterance.pitch = opts.pitch;
          utterance.volume = opts.volume;

          utterance.onend = () => resolve();

          utterance.onerror = (e) => {
            // "interrupted" no es error real
            if (e.error === 'interrupted') {
              resolve();
            } else {
              console.error('❌ TTS error:', e);
              reject(e);
            }
          };

          this.synthesis.speak(utterance);
        });
      }

      throw new Error('Text-to-Speech no disponible');
    } catch (error) {
      console.error('❌ Error en speak():', error);
      throw error;
    }
  }

  /* ============================
     ⏹️ STOP
  ============================ */

  async stop() {
    try {
      if (this.isMobile && this.ttsPlugin) {
        await this.ttsPlugin.stop();
      } else if (this.synthesis) {
        this.synthesis.cancel();
      }
    } catch (error) {
      console.error('❌ Error al detener TTS:', error);
    }
  }

  /* ============================
     ✅ DISPONIBLE
  ============================ */

  isAvailable() {
    return this.isMobile
      ? !!this.ttsPlugin
      : !!this.synthesis;
  }
}

// 📦 instancia única
const ttsService = new TTSService();
export default ttsService;
