import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdRefresh, MdTouchApp, MdSearch, MdCheck } from "react-icons/md";
import { FaClock } from "react-icons/fa";

// ✅ 1) IMPORTA TUS IMÁGENES (Flaticon)
import gatoImg from "../../assets/memory/gato.png";
import perroImg from "../../assets/memory/perro.png";
import lunaImg from "../../assets/memory/luna.png";
import solImg from "../../assets/memory/sol.png";
import casaImg from "../../assets/memory/casa.png";
import libroImg from "../../assets/memory/libro.png";
import aguaImg from "../../assets/memory/agua.png";
import arbolImg from "../../assets/memory/arbol.png";
import nubeImg from "../../assets/memory/nube.png";
import pajaroImg from "../../assets/memory/pajaro.png";
import pezImg from "../../assets/memory/pez.png";
import florImg from "../../assets/memory/flor.png";
import estrellaImg from "../../assets/memory/estrella.png";
import corazonImg from "../../assets/memory/corazon.png";
import fuegoImg from "../../assets/memory/fuego.png";
import nieveImg from "../../assets/memory/nieve.png";
import coheteImg from "../../assets/memory/cohete.png";
import pizzaImg from "../../assets/memory/pizza.png";
import manzanaImg from "../../assets/memory/manzana.png";
import musicaImg from "../../assets/memory/musica.png";

const COLORES = [
  { bg: "bg-emerald-100", text: "text-emerald-600", borde: "border-emerald-300" },
  { bg: "bg-violet-100", text: "text-violet-600", borde: "border-violet-300" },
  { bg: "bg-rose-100", text: "text-rose-600", borde: "border-rose-300" },
  { bg: "bg-amber-100", text: "text-amber-600", borde: "border-amber-300" },
  { bg: "bg-sky-100", text: "text-sky-600", borde: "border-sky-300" },
  { bg: "bg-teal-100", text: "text-teal-600", borde: "border-teal-300" },
  { bg: "bg-pink-100", text: "text-pink-600", borde: "border-pink-300" },
  { bg: "bg-indigo-100", text: "text-indigo-600", borde: "border-indigo-300" },
  { bg: "bg-orange-100", text: "text-orange-600", borde: "border-orange-300" },
  { bg: "bg-cyan-100", text: "text-cyan-600", borde: "border-cyan-300" },
];

/* ══════════════════════════════════════════════════════════
   PAREJAS — palabra ↔ IMAGEN (Flaticon)
   ══════════════════════════════════════════════════════════ */
const PAREJAS_POOL = [
  { palabra: "GATO", imagen: gatoImg },
  { palabra: "PERRO", imagen: perroImg },
  { palabra: "LUNA", imagen: lunaImg },
  { palabra: "SOL", imagen: solImg },
  { palabra: "CASA", imagen: casaImg },
  { palabra: "LIBRO", imagen: libroImg },
  { palabra: "AGUA", imagen: aguaImg },
  { palabra: "ÁRBOL", imagen: arbolImg },
  { palabra: "NUBE", imagen: nubeImg },
  { palabra: "PÁJARO", imagen: pajaroImg },
  { palabra: "PECES", imagen: pezImg },
  { palabra: "FLOR", imagen: florImg },
  { palabra: "ESTRELLA", imagen: estrellaImg },
  { palabra: "CORAZÓN", imagen: corazonImg },
  { palabra: "FUEGO", imagen: fuegoImg },
  { palabra: "NIEVE", imagen: nieveImg },
  { palabra: "COHETE", imagen: coheteImg },
  { palabra: "PIZZA", imagen: pizzaImg },
  { palabra: "MANZANA", imagen: manzanaImg },
  { palabra: "MÚSICA", imagen: musicaImg },
];

const NIVELES = {
  1: { parejas: 6, label: "Fácil", tiempo: 60 },
  2: { parejas: 8, label: "Medio", tiempo: 90 },
  3: { parejas: 10, label: "Difícil", tiempo: 120 },
};

/* ── Utilidades ── */
const mezclar = (arr) => {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
};

const generarTablero = (nParejas) => {
  const pool = mezclar(PAREJAS_POOL).slice(0, nParejas);
  const cartas = [];
  pool.forEach((p, i) => {
    cartas.push({ id: `p-${i}`, parejaId: i, tipo: "palabra", palabra: p.palabra, colorIdx: i });
    cartas.push({ id: `i-${i}`, parejaId: i, tipo: "imagen", imagen: p.imagen, alt: p.palabra, colorIdx: i });
  });
  return mezclar(cartas);
};

