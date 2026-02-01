import { useState, useRef, useCallback } from "react";
import { MdArrowBack, MdRefresh, MdLightbulb } from "react-icons/md";
import { useNavigate } from "react-router-dom";

/* ══════════════════════════════════════════════════════════
   PALABRAS DEL JUEGO — todo local, sin API
   Nivel 1 → 4-5 letras (Fácil)
   Nivel 2 → 6-7 letras (Medio)
   Nivel 3 → 8-10 letras (Difícil)
   ══════════════════════════════════════════════════════════ */
const PALABRAS = {
  1: [
    { palabra: "GATO",   pista: "Animal que hace ronroneos" },
    { palabra: "LUNA",   pista: "Brilla en el cielo de noche" },
    { palabra: "CASA",   pista: "Donde vivimos con la familia" },
    { palabra: "LIBRO",  pista: "Tiene páginas y letras" },
    { palabra: "AGUA",   pista: "Un líquido que bebemos" },
    { palabra: "PERRO",  pista: "Animal fiel y amable" },
    { palabra: "ARBOL",  pista: "Tiene ramas y hojas" },
    { palabra: "PATO",   pista: "Vive cerca del agua" },
    { palabra: "NUBE",   pista: "Blanca, flota en el cielo" },
    { palabra: "MANO",   pista: "Tiene cinco dedos" },
    { palabra: "OJOS",   pista: "Con ellos vemos" },
    { palabra: "PIES",   pista: "Con ellos caminamos" },
  ],
  2: [
    { palabra: "BOSQUE",  pista: "Lugar lleno de árboles" },
    { palabra: "ANIMAL",  pista: "Seres vivos que se mueven" },
    { palabra: "FLORES",  pista: "Plantas con colores bonitos" },
    { palabra: "CONEJO",  pista: "Tiene orejas largas" },
    { palabra: "PALOMA",  pista: "Pájaro blanco y gris" },
    { palabra: "GALLINA", pista: "Pone huevos" },
    { palabra: "HERMANO", pista: "Familiar cercano" },
    { palabra: "AMIGOS",  pista: "Con quienes jugamos" },
    { palabra: "JARDIN",  pista: "Lugar con plantas bonitas" },
    { palabra: "COHETE",  pista: "Va al espacio" },
  ],
  3: [
    { palabra: "AVENTURA",   pista: "Una experiencia emocionante" },
    { palabra: "ESTRELLA",   pista: "Brilla en el cielo nocturno" },
    { palabra: "ELEFANTE",   pista: "Animal grande con trompa" },
    { palabra: "LECTURA",    pista: "La actividad de leer" },
    { palabra: "PLANETA",    pista: "La Tierra es uno de estos" },
    { palabra: "TORTUGA",    pista: "Animal lento con carapace" },
    { palabra: "DINOSAURIO", pista: "Animal prehistorico extinto" },
  ],
};

/* ══════════════════════════════════════════════════════════
   UTILIDADES
   ══════════════════════════════════════════════════════════ */
const mezclar = (arr) => {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
};

// Mezcla letras asegurando que no quede igual a la original
const scramble = (palabra) => {
  let r, t = 0;
  do {
    r = mezclar(palabra.split("")).join("");
    t++;
  } while (r === palabra && t < 50 && palabra.length > 1);
  return r.split("");
};

// Selecciona palabra aleatoria del nivel que no haya sido usada
const pickWord = (nivel, usadas) => {
  const pool = (PALABRAS[nivel] || []).filter((p) => !usadas.includes(p.palabra));
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
};

