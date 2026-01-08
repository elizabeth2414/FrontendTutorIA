import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex flex-col">
      {/* Añadir fuentes de Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>

      {/* NAVBAR FIJO */}
      <Navbar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 pt-24 flex flex-col items-center px-4 pb-10 md:px-6">

        {/* HERO SECTION */}
        <section className="w-full max-w-7xl mt-6 md:mt-10">
          <div className="relative bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-500/10 border border-white/60 p-8 md:p-14 overflow-hidden">
            
            {/* Elementos decorativos mejorados */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse-glow"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1.5s'}}></div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Texto principal */}
              <div className="space-y-6">
                
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-semibold text-blue-700">Aprendizaje con IA</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                  Aprende a leer de manera
                  <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                    inteligente y divertida
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
                  <span className="font-semibold text-blue-600">ReadSmartIA</span> transforma el aprendizaje de la lectura con retroalimentación automática, ejercicios interactivos y seguimiento personalizado.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Comenzar Ahora
                  </button>
                  <button
                    onClick={() => navigate("/register-padre")}
                    className="px-8 py-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-semibold hover:border-blue-300 hover:bg-blue-50/50 hover:scale-[1.02] transition-all duration-300"
                  >
                    Crear Cuenta Gratis
                  </button>
                </div>

                <div className="flex items-center gap-6 pt-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Sin tarjeta requerida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Plan gratuito disponible</span>
                  </div>
                </div>
              </div>

              {/* Imagen hero mejorada */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative animate-float">
                  <div className="w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-[3rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-6 hover:rotate-3 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-[3rem]"></div>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/3135/3135765.png"
                      alt="Niños aprendiendo con tecnología"
                      className="w-56 h-56 md:w-72 md:h-72 relative z-10 drop-shadow-2xl"
                    />
                  </div>
                  {/* Elementos flotantes mejorados */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/20 hover:scale-110 transition-transform duration-300">
                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Meta" className="w-12 h-12" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl flex items-center justify-center shadow-xl shadow-pink-500/20 hover:scale-110 transition-transform duration-300">
                    <img src="https://cdn-icons-png.flaticon.com/512/3069/3069945.png" alt="Estrella" className="w-10 h-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="w-full max-w-7xl mt-20 md:mt-28">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-100 mb-6">
              <span className="text-sm font-semibold text-purple-700">Proceso Simple</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Así funciona <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">ReadSmartIA</span>
            </h2>
            <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
              Cuatro pasos diseñados para maximizar el aprendizaje
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z",
                title: "Escucha", 
                desc: "Oye la lectura narrada correctamente",
                color: "from-blue-500 to-indigo-500",
                bg: "bg-blue-50"
              },
              { 
                icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                title: "Lee", 
                desc: "Practica tu lectura en voz alta",
                color: "from-purple-500 to-pink-500",
                bg: "bg-purple-50"
              },
              { 
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Recibe Feedback", 
                desc: "Correcciones automáticas de la IA",
                color: "from-green-500 to-emerald-500",
                bg: "bg-green-50"
              },
              { 
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
                title: "Mejora", 
                desc: "Practica áreas de oportunidad",
                color: "from-orange-500 to-red-500",
                bg: "bg-orange-50"
              }
            ].map((step, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500"
                style={{animationDelay: `${idx * 100}ms`}}
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${step.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <svg className={`w-8 h-8 bg-gradient-to-br ${step.color} bg-clip-text text-transparent`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                  </svg>
                </div>
                <div className="text-center space-y-3">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-sm bg-gradient-to-br ${step.color} shadow-lg`}>
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN DE ROLES */}
        <section className="w-full max-w-7xl mt-20 md:mt-28">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100 mb-6">
              <span className="text-sm font-semibold text-indigo-700">Para Todos</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              ¿Quién usa ReadSmartIA?
            </h2>
            <p className="text-slate-600 text-lg md:text-xl">
              Diseñado para cada parte del proceso educativo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                title: "Estudiante", 
                desc: "Practico lecturas interactivas y la IA me ayuda a mejorar mi pronunciación con ejercicios personalizados.",
                color: "from-blue-500 to-indigo-600",
                bg: "blue",
                accent: "bg-blue-500"
              },
              { 
                icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222",
                title: "Docente", 
                desc: "Asigno lecturas, analizo reportes detallados y doy seguimiento al progreso de cada estudiante en tiempo real.",
                color: "from-purple-500 to-pink-600",
                bg: "purple",
                accent: "bg-purple-500"
              },
              { 
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                title: "Representante", 
                desc: "Acompaño el aprendizaje de mi hijo, reviso sus avances y me mantengo informado de su progreso.",
                color: "from-pink-500 to-rose-600",
                bg: "pink",
                accent: "bg-pink-500"
              }
            ].map((role, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-3 overflow-hidden"
              >
                {/* Gradient accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role.color}`}></div>
                
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d={role.icon} />
                  </svg>
                </div>
                
                <h3 className={`text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r ${role.color}`}>
                  {role.title}
                </h3>
                
                <p className="text-slate-600 mb-8 leading-relaxed">
                  {role.desc}
                </p>
                
                <button
                  onClick={() => navigate(`/register-${role.title.toLowerCase()}`)}
                  className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${role.color} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
                >
                  Registro para {role.title}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* BENEFICIOS */}
        <section className="w-full max-w-7xl mt-20 md:mt-28">
          <div className="relative bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 rounded-[2.5rem] p-10 md:p-16 border border-white/60 overflow-hidden">
            
            {/* Elementos de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-6">
                    <span className="text-sm font-semibold text-blue-700">Ventajas Únicas</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                    Beneficios de aprender con <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Inteligencia Artificial</span>
                  </h2>
                </div>
                
                <div className="space-y-5">
                  {[
                    { 
                      icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
                      text: "Aprendizaje personalizado que se adapta al ritmo de cada niño",
                      color: "from-blue-500 to-indigo-500"
                    },
                    { 
                      icon: "M13 10V3L4 14h7v7l9-11h-7z",
                      text: "Retroalimentación inmediata y constructiva",
                      color: "from-purple-500 to-pink-500"
                    },
                    { 
                      icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                      text: "Métodos interactivos que mantienen la motivación",
                      color: "from-green-500 to-emerald-500"
                    },
                    { 
                      icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
                      text: "Accesible desde cualquier dispositivo, en cualquier momento",
                      color: "from-orange-500 to-red-500"
                    }
                  ].map((benefit, idx) => (
                    <div 
                      key={idx} 
                      className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/70 transition-all duration-300"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                        </svg>
                      </div>
                      <p className="text-slate-700 text-lg leading-relaxed pt-2">
                        {benefit.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-[3rem] blur-2xl"></div>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/8370/8370847.png"
                    alt="Beneficios de la educación con IA"
                    className="relative w-72 h-72 md:w-96 md:h-96 drop-shadow-2xl animate-float"
                  />
                  <div className="absolute -bottom-8 -right-8 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-6 shadow-2xl shadow-orange-500/20 hover:scale-110 transition-transform duration-300">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">+95%</div>
                      <div className="text-slate-600 text-sm font-medium mt-1">Mejora en<br/>pronunciación</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LLAMADO A LA ACCIÓN FINAL */}
        <section className="w-full max-w-5xl mt-20 md:mt-28 text-center">
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[2.5rem] p-12 md:p-16 text-white shadow-2xl shadow-blue-500/30 overflow-hidden">
            
            {/* Efectos de fondo */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                ¿Listo para transformar la<br className="hidden sm:block" /> experiencia de aprendizaje?
              </h2>
              
              <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Únete a miles de estudiantes, docentes y padres que ya están usando ReadSmartIA
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                  onClick={() => navigate("/register-padre")}
                  className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-2xl hover:bg-blue-50 hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
                >
                  Comenzar Gratis
                </button>
                <button
                  onClick={() => navigate("/sobre-nosotros")}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/20 hover:scale-105 transition-all"
                >
                  Conocer Más
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-8 pt-6 text-blue-100 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Sin tarjeta requerida</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Plan gratuito disponible</span>
                </div>
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
