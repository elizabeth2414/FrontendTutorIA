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
  MdCheckCircle,
  MdError,
  MdSave,
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

  // ══════════════════════════════════════════════════════
  // VALIDACIONES ESTRICTAS
  // ══════════════════════════════════════════════════════
  const validateField = (name, value) => {
    let msg = "";
    
    // Solo letras, espacios, tildes y ñ (NO números ni símbolos)
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    
    // Solo números, +, -, espacios, paréntesis
    const soloTelefono = /^[0-9+\-\s()]+$/;
    
    // Email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === "nombre") {
      if (!value.trim()) {
        msg = "El nombre es obligatorio";
      } else if (value.trim().length < 2) {
        msg = "Debe tener al menos 2 caracteres";
      } else if (!soloLetras.test(value)) {
        msg = "Solo se permiten letras (sin números ni símbolos)";
      }
    }

    if (name === "apellido") {
      if (!value.trim()) {
        msg = "El apellido es obligatorio";
      } else if (value.trim().length < 2) {
        msg = "Debe tener al menos 2 caracteres";
      } else if (!soloLetras.test(value)) {
        msg = "Solo se permiten letras (sin números ni símbolos)";
      }
    }

    if (name === "email") {
      if (!value.trim()) {
        msg = "El correo es obligatorio";
      } else if (!emailRegex.test(value)) {
        msg = "Formato de correo inválido";
      }
    }

    if (name === "telefono_contacto" && value) {
      if (!soloTelefono.test(value)) {
        msg = "Solo números y símbolos: + - ( )";
      } else if (value.replace(/[^0-9]/g, "").length < 7) {
        msg = "Teléfono muy corto";
      }
    }

    if (name === "passwordNueva" && cambiarPassword) {
      if (value && value.length < 6) {
        msg = "Mínimo 6 caracteres";
      }
    }

    if (name === "passwordConfirmar" && cambiarPassword) {
      if (value !== form.passwordNueva) {
        msg = "Las contraseñas no coinciden";
      }
    }

    if (name === "passwordActual" && cambiarPassword) {
      if (!value && form.passwordNueva) {
        msg = "Debes ingresar tu contraseña actual";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
    return msg === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación en tiempo real para campos que solo aceptan letras
    if ((name === "nombre" || name === "apellido") && value) {
      const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;
      if (!soloLetras.test(value)) {
        return; // No permitir que se escriba
      }
    }
    
    // Validación en tiempo real para teléfono
    if (name === "telefono_contacto" && value) {
      const soloTelefono = /^[0-9+\-\s()]*$/;
      if (!soloTelefono.test(value)) {
        return; // No permitir que se escriba
      }
    }
    
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const validaciones = {
      nombre: validateField("nombre", form.nombre),
      apellido: validateField("apellido", form.apellido),
      email: validateField("email", form.email),
    };
    
    if (form.telefono_contacto) {
      validaciones.telefono_contacto = validateField("telefono_contacto", form.telefono_contacto);
    }
    
    if (cambiarPassword) {
      validaciones.passwordActual = validateField("passwordActual", form.passwordActual);
      validaciones.passwordNueva = validateField("passwordNueva", form.passwordNueva);
      validaciones.passwordConfirmar = validateField("passwordConfirmar", form.passwordConfirmar);
    }
    
    // Si hay errores, no continuar
    if (!Object.values(validaciones).every(v => v)) {
      setErrorMsg("Por favor corrige los errores antes de guardar");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const dataActualizar = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        telefono_contacto: form.telefono_contacto ? form.telefono_contacto.trim() : null,
      };

      if (cambiarPassword && form.passwordNueva) {
        if (!form.passwordActual) {
          setErrorMsg("Debes ingresar tu contraseña actual");
          setSaving(false);
          return;
        }
        if (form.passwordNueva !== form.passwordConfirmar) {
          setErrorMsg("Las contraseñas nuevas no coinciden");
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
        email: datosActualizados.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccessMsg("Datos actualizados correctamente");
      setForm({
        ...form,
        passwordActual: "",
        passwordNueva: "",
        passwordConfirmar: "",
      });
      setCambiarPassword(false);

      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
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

  // ══════════════════════════════════════════════════════
  // INPUT FIELD COMPONENT
  // ══════════════════════════════════════════════════════
  const InputField = ({ label, name, type = "text", placeholder, icon: Icon, value, showToggle = false, mobile = false }) => {
    const hasError = errors[name];
    const isValid = value && !hasError;

    return (
      <div>
        <label className={`text-slate-700 font-bold block mb-2 ${mobile ? 'text-xs' : 'text-sm'}`}>
          {label}
        </label>
        <div className="relative">
          <input
            type={showToggle && showPasswords[name] ? "text" : type}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={(e) => validateField(name, e.target.value)}
            placeholder={placeholder}
            className={`w-full ${Icon ? 'pl-11' : 'pl-4'} ${showToggle ? 'pr-11' : 'pr-4'} rounded-xl border-2 bg-white outline-none transition-all ${
              mobile ? 'py-2.5 text-sm' : 'py-3 text-base'
            } ${
              hasError
                ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                : isValid
                  ? "border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  : "border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            }`}
          />
          
          {/* Icono izquierda */}
          {Icon && (
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              hasError ? "text-rose-500" : isValid ? "text-emerald-500" : "text-slate-400"
            }`}>
              <Icon size={mobile ? 18 : 20} />
            </div>
          )}
          
          {/* Toggle password o check/error */}
          {showToggle ? (
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, [name]: !showPasswords[name] })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPasswords[name] ? (
                <MdVisibility size={mobile ? 18 : 20} />
              ) : (
                <MdVisibilityOff size={mobile ? 18 : 20} />
              )}
            </button>
          ) : (
            <>
              {isValid && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                  <MdCheckCircle size={mobile ? 18 : 20} />
                </div>
              )}
              {hasError && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500">
                  <MdError size={mobile ? 18 : 20} />
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Mensaje de error */}
        {hasError && (
          <div className="flex items-center gap-1.5 mt-1.5 ml-1">
            <MdError size={14} className="text-rose-600 flex-shrink-0" />
            <p className="text-rose-600 text-xs font-medium">{hasError}</p>
          </div>
        )}
      </div>
    );
  };

  // ══════════════════════════════════════════════════════
  // LOADING STATE
  // ══════════════════════════════════════════════════════
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
          </div>
          <p className="text-slate-700 font-bold">Cargando datos...</p>
          <p className="text-sm text-slate-500 mt-1">Espera un momento</p>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
        * { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif; }
        h1,h2,h3,h4,h5,h6 { font-family: 'Fredoka', 'Poppins', sans-serif; }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .alert-anim { animation: slideDown 0.3s ease-out; }
      `}</style>

      {/* ════════════════════════════════════════════
          VERSIÓN MÓVIL
          ════════════════════════════════════════════ */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        
        {/* Header móvil */}
        <div className="bg-white rounded-b-2xl shadow-sm px-4 pt-4 pb-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-slate-400 active:text-emerald-600 transition-colors mb-3"
          >
            <MdArrowBack size={18} />
            <span className="text-sm font-bold">Volver</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <MdEdit size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Editar Cuenta</h1>
              <p className="text-xs text-slate-500">Actualiza tu información</p>
            </div>
          </div>
        </div>

        {/* Contenido móvil */}
        <main className="px-4 py-5 pb-8">
          
          {/* Alertas */}
          {errorMsg && (
            <div className="alert-anim bg-rose-50 border-l-4 border-rose-500 rounded-xl p-3.5 mb-4 shadow-sm">
              <div className="flex items-start gap-3">
                <MdError size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-rose-700 font-medium">{errorMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="alert-anim bg-emerald-50 border-l-4 border-emerald-500 rounded-xl p-3.5 mb-4 shadow-sm">
              <div className="flex items-start gap-3">
                <MdCheckCircle size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-700 font-medium">{successMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleGuardar} className="space-y-4">
            
            {/* Información Personal */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500"></div>
              <div className="p-4">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <MdPerson size={20} className="text-emerald-600" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Información Personal</h2>
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
            </div>

            {/* Seguridad */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600"></div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
                      <MdLock size={20} className="text-teal-600" />
                    </div>
                    <h2 className="text-sm font-bold text-slate-900">Seguridad</h2>
                  </div>
                  
                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => setCambiarPassword(!cambiarPassword)}
                    className={`relative inline-flex items-center rounded-full transition-all h-6 w-11 ${
                      cambiarPassword
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm shadow-emerald-500/30"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block transform rounded-full bg-white transition-all shadow-sm h-5 w-5 ${
                        cambiarPassword ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
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
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={saving || formInvalido}
                className={`w-full py-3.5 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                  saving || formInvalido
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white active:scale-95 shadow-emerald-500/20"
                }`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <MdSave size={20} />
                    Guardar Cambios
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all active:scale-95"
              >
                Cancelar
              </button>
            </div>

            {/* Info */}
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-teal-100 border border-teal-300 flex items-center justify-center flex-shrink-0">
                  <MdLock size={16} className="text-teal-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-teal-900 mb-1">Seguridad de contraseña</p>
                  <p className="text-xs text-teal-700">Usa una combinación de letras, números y símbolos para mayor seguridad.</p>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>

      {/* ════════════════════════════════════════════
          VERSIÓN DESKTOP
          ════════════════════════════════════════════ */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
        <main className="max-w-4xl mx-auto px-6">
          
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 transition-all text-sm mb-4 active:scale-95"
            >
              <MdArrowBack size={18} />
              Volver
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <MdEdit size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Editar Cuenta</h1>
                <p className="text-sm text-slate-600">Actualiza tu información personal</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            
            {/* Alertas */}
            {errorMsg && (
              <div className="alert-anim bg-rose-50 border-l-4 border-rose-500 rounded-xl p-4 mb-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <MdError size={22} className="text-rose-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-rose-700 font-medium">{errorMsg}</p>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="alert-anim bg-emerald-50 border-l-4 border-emerald-500 rounded-xl p-4 mb-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <MdCheckCircle size={22} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-700 font-medium">{successMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleGuardar} className="space-y-6">
              
              {/* Información Personal */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <MdPerson size={24} className="text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Información Personal</h2>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-5">
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

                <div className="space-y-5">
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

              {/* Seguridad */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
                      <MdLock size={24} className="text-teal-600" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Seguridad</h2>
                  </div>
                  
                  <label className="flex items-center cursor-pointer gap-3">
                    <span className="text-sm font-semibold text-slate-700">Cambiar contraseña</span>
                    <button
                      type="button"
                      onClick={() => setCambiarPassword(!cambiarPassword)}
                      className={`relative inline-flex items-center rounded-full transition-all h-7 w-12 ${
                        cambiarPassword
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm shadow-emerald-500/30"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block transform rounded-full bg-white transition-all shadow-sm h-6 w-6 ${
                          cambiarPassword ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </label>
                </div>

                {cambiarPassword && (
                  <div className="space-y-5">
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
                  className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all active:scale-95"
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  disabled={saving || formInvalido}
                  className={`flex-1 py-3.5 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                    saving || formInvalido
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white hover:shadow-xl shadow-emerald-500/20 active:scale-95"
                  }`}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <MdSave size={22} />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Info */}
          <div className="mt-6 bg-teal-50 border border-teal-200 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-300 flex items-center justify-center flex-shrink-0">
                <MdLock size={20} className="text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-teal-900 mb-1">Consejo de seguridad</p>
                <p className="text-sm text-teal-700">Te recomendamos cambiar tu contraseña cada 3 meses y usar una combinación de letras mayúsculas, minúsculas, números y símbolos.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default EditarCuentaPadre;
