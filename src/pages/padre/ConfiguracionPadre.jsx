import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdPerson,
  MdSecurity,
  MdEdit,
  MdChevronRight,
  MdArrowBack,
  MdSettings,
} from "react-icons/md";

export default function ConfiguracionPadre() {
  const navigate = useNavigate();

  // ==========================
  // Estados de configuración
  // ==========================
  const [permitirIA, setPermitirIA] = useState(true);
  const [permitirAudio, setPermitirAudio] = useState(true);

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

      {/* VERSIÓN MÓVIL */}
      <div className="md:hidden min-h-screen bg-white">
        {/* Header móvil fijo */}
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 shadow-lg z-30">
          
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MdSettings size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white mb-0.5">Configuración</h1>
              <p className="text-xs text-blue-100">Privacidad y preferencias</p>
            </div>
          </div>
        </div>

        {/* Contenido móvil */}
        <main className="pt-32 px-4 pb-8 space-y-4">
          {/* Mi Cuenta móvil */}
          <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <MdPerson size={18} />
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                Mi Cuenta
              </h2>
            </div>

            <button
              onClick={() => navigate("/padre/menu/editar-cuenta")}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all active:scale-98"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <MdEdit size={16} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">
                    Editar Perfil
                  </p>
                  <p className="text-xs text-slate-500">
                    Actualiza tu información
                  </p>
                </div>
              </div>
              <MdChevronRight size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Privacidad móvil */}
          <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <MdSecurity size={18} />
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                Privacidad y control
              </h2>
            </div>

            <div className="space-y-3">
              <Toggle
                label="Permitir análisis con IA"
                description="Autorizar el uso de IA para evaluar la lectura."
                enabled={permitirIA}
                setEnabled={setPermitirIA}
                mobile
              />

              <Toggle
                label="Permitir grabación de audio"
                description="Autorizar el uso del micrófono para prácticas."
                enabled={permitirAudio}
                setEnabled={setPermitirAudio}
                mobile
              />
            </div>
          </div>

          {/* Info adicional móvil */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-xs text-blue-800">
              💡 <strong>Nota:</strong> Los cambios se guardan automáticamente.
            </p>
          </div>
        </main>
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden md:block min-h-screen bg-white pt-6">
        <main className="max-w-4xl mx-auto px-6 py-6 space-y-6">
          {/* Header desktop */}
          <div className="mb-6">
           

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                <MdSettings size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  Configuración
                </h1>
                <p className="text-sm text-slate-600">
                  Controla tu privacidad y preferencias
                </p>
              </div>
            </div>
          </div>

          {/* Mi Cuenta desktop */}
          <section className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <MdPerson size={22} />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Mi Cuenta
              </h2>
            </div>

            <button
              onClick={() => navigate("/padre/menu/editar-cuenta")}
              className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-200 transition">
                  <MdEdit size={20} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">
                    Editar Perfil
                  </p>
                  <p className="text-sm text-slate-500">
                    Actualiza tu información personal y contraseña
                  </p>
                </div>
              </div>
              <MdChevronRight size={24} className="text-slate-400 group-hover:text-purple-600 transition" />
            </button>
          </section>

          {/* Privacidad desktop */}
          <section className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <MdSecurity size={22} />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Privacidad y control
              </h2>
            </div>

            <div className="space-y-4">
              <Toggle
                label="Permitir análisis con IA"
                description="Autorizar el uso de inteligencia artificial para evaluar la lectura y proporcionar retroalimentación."
                enabled={permitirIA}
                setEnabled={setPermitirIA}
              />

              <Toggle
                label="Permitir grabación de audio"
                description="Autorizar el uso del micrófono para prácticas de lectura en voz alta y análisis de pronunciación."
                enabled={permitirAudio}
                setEnabled={setPermitirAudio}
              />
            </div>
          </section>

          {/* Info adicional desktop */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Nota:</strong> Los cambios en la configuración se guardan automáticamente. Puedes modificarlos en cualquier momento.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}

/* ======================================================
   COMPONENTE TOGGLE (REUTILIZABLE)
====================================================== */
function Toggle({ label, description, enabled, setEnabled, mobile = false }) {
  return (
    <div className={`flex items-start justify-between ${mobile ? 'gap-3' : 'gap-4'}`}>
      <div className="flex-1">
        <p className={`font-medium text-slate-900 ${mobile ? 'text-sm' : 'text-base'}`}>
          {label}
        </p>
        <p className={`text-slate-500 ${mobile ? 'text-xs' : 'text-sm'}`}>
          {description}
        </p>
      </div>

      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex items-center rounded-full transition flex-shrink-0 ${
          mobile ? 'h-5 w-9' : 'h-6 w-11'
        } ${enabled ? "bg-blue-600" : "bg-slate-300"}`}
      >
        <span
          className={`inline-block transform rounded-full bg-white transition ${
            mobile 
              ? 'h-4 w-4' 
              : 'h-5 w-5'
          } ${
            enabled 
              ? (mobile ? 'translate-x-4' : 'translate-x-5') 
              : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
