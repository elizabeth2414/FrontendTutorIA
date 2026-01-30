// src/services/tutorVozService.js
// Servicio de voz del tutor (Web Speech API - gratuito)
import { Capacitor } from "@capacitor/core";

class TutorVozService {
  constructor() {
    this.synthesis = typeof window !== "undefined" ? window.speechSynthesis : null;
    this.vozActual = null;
    this.vozCargada = false;

    // ✅ Cola simple (evita solapamiento)
    this._cola = Promise.resolve();

    // ✅ Anti-duplicado por texto/tiempo
    this._ultimoTexto = "";
    this._ultimoTS = 0;

    // ✅ Evitar enganchar voiceschanged múltiples veces
    this._voicesListenerAdded = false;

    this.inicializarVoz();
  }

  inicializarVoz() {
    if (!this.synthesis) return;

    const init = () => this.seleccionarVozTierna();

    if (this.synthesis.getVoices().length > 0) {
      init();
      return;
    }

    if (!this._voicesListenerAdded) {
      this._voicesListenerAdded = true;
      this.synthesis.addEventListener(
        "voiceschanged",
        () => {
          init();
        },
        { once: true }
      );
    }
  }

  seleccionarVozTierna() {
    if (!this.synthesis) return;

    const voces = this.synthesis.getVoices();
    const vocesEspanol = voces.filter((voz) => voz.lang?.startsWith("es") || voz.lang?.startsWith("ES"));

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
        (voz) => (voz.name || "").includes(prioridad) || (voz.lang || "").includes(prioridad)
      );
      if (mejorVoz) break;
    }

    this.vozActual = mejorVoz || vocesEspanol[0] || voces[0] || null;
    this.vozCargada = true;

    console.log("🎤 Voz del tutor:", this.vozActual?.name || "Predeterminada");
  }

  pausa(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  hablar(texto, opciones = {}) {
    this._cola = this._cola
      .catch(() => {})
      .then(() => this._hablarInterno(texto, opciones));

    return this._cola;
  }

  _hablarInterno(texto, opciones = {}) {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error("SpeechSynthesis no disponible"));
        return;
      }

      const limpio = String(texto || "")
        .trim()
        .replace(/\./g, "… ")
        .replace(/\!/g, "! ");

      if (!limpio) {
        resolve();
        return;
      }

      // ✅ Anti-duplicado: mismo texto en menos de 650ms = ignorar
      const ahora = Date.now();
      if (limpio === this._ultimoTexto && ahora - this._ultimoTS < 650) {
        resolve();
        return;
      }
      this._ultimoTexto = limpio;
      this._ultimoTS = ahora;

      if (this.synthesis.speaking || this.synthesis.pending) {
        this.synthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(limpio);
      if (this.vozActual) utterance.voice = this.vozActual;

      utterance.rate = opciones.velocidad ?? 0.95;
      utterance.pitch = opciones.tono ?? 0.9;
      utterance.volume = opciones.volumen ?? 0.95;
      utterance.lang = opciones.idioma ?? "es-ES";

      utterance.onend = () => resolve();

      utterance.onerror = (e) => {
        if (e?.error === "interrupted") resolve();
        else reject(e);
      };

      // ✅ micro-delay ayuda a que no se “coma” la primera palabra
      setTimeout(() => {
        try {
          this.synthesis.speak(utterance);
        } catch (err) {
          reject(err);
        }
      }, 60);
    });
  }

  detener() {
    if (this.synthesis) this.synthesis.cancel();
  }

  estaHablando() {
    return this.synthesis?.speaking || false;
  }

  async saludar(nombreNino) {
    const saludos = [`¡Como estas el dia de hoy !`, "¡Hola !", `¡Hola ! Me siento feliz de verte .`];
    const saludo = saludos[Math.floor(Math.random() * saludos.length)];

    await this.hablar(saludo, { tono: 1.2 });
    await this.pausa(350);
    await this.hablar("¿Estas listo para aprender juntos?", { tono: 1.15 });
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
    const mensajes = ["Ahora dila tú. ¡Tú puedes!", "Tu turno. Di la palabra.", "Inténtalo tú ahora, despacito."];
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
    const celebracion = celebraciones[Math.floor(Math.random() * celebraciones.length)];
    await this.hablar(celebracion, { tono: 1.25, velocidad: 0.95 });
  }

  async animarMejora() {
    const animos = ["Muy buen intento.", "Casi lo tienes.", "Vamos a intentarlo otra vez, despacito.", "No pasa nada, escucha de nuevo."];
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
    const despedidas = [`¡Muy bien ${nombreNino}! Nos vemos pronto.`, "¡Excelente trabajo hoy!", `Sigue así ${nombreNino}. Cada día lo haces mejor.`];
    const despedida = despedidas[Math.floor(Math.random() * despedidas.length)];
    await this.hablar(despedida, { tono: 1.2 });
  }

  async pronunciarSilaba(silaba) {
    await this.hablar(silaba, { velocidad: 0.6, tono: 1.1 });
  }

  async contarSilabas(palabra, silabas) {
    await this.hablar(`La palabra ${palabra} tiene ${silabas.length} sílabas.`);
    await this.pausa(400);

    for (let i = 0; i < silabas.length; i++) {
      await this.hablar(`${i + 1}`);
      await this.pausa(250);
      await this.pronunciarSilaba(silabas[i]);
      await this.pausa(400);
    }
  }

  async explicarError(palabraOriginal, palabraDicha) {
    await this.hablar(`Dijiste ${palabraDicha}.`, { velocidad: 0.8 });
    await this.pausa(300);
    await this.hablar(`La palabra es ${palabraOriginal}. Escucha otra vez.`, { velocidad: 0.75 });
  }

  async explicarSilencio() {
    await this.hablar("No te escuché. No pasa nada.", { tono: 1.1 });
    await this.pausa(250);
    await this.hablar("Respira y dilo otra vez despacito.", { tono: 1.15 });
  }
}

const tutorVozService = new TutorVozService();
export default tutorVozService;
