import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Contacto() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50 flex flex-col">
        <Navbar />

        <main className="pt-28 flex flex-1 justify-center items-start p-6 pb-20">
          <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white/60 max-w-6xl w-full relative overflow-hidden">

            {/* Elementos decorativos mejorados */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              {/* Encabezado */}
              <div className="text-center mb-12">
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/30">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
                  Contáctanos
                </h1>
                <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  Estamos aquí para responder tus preguntas y escuchar tus sugerencias
                </p>
              </div>

              {/* Información de contacto */}
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                {/* Email */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start space-x-5">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-4 rounded-2xl flex-shrink-0">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Correo Electrónico</h3>
                      <p className="text-slate-600 mb-4">Escríbenos a nuestra dirección principal</p>
                      <a 
                        href="mailto:calmasoporte2025@gmail.com" 
                        className="text-blue-600 hover:text-blue-700 font-semibold text-base transition-colors inline-flex items-center gap-2 group break-all"
                      >
                        calmasoporte2025@gmail.com
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Soporte */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start space-x-5">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-2xl flex-shrink-0">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Soporte</h3>
                      <p className="text-slate-600 mb-3">Respondemos en menos de 24 horas</p>
                      <div className="flex items-center gap-2 text-slate-700 font-medium">
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
              <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl p-8 md:p-10 border border-slate-200/50">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center flex items-center justify-center gap-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  ¿Prefieres escribirnos directamente?
                </h2>
                
                <div className="grid gap-6">
                  {/* Nombre */}
                  <div>
                    <label className="block text-slate-700 mb-3 font-semibold text-sm">Tu nombre</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="w-full px-4 py-4 pl-12 rounded-2xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        placeholder="Ingresa tu nombre"
                      />
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-slate-700 mb-3 font-semibold text-sm">Tu correo</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        className="w-full px-4 py-4 pl-12 rounded-2xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        placeholder="ejemplo@correo.com"
                      />
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label className="block text-slate-700 mb-3 font-semibold text-sm">Tu mensaje</label>
                    <div className="relative">
                      <textarea 
                        className="w-full px-4 py-4 pl-12 rounded-2xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none h-40 resize-none"
                        placeholder="Escribe tu mensaje aquí..."
                      ></textarea>
                      <svg className="absolute left-4 top-4 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>

                  {/* Botón */}
                  <button className="mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-3 mx-auto group">
                    <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Enviar Mensaje
                  </button>
                </div>
              </div>

              {/* Nota final */}
              <div className="mt-10 bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <p className="text-center text-slate-700 text-sm flex items-center justify-center gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Nos comprometemos a responderte en el menor tiempo posible</span>
                </p>
              </div>

              {/* Información adicional */}
              <div className="mt-8 grid sm:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-2xl bg-white/50 border border-slate-100">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Respuesta rápida</p>
                  <p className="text-xs text-slate-500 mt-1">Menos de 24h</p>
                </div>

                <div className="text-center p-4 rounded-2xl bg-white/50 border border-slate-100">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Equipo dedicado</p>
                  <p className="text-xs text-slate-500 mt-1">Siempre disponible</p>
                </div>

                <div className="text-center p-4 rounded-2xl bg-white/50 border border-slate-100">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-100 to-pink-50 rounded-xl flex items-center justify-center">
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
