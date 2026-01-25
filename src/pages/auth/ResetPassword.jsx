import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { confirmarResetPassword } from "../../services/authService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const isMobile = Capacitor.isNativePlatform();
  const [searchParams] = useSearchParams();

  const token = useMemo(() => searchParams.get("token"), [searchParams]);

  const [nuevoPassword, setNuevoPassword] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOkMsg("");
    setErrorMsg("");

    if (!token) {
      setErrorMsg("Token no encontrado. Abre el enlace desde tu correo.");
      return;
    }

    if (!nuevoPassword || nuevoPassword.length < 8) {
      setErrorMsg("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (nuevoPassword !== confirmacion) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await confirmarResetPassword(token, nuevoPassword);
      setOkMsg("Contraseña actualizada. Redirigiendo al login...");

      setTimeout(() => {
        navigate("/login", {
          state: { mensaje: "Contraseña restablecida correctamente. Inicia sesión." },
        });
      }, 2000);
    } catch (error) {
      const detail = error?.response?.data?.detail;
      setErrorMsg(detail || "No se pudo cambiar la contraseña. El token podría estar expirado.");
    } finally {
      setLoading(false);
    }
  };

  const Card = (
    <div className="bg-white/90 backdrop-blur-xl p-7 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white/60">
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/30">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 11c0 3.866-3.582 7-8 7h16c-4.418 0-8-3.134-8-7zm0 0V7a4 4 0 10-8 0v4"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "Poppins, sans-serif" }}>
          Nueva contraseña
        </h2>
        <p className="text-slate-600 text-sm mt-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
          Crea una contraseña segura para tu cuenta.
        </p>
      </div>

      {!token && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-xl mb-5 text-sm">
          Token no encontrado. Abre el enlace desde tu correo.
        </div>
      )}

      {okMsg && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl mb-5 text-sm">
          {okMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-5 text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-slate-700 font-semibold text-sm block mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={nuevoPassword}
              onChange={(e) => setNuevoPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-4 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 pr-12"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
              {show ? "🙈" : "👁️"}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">Mínimo 8 caracteres.</p>
        </div>

        <div>
          <label className="text-slate-700 font-semibold text-sm block mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Confirmar contraseña
          </label>
          <input
            type={show ? "text" : "password"}
            value={confirmacion}
            onChange={(e) => setConfirmacion(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-4 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !token}
          className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all ${
            loading || !token
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          }`}
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {loading ? "Guardando..." : "Guardar contraseña"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full py-4 rounded-2xl border-2 border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-50 transition-all"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Volver al Login
        </button>
      </form>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        `}</style>

        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-6">
          {Card}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex flex-col">
        <Navbar />
        <main className="pt-28 flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full">{Card}</div>
        </main>
        <Footer />
      </div>
    </>
  );
}
