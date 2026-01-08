import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function SobreNosotros() {
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex flex-col">
        <Navbar />

        <main className="pt-32 flex flex-1 justify-center items-start p-4 md:p-6 pb-20">
          <div className="bg-white/80 backdrop-blur-xl p-6 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white/60 max-w-6xl w-full relative overflow-hidden">

            {/* Elementos decorativos mejorados */}
            <div className="absolute -top-24 left-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-purple-200/15 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              {/* Encabezado */}
              <div className="text-center mb-12">
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="w-36 h-36 md:w-40 md:h-40 rounded-[2rem] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                      <svg className="w-20 h-20 md:w-24 md:h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-500/30 border-4 border-white">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                  Sobre Nosotros
                </h1>
                <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  Transformando el aprendizaje infantil con tecnología innovadora
                </p>
              </div>

              {/* Sección de presentación */}
              <div className="bg-gradient-to-br from-blue-50/70 to-pink-50/70 rounded-3xl p-6 md:p-10 mb-10 border border-slate-100 shadow-lg shadow-slate-200/50">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-2/3 space-y-5">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Nuestra Historia</h2>
                    <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                      <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-700">ReadSmartIA</span> nació de una visión simple pero poderosa: 
                      utilizar la tecnología para hacer el aprendizaje de la lectura más accesible, 
                      efectivo y divertido para todos los niños.
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      Combinamos lo mejor de la <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">pedagogía moderna</span>, 
                      el <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-pink-700">diseño centrado en niños</span> y la 
                      <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-700"> inteligencia artificial</span> para crear 
                      una experiencia de aprendizaje única.
                    </p>
                  </div>
                  <div className="md:w-1/3 flex justify-center">
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-500/10 hover:scale-105 transition-transform duration-300">
                      <svg className="w-32 h-32 md:w-36 md:h-36 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nuestros valores */}
              <div className="mb-10">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-100 mb-4">
                    <span className="text-sm font-semibold text-purple-700">Principios</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Nuestros Valores</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Valor 1 - Innovación */}
                  <div className="group bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Innovación Continua</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Siempre buscamos nuevas formas de mejorar la experiencia de aprendizaje
                    </p>
                  </div>

                  {/* Valor 2 - Educación Accesible */}
                  <div className="group bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <div className="bg-gradient-to-br from-purple-100 to-violet-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Educación Accesible</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Creemos que todos los niños merecen las mejores herramientas educativas
                    </p>
                  </div>

                  {/* Valor 3 - Aprendizaje Divertido */}
                  <div className="group bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                    <div className="bg-gradient-to-br from-pink-100 to-rose-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Aprendizaje Divertido</h3>
                    <p className="text-slate-600 leading-relaxed">
                      El juego es fundamental para el desarrollo y aprendizaje infantil
                    </p>
                  </div>
                </div>
              </div>

              {/* Equipo y tecnología */}
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                {/* Nuestro Equipo */}
                <div className="bg-gradient-to-br from-blue-50/70 to-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-lg shadow-slate-200/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-50 p-3 rounded-2xl">
                      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">Nuestro Equipo</h3>
                  </div>
                  
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Un equipo multidisciplinario de educadores, diseñadores, desarrolladores 
                    y especialistas en IA trabajando juntos para crear la mejor experiencia.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", text: "Pedagogos especializados", color: "blue" },
                      { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", text: "Expertos en desarrollo infantil", color: "purple" },
                      { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", text: "Ingenieros en IA y machine learning", color: "pink" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className={`bg-gradient-to-br from-${item.color}-100 to-${item.color}-50 p-2 rounded-xl mr-4 flex-shrink-0`}>
                          <svg className={`w-5 h-5 text-${item.color}-600`} fill="currentColor" viewBox="0 0 24 24">
                            <path d={item.icon} />
                          </svg>
                        </div>
                        <p className="text-slate-700 font-medium">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nuestra Tecnología */}
                <div className="bg-gradient-to-br from-purple-50/70 to-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-lg shadow-slate-200/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-br from-purple-100 to-violet-50 p-3 rounded-2xl">
                      <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">Nuestra Tecnología</h3>
                  </div>
                  
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Utilizamos algoritmos de inteligencia artificial avanzados para 
                    personalizar el aprendizaje según las necesidades de cada niño.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { title: "Reconocimiento de Voz", color: "from-blue-500 to-indigo-600" },
                      { title: "Análisis de Progreso", color: "from-purple-500 to-violet-600" },
                      { title: "Adaptación Dinámica", color: "from-pink-500 to-rose-600" },
                      { title: "Feedback en Tiempo Real", color: "from-emerald-500 to-green-600" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <p className={`font-bold text-sm md:text-base text-transparent bg-clip-text bg-gradient-to-r ${item.color}`}>
                          {item.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compromiso */}
              <div className="bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 rounded-3xl p-8 md:p-10 border border-slate-200/50">
                <div className="text-center space-y-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100 mb-4">
                      <span className="text-sm font-semibold text-indigo-700">Compromiso</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Nuestra Promesa</h2>
                    <p className="text-slate-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
                      Estamos comprometidos a crear herramientas educativas que no solo enseñen, 
                      sino que inspiren el amor por el aprendizaje en cada niño.
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/30 inline-flex items-center gap-3 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 hover:scale-105 transition-all duration-300 cursor-pointer">
                      <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-bold text-lg">Educación de calidad para todos</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="mt-10 grid sm:grid-cols-3 gap-6">
                {[
                  { number: "2025", label: "Año de fundación", color: "from-blue-500 to-indigo-600" },
                  { number: "100%", label: "Compromiso con IA", color: "from-purple-500 to-violet-600" },
                  { number: "24/7", label: "Soporte disponible", color: "from-pink-500 to-rose-600" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-6 text-center shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className={`text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                      {stat.number}
                    </div>
                    <div className="text-slate-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
