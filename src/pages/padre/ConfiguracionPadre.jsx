import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdPerson,
  MdSecurity,
  MdEdit,
  MdChevronRight,
  MdArrowBack,
  MdSettings,
  MdCheck,
} from "react-icons/md";

export default function ConfiguracionPadre() {
  const navigate = useNavigate();

  // Estados
  const [permitirIA, setPermitirIA] = useState(true);
  const [permitirAudio, setPermitirAudio] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
        * { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif; }
        h1,h2,h3,h4,h5,h6 { font-family: 'Fredoka', 'Poppins', sans-serif; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .modal-anim { animation: fadeIn 0.2s ease-out; }
      `}</style>

      {/* ════════════════════════════════════════════
          VERSIÓN MÓVIL
          ════════════════════════════════════════════ */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        
        {/* Header móvil */}
        <div className="bg-white rounded-b-2xl shadow-sm px-4 pt-4 pb-5">
          

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <MdSettings size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Configuración</h1>
              <p className="text-xs text-slate-500">Privacidad y preferencias</p>
            </div>
          </div>
        </div>

        {/* Contenido móvil */}
        <main className="px-4 py-5 space-y-4">
          
          {/* Mi Cuenta */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500"></div>
            <div className="p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <MdPerson size={20} className="text-emerald-600" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Mi Cuenta</h2>
              </div>

              <button
                onClick={() => navigate("/padre/menu/editar-cuenta")}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <MdEdit size={18} className="text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">Editar Perfil</p>
                    <p className="text-xs text-slate-500">Actualiza tu información</p>
                  </div>
                </div>
                <MdChevronRight size={20} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* Privacidad */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600"></div>
            <div className="p-4">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
                  <MdSecurity size={20} className="text-teal-600" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Privacidad y control</h2>
              </div>

              <div className="space-y-3">
                <Toggle
                  label="Permitir análisis con IA"
                  description="Autorizar el uso de IA para evaluar la lectura"
                  enabled={permitirIA}
                  setEnabled={setPermitirIA}
                  mobile
                />

                <div className="h-px bg-slate-100"></div>

                <Toggle
                  label="Permitir grabación de audio"
                  description="Autorizar el uso del micrófono para prácticas"
                  enabled={permitirAudio}
                  setEnabled={setPermitirAudio}
                  mobile
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center flex-shrink-0">
                <MdCheck size={16} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900 mb-1">Cambios automáticos</p>
                <p className="text-xs text-emerald-700">Los cambios se guardan automáticamente al activar o desactivar opciones.</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ════════════════════════════════════════════
          VERSIÓN DESKTOP
          ════════════════════════════════════════════ */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
        <main className="max-w-4xl mx-auto px-6">
          
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <MdSettings size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Configuración</h1>
                <p className="text-sm text-slate-600">Controla tu privacidad y preferencias</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Mi Cuenta */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500"></div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <MdPerson size={24} className="text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Mi Cuenta</h2>
                </div>

                <button
                  onClick={() => navigate("/padre/menu/editar-cuenta")}
                  className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all group active:scale-95"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                      <MdEdit size={22} className="text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-bold text-slate-900">Editar Perfil</p>
                      <p className="text-sm text-slate-500">Actualiza tu información personal y contraseña</p>
                    </div>
                  </div>
                  <MdChevronRight size={24} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </button>
              </div>
            </div>

            {/* Privacidad */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600"></div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
                    <MdSecurity size={24} className="text-teal-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Privacidad y control</h2>
                </div>

                <div className="space-y-4">
                  <Toggle
                    label="Permitir análisis con IA"
                    description="Autorizar el uso de inteligencia artificial para evaluar la lectura y proporcionar retroalimentación personalizada"
                    enabled={permitirIA}
                    setEnabled={setPermitirIA}
                  />

                  <div className="h-px bg-slate-100"></div>

                  <Toggle
                    label="Permitir grabación de audio"
                    description="Autorizar el uso del micrófono para prácticas de lectura en voz alta y análisis de pronunciación"
                    enabled={permitirAudio}
                    setEnabled={setPermitirAudio}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center flex-shrink-0">
                <MdCheck size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900 mb-1">Guardado automático</p>
                <p className="text-sm text-emerald-700">Los cambios en la configuración se guardan automáticamente. Puedes modificarlos en cualquier momento.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════
   TOGGLE COMPONENT
   ══════════════════════════════════════════════════════ */
function Toggle({ label, description, enabled, setEnabled, mobile = false }) {
  return (
    <div className={`flex items-start justify-between ${mobile ? 'gap-3' : 'gap-4'}`}>
      <div className="flex-1">
        <p className={`font-bold text-slate-900 mb-1 ${mobile ? 'text-sm' : 'text-base'}`}>
          {label}
        </p>
        <p className={`text-slate-500 leading-snug ${mobile ? 'text-xs' : 'text-sm'}`}>
          {description}
        </p>
      </div>

      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex items-center rounded-full transition-all flex-shrink-0 ${
          mobile ? 'h-6 w-11' : 'h-7 w-12'
        } ${
          enabled 
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm shadow-emerald-500/30" 
            : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block transform rounded-full bg-white transition-all shadow-sm ${
            mobile ? 'h-5 w-5' : 'h-6 w-6'
          } ${
            enabled 
              ? (mobile ? 'translate-x-5' : 'translate-x-6') 
              : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
