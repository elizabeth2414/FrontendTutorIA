import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerPerfilPadre, actualizarPerfilPadre } from "../../services/padresService";
import {
  MdArrowBack,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdEdit,
} from "react-icons/md";

const EditarCuentaPadre = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono_contacto: "",
    passwordActual: "",
    passwordNueva: "",
    passwordConfirmar: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    passwordActual: false,
    passwordNueva: false,
    passwordConfirmar: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [cambiarPassword, setCambiarPassword] = useState(false);

  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono_contacto: "",
    passwordActual: "",
    passwordNueva: "",
    passwordConfirmar: "",
  });

  useEffect(() => {
    cargarDatosPadre();
  }, []);

  const cargarDatosPadre = async () => {
    try {
      const datos = await obtenerPerfilPadre();
      
      setForm({
        nombre: datos.nombre || "",
        apellido: datos.apellido || "",
        email: datos.email || "",
        telefono_contacto: datos.telefono_contacto || "",
        passwordActual: "",
        passwordNueva: "",
        passwordConfirmar: "",
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setErrorMsg("No se pudieron cargar los datos de la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    let msg = "";
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;

    if (name === "nombre") {
      if (value.trim().length < 2) msg = "Ingresa un nombre válido.";
      else if (!soloLetras.test(value)) msg = "Solo se permiten letras.";
    }

    if (name === "apellido") {
      if (value.trim().length < 2) msg = "Ingresa un apellido válido.";
      else if (!soloLetras.test(value)) msg = "Solo se permiten letras.";
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) msg = "Correo electrónico no válido.";
    }

    if (name === "telefono_contacto" && value) {
      const telefonoRegex = /^[0-9+\-\s()]+$/;
      if (!telefonoRegex.test(value)) msg = "Teléfono no válido.";
    }

    if (name === "passwordNueva" && cambiarPassword) {
      if (value.length > 0 && value.length < 6)
        msg = "Debe tener mínimo 6 caracteres.";
    }

    if (name === "passwordConfirmar" && cambiarPassword) {
      if (value !== form.passwordNueva)
        msg = "Las contraseñas no coinciden.";
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const dataActualizar = {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        telefono_contacto: form.telefono_contacto || null,
      };

      if (cambiarPassword && form.passwordNueva) {
        if (!form.passwordActual) {
          setErrorMsg("Debes ingresar tu contraseña actual.");
          setSaving(false);
          return;
        }
        if (form.passwordNueva !== form.passwordConfirmar) {
          setErrorMsg("Las contraseñas nuevas no coinciden.");
          setSaving(false);
          return;
        }
        dataActualizar.password_actual = form.passwordActual;
        dataActualizar.password = form.passwordNueva;
      }

      const datosActualizados = await actualizarPerfilPadre(dataActualizar);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { 
        ...user, 
        nombre: datosActualizados.nombre, 
        apellido: datosActualizados.apellido, 
        email: datosActualizados.email 
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccessMsg("✅ Datos actualizados correctamente.");
      
      setForm({
        ...form,
        passwordActual: "",
        passwordNueva: "",
        passwordConfirmar: "",
      });
      setCambiarPassword(false);

      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (error) {
      console.error("Error al guardar:", error);
      setErrorMsg(error.message || "No se pudo actualizar la cuenta. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const formInvalido =
    Object.values(errors).some((e) => e !== "") ||
    !form.nombre ||
    !form.apellido ||
    !form.email ||
    (cambiarPassword && (!form.passwordActual || !form.passwordNueva || !form.passwordConfirmar));

  const InputField = ({ label, name, type = "text", placeholder, icon: Icon, value, showToggle = false, mobile = false }) => (
    <div>
      <label className={`text-slate-700 font-semibold block mb-2 ${mobile ? 'text-xs' : 'text-sm'}`}>
        {label}
      </label>
      <div className="relative">
        <input
          type={showToggle && showPasswords[name] ? "text" : type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 rounded-lg border-2 bg-white outline-none transition-all ${
            mobile ? 'py-2.5 text-sm' : 'py-3 text-base'
          } ${
            errors[name]
              ? "border-red-400 focus:border-red-500"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }`}
        />
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={mobile ? 18 : 20} />
          </div>
        )}
        {showToggle && (
          <button
            type="button"
            onClick={() =>
              setShowPasswords({ ...showPasswords, [name]: !showPasswords[name] })
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPasswords[name] ? (
              <MdVisibility size={mobile ? 18 : 20} />
            ) : (
              <MdVisibilityOff size={mobile ? 18 : 20} />
            )}
          </button>
        )}
      </div>
      {errors[name] && (
        <p className="text-red-600 text-xs mt-1 ml-1">{errors[name]}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

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
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-3 transition-colors"
          >
            <MdArrowBack size={16} />
            <span className="font-medium text-xs">Volver</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MdEdit size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white mb-0.5">Editar Cuenta</h1>
              <p className="text-xs text-blue-100">Actualiza tu información</p>
            </div>
          </div>
        </div>

        {/* Contenido móvil */}
        <main className="pt-32 px-4 pb-8">
          {/* Mensajes */}
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-lg mb-4">
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-lg mb-4">
              <p className="text-sm text-green-700">{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleGuardar} className="space-y-4">
            {/* Información Personal móvil */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <MdPerson size={18} />
                </div>
                <h2 className="text-sm font-bold text-slate-900">
                  Información Personal
                </h2>
              </div>

              <div className="space-y-3">
                <InputField
                  label="Nombre"
                  name="nombre"
                  value={form.nombre}
                  placeholder="Tu nombre"
                  icon={MdPerson}
                  mobile
                />

                <InputField
                  label="Apellido"
                  name="apellido"
                  value={form.apellido}
                  placeholder="Tu apellido"
                  icon={MdPerson}
                  mobile
                />

                <InputField
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  value={form.email}
                  placeholder="correo@ejemplo.com"
                  icon={MdEmail}
                  mobile
                />

                <InputField
                  label="Teléfono (Opcional)"
                  name="telefono_contacto"
                  type="tel"
                  value={form.telefono_contacto}
                  placeholder="+593 99 999 9999"
                  icon={MdPhone}
                  mobile
                />
              </div>
            </div>

            {/* Seguridad móvil */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                    <MdLock size={18} />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Seguridad
                  </h2>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cambiarPassword}
                    onChange={(e) => setCambiarPassword(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
              </div>

              {cambiarPassword && (
                <div className="space-y-3">
                  <InputField
                    label="Contraseña Actual"
                    name="passwordActual"
                    type="password"
                    value={form.passwordActual}
                    placeholder="Tu contraseña actual"
                    showToggle={true}
                    mobile
                  />

                  <InputField
                    label="Nueva Contraseña"
                    name="passwordNueva"
                    type="password"
                    value={form.passwordNueva}
                    placeholder="Mínimo 6 caracteres"
                    showToggle={true}
                    mobile
                  />

                  <InputField
                    label="Confirmar Contraseña"
                    name="passwordConfirmar"
                    type="password"
                    value={form.passwordConfirmar}
                    placeholder="Repite tu contraseña"
                    showToggle={true}
                    mobile
                  />
                </div>
              )}
            </div>

            {/* Botones móvil */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={saving || formInvalido}
                className={`w-full py-3 rounded-lg text-white font-bold shadow-md transition-all ${
                  saving || formInvalido
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 active:scale-95"
                }`}
              >
                {saving ? "Guardando..." : "💾 Guardar Cambios"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full py-3 rounded-lg border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
            </div>

            {/* Info móvil */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                💡 <strong>Consejo:</strong> Usa contraseñas seguras con letras, números y símbolos.
              </p>
            </div>
          </form>
        </main>
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden md:block min-h-screen bg-white pt-6">
        <main className="max-w-3xl mx-auto px-6 py-6">
          {/* Header desktop */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition text-sm mb-4"
            >
              <MdArrowBack size={18} />
              Volver
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                <MdEdit size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  Editar Cuenta
                </h1>
                <p className="text-sm text-slate-600">
                  Actualiza tu información personal
                </p>
              </div>
            </div>
          </div>

          {/* Formulario desktop */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            {/* Mensajes */}
            {errorMsg && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
                <p className="text-sm text-red-700">{errorMsg}</p>
              </div>
            )}

            {successMsg && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg mb-6">
                <p className="text-sm text-green-700">{successMsg}</p>
              </div>
            )}

            <form onSubmit={handleGuardar} className="space-y-6">
              {/* Información Personal desktop */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <MdPerson size={22} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    Información Personal
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <InputField
                    label="Nombre"
                    name="nombre"
                    value={form.nombre}
                    placeholder="Tu nombre"
                    icon={MdPerson}
                  />

                  <InputField
                    label="Apellido"
                    name="apellido"
                    value={form.apellido}
                    placeholder="Tu apellido"
                    icon={MdPerson}
                  />
                </div>

                <div className="space-y-4">
                  <InputField
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    value={form.email}
                    placeholder="correo@ejemplo.com"
                    icon={MdEmail}
                  />

                  <InputField
                    label="Teléfono de Contacto (Opcional)"
                    name="telefono_contacto"
                    type="tel"
                    value={form.telefono_contacto}
                    placeholder="+593 99 999 9999"
                    icon={MdPhone}
                  />
                </div>
              </div>

              {/* Seguridad desktop */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                      <MdLock size={22} />
                    </div>
                    <h2 className="text-base font-bold text-slate-900">
                      Seguridad
                    </h2>
                  </div>
                  <label className="flex items-center cursor-pointer gap-3">
                    <span className="text-sm font-medium text-slate-700">
                      Cambiar contraseña
                    </span>
                    <input
                      type="checkbox"
                      checked={cambiarPassword}
                      onChange={(e) => setCambiarPassword(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                {cambiarPassword && (
                  <div className="space-y-4">
                    <InputField
                      label="Contraseña Actual"
                      name="passwordActual"
                      type="password"
                      value={form.passwordActual}
                      placeholder="Ingresa tu contraseña actual"
                      showToggle={true}
                    />

                    <InputField
                      label="Nueva Contraseña"
                      name="passwordNueva"
                      type="password"
                      value={form.passwordNueva}
                      placeholder="Mínimo 6 caracteres"
                      showToggle={true}
                    />

                    <InputField
                      label="Confirmar Nueva Contraseña"
                      name="passwordConfirmar"
                      type="password"
                      value={form.passwordConfirmar}
                      placeholder="Repite tu nueva contraseña"
                      showToggle={true}
                    />
                  </div>
                )}
              </div>

              {/* Botones desktop */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 py-3 rounded-lg border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || formInvalido}
                  className={`flex-1 py-3 rounded-lg text-white font-bold shadow-lg transition-all ${
                    saving || formInvalido
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl"
                  }`}
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Guardando...
                    </span>
                  ) : (
                    "💾 Guardar Cambios"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Info desktop */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Consejo de seguridad:</strong> Te recomendamos cambiar tu contraseña cada 3 meses y usar una combinación de letras, números y símbolos.
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default EditarCuentaPadre;
