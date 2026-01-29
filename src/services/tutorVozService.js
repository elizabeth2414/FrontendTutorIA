// src/services/tutorVozService.js
// Servicio de voz del tutor (Web Speech API - gratuito)
import { Capacitor } from '@capacitor/core';
class TutorVozService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.vozActual = null;
    this.vozCargada = false;
    this.inicializarVoz();
  }

  /* ============================
     🎤 INICIALIZACIÓN DE VOZ
  ============================ */

  inicializarVoz() {
    if (!this.synthesis) return;

    if (this.synthesis.getVoices().length > 0) {
      this.seleccionarVozTierna();
    } else {
      this.synthesis.addEventListener("voiceschanged", () => {
        this.seleccionarVozTierna();
      });
    }
  }

  seleccionarVozTierna() {
    const voces = this.synthesis.getVoices();

    const vocesEspanol = voces.filter(
      (voz) => voz.lang.startsWith("es") || voz.lang.startsWith("ES")
    );

    // 🎯 Orden realista de voces más tiernas
    const prioridades = [
      "Google español de Estados Unidos",
      "Google español",
      "Microsoft Helena",
      "Microsoft Sabina",
      "Paulina",
      "Monica",
      "es-ES",
      "es-MX",
    ];

    let mejorVoz = null;
    for (const prioridad of prioridades) {
      mejorVoz = vocesEspanol.find(
        (voz) =>
          voz.name.includes(prioridad) || voz.lang.includes(prioridad)
      );
      if (mejorVoz) break;
    }

    this.vozActual = mejorVoz || vocesEspanol[0] || voces[0];
    this.vozCargada = true;

    console.log("🎤 Voz del tutor:", this.vozActual?.name || "Predeterminada");
  }

  /* ============================
     ⏸️ PAUSA HUMANA
  ============================ */

  pausa(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /* ============================
     🗣️ HABLAR (CORE)
  ============================ */

  async hablar(texto, opciones = {}) {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error("SpeechSynthesis no disponible"));
        return;
      }

      // 🔴 Cancelar cualquier voz anterior
      this.detener();

      const utterance = new SpeechSynthesisUtterance(
        texto
          .replace(/\./g, "… ")
          .replace(/\!/g, "! ")
      );

      if (this.vozActual) {
        utterance.voice = this.vozActual;
      }

      // 🎛️ Parámetros dulces y naturales
      utterance.rate = opciones.velocidad ?? 0.95;
      utterance.pitch = opciones.tono ?? 0.90;
      utterance.volume = opciones.volumen ?? 0.95;
      utterance.lang = opciones.idioma ?? "es-ES";

      utterance.onend = () => resolve();

      utterance.onerror = (e) => {
        // ❗ "interrupted" NO es un error real
        if (e.error === "interrupted") {
          resolve();
        } else {
          reject(e);
        }
      };

      this.synthesis.speak(utterance);
    });
  }

  detener() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  estaHablando() {
    return this.synthesis?.speaking || false;
  }

  /* ============================
     🧸 FRASES DEL TUTOR
  ============================ */

  async saludar(nombreNino) {
    const saludos = [
      `¡Hola ${nombreNino}!`,
      `¡Hola campeón!`,
      `¡Hola ${nombreNino}! Qué alegría verte.`,
    ];

    const saludo = saludos[Math.floor(Math.random() * saludos.length)];

    await this.hablar(saludo, { tono: 1.2 });
    await this.pausa(350);
    await this.hablar("¿Listo para aprender juntos?", { tono: 1.15 });
  }

  async explicarPractica() {
    await this.hablar("Voy a decir una palabra.");
    await this.pausa(350);
    await this.hablar("Escúchame bien.");
    await this.pausa(300);
    await this.hablar("Luego tú la repites, ¿sí?", { tono: 1.18 });
  }

  async pronunciarPalabra(palabra) {
    await this.hablar(palabra, { velocidad: 0.85, tono: 1.1 });
  }

  async pedirRepetir() {
    const mensajes = [
      "Ahora dila tú. ¡Tú puedes!",
      "Tu turno. Di la palabra.",
      "Inténtalo tú ahora, despacito.",
    ];

    const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];
    await this.hablar(mensaje, { velocidad: 0.95, tono: 1.15 });
  }

  async celebrarExito() {
    const celebraciones = [
      "¡Excelente! ¡Lo dijiste perfecto!",
      "¡Muy bien! ¡Qué bonito lo hiciste!",
      "¡Genial! ¡Estoy muy orgullosa de ti!",
      "¡Súper! ¡Lo lograste!",
    ];

    const celebracion =
      celebraciones[Math.floor(Math.random() * celebraciones.length)];

    await this.hablar(celebracion, { tono: 1.25, velocidad: 0.95 });
  }

  async animarMejora() {
    const animos = [
      "Muy buen intento.",
      "Casi lo tienes.",
      "Vamos a intentarlo otra vez, despacito.",
      "No pasa nada, escucha de nuevo.",
    ];

    const animo = animos[Math.floor(Math.random() * animos.length)];

    await this.hablar(animo, { tono: 1.05, velocidad: 0.95 });
  }

  async darConsejo(tipo) {
    const consejos = {
      despacio: "Intenta decir la palabra despacio.",
      escuchar: "Escucha bien cómo suena.",
      repetir: "Repite después de mí.",
      silabas: "Vamos a dividirla en partes pequeñas.",
    };

    const consejo = consejos[tipo] || consejos.despacio;
    await this.hablar(consejo, { velocidad: 0.75, tono: 1.1 });
  }

  async despedirse(nombreNino) {
    const despedidas = [
      `¡Muy bien ${nombreNino}! Nos vemos pronto.`,
      "¡Excelente trabajo hoy!",
      `Sigue así ${nombreNino}. Cada día lo haces mejor.`,
    ];

    const despedida =
      despedidas[Math.floor(Math.random() * despedidas.length)];

    await this.hablar(despedida, { tono: 1.2 });
  }

  async pronunciarSilaba(silaba) {
    await this.hablar(silaba, { velocidad: 0.6, tono: 1.1 });
  }

  async contarSilabas(palabra, silabas) {
    await this.hablar(
      `La palabra ${palabra} tiene ${silabas.length} sílabas.`
    );
    await this.pausa(400);

    for (let i = 0; i < silabas.length; i++) {
      await this.hablar(`${i + 1}`);
      await this.pausa(250);
      await this.pronunciarSilaba(silabas[i]);
      await this.pausa(400);
    }
  }

  async explicarError(palabraOriginal, palabraDicha) {
    await this.hablar(
      `Dijiste ${palabraDicha}.`,
      { velocidad: 0.8 }
    );
    await this.pausa(300);
    await this.hablar(
      `La palabra es ${palabraOriginal}. Escucha otra vez.`,
      { velocidad: 0.75 }
    );
  }
}

/* ============================
   📦 EXPORTAR INSTANCIA ÚNICA
============================ */

const tutorVozService = new TutorVozService();
export default tutorVozService;
