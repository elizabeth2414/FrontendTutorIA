import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { solicitarResetPassword } from "../../services/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const isMobile = Capacitor.isNativePlatform();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOkMsg("");
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Ingresa tu correo.");
      return;
    }

    setLoading(true);
    try {
      // Backend responde mensaje genérico por seguridad
      const res = await solicitarResetPassword(email.trim());
      setOkMsg(res?.mensaje || "Si el email existe, se enviarán instrucciones para resetear la contraseña.");
    } catch (error) {
      setErrorMsg("No se pudo procesar la solicitud. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const Card = (
    <div className="bg-white/90 backdrop-blur-xl p-7 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white/60">
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/30">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 11c0 3.866-3.582 7-8 7h16c-4.418 0-8-3.134-8-7zm0 0V7a4 4 0 10-8 0v4"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "Poppins, sans-serif" }}>
          Recuperar contraseña
        </h2>
        <p className="text-slate-600 text-sm mt-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
          Te enviaremos un enlace para crear una nueva contraseña.
        </p>
      </div>

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
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            className="w-full px-4 py-4 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            autoComplete="email"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all ${
            loading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          }`}
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {loading ? "Enviando..." : "Enviar enlace"}
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
