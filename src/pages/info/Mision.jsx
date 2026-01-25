import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Mision() {
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/30 flex flex-col">
        <Navbar />

        {/* ESPACIADO CORRECTO - pt-24 para móvil, pt-28 para desktop */}
        <main className="pt-24 md:pt-28 flex flex-1 justify-center items-start p-4 md:p-6 pb-10 md:pb-20">
          <div className="bg-white/70 backdrop-blur-xl p-6 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl shadow-xl border border-white/80 max-w-6xl w-full relative overflow-hidden">

            {/* Elementos decorativos suaves */}
            <div className="absolute -top-20 right-10 w-48 h-48 md:w-64 md:h-64 bg-emerald-200/15 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-56 h-56 md:w-80 md:h-80 bg-teal-200/15 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 left-1/4 w-40 h-40 md:w-48 md:h-48 bg-cyan-200/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              {/* Encabezado */}
              <div className="text-center mb-10 md:mb-12 animate-fade-in">
                <div className="flex justify-center mb-6 md:mb-8">
                  <div className="relative">
                    <div className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-2xl md:rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-500/20">
                      <svg className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 border-3 md:border-4 border-white">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4 tracking-tight">
                  Nuestra Misión
                </h1>
                <p className="text-slate-600 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4">
                  Revolucionar la educación infantil a través de la tecnología personalizada
                </p>
              </div>

              {/* Declaración de misión principal */}
              <div className="bg-gradient-to-br from-emerald-50/60 to-teal-50/60 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 mb-8 md:mb-10 border border-slate-100 shadow-lg animate-fade-in stagger-1">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <div className="md:w-2/3 space-y-4 md:space-y-5">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Nuestro Propósito Fundamental</h2>
                    <p className="text-slate-700 text-sm md:text-base lg:text-lg leading-relaxed">
                      <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Facilitar el aprendizaje infantil</span> mediante 
                      Inteligencia Artificial, ofreciendo experiencias personalizadas, seguras y motivadoras 
                      tanto para estudiantes como para docentes.
                    </p>
                    <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                      Buscamos eliminar las barreras en el aprendizaje de la lectura y crear un entorno 
                      donde cada niño pueda desarrollar sus habilidades al máximo potencial.
                    </p>
                  </div>
                  <div className="md:w-1/3 flex justify-center">
                    <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg hover:scale-105 transition-transform duration-300">
                      <svg className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pilares de nuestra misión */}
              <div className="mb-8 md:mb-10">
                <div className="text-center mb-8 md:mb-10 animate-fade-in stagger-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-200/50 mb-4">
                    <span className="text-sm font-semibold text-emerald-700">Fundamentos</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Los Tres Pilares de Nuestra Misión</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Pilar 1 - Aprendizaje Personalizado */}
                  <div className="group bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in stagger-1">
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-50 w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3">Aprendizaje Personalizado</h3>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                      Adaptamos cada lección al ritmo, estilo y necesidades individuales de cada niño
                    </p>
                  </div>

                  {/* Pilar 2 - Entorno Seguro */}
                  <div className="group bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in stagger-2">
                    <div className="bg-gradient-to-br from-teal-100 to-cyan-50 w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3">Entorno Seguro</h3>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                      Creamos espacios digitales protegidos donde los niños pueden aprender sin riesgos
                    </p>
                  </div>

                  {/* Pilar 3 - Motivación Constante */}
                  <div className="group bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 sm:col-span-2 lg:col-span-1 animate-fade-in stagger-3">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-50 w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3">Motivación Constante</h3>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                      Diseñamos experiencias que mantienen el interés y la curiosidad por aprender
                    </p>
                  </div>
                </div>
              </div>

              {/* Impacto y alcance */}
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
                {/* Nuestro Impacto */}
                <div className="bg-gradient-to-br from-emerald-50/60 to-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-slate-100 shadow-lg animate-fade-in stagger-1">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-50 p-2.5 md:p-3 rounded-xl md:rounded-2xl">
                      <svg className="w-6 h-6 md:w-7 md:h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">Nuestro Impacto</h3>
                  </div>
                  
                  <p className="text-sm md:text-base text-slate-600 mb-4 md:mb-6 leading-relaxed">
                    Transformamos la manera en que los niños interactúan con el aprendizaje, 
                    haciendo que cada logro sea reconocido y celebrado.
                  </p>
                  
                  <div className="space-y-3 md:space-y-4">
                    {[
                      { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", text: "Mejora en la confianza lectora", color: "emerald" },
                      { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", text: "Progreso académico medible", color: "teal" },
                      { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", text: "Amor por el aprendizaje", color: "purple" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className={`bg-gradient-to-br from-${item.color}-100 to-${item.color}-50 p-2 md:p-3 rounded-lg md:rounded-xl mr-3 md:mr-4 flex-shrink-0`}>
                          <svg className={`w-4 h-4 md:w-5 md:h-5 text-${item.color}-600`} fill="currentColor" viewBox="0 0 24 24">
                            <path d={item.icon} />
                          </svg>
                        </div>
                        <p className="text-sm md:text-base font-semibold text-slate-800">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nuestro Alcance */}
                <div className="bg-gradient-to-br from-teal-50/60 to-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-slate-100 shadow-lg animate-fade-in stagger-2">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="bg-gradient-to-br from-teal-100 to-cyan-50 p-2.5 md:p-3 rounded-xl md:rounded-2xl">
                      <svg className="w-6 h-6 md:w-7 md:h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">Nuestro Alcance</h3>
                  </div>
                  
                  <p className="text-sm md:text-base text-slate-600 mb-4 md:mb-6 leading-relaxed">
                    Llegamos a estudiantes, padres y educadores con herramientas diseñadas 
                    específicamente para cada uno de ellos.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {[
                      { title: "Para Niños", desc: "Experiencias de aprendizaje divertidas", color: "from-emerald-400 to-teal-500" },
                      { title: "Para Padres", desc: "Seguimiento del progreso", color: "from-teal-400 to-cyan-500" },
                      { title: "Para Docentes", desc: "Herramientas de evaluación", color: "from-purple-400 to-purple-500" },
                      { title: "Para Escuelas", desc: "Plataformas institucionales", color: "from-orange-400 to-amber-500" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className={`text-lg md:text-xl lg:text-2xl font-bold mb-1 md:mb-2 text-transparent bg-clip-text bg-gradient-to-r ${item.color}`}>
                          {item.title.split(' ')[1]}
                        </div>
                        <p className="text-[10px] md:text-xs lg:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compromiso final */}
              <div className="bg-gradient-to-br from-emerald-50/40 via-teal-50/40 to-purple-50/40 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-200/50 animate-fade-in stagger-3">
                <div className="text-center space-y-6 md:space-y-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-200/50 mb-4">
                      <span className="text-sm font-semibold text-purple-700">Compromiso</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 md:mb-4">Nuestra Promesa</h2>
                    <p className="text-sm md:text-base lg:text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto px-4">
                      Nos comprometemos a seguir innovando, mejorando y adaptando nuestras soluciones 
                      para garantizar que cada niño, sin importar sus circunstancias, tenga acceso a 
                      las mejores herramientas para desarrollar su potencial lector y amor por el aprendizaje.
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="group bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2 md:gap-3 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 hover:scale-105 transition-all duration-300 cursor-pointer">
                      <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-bold text-base md:text-lg">Comprometidos con la educación del futuro</span>
                    </div>
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
