import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdNotificationsActive,
  MdPerson,
  MdSecurity,
  MdEdit,
  MdChevronRight,
} from "react-icons/md";

export default function ConfiguracionPadre() {
  const navigate = useNavigate();

  // ==========================
  // Estados de configuración (UI)
  // ==========================
  const [notifLecturas, setNotifLecturas] = useState(true);
  const [notifPracticas, setNotifPracticas] = useState(true);
  const [notifRecordatorios, setNotifRecordatorios] = useState(false);

  const [permitirIA, setPermitirIA] = useState(true);
  const [permitirAudio, setPermitirAudio] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-blue-100">
      <main className="pt-24 max-w-5xl mx-auto p-6 space-y-8">

        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow">
            <MdSecurity size={26} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-600">
              Configuración
            </h1>
            <p className="text-sm text-slate-600">
              Controla notificaciones, privacidad y preferencias
            </p>
          </div>
        </div>

        {/* CUENTA - Editar Perfil */}
        <section className="bg-white/90 backdrop-blur-sm rounded-2xl
                            border border-purple-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100
                            text-purple-600 flex items-center justify-center">
              <MdPerson size={22} />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">
              Mi Cuenta
            </h2>
          </div>

          <button
            onClick={() => navigate("/padre/menu/editar-cuenta")}
            className="w-full flex items-center justify-between p-4 
                       rounded-xl border-2 border-slate-200 
                       hover:border-purple-400 hover:bg-purple-50
                       transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 
                              text-purple-600 flex items-center justify-center
                              group-hover:bg-purple-200 transition">
                <MdEdit size={20} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-800">
                  Editar Perfil
                </p>
                <p className="text-sm text-slate-500">
                  Actualiza tu información personal y contraseña
                </p>
              </div>
            </div>
            <MdChevronRight 
              size={24} 
              className="text-slate-400 group-hover:text-purple-600 transition" 
            />
          </button>
        </section>

        {/* NOTIFICACIONES */}
        <section className="bg-white/90 backdrop-blur-sm rounded-2xl
                            border border-indigo-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100
                            text-indigo-600 flex items-center justify-center">
              <MdNotificationsActive size={22} />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">
              Notificaciones
            </h2>
          </div>

          <Toggle
            label="Lecturas pendientes"
            description="Recibir alertas cuando un hijo tenga lecturas sin completar."
            enabled={notifLecturas}
            setEnabled={setNotifLecturas}
          />

          <Toggle
            label="Prácticas de pronunciación"
            description="Notificar cuando no se haya realizado la práctica con IA."
            enabled={notifPracticas}
            setEnabled={setNotifPracticas}
          />

          <Toggle
            label="Recordatorios periódicos"
            description="Enviar recordatorios diarios o semanales."
            enabled={notifRecordatorios}
            setEnabled={setNotifRecordatorios}
          />
        </section>

        {/* PRIVACIDAD */}
        <section className="bg-white/90 backdrop-blur-sm rounded-2xl
                            border border-emerald-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100
                            text-emerald-600 flex items-center justify-center">
              <MdSecurity size={22} />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">
              Privacidad y control
            </h2>
          </div>

          <Toggle
            label="Permitir análisis con IA"
            description="Autorizar el uso de inteligencia artificial para evaluar la lectura."
            enabled={permitirIA}
            setEnabled={setPermitirIA}
          />

          <Toggle
            label="Permitir grabación de audio"
            description="Autorizar el uso del micrófono para prácticas de lectura."
            enabled={permitirAudio}
            setEnabled={setPermitirAudio}
          />
        </section>

      </main>
    </div>
  );
}

/* ======================================================
   COMPONENTE TOGGLE (REUTILIZABLE)
====================================================== */
function Toggle({ label, description, enabled, setEnabled }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium text-slate-800">
          {label}
        </p>
        <p className="text-sm text-slate-500">
          {description}
        </p>
      </div>

      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full
                    transition ${
                      enabled ? "bg-indigo-600" : "bg-slate-300"
                    }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white
                      transition ${
                        enabled ? "translate-x-5" : "translate-x-1"
                      }`}
        />
      </button>
    </div>
  );
}
