import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerPerfilPadre, actualizarPerfilPadre } from "../../services/padresService";

const EditarCuentaPadre = () => {
  const navigate = useNavigate();

  // Estado del formulario
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

  // Cargar datos del padre al montar el componente
  useEffect(() => {
    cargarDatosPadre();
  }, []);

  const cargarDatosPadre = async () => {
    try {
      // Obtener perfil del padre actual (no necesita ID)
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

  // Validación de campos
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

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  // Guardar cambios
  const handleGuardar = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Preparar datos a actualizar
      const dataActualizar = {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        telefono_contacto: form.telefono_contacto || null,
      };

      // Si el usuario quiere cambiar la contraseña
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

      // Actualizar en el backend
      const datosActualizados = await actualizarPerfilPadre(dataActualizar);

      // Actualizar localStorage con los nuevos datos
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { 
        ...user, 
        nombre: datosActualizados.nombre, 
        apellido: datosActualizados.apellido, 
        email: datosActualizados.email 
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccessMsg("✅ Datos actualizados correctamente.");
      
      // Limpiar campos de contraseña
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
      
      // El error ya viene procesado desde el servicio
      setErrorMsg(error.message || "No se pudo actualizar la cuenta. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  // Verificar si hay errores o campos vacíos
  const formInvalido =
    Object.values(errors).some((e) => e !== "") ||
    !form.nombre ||
    !form.apellido ||
    !form.email ||
    (cambiarPassword && (!form.passwordActual || !form.passwordNueva || !form.passwordConfirmar));

  // Campo de input reutilizable
  const InputField = ({ label, name, type = "text", placeholder, icon, value, showToggle = false }) => (
    <div>
      <label className="text-gray-700 font-semibold text-sm block mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showToggle && showPasswords[name] ? "text" : type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 ${icon ? 'pl-11' : ''} rounded-2xl border-2 bg-gray-50 outline-none transition-all text-base ${
            errors[name]
              ? "border-red-400 focus:border-red-500"
              : "border-gray-200 focus:border-blue-400 focus:bg-white"
          }`}
        />
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        {showToggle && (
          <button
            type="button"
            onClick={() =>
              setShowPasswords({ ...showPasswords, [name]: !showPasswords[name] })
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswords[name] ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-blue-700">✏️ Editar Cuenta</h1>
            <p className="text-gray-600 text-sm">Actualiza tu información personal</p>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/40">
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-xl mb-6 flex items-start">
              <svg className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-4 rounded-xl mb-6 flex items-start">
              <svg className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleGuardar} className="space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Información Personal
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Nombre"
                  name="nombre"
                  value={form.nombre}
                  placeholder="Tu nombre"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                />

                <InputField
                  label="Apellido"
                  name="apellido"
                  value={form.apellido}
                  placeholder="Tu apellido"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  }
                />
              </div>

              <InputField
                label="Correo Electrónico"
                name="email"
                type="email"
                value={form.email}
                placeholder="correo@ejemplo.com"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
              />

              <InputField
                label="Teléfono de Contacto (Opcional)"
                name="telefono_contacto"
                type="tel"
                value={form.telefono_contacto}
                placeholder="+593 99 999 9999"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />
            </div>

            {/* Cambiar Contraseña */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Seguridad
                </h3>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cambiarPassword}
                    onChange={(e) => setCambiarPassword(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Cambiar contraseña
                  </span>
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

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 px-6 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || formInvalido}
                className={`flex-1 py-3 px-6 rounded-2xl text-white font-bold text-lg shadow-xl transition-all ${
                  saving || formInvalido
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 active:scale-95"
                }`}
              >
                {saving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </span>
                ) : (
                  "💾 Guardar Cambios"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info adicional */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-xl">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-blue-800 font-semibold">💡 Consejo de seguridad</p>
              <p className="text-sm text-blue-700 mt-1">
                Te recomendamos cambiar tu contraseña cada 3 meses y usar una combinación de letras, números y símbolos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarCuentaPadre;
