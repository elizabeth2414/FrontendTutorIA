import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Objetivo() {
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-purple-50/30 flex flex-col">
        <Navbar />

        {/* ESPACIADO CORRECTO - pt-24 para móvil, pt-28 para desktop */}
        <main className="pt-24 md:pt-28 flex flex-1 justify-center items-start p-4 md:p-6 pb-10 md:pb-20">
          <div className="bg-white/70 backdrop-blur-xl p-6 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl shadow-xl border border-white/80 max-w-6xl w-full relative overflow-hidden">

            {/* Elementos decorativos suaves */}
            <div className="absolute -top-20 right-10 w-48 h-48 md:w-64 md:h-64 bg-orange-200/15 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-56 h-56 md:w-80 md:h-80 bg-purple-200/15 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 left-1/4 w-40 h-40 md:w-48 md:h-48 bg-emerald-200/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              {/* Encabezado */}
              <div className="text-center mb-10 md:mb-12 animate-fade-in">
                <div className="flex justify-center mb-6 md:mb-8">
                  <div className="relative">
                    <div className="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-2xl md:rounded-3xl bg-gradient-to-br from-orange-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-xl shadow-orange-500/20">
                      <svg className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-3 -right-3 md:-bottom-3 md:-right-3 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4 tracking-tight">
                  Nuestro Objetivo
                </h1>
                <p className="text-slate-600 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4">
                  Transformar la forma en que los niños aprenden a leer y pronunciar
                </p>
              </div>

              {/* Sección de Misión Principal */}
              <div className="bg-gradient-to-br from-orange-50/60 to-purple-50/60 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 mb-8 md:mb-10 border border-slate-100 shadow-lg animate-fade-in stagger-1">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <div className="md:w-1/3 flex justify-center order-2 md:order-1">
                    <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg hover:scale-105 transition-transform duration-300">
                      <svg className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  <div className="md:w-2/3 space-y-4 md:space-y-5 order-1 md:order-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Misión Principal</h2>
                    <p className="text-slate-700 text-sm md:text-base lg:text-lg leading-relaxed">
                      <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Mejorar la lectura</span> y <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-700">pronunciación infantil</span> mediante herramientas interactivas, retroalimentación automática y actividades guiadas por Inteligencia Artificial.
                    </p>
                    <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 border border-slate-100">
                      <div className="bg-gradient-to-br from-emerald-100 to-teal-50 p-2 rounded-lg md:rounded-xl flex-shrink-0">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm md:text-base text-slate-700 font-medium">Diseñado para niños de 7 a 10 años</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Características clave */}
              <div className="mb-8 md:mb-10">
                <div className="text-center mb-8 md:mb-10 animate-fade-in stagger-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-200/50 mb-4">
                    <span className="text-sm font-semibold text-purple-700">Estrategia</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Cómo lo Logramos</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Card 1 - Interactividad */}
                  <div className="group bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in stagger-1">
                    <div className="bg-gradient-to-br from-orange-100 to-amber-50 w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3">Interactividad</h3>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                      Juegos y actividades que mantienen el interés del niño
                    </p>
                  </div>

                  {/* Card 2 - IA */}
                  <div className="group bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in stagger-2">
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-50 w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3">Inteligencia Artificial</h3>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                      Retroalimentación automática y personalizada
                    </p>
                  </div>

                  {/* Card 3 - Actividades Guiadas */}
                  <div className="group bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 sm:col-span-2 lg:col-span-1 animate-fade-in stagger-3">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-50 w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3">Actividades Guiadas</h3>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                      Ejercicios paso a paso adaptados al nivel de cada niño
                    </p>
                  </div>
                </div>
              </div>

              {/* Beneficios adicionales */}
              <div className="bg-gradient-to-br from-emerald-50/40 to-purple-50/40 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-200/50 animate-fade-in stagger-3">
                <div className="text-center mb-8 md:mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-200/50 mb-4">
                    <span className="text-sm font-semibold text-emerald-700">Resultados</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Beneficios Clave</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                  {/* Beneficio 1 - Confianza */}
                  <div className="flex items-start gap-4 md:gap-5 bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-50 p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0">
                      <svg className="w-6 h-6 md:w-7 md:h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-bold text-slate-900 mb-1 md:mb-2">Confianza</h4>
                      <p className="text-sm md:text-base text-slate-600 leading-relaxed">Los niños ganan seguridad al leer en voz alta</p>
                    </div>
                  </div>

                  {/* Beneficio 2 - Diversión */}
                  <div className="flex items-start gap-4 md:gap-5 bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-gradient-to-br from-orange-100 to-amber-50 p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0">
                      <svg className="w-6 h-6 md:w-7 md:h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-bold text-slate-900 mb-1 md:mb-2">Diversión</h4>
                      <p className="text-sm md:text-base text-slate-600 leading-relaxed">Aprendizaje a través del juego y la exploración</p>
                    </div>
                  </div>

                  {/* Beneficio 3 - Progreso Medible */}
                  <div className="flex items-start gap-4 md:gap-5 bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0">
                      <svg className="w-6 h-6 md:w-7 md:h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-bold text-slate-900 mb-1 md:mb-2">Progreso Medible</h4>
                      <p className="text-sm md:text-base text-slate-600 leading-relaxed">Seguimiento del desarrollo de habilidades</p>
                    </div>
                  </div>

                  {/* Beneficio 4 - Accesibilidad */}
                  <div className="flex items-start gap-4 md:gap-5 bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-gradient-to-br from-teal-100 to-cyan-50 p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0">
                      <svg className="w-6 h-6 md:w-7 md:h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-bold text-slate-900 mb-1 md:mb-2">Accesibilidad</h4>
                      <p className="text-sm md:text-base text-slate-600 leading-relaxed">Disponible en cualquier momento y lugar</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estadística destacada */}
              <div className="mt-8 md:mt-10 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-center text-white shadow-xl shadow-orange-500/20">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
                  <div>
                    <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-1 md:mb-2">7-10</div>
                    <div className="text-orange-100 text-sm md:text-base lg:text-lg">Años de edad</div>
                  </div>
                  <div className="hidden sm:block w-px h-16 md:h-20 bg-white/30"></div>
                  <div>
                    <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-1 md:mb-2">100%</div>
                    <div className="text-orange-100 text-sm md:text-base lg:text-lg">Personalizado</div>
                  </div>
                  <div className="hidden sm:block w-px h-16 md:h-20 bg-white/30"></div>
                  <div>
                    <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-1 md:mb-2">24/7</div>
                    <div className="text-orange-100 text-sm md:text-base lg:text-lg">Disponible</div>
                  </div>
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