const Carta = ({ carta, voltear, estado, compact }) => {
  const color = COLORES[carta.colorIdx % COLORES.length];

  return (
    <button
      onClick={() => estado === "tapada" && voltear(carta.id)}
      disabled={estado !== "tapada"}
      className={`relative rounded-xl border-2 transition-all duration-200 select-none overflow-hidden
        ${estado === "tapada"
          ? "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 border-emerald-600 shadow-md active:scale-90 cursor-pointer"
          : estado === "volteada"
            ? `bg-white ${color.borde} shadow-md scale-95`
            : `bg-white border-slate-200 shadow-sm opacity-50`
        }`}
      style={{ aspectRatio: "3/4" }}
    >
      {/* TAPADA */}
      {estado === "tapada" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`rounded-lg bg-white/20 flex items-center justify-center ${compact ? "w-6 h-6" : "w-8 h-8"}`}>
            <span className={`text-white/70 font-bold ${compact ? "text-sm" : "text-lg"}`}>?</span>
          </div>
        </div>
      )}

      {/* PALABRA */}
      {estado !== "tapada" && carta.tipo === "palabra" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-1 gap-1.5">
          <div className={`rounded ${color.bg} flex items-center justify-center ${compact ? "w-5 h-5" : "w-6 h-6"}`}>
            <span className={`font-bold ${color.text} ${compact ? "text-[8px]" : "text-[9px]"}`}>Aa</span>
          </div>
          <span className={`font-bold text-slate-800 text-center leading-tight ${compact ? "text-[9px]" : "text-xs"}`}>
            {carta.palabra}
          </span>
        </div>
      )}

      {/* IMAGEN (Flaticon) */}
      {estado !== "tapada" && carta.tipo === "imagen" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`rounded-lg ${color.bg} flex items-center justify-center ${compact ? "w-8 h-8" : "w-11 h-11"}`}>
            <img
              src={carta.imagen}
              alt={carta.alt || ""}
              draggable={false}
              className={`${compact ? "w-5 h-5" : "w-7 h-7"} object-contain`}
            />
          </div>
        </div>
      )}

      {/* CHECK en esquina al encontrar pareja */}
      {estado === "encontrada" && (
        <div className="absolute top-0.5 right-0.5">
          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
            <MdCheck size={10} className="text-white" />
          </div>
        </div>
      )}
    </button>
  );
};

