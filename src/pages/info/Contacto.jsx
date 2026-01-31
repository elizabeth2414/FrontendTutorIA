import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Contacto() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Fredoka', 'Poppins', sans-serif;
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

        .animate-fade-in {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-purple-50/30 flex flex-col">
        <Navbar />

        {/* ESPACIADO CORRECTO - pt-24 para móvil, pt-28 para desktop */}
        <main className="pt-24 md:pt-28 flex flex-1 justify-center items-start p-4 md:p-6 pb-10 md:pb-20">
          <div className="bg-white/70 backdrop-blur-xl p-6 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl shadow-xl border border-white/80 max-w-6xl w-full relative overflow-hidden">

            {/* Elementos decorativos suaves */}
            <div className="absolute -top-20 -left-20 w-48 h-48 md:w-64 md:h-64 bg-teal-200/15 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-56 h-56 md:w-80 md:h-80 bg-purple-200/15 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-cyan-200/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              {/* Encabezado */}
              <div className="text-center mb-10 md:mb-12 animate-fade-in">
                <div className="flex justify-center mb-6 md:mb-8">
                  <div className="relative">
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl md:rounded-3xl bg-gradient-to-br from-teal-400 via-cyan-500 to-teal-500 flex items-center justify-center shadow-xl shadow-teal-500/20">
                      <svg className="w-14 h-14 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-3 -right-3 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4 tracking-tight">
                  Contáctanos
                </h1>
                <p className="text-slate-600 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4">
                  Estamos aquí para responder tus preguntas y escuchar tus sugerencias
                </p>
              </div>

              {/* Información de contacto */}
              <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10 animate-fade-in stagger-1">
                {/* Email */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start space-x-4 md:space-x-5">
                    <div className="bg-gradient-to-br from-teal-100 to-cyan-50 p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0">
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">Correo Electrónico</h3>
                      <p className="text-sm md:text-base text-slate-600 mb-3 md:mb-4">Escríbenos a nuestra dirección principal</p>
                      <a 
                        href="mailto:calmasoporte2025@gmail.com" 
                        className="text-teal-600 hover:text-teal-700 font-semibold text-sm md:text-base transition-colors inline-flex items-center gap-2 group break-all"
                      >
                        mariuxi.calle.est@tecazuay.edu.ec, carmen.neria.est@tecazuay.edu.ec
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Soporte */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start space-x-4 md:space-x-5">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0">
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">Soporte</h3>
                      <p className="text-sm md:text-base text-slate-600 mb-3">Respondemos en menos de 24 horas</p>
                      <div className="flex items-center gap-2 text-sm md:text-base text-slate-700 font-medium">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Lun - Vie: 9:00 - 18:00
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulario de contacto */}
              <div className="bg-gradient-to-br from-teal-50/40 to-purple-50/40 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-200/50 animate-fade-in stagger-2">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-6 md:mb-8 text-center flex items-center justify-center gap-3">
                  <svg className="w-7 h-7 md:w-8 md:h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  ¿Prefieres escribirnos directamente?
                </h2>
                
                <div className="grid gap-5 md:gap-6">
                  {/* Nombre */}
                  <div>
                    <label className="block text-slate-700 mb-2 md:mb-3 font-semibold text-sm">Tu nombre</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 md:py-4 pl-11 md:pl-12 rounded-xl md:rounded-2xl border-2 border-slate-200 bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none text-sm md:text-base"
                        placeholder="Ingresa tu nombre"
                      />
                      <svg className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-slate-700 mb-2 md:mb-3 font-semibold text-sm">Tu correo</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        className="w-full px-4 py-3 md:py-4 pl-11 md:pl-12 rounded-xl md:rounded-2xl border-2 border-slate-200 bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none text-sm md:text-base"
                        placeholder="ejemplo@correo.com"
                      />
                      <svg className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label className="block text-slate-700 mb-2 md:mb-3 font-semibold text-sm">Tu mensaje</label>
                    <div className="relative">
                      <textarea 
                        className="w-full px-4 py-3 md:py-4 pl-11 md:pl-12 rounded-xl md:rounded-2xl border-2 border-slate-200 bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none h-32 md:h-40 resize-none text-sm md:text-base"
                        placeholder="Escribe tu mensaje aquí..."
                      ></textarea>
                      <svg className="absolute left-3 md:left-4 top-3 md:top-4 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>

                  {/* Botón */}
                  <button className="mt-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl hover:from-teal-600 hover:via-cyan-600 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3 mx-auto group">
                    <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span className="text-sm md:text-base">Enviar Mensaje</span>
                  </button>
                </div>
              </div>

              {/* Nota final */}
              <div className="mt-8 md:mt-10 bg-teal-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-teal-200/50 animate-fade-in stagger-3">
                <p className="text-center text-slate-700 text-xs md:text-sm flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3">
                  <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Nos comprometemos a responderte en el menor tiempo posible</span>
                </p>
              </div>

              {/* Información adicional */}
              <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl md:rounded-2xl bg-white/50 border border-slate-100">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Respuesta rápida</p>
                  <p className="text-xs text-slate-500 mt-1">Menos de 24h</p>
                </div>

                <div className="text-center p-4 rounded-xl md:rounded-2xl bg-white/50 border border-slate-100">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-teal-100 to-cyan-50 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Equipo dedicado</p>
                  <p className="text-xs text-slate-500 mt-1">Siempre disponible</p>
                </div>

                <div className="text-center p-4 rounded-xl md:rounded-2xl bg-white/50 border border-slate-100 sm:col-span-1">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">100% Satisfacción</p>
                  <p className="text-xs text-slate-500 mt-1">Garantizada</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
