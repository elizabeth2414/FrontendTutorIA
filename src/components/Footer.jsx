import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap');
      `}</style>

      <footer
        className="
          mt-28 w-full py-12 
          bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50
          border-t border-slate-200/50
        "
      >
        {/* CONTENEDOR */}
        <div
          className="
            max-w-7xl mx-auto px-6 
            grid md:grid-cols-3 gap-10
          "
        >

          {/* INFO DEL PROYECTO */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600" style={{fontFamily: 'Poppins, sans-serif'}}>
                ReadSmartIA
              </h2>
            </div>

            <p className="text-slate-600 text-base leading-relaxed max-w-sm">
              Plataforma educativa inteligente diseñada para apoyar el aprendizaje lector
              de niños entre 7 y 10 años mediante inteligencia artificial.
            </p>

            <p className="text-slate-500 text-sm">
              © 2025 ReadSmartIA • Todos los derechos reservados
            </p>
          </div>

          {/* REDES SOCIALES */}
          <div className="flex flex-col items-start md:items-center justify-center space-y-5">
            <h3 className="text-lg font-semibold text-slate-900">Síguenos</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="group w-12 h-12 rounded-xl bg-white border-2 border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-lg"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-xl" />
              </a>

              <a
                href="#"
                className="group w-12 h-12 rounded-xl bg-white border-2 border-pink-100 flex items-center justify-center text-pink-600 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:border-pink-600 hover:text-white transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-lg"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>

              <a
                href="#"
                className="group w-12 h-12 rounded-xl bg-white border-2 border-red-100 flex items-center justify-center text-red-600 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-lg"
                aria-label="YouTube"
              >
                <FaYoutube className="text-xl" />
              </a>

              <a
                href="#"
                className="group w-12 h-12 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:border-slate-900 hover:text-white transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-lg"
                aria-label="TikTok"
              >
                <FaTiktok className="text-xl" />
              </a>
            </div>
          </div>

          {/* INFORMACIÓN INSTITUCIONAL */}
          <div className="flex flex-col items-start md:items-end justify-center space-y-3">
            <div className="text-right space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-xl border border-purple-100">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-semibold text-purple-700">Proyecto Académico</span>
              </div>

              <p className="font-semibold text-slate-900 text-base">
                Instituto Superior Tecnológico del Azuay
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Desarrollo de Software<br />
                Proyecto Integrador • N6A
              </p>
            </div>
          </div>
        </div>

        {/* BARRA INFERIOR */}
        <div className="max-w-7xl mx-auto px-6 mt-10 pt-8 border-t border-slate-200/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-blue-600 transition-colors">Términos de Uso</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
