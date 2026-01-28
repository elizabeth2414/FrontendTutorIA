import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { configurarCuenta } from "../../services/authService";

export default function ConfigurarCuenta() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: "Token faltante",
        text: "El enlace no tiene token. Solicita al administrador que reenvíe la invitación.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    if (password.length < 6) {
      return Swal.fire({
        title: "Contraseña muy corta",
        text: "Debe tener al menos 6 caracteres.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
    }

    if (password !== confirm) {
      return Swal.fire({
        title: "No coinciden",
        text: "La confirmación no coincide con la contraseña.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
    }

    try {
      setLoading(true);
      const r = await configurarCuenta({ token, nuevo_password: password });


      await Swal.fire({
        title: "✅ Cuenta configurada",
        text: r?.mensaje || "Ya puedes iniciar sesión.",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });

      navigate("/login");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        "No se pudo configurar la cuenta. El token puede haber expirado.";
      Swal.fire({
        title: "Error",
        text: msg,
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Configurar Cuenta
        </h1>
        <p className="text-slate-600 text-sm mb-6">
          Crea tu contraseña para activar tu cuenta de BookiSmartIA.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Nueva contraseña
            </label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Confirmar contraseña
            </label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repite la contraseña"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all disabled:opacity-60"
          >
            {loading ? "Configurando..." : "Configurar cuenta"}
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-4">
          Si tu enlace expiró, pide al administrador que reenvíe la invitación.
        </p>
      </div>
    </div>
  );
}
