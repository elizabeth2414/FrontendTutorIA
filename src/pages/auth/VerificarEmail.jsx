import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { verificarEmail, reenviarVerificacion } from "../../services/authService";

const VerificarEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isMobile = Capacitor.isNativePlatform();

  const [verificando, setVerificando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [verificado, setVerificado] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  // ✅ Email puede venir por state (cuando vienes del registro)
  const email = location.state?.email || "";
  // ✅ Token viene por query param ?token=
  const token = searchParams.get("token");

  // Verificar token automáticamente si existe en la URL
  useEffect(() => {
    if (token) {
      verificarToken(token);
    } else {
      // Si no hay token, solo mostramos instrucciones (y opción de reenviar si hay email)
      setVerificado(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const getApiErrorMessage = (err, fallback) => {
    return (
      err?.response?.data?.detail ||
      err?.response?.data?.mensaje ||
      err?.response?.data?.message || // por si algún backend manda message
      fallback
    );
  };

  // Función para verificar el token
  const verificarToken = async (verificationToken) => {
    setVerificando(true);
    setError("");
    setMensaje("");

    try {
      await verificarEmail(verificationToken);
      setVerificado(true);
      setMensaje("¡Email verificado con éxito! Redirigiendo al inicio de sesión...");

      setTimeout(() => {
        navigate("/login", {
          state: {
            mensaje: "Email verificado correctamente. Ya puedes iniciar sesión.",
          },
        });
      }, 3000);
    } catch (err) {
      setVerificado(false);
      setError(getApiErrorMessage(err, "El token de verificación es inválido o ha expirado."));
    } finally {
      setVerificando(false);
    }
  };

  // Función para reenviar email de verificación
  const handleReenviar = async () => {
    if (!email) {
      setError("No se encontró el correo electrónico para reenviar. Vuelve a registrarte o escribe tu email.");
      return;
    }

    setReenviando(true);
    setError("");
    setMensaje("");

    try {
      await reenviarVerificacion(email);
      setMensaje("Email de verificación reenviado. Revisa tu bandeja de entrada (y SPAM).");
    } catch (err) {
      setError(getApiErrorMessage(err, "No se pudo reenviar el email. Intenta de nuevo."));
    } finally {
      setReenviando(false);
    }
  };

  // =========================
  // 📱 DISEÑO MÓVIL (tu UI original, solo ajustado)
  // =========================
  if (isMobile) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
          .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        `}</style>

        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-10 left-10 w-48 h-48 bg-blue-200/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl"></div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl max-w-md w-full border border-white/60">
              {verificando ? (
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Verificando...
                  </h2>
                  <p className="text-slate-600 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    Por favor espera mientras verificamos tu email
                  </p>
                </div>
              ) : verificado ? (
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                    ¡Email Verificado!
                  </h2>
                  <p className="text-slate-600 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {mensaje}
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                      Verifica tu Email
                    </h2>
                    <p className="text-slate-600 text-sm mb-4" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {token
                        ? "Tenemos tu token, intentaremos verificar automáticamente."
                        : "Hemos enviado un correo de verificación a:"}
                    </p>

                    {email ? (
                      <p className="text-purple-600 font-bold text-base mb-6" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        {email}
                      </p>
                    ) : (
                      <p className="text-slate-500 text-xs mb-6" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        (Si llegaste desde el link del correo, no necesitas el email aquí.)
                      </p>
                    )}
                  </div>

                  {mensaje && (
                    <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl mb-6 flex items-start text-sm">
                      <span style={{ fontFamily: "DM Sans, sans-serif" }}>{mensaje}</span>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 flex items-start text-sm">
                      <span style={{ fontFamily: "DM Sans, sans-serif" }}>{error}</span>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                    <h3 className="font-bold text-slate-900 text-sm mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                      📧 Pasos para verificar:
                    </h3>
                    <ol className="text-slate-700 text-xs space-y-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      <li>1. Revisa tu bandeja de entrada</li>
                      <li>2. Revisa SPAM o Promociones</li>
                      <li>3. Haz clic en el botón de verificación</li>
                    </ol>
                  </div>

                  <button
                    onClick={handleReenviar}
                    disabled={reenviando || !email}
                    className={`w-full py-3.5 rounded-2xl font-bold text-base shadow-lg transition-all mb-4 ${
                      reenviando || !email
                        ? "bg-slate-400 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                    }`}
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    title={!email ? "Necesitas el email (viene del registro) para reenviar" : ""}
                  >
                    {reenviando ? "Reenviando..." : "Reenviar Email"}
                  </button>

                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3.5 rounded-2xl border-2 border-slate-300 text-slate-700 font-bold text-base hover:bg-slate-50 transition-all"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Volver al Login
                  </button>
                </>
              )}
            </div>

            <div className="text-center text-slate-500 text-xs mt-6" style={{ fontFamily: "DM Sans, sans-serif" }}>
              <p>ReadSmartIA © 2025</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // =========================
  // 🖥️ DISEÑO WEB (tu UI original, solo ajustado)
  // =========================
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50 flex flex-col">
        <Navbar />

        <main className="pt-28 flex-1 flex items-center justify-center p-6">
          <div className="relative bg-white/80 backdrop-blur-xl p-12 rounded-[2.5rem] shadow-2xl max-w-lg w-full border border-white/60">
            {verificando ? (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-12 h-12 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Verificando tu email...</h2>
                <p className="text-slate-600 text-base">Por favor espera un momento</p>
              </div>
            ) : verificado ? (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">¡Email Verificado!</h2>
                <p className="text-slate-600 text-base">{mensaje}</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Verifica tu Email</h2>
                  <p className="text-slate-600 text-base mb-4">
                    {token
                      ? "Tenemos tu token, intentaremos verificar automáticamente."
                      : "Hemos enviado un correo de verificación a:"}
                  </p>
                  {email ? (
                    <p className="text-purple-600 font-bold text-lg mb-8">{email}</p>
                  ) : (
                    <p className="text-slate-500 text-sm mb-8">
                      Si abriste esta página desde el link del correo, no necesitas el email aquí.
                    </p>
                  )}
                </div>

                {mensaje && (
                  <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl mb-6">
                    <span className="text-sm">{mensaje}</span>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6">
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
                  <h3 className="font-bold text-slate-900 text-base mb-4">📧 Pasos para verificar tu cuenta:</h3>
                  <ol className="text-slate-700 text-sm space-y-3">
                    <li>1. Revisa tu bandeja de entrada</li>
                    <li>2. Si no lo encuentras, revisa SPAM o Promociones</li>
                    <li>3. Haz clic en el botón "Verificar Email" del correo</li>
                    <li>4. Serás redirigido automáticamente para iniciar sesión</li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleReenviar}
                    disabled={reenviando || !email}
                    className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all ${
                      reenviando || !email
                        ? "bg-slate-400 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-[1.02]"
                    }`}
                    title={!email ? "Necesitas el email (viene del registro) para reenviar" : ""}
                  >
                    {reenviando ? "Reenviando..." : "Reenviar Email de Verificación"}
                  </button>

                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-4 rounded-2xl border-2 border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-50 transition-all"
                  >
                    Volver al Login
                  </button>
                </div>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default VerificarEmail;
