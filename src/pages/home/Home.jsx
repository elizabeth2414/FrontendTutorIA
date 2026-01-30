import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// ✅ Opción 1: Importar imágenes para que Vite las incluya en dist (funciona en Capacitor)
import profeImg from "../../assets/images/profeenseñando.png";
import ninoImg from "../../assets/images/niñonocomprende.png";
import padresImg from "../../assets/images/padresenseñando.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-orange-50/20 flex flex-col">
      {/* Fuentes y animaciones */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Fredoka:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Fredoka', 'Poppins', sans-serif;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.8s ease-out forwards;
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }

        /* Hover suave para imágenes */
        .hover-lift {
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
      `}</style>

      {/* NAVBAR FIJO */}
      <Navbar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 pt-24 flex flex-col items-center px-4 pb-10 md:px-6">

        {/* HERO SECTION CON IMAGEN DE PROFESORA */}
        <section className="w-full max-w-7xl mt-6 md:mt-10">
          <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl md:rounded-[2.5rem] shadow-xl border border-white/80 p-6 md:p-14 overflow-hidden">
            
            {/* Elementos decorativos sutiles */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              
              {/* Texto principal */}
              <div className="space-y-6 animate-slide-in-left">
                
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-200/50">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-semibold text-emerald-700">BookiSmartIA</span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
                  Aprende a leer de manera
                  <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600">
                    inteligente y divertida
                  </span>
                </h1>
                
                <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-xl">
                  <span className="font-semibold text-emerald-600">BookiSmartIA</span> transforma el aprendizaje de la lectura con retroalimentación automática, ejercicios interactivos y seguimiento personalizado.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="group px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Comenzar Ahora
                  </button>
                  <button
                    onClick={() => navigate("/register-padre")}
                    className="px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-semibold hover:border-emerald-300 hover:bg-emerald-50/50 hover:scale-[1.02] transition-all duration-300"
                  >
                    Crear Cuenta Gratis
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-4 text-xs md:text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Sin tarjeta requerida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Plan gratuito disponible</span>
                  </div>
                </div>
              </div>

              {/* Imagen de profesora con niños */}
              <div className="flex justify-center lg:justify-end animate-slide-in-right">
                <div className="relative w-full max-w-lg">
                  <img
                    src={profeImg}
                    alt="Maestra enseñando con BookiSmartIA"
                    className="w-full h-auto rounded-2xl md:rounded-3xl shadow-2xl hover-lift"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN DEL PROBLEMA (niño confundido) */}
        <section className="w-full max-w-7xl mt-16 md:mt-24">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl md:rounded-[2.5rem] shadow-xl border border-white/80 p-6 md:p-12 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              
              {/* Imagen del niño confundido - primero en móvil */}
              <div className="flex justify-center order-1 lg:order-1 animate-scale-in">
                <div className="relative w-full max-w-md">
                  <img
                    src={ninoImg}
                    alt="Niño con dificultades en la lectura"
                    className="w-full h-auto rounded-2xl md:rounded-3xl shadow-2xl hover-lift"
                  />
                </div>
              </div>

              {/* Texto del problema */}
              <div className="space-y-6 order-2 lg:order-2 animate-fade-in-up stagger-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full border border-orange-200/50">
                  <span className="text-sm font-semibold text-orange-700">El Desafío</span>
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                  ¿Tu hijo tiene dificultades con la lectura?
                </h2>
                
                <div className="space-y-4 text-slate-600">
                  <p className="flex items-start gap-3">
                    <span className="text-orange-500 text-xl flex-shrink-0">•</span>
                    <span>Muchos niños de 7-10 años luchan con la comprensión lectora</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-orange-500 text-xl flex-shrink-0">•</span>
                    <span>La retroalimentación tradicional es lenta y poco personalizada</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-orange-500 text-xl flex-shrink-0">•</span>
                    <span>Los padres no siempre tienen tiempo de practicar todos los días</span>
                  </p>
                </div>

                <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-xl p-4 md:p-6">
                  <p className="text-slate-700 font-medium">
                    <span className="text-emerald-600 font-bold">BookiSmartIA</span> soluciona esto con inteligencia artificial que ofrece retroalimentación instantánea y ejercicios adaptados al nivel de cada niño.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="w-full max-w-7xl mt-16 md:mt-24">
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-200/50 mb-6">
              <span className="text-sm font-semibold text-purple-700">Proceso Simple</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Así funciona <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">BookiSmartIA</span>
            </h2>
            <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
              Cuatro pasos diseñados para maximizar el aprendizaje
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { 
                icon: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z",
                title: "Escucha", 
                desc: "Oye la lectura narrada correctamente",
                color: "from-emerald-400 to-teal-500",
                bg: "bg-emerald-50"
              },
              { 
                icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                title: "Lee", 
                desc: "Practica tu lectura en voz alta",
                color: "from-purple-400 to-pink-500",
                bg: "bg-purple-50"
              },
              { 
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Recibe Feedback", 
                desc: "Correcciones automáticas de la IA",
                color: "from-green-400 to-emerald-500",
                bg: "bg-green-50"
              },
              { 
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
                title: "Mejora", 
                desc: "Practica áreas de oportunidad",
                color: "from-orange-400 to-amber-500",
                bg: "bg-orange-50"
              }
            ].map((step, idx) => (
              <div 
                key={idx} 
                className={`group relative bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 animate-fade-in-up stagger-${idx + 1}`}
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-xl md:rounded-2xl ${step.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <svg className={`w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br ${step.color} bg-clip-text text-transparent`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                  </svg>
                </div>
                <div className="text-center space-y-2 md:space-y-3">
                  <div className={`inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full text-white font-bold text-sm bg-gradient-to-br ${step.color} shadow-md`}>
                    {idx + 1}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN DE ROLES CON FAMILIA */}
        <section className="w-full max-w-7xl mt-16 md:mt-24">
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-200/50 mb-6">
              <span className="text-sm font-semibold text-indigo-700">Para Todos</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              ¿Quién usa BookiSmartIA?
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              Diseñado para cada parte del proceso educativo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                title: "Estudiante", 
                desc: "Practico lecturas interactivas y la IA me ayuda a mejorar mi pronunciación con ejercicios personalizados.",
                color: "from-emerald-400 to-teal-500",
                accent: "bg-emerald-500"
              },
              { 
                icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222",
                title: "Docente", 
                desc: "Asigno lecturas, analizo reportes detallados y doy seguimiento al progreso de cada estudiante en tiempo real.",
                color: "from-purple-400 to-pink-500",
                accent: "bg-purple-500"
              },
              { 
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 0 014 0z",
                title: "Representante", 
                desc: "Acompaño el aprendizaje de mi hijo, reviso sus avances y me mantengo informado de su progreso.",
                color: "from-pink-400 to-rose-500",
                accent: "bg-pink-500"
              }
            ].map((role, idx) => (
              <div 
                key={idx} 
                className={`group relative bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden animate-fade-in-up stagger-${idx + 1}`}
              >
                {/* Barra de acento */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role.color}`}></div>
                
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d={role.icon} />
                  </svg>
                </div>
                
                <h3 className={`text-xl md:text-2xl font-bold mb-3 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r ${role.color}`}>
                  {role.title}
                </h3>
                
                <p className="text-sm md:text-base text-slate-600 mb-6 md:mb-8 leading-relaxed">
                  {role.desc}
                </p>
                
                <button
                  onClick={() => navigate(`/register-${role.title.toLowerCase()}`)}
                  className={`w-full py-3 md:py-3.5 rounded-xl md:rounded-2xl bg-gradient-to-r ${role.color} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
                >
                  Registro para {role.title}
                </button>
              </div>
            ))}
          </div>

          {/* Imagen de familia debajo */}
          <div className="mt-12 md:mt-16 flex justify-center animate-scale-in stagger-4">
            <div className="relative w-full max-w-3xl">
              <img
                src={padresImg}
                alt="Familia usando BookiSmartIA"
                className="w-full h-auto rounded-2xl md:rounded-3xl shadow-2xl hover-lift"
              />
            </div>
          </div>
        </section>

        {/* DESCARGA LA APP - SECCIÓN QR */}
        <section className="w-full max-w-5xl mt-16 md:mt-24">
          <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl md:rounded-3xl p-8 md:p-12 border border-emerald-200/50 overflow-hidden animate-fade-in-up">
            
            <div className="relative z-10 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-emerald-200/50 mb-4">
                <span className="text-sm font-semibold text-emerald-700">Disponible en Google Play</span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Descarga BookiSmartIA
              </h2>
              
              <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
                Escanea el código QR o descarga desde Play Store
              </p>

              {/* ESPACIO PARA CÓDIGO QR */}
              <div className="flex flex-col items-center gap-6 pt-6">
                
                {/* Contenedor del QR - Aquí pegarás tu código QR */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-emerald-200/50">
                  <div className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <div className="text-center text-slate-400">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      <p className="text-sm font-medium">Tu código QR aquí</p>
                      <p className="text-xs mt-1">Pega el código del Play Store</p>
                    </div>
                  </div>
                </div>

                {/* Botón alternativo */}
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <button
                    onClick={() => window.open('https://play.google.com/store', '_blank')}
                    className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    <span className="font-semibold">Descargar en Play Store</span>
                  </button>

                  <p className="text-slate-500 text-sm">
                    o escanea el código QR
                  </p>
                </div>
              </div>

              <p className="text-slate-500 text-sm pt-4">
                📱 Compatible con Android 6.0 o superior
              </p>
            </div>
          </div>
        </section>

        {/* LLAMADO A LA ACCIÓN FINAL */}
        <section className="w-full max-w-5xl mt-16 md:mt-24 text-center">
          <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 text-white shadow-2xl shadow-emerald-500/20 overflow-hidden">
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                ¿Listo para transformar la<br className="hidden sm:block" /> experiencia de aprendizaje?
              </h2>
              
              <p className="text-emerald-50 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
                Únete a miles de estudiantes, docentes y padres que ya están usando BookiSmartIA
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                  onClick={() => navigate("/register-padre")}
                  className="px-6 md:px-8 py-3 md:py-4 bg-white text-emerald-700 font-semibold rounded-xl md:rounded-2xl hover:bg-emerald-50 hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
                >
                  Comenzar Gratis
                </button>
                <button
                  onClick={() => navigate("/sobre-nosotros")}
                  className="px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-xl md:rounded-2xl hover:bg-white/20 hover:scale-105 transition-all"
                >
                  Conocer Más
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
