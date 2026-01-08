import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Objetivo() {
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-blue-50/50 flex flex-col">
        <Navbar />

        <main className="pt-32 flex flex-1 justify-center items-start p-4 md:p-6 pb-20">
          <div className="bg-white/80 backdrop-blur-xl p-6 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white/60 max-w-6xl w-full relative overflow-hidden">

            {/* Elementos decorativos mejorados */}
            <div className="absolute -top-24 right-10 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-purple-200/15 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              {/* Encabezado */}
              <div className="text-center mb-12">
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="w-32 h-32 md:w-36 md:h-36 rounded-[2rem] bg-gradient-to-br from-pink-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-pink-500/30">
                      <svg className="w-16 h-16 md:w-20 md:h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-500/30">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                  Nuestro Objetivo
                </h1>
                <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  Transformar la forma en que los niños aprenden a leer y pronunciar
                </p>
              </div>

              {/* Sección de Misión Principal */}
              <div className="bg-gradient-to-br from-pink-50/70 to-blue-50/70 rounded-3xl p-6 md:p-10 mb-10 border border-slate-100 shadow-lg shadow-slate-200/50">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/3 flex justify-center">
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-500/10 hover:scale-105 transition-transform duration-300">
                      <svg className="w-28 h-28 md:w-32 md:h-32 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  <div className="md:w-2/3 space-y-5">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Misión Principal</h2>
                    <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                      <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-pink-700">Mejorar la lectura</span> y <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">pronunciación infantil</span> mediante herramientas interactivas, retroalimentación automática y actividades guiadas por Inteligencia Artificial.
                    </p>
                    <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-100">
                      <div className="bg-gradient-to-br from-green-100 to-emerald-50 p-2 rounded-xl">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium">Diseñado para niños de 7 a 10 años</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Características clave */}
              <div className="mb-10">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-4">
                    <span className="text-sm font-semibold text-blue-700">Estrategia</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Cómo lo Logramos</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Card 1 - Interactividad */}
                  <div className="group bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <div className="bg-gradient-to-br from-pink-100 to-pink-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Interactividad</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Juegos y actividades que mantienen el interés del niño
                    </p>
                  </div>

                  {/* Card 2 - IA */}
                  <div className="group bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Inteligencia Artificial</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Retroalimentación automática y personalizada
                    </p>
                  </div>

                  {/* Card 3 - Actividades Guiadas */}
                  <div className="group bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Actividades Guiadas</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Ejercicios paso a paso adaptados al nivel de cada niño
                    </p>
                  </div>
                </div>
              </div>

              {/* Beneficios adicionales */}
              <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl p-6 md:p-10 border border-slate-200/50">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-100 mb-4">
                    <span className="text-sm font-semibold text-purple-700">Resultados</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Beneficios Clave</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Beneficio 1 - Confianza */}
                  <div className="flex items-start gap-5 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-gradient-to-br from-green-100 to-emerald-50 p-4 rounded-2xl flex-shrink-0">
                      <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">Confianza</h4>
                      <p className="text-slate-600 leading-relaxed">Los niños ganan seguridad al leer en voz alta</p>
                    </div>
                  </div>

                  {/* Beneficio 2 - Diversión */}
                  <div className="flex items-start gap-5 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-gradient-to-br from-pink-100 to-rose-50 p-4 rounded-2xl flex-shrink-0">
                      <svg className="w-7 h-7 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">Diversión</h4>
                      <p className="text-slate-600 leading-relaxed">Aprendizaje a través del juego y la exploración</p>
                    </div>
                  </div>

                  {/* Beneficio 3 - Progreso Medible */}
                  <div className="flex items-start gap-5 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-50 p-4 rounded-2xl flex-shrink-0">
                      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">Progreso Medible</h4>
                      <p className="text-slate-600 leading-relaxed">Seguimiento del desarrollo de habilidades</p>
                    </div>
                  </div>

                  {/* Beneficio 4 - Accesibilidad */}
                  <div className="flex items-start gap-5 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-gradient-to-br from-purple-100 to-violet-50 p-4 rounded-2xl flex-shrink-0">
                      <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">Accesibilidad</h4>
                      <p className="text-slate-600 leading-relaxed">Disponible en cualquier momento y lugar</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estadística destacada */}
              <div className="mt-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-center text-white shadow-2xl shadow-blue-500/30">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <div>
                    <div className="text-5xl md:text-6xl font-bold mb-2">7-10</div>
                    <div className="text-blue-100 text-lg">Años de edad</div>
                  </div>
                  <div className="hidden md:block w-px h-20 bg-white/30"></div>
                  <div>
                    <div className="text-5xl md:text-6xl font-bold mb-2">100%</div>
                    <div className="text-blue-100 text-lg">Personalizado</div>
                  </div>
                  <div className="hidden md:block w-px h-20 bg-white/30"></div>
                  <div>
                    <div className="text-5xl md:text-6xl font-bold mb-2">24/7</div>
                    <div className="text-blue-100 text-lg">Disponible</div>
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