/* ══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════════════════════════════════ */
export default function MiniJuego() {
  const navigate = useNavigate();

  // ─── Estado ───
  const [fase, setFase]               = useState("inicio"); // inicio | jugando | final
  const [nivel, setNivel]             = useState(1);
  const [palabra, setPalabra]         = useState(null);     // { palabra, pista }
  const [letras, setLetras]           = useState([]);       // [{ letra, id, sel }]
  const [elegidas, setElegidas]       = useState([]);       // [id, id, ...] orden de toque
  const [puntuacion, setPuntuacion]   = useState(0);
  const [vidas, setVidas]             = useState(3);
  const [racha, setRacha]             = useState(0);
  const [completadas, setCompletadas] = useState(0);
  const [pistaVista, setPistaVista]   = useState(false);
  const [feedback, setFeedback]       = useState(null);     // "ok" | "err" | null

  // Refs para evitar closures stales dentro de setTimeout
  const usadasRef = useRef([]);
  const nivelRef  = useRef(1);

  // ─── Cargar nueva palabra ───
  const loadWord = useCallback((niv) => {
    let w = pickWord(niv, usadasRef.current);
    let curNiv = niv;

    // Si no hay palabras en este nivel, subir al siguiente
    if (!w && niv < 3) {
      curNiv = niv + 1;
      w = pickWord(curNiv, usadasRef.current);
      setNivel(curNiv);
      nivelRef.current = curNiv;
    }
    // Sin palabras disponibles → fin del juego
    if (!w) { setFase("final"); return; }

    usadasRef.current = [...usadasRef.current, w.palabra];
    setPalabra(w);
    setLetras(scramble(w.palabra).map((l, i) => ({ letra: l, id: i, sel: false })));
    setElegidas([]);
    setPistaVista(false);
  }, []);

  // ─── Iniciar juego ───
  const iniciar = () => {
    usadasRef.current = [];
    nivelRef.current  = 1;
    setNivel(1);
    setPuntuacion(0);
    setVidas(3);
    setRacha(0);
    setCompletadas(0);
    setFeedback(null);
    setFase("jugando");
    loadWord(1);
  };

  // ─── Tocar letra disponible → agregar a la respuesta ───
  const tapLetra = (id) => {
    if (fase !== "jugando" || feedback || letras[id]?.sel) return;

    const nuevas = [...elegidas, id];
    setElegidas(nuevas);
    setLetras((prev) => prev.map((l) => (l.id === id ? { ...l, sel: true } : l)));

    // Si la palabra está completa → verificar
    if (palabra && nuevas.length === palabra.palabra.length) {
      const intentada = nuevas.map((eid) => letras[eid]?.letra).join("");

      if (intentada === palabra.palabra) {
        // ✅ CORRECTO
        const pts = 10 + racha * 5;
        setPuntuacion((p) => p + pts);
        setRacha((r) => r + 1);
        setCompletadas((c) => c + 1);
        setFeedback("ok");
        setTimeout(() => {
          setFeedback(null);
          loadWord(nivelRef.current);
        }, 1100);
      } else {
        // ❌ INCORRECTO
        const nv = vidas - 1;
        setVidas(nv);
        setRacha(0);
        setFeedback("err");
        setTimeout(() => {
          setFeedback(null);
          if (nv <= 0) {
            setFase("final");
          } else {
            // Reset letras para reintentar misma palabra
            setElegidas([]);
            setLetras((prev) => prev.map((l) => ({ ...l, sel: false })));
          }
        }, 700);
      }
    }
  };

  // ─── Tocar letra elegida → removerla de la respuesta ───
  const tapElegida = (id) => {
    if (fase !== "jugando" || feedback) return;
    setElegidas((prev) => prev.filter((eid) => eid !== id));
    setLetras((prev) => prev.map((l) => (l.id === id ? { ...l, sel: false } : l)));
  };

  // ─── Mezclar letras de nuevo ───
  const reshuffle = () => {
    if (!palabra || feedback) return;
    setLetras(scramble(palabra.palabra).map((l, i) => ({ letra: l, id: i, sel: false })));
    setElegidas([]);
  };

  // ─── Mostrar pista (cuesta 5 puntos) ───
  const mostrarPista = () => {
    setPistaVista(true);
    setPuntuacion((p) => Math.max(0, p - 5));
  };

  // ─── Tamaño de botones según longitud de palabra ───
  //     Palabras largas (8+) necesitan botones más pequeños para entrar en pantalla
  const btnCls = palabra && palabra.palabra.length > 7
    ? "w-10 h-10 text-base"   // compacto para palabras largas
    : "w-12 h-12 text-lg";    // grande y cómodo para palabras cortas

  const nivelLabel = { 1: "Fácil", 2: "Medio", 3: "Difícil" };

  // ═══════════════════════════════════════════════════════
  // PANTALLA: INICIO
  // ═══════════════════════════════════════════════════════
  if (fase === "inicio") return (
    <>
      {/* ── MÓVIL ── */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
          * { font-family: 'Poppins', sans-serif; }
          h1,h2,h3,h4 { font-family: 'Fredoka', 'Poppins', sans-serif; }
        `}</style>

        {/* Flecha volver arriba */}
        <div className="px-4 pt-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-slate-400 active:text-emerald-600 transition-colors">
            <MdArrowBack size={18} />
            <span className="text-sm font-bold">Volver</span>
          </button>
        </div>

        {/* Contenido centrado */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pb-8">

          {/* Icono grande */}
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-lg shadow-emerald-500/20 flex items-center justify-center mb-6">
            <span className="text-6xl">🔤</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Desordena</h1>
          <p className="text-sm text-slate-500 mb-8 max-w-xs">
            Ordena las letras y forma la palabra correcta. ¡Hazlo rápido!
          </p>

          {/* Instrucciones */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 w-full mb-7 text-left">
            <h3 className="font-bold text-slate-800 text-center text-sm mb-4">¿Cómo jugar?</h3>
            {[
              { emoji: "👆", text: "Toca las letras para ordenarlas" },
              { emoji: "❤️", text: "Si te equivocas pierdas una vida" },
              { emoji: "💡", text: "Usa pistas si necesitas ayuda" },
              { emoji: "🔥", text: "Haz rachas para ganar más puntos" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                <span className="text-xl w-7 text-center flex-shrink-0">{item.emoji}</span>
                <p className="text-sm text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Niveles preview */}
          <div className="flex gap-2 w-full mb-7">
            {[
              { label: "Fácil", color: "emerald", letters: "4-5" },
              { label: "Medio", color: "teal", letters: "6-7" },
              { label: "Difícil", color: "cyan", letters: "8+" },
            ].map((n) => (
              <div key={n.label} className={`flex-1 bg-${n.color}-50 border border-${n.color}-200 rounded-xl p-2.5 text-center`}
                style={{ backgroundColor: n.color === "emerald" ? "#ecfdf5" : n.color === "teal" ? "#f0fdfa" : "#f0fdff", borderColor: n.color === "emerald" ? "#6ee7b7" : n.color === "teal" ? "#5eead4" : "#67e8f9" }}
              >
                <p className="text-xs font-bold mb-0.5" style={{ color: n.color === "emerald" ? "#059669" : n.color === "teal" ? "#0d9488" : "#0891b2" }}>{n.label}</p>
                <p className="text-[10px] text-slate-500">{n.letters} letras</p>
              </div>
            ))}
          </div>

          {/* Botón jugar */}
          <button
            onClick={iniciar}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-2xl font-bold text-lg shadow-md shadow-emerald-500/20 active:scale-95 transition-transform"
          >
            ¡Jugar!
          </button>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-sm">
          <p className="text-6xl mb-4">📱</p>
          <h2 className="text-lg font-bold text-slate-700 mb-2">Solo disponible en móvil</h2>
          <p className="text-sm text-slate-500">Este juego está diseñado para dispositivos móviles</p>
        </div>
      </div>
    </>
  );

  // ═══════════════════════════════════════════════════════
  // PANTALLA: FINAL
  // ═══════════════════════════════════════════════════════
  if (fase === "final") return (
    <>
      {/* ── MÓVIL ── */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
          * { font-family: 'Poppins', sans-serif; }
          h1,h2,h3,h4 { font-family: 'Fredoka', 'Poppins', sans-serif; }
          @keyframes popIn { from { opacity:0; transform:scale(0.7); } to { opacity:1; transform:scale(1); } }
          .pop { animation: popIn 0.5s cubic-bezier(.34,1.56,.64,1) forwards; }
        `}</style>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">

          {/* Trofeo animado */}
          <div className="pop w-28 h-28 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-lg shadow-emerald-500/20 flex items-center justify-center mb-5">
            <span className="text-6xl">🏆</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">¡Juego terminado!</h1>
          <p className="text-sm text-slate-500 mb-6">Aquí está tu resultado</p>

          {/* Tarjeta de resultados */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 w-full mb-6">
            {/* Puntuación grande */}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-1">Puntuación</p>
            <p className="text-6xl font-bold text-emerald-600 text-center mb-5">{puntuacion}</p>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-center">
                <p className="text-emerald-600 font-bold uppercase tracking-wide" style={{ fontSize: "9px" }}>Palabras</p>
                <p className="text-xl font-bold text-emerald-700 mt-0.5">{completadas}</p>
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-2.5 text-center">
                <p className="text-teal-600 font-bold uppercase tracking-wide" style={{ fontSize: "9px" }}>Nivel máx</p>
                <p className="text-xl font-bold text-teal-700 mt-0.5">{nivel}</p>
              </div>
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-2.5 text-center">
                <p className="text-violet-600 font-bold uppercase tracking-wide" style={{ fontSize: "9px" }}>Errores</p>
                <p className="text-xl font-bold text-violet-700 mt-0.5">{3 - vidas}</p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <button
            onClick={iniciar}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-2xl font-bold text-lg shadow-md shadow-emerald-500/20 active:scale-95 transition-transform mb-3"
          >
            Jugar de nuevo
          </button>
          <button onClick={() => navigate(-1)} className="text-sm text-slate-400 active:text-slate-600 transition-colors">
            Volver
          </button>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-sm">
          <p className="text-6xl mb-4">📱</p>
          <h2 className="text-lg font-bold text-slate-700 mb-2">Solo disponible en móvil</h2>
          <p className="text-sm text-slate-500">Este juego está diseñado para dispositivos móviles</p>
        </div>
      </div>
    </>
  );

  // ═══════════════════════════════════════════════════════
  // PANTALLA: JUGANDO
  // ═══════════════════════════════════════════════════════
  return (
    <>
      {/* ── MÓVIL ── */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
          * { font-family: 'Poppins', sans-serif; }
          h1,h2,h3,h4 { font-family: 'Fredoka', 'Poppins', sans-serif; }
          @keyframes shake { 0%,100% { transform:translateX(0); } 20%,60% { transform:translateX(-6px); } 40%,80% { transform:translateX(6px); } }
          .shake { animation: shake 0.4s ease; }
        `}</style>

        {/* ── Header ── */}
        <div className="bg-white rounded-b-2xl shadow-sm px-4 pt-4 pb-4">
          {/* Fila superior: salir + puntos */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setFase("final")} className="flex items-center gap-1.5 text-slate-400 active:text-emerald-600 transition-colors">
              <MdArrowBack size={18} />
              <span className="text-sm font-bold">Salir</span>
            </button>

            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
              <span className="text-sm">⭐</span>
              <span className="text-sm font-bold text-emerald-700">{puntuacion}</span>
            </div>
          </div>

          {/* Fila inferior: vidas + racha + nivel */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className={`text-xl transition-all duration-300 ${i < vidas ? "opacity-100 scale-100" : "opacity-20 scale-90"}`}>
                  ❤️
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {racha > 0 && (
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                  🔥 x{racha}
                </span>
              )}
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                Niv.{nivel} · {nivelLabel[nivel]}
              </span>
            </div>
          </div>
        </div>

        {/* ── Cuerpo del juego ── */}
        <div className="flex-1 flex flex-col px-4 pt-5 pb-6">

          {/* ── Pista ── */}
          <div className="mb-5">
            {!pistaVista ? (
              <button onClick={mostrarPista} className="flex items-center gap-2 text-teal-600 active:opacity-60 transition-opacity">
                <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
                  <MdLightbulb size={16} className="text-teal-500" />
                </div>
                <span className="text-sm font-bold">
                  Ver pista <span className="font-normal text-teal-400">(-5 pts)</span>
                </span>
              </button>
            ) : (
              <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <MdLightbulb size={16} className="text-teal-600" />
                </div>
                <p className="text-sm text-teal-700 font-medium">{palabra?.pista}</p>
              </div>
            )}
          </div>

          {/* ── Tu respuesta (slots) ── */}
          <div className="mb-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2.5">Tu respuesta</p>
            <div className={`flex flex-wrap gap-2 ${feedback === "err" ? "shake" : ""}`}>
              {palabra && [...Array(palabra.palabra.length)].map((_, i) => {
                const eid   = elegidas[i];
                const lleno = eid !== undefined;
                return (
                  <div
                    key={`slot-${i}`}
                    onClick={() => lleno && tapElegida(eid)}
                    className={`${btnCls} rounded-xl flex items-center justify-center font-bold border-2 select-none transition-all ${
                      lleno
                        ? feedback === "ok"
                          ? "bg-emerald-100 border-emerald-400 text-emerald-700 shadow-sm"
                          : feedback === "err"
                            ? "bg-rose-100 border-rose-300 text-rose-600"
                            : "bg-white border-teal-300 text-teal-700 shadow-sm active:scale-90 cursor-pointer"
                        : "bg-slate-50 border-dashed border-slate-300 text-slate-300"
                    }`}
                  >
                    {lleno ? letras[eid]?.letra : ""}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Feedback (correcto / incorrecto) ── */}
          {feedback && (
            <div className={`rounded-xl px-4 py-2.5 mb-3 text-center border ${
              feedback === "ok"
                ? "bg-emerald-50 border-emerald-200"
                : "bg-rose-50 border-rose-200"
            }`}>
              <p className={`text-sm font-bold ${feedback === "ok" ? "text-emerald-700" : "text-rose-700"}`}>
                {feedback === "ok"
                  ? `✅ ¡Correcto! +${10 + (racha - 1) * 5} pts`
                  : "❌ ¡Incorrecto! Intenta de nuevo"
                }
              </p>
            </div>
          )}

          {/* ── Letras disponibles ── */}
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2.5">Letras</p>
            <div className="flex flex-wrap gap-2">
              {letras.map((l) => (
                <button
                  key={l.id}
                  onClick={() => tapLetra(l.id)}
                  disabled={l.sel || !!feedback}
                  className={`${btnCls} rounded-xl flex items-center justify-center font-bold border-2 select-none transition-all ${
                    l.sel
                      ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
                      : "bg-white border-teal-300 text-teal-700 shadow-sm active:scale-90 active:bg-teal-50 cursor-pointer"
                  }`}
                >
                  {l.letra}
                </button>
              ))}
            </div>
          </div>

          {/* ── Mezclar ── */}
          <div className="pt-5">
            <button
              onClick={reshuffle}
              disabled={!!feedback}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 text-slate-500 font-bold text-sm active:bg-slate-50 transition-all disabled:opacity-40"
            >
              <MdRefresh size={18} /> Mezclar de nuevo
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-sm">
          <p className="text-6xl mb-4">📱</p>
          <h2 className="text-lg font-bold text-slate-700 mb-2">Solo disponible en móvil</h2>
          <p className="text-sm text-slate-500">Este juego está diseñado para dispositivos móviles</p>
        </div>
      </div>
    </>
  );
}