export default function MiniJuegoMemory() {
  const navigate = useNavigate();

  const [fase, setFase] = useState("inicio");
  const [nivel, setNivel] = useState(1);
  const [tablero, setTablero] = useState([]);
  const [volteadas, setVolteadas] = useState([]);
  const [encontradas, setEncontradas] = useState([]);
  const [movimientos, setMovimientos] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [tiempoUsado, setTiempoUsado] = useState(0);

  const timerRef = useRef(null);
  const bloqueRef = useRef(false);

  const calcPuntuacion = () => {
    const nP = NIVELES[nivel]?.parejas || 6;
    return Math.max(0, nP * 100 + tiempoRestante * 2 - Math.max(0, movimientos - nP) * 5);
  };

  // Timer
  useEffect(() => {
    if (fase !== "jugando") {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTiempoRestante((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setFase("final");
          return 0;
        }
        setTiempoUsado((u) => u + 1);
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [fase]);

  // Victoria
  useEffect(() => {
    if (fase !== "jugando") return;
    if (encontradas.length === (NIVELES[nivel]?.parejas || 6)) {
      clearInterval(timerRef.current);
      setFase("final");
    }
  }, [encontradas, nivel, fase]);

  // Iniciar
  const iniciar = (niv = 1) => {
    setNivel(niv);
    setEncontradas([]);
    setVolteadas([]);
    setMovimientos(0);
    setTablero(generarTablero(NIVELES[niv].parejas));
    setTiempoRestante(NIVELES[niv].tiempo);
    setTiempoUsado(0);
    bloqueRef.current = false;
    setFase("jugando");
  };

  // Voltear
  const voltear = (id) => {
    if (bloqueRef.current) return;
    if (volteadas.includes(id)) return;
    if (encontradas.includes(tablero.find((c) => c.id === id)?.parejaId)) return;

    const nuevas = [...volteadas, id];
    setVolteadas(nuevas);

    if (nuevas.length === 2) {
      bloqueRef.current = true;
      setMovimientos((m) => m + 1);

      const c1 = tablero.find((c) => c.id === nuevas[0]);
      const c2 = tablero.find((c) => c.id === nuevas[1]);

      if (c1?.parejaId === c2?.parejaId) {
        setTimeout(() => {
          setEncontradas((prev) => [...prev, c1.parejaId]);
          setVolteadas([]);
          bloqueRef.current = false;
        }, 500);
      } else {
        setTimeout(() => {
          setVolteadas([]);
          bloqueRef.current = false;
        }, 900);
      }
    }
  };

  const getEstado = (carta) => {
    if (encontradas.includes(carta.parejaId)) return "encontrada";
    if (volteadas.includes(carta.id)) return "volteada";
    return "tapada";
  };

  const formatTiempo = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const timerMax = NIVELES[nivel]?.tiempo || 60;
  const timerPct = (tiempoRestante / timerMax) * 100;
  const timerColor = timerPct > 40 ? "bg-emerald-500" : timerPct > 20 ? "bg-amber-500" : "bg-rose-500";
  const cols = nivel === 3 ? "grid-cols-5" : "grid-cols-4";

  // ═══ INICIO ═══
  if (fase === "inicio")
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
          * { font-family: 'Poppins', sans-serif; }
          h1,h2,h3,h4 { font-family: 'Fredoka', 'Poppins', sans-serif; }
        `}</style>

        <div className="md:hidden min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
          <div className="px-4 pt-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-slate-400 active:text-emerald-600 transition-colors">
              <MdArrowBack size={18} />
              <span className="text-sm font-bold">Volver</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-5 text-center pb-8">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-lg shadow-emerald-500/20 flex items-center justify-center mb-6">
              <MdTouchApp size={52} className="text-white" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">Parejas</h1>
            <p className="text-sm text-slate-500 mb-7 max-w-xs">
              Encuentra las parejas: cada palabra tiene una imagen que va con ella. ¡Memoriza bien!
            </p>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 w-full mb-6 text-left">
              <h3 className="font-bold text-slate-800 text-center text-sm mb-4">¿Cómo jugar?</h3>
              {[
                { Icono: MdTouchApp, bgColor: "bg-emerald-50", textColor: "text-emerald-600", texto: "Toca una tarjeta para voltearla" },
                { Icono: MdSearch, bgColor: "bg-teal-50", textColor: "text-teal-600", texto: "Busca la palabra que va con cada imagen" },
                { Icono: FaClock, bgColor: "bg-amber-50", textColor: "text-amber-600", texto: "Tienes tiempo límite según el nivel" },
              ].map((item, i) => {
                const I = item.Icono;
                return (
                  <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                    <div className={`w-9 h-9 rounded-lg ${item.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <I size={19} className={item.textColor} />
                    </div>
                    <p className="text-sm text-slate-600">{item.texto}</p>
                  </div>
                );
              })}
            </div>

            <div className="w-full mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide text-center mb-3">Elige el nivel</p>
              <div className="space-y-2.5">
                {Object.entries(NIVELES).map(([niv, info]) => (
                  <button
                    key={niv}
                    onClick={() => iniciar(Number(niv))}
                    className="w-full bg-white rounded-xl shadow-sm border border-slate-200 hover:border-slate-300 p-3.5 flex items-center gap-4 active:scale-95 transition-all"
                  >
                    <div className="w-11 h-11 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm flex-shrink-0">
                      <span className="text-white font-black">{niv}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold text-slate-900">{info.label}</p>
                      <p className="text-xs text-slate-400">
                        {info.parejas} parejas · {info.tiempo}s
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-sm">
            <h2 className="text-lg font-bold text-slate-700 mb-2">Solo disponible en móvil</h2>
            <p className="text-sm text-slate-500">Este juego está diseñado para dispositivos móviles</p>
          </div>
        </div>
      </>
    );

  // ═══ FINAL ═══
  if (fase === "final") {
    const nParejas = NIVELES[nivel]?.parejas || 6;
    const gano = encontradas.length === nParejas;
    const pts = calcPuntuacion();

    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
          * { font-family: 'Poppins', sans-serif; }
          h1,h2,h3,h4 { font-family: 'Fredoka', 'Poppins', sans-serif; }
          @keyframes popIn { from { opacity:0; transform:scale(0.7); } to { opacity:1; transform:scale(1); } }
          .pop { animation: popIn 0.5s cubic-bezier(.34,1.56,.64,1) forwards; }
        `}</style>

        <div className="md:hidden min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
            <div className="pop w-28 h-28 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-lg shadow-emerald-500/20 flex items-center justify-center mb-5">
              <MdCheck size={52} className="text-white" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-1">{gano ? "¡La completaste!" : "¡Se acabó el tiempo!"}</h1>
            <p className="text-sm text-slate-500 mb-6">
              {gano ? "Encontraste todas las parejas" : `Te faltaron ${nParejas - encontradas.length} parejas`}
            </p>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 w-full mb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-1">Puntuación</p>
              <p className="text-6xl font-bold text-emerald-600 text-center mb-5">{pts}</p>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-center">
                  <div className="w-6 h-6 mx-auto mb-1 rounded bg-emerald-100 flex items-center justify-center">
                    <MdCheck size={13} className="text-emerald-600" />
                  </div>
                  <p className="text-emerald-600 font-bold uppercase tracking-wide" style={{ fontSize: "9px" }}>Parejas</p>
                  <p className="text-xl font-bold text-emerald-700 mt-0.5">{encontradas.length}/{nParejas}</p>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-2.5 text-center">
                  <div className="w-6 h-6 mx-auto mb-1 rounded bg-teal-100 flex items-center justify-center">
                    <MdTouchApp size={13} className="text-teal-600" />
                  </div>
                  <p className="text-teal-600 font-bold uppercase tracking-wide" style={{ fontSize: "9px" }}>Movimientos</p>
                  <p className="text-xl font-bold text-teal-700 mt-0.5">{movimientos}</p>
                </div>
                <div className="bg-violet-50 border border-violet-200 rounded-xl p-2.5 text-center">
                  <div className="w-6 h-6 mx-auto mb-1 rounded bg-violet-100 flex items-center justify-center">
                    <FaClock size={12} className="text-violet-600" />
                  </div>
                  <p className="text-violet-600 font-bold uppercase tracking-wide" style={{ fontSize: "9px" }}>Tiempo</p>
                  <p className="text-xl font-bold text-violet-700 mt-0.5">{formatTiempo(tiempoUsado)}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setFase("inicio")}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-2xl font-bold text-lg shadow-md shadow-emerald-500/20 active:scale-95 transition-transform mb-3"
            >
              Jugar de nuevo
            </button>
            <button onClick={() => navigate(-1)} className="text-sm text-slate-400 active:text-slate-600 transition-colors">
              Volver
            </button>
          </div>
        </div>

        <div className="hidden md:flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-sm">
            <h2 className="text-lg font-bold text-slate-700 mb-2">Solo disponible en móvil</h2>
            <p className="text-sm text-slate-500">Este juego está diseñado para dispositivos móviles</p>
          </div>
        </div>
      </>
    );
  }

  // ═══ JUGANDO ═══
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif; }
        h1,h2,h3,h4 { font-family: 'Fredoka', 'Poppins', sans-serif; }
      `}</style>

      <div className="md:hidden min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-b-2xl shadow-sm px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setFase("final")} className="flex items-center gap-1.5 text-slate-400 active:text-emerald-600 transition-colors">
              <MdArrowBack size={18} />
              <span className="text-sm font-bold">Salir</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                <MdCheck size={11} className="text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700">
                  {encontradas.length}/{NIVELES[nivel]?.parejas}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-lg">
                <MdTouchApp size={11} className="text-teal-600" />
                <span className="text-xs font-bold text-teal-700">{movimientos}</span>
              </div>
            </div>
          </div>

          {/* Timer bar */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <FaClock size={14} className="text-slate-500" />
            </div>
            <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${timerColor}`} style={{ width: `${timerPct}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-500 w-10 text-right flex-shrink-0">{formatTiempo(tiempoRestante)}</span>
          </div>
        </div>

        {/* Tablero */}
        <div className="flex-1 px-3 py-4 flex flex-col justify-center">
          <div className={`grid ${cols} gap-2`}>
            {tablero.map((carta) => (
              <Carta
                key={carta.id}
                carta={carta}
                estado={getEstado(carta)}
                voltear={voltear}
                compact={nivel === 3}
              />
            ))}
          </div>
        </div>

        {/* Mezclar */}
        <div className="px-4 pb-5">
          <button
            onClick={() => {
              setTablero((prev) => mezclar(prev));
              setVolteadas([]);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 text-slate-500 font-bold text-sm active:bg-slate-50 transition-all"
          >
            <MdRefresh size={18} /> Mezclar tablero
          </button>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-sm">
          <h2 className="text-lg font-bold text-slate-700 mb-2">Solo disponible en móvil</h2>
          <p className="text-sm text-slate-500">Este juego está diseñado para dispositivos móviles</p>
        </div>
      </div>
    </>
  );
}
