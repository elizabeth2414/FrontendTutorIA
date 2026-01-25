import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Fredoka:wght@500;600;700&display=swap');
      `}</style>

      <footer className="mt-16 w-full py-8 bg-gradient-to-br from-emerald-50/50 via-orange-50/30 to-purple-50/50 border-t-2 border-slate-200/50">
        
        {/* CONTENEDOR PRINCIPAL */}
        <div className="max-w-7xl mx-auto px-6">
          
          {/* GRID COMPACTO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

            {/* COLUMNA 1: LOGO + INFO */}
            <div className="space-y-3 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                {/* Logo del camaleón */}
                <img 
                  src="/src/assets/images/bookismartia.jpeg" 
                  alt="BookiSmartIA Logo" 
                  className="w-10 h-10 object-contain rounded-xl"
                />
                <h2 
                  className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-orange-500 to-purple-600" 
                  style={{fontFamily: 'Fredoka, sans-serif'}}
                >
                  BookiSmartIA
                </h2>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed">
               
              </p>

              <p className="text-slate-400 text-xs">
                © 2026 BookiSmartIA
              </p>
            </div>

            {/* COLUMNA 2: REDES SOCIALES */}
            <div className="flex flex-col items-center space-y-3">
              <h3 className="text-sm font-semibold text-slate-700" style={{fontFamily: 'Fredoka, sans-serif'}}>
                Síguenos
              </h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white border-2 border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-200 hover:scale-110 shadow-sm"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="text-base" />
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white border-2 border-pink-100 flex items-center justify-center text-pink-600 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:border-pink-600 hover:text-white transition-all duration-200 hover:scale-110 shadow-sm"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-base" />
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white border-2 border-red-100 flex items-center justify-center text-red-600 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-200 hover:scale-110 shadow-sm"
                  aria-label="YouTube"
                >
                  <FaYoutube className="text-base" />
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:border-slate-900 hover:text-white transition-all duration-200 hover:scale-110 shadow-sm"
                  aria-label="TikTok"
                >
                  <FaTiktok className="text-base" />
                </a>
              </div>
            </div>

            {/* COLUMNA 3: INFO INSTITUCIONAL */}
            <div className="flex flex-col items-center md:items-end space-y-2 text-center md:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-100">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-xs font-semibold text-purple-700">Proyecto Académico</span>
              </div>

              <p className="font-semibold text-slate-900 text-sm">
                Instituto Superior Tecnológico del Azuay
              </p>
              <p className="text-slate-600 text-xs">
                Desarrollo de Software • M6A
              </p>
            </div>
          </div>

          {/* BARRA INFERIOR COMPACTA */}
          <div className="mt-6 pt-4 border-t border-slate-200/50">
            <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-emerald-600 transition-colors">Términos</a>
                <span className="text-slate-300">•</span>
                <a href="#" className="hover:text-emerald-600 transition-colors">Privacidad</a>
                <span className="text-slate-300">•</span>
                <a href="#" className="hover:text-emerald-600 transition-colors">Contacto</a>
              </div>
              <p className="text-slate-400">Hecho con 💚 para niños de 7-10 años</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
