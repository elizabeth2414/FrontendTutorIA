import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import {
  listarDocentesAdmin,
  listarDocentesEliminadosAdmin,
  eliminarDocenteAdmin,
  toggleDocenteAdmin,
  restaurarDocenteAdmin,
} from "../../services/adminService";

import Swal from "sweetalert2";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSchool,
  MdEmail,
  MdPerson,
  MdToggleOn,
  MdToggleOff,
  MdReplay,
} from "react-icons/md";

import ModalCrearDocente from "../../components/admin/ModalCrearDocente";
import ModalEditarDocente from "../../components/admin/ModalEditarDocente";

export default function DocentesGestion() {
  const isMobile = Capacitor.isNativePlatform();

  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [docenteEditar, setDocenteEditar] = useState(null);

  // ✅ Nuevo: ver eliminados
  const [verEliminados, setVerEliminados] = useState(false);

  const obtenerDetalleError = (error, fallback) => {
    const detail = error?.response?.data?.detail;
    if (detail) return detail;
    return fallback || "Ocurrió un error.";
  };

  const cargarDocentes = async () => {
    setLoading(true);
    try {
      const data = verEliminados
        ? await listarDocentesEliminadosAdmin()
        : await listarDocentesAdmin();
      setDocentes(data || []);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: obtenerDetalleError(error, "No se pudieron cargar los docentes"),
        icon: "error",
        confirmButtonColor: "#f97316",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarDocentes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verEliminados]);

  const toggleDocente = async (id, activo) => {
    const accion = activo ? "desactivar" : "activar";

    const confirm = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} Docente?`,
      text: activo
        ? "El docente perderá acceso al sistema. (Si tiene alumnos asignados, no se permitirá)."
        : "El docente recuperará acceso al sistema.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
      confirmButtonColor: activo ? "#f59e0b" : "#10b981",
      cancelButtonColor: "#64748b",
    });

    if (!confirm.isConfirmed) return;

    try {
      await toggleDocenteAdmin(id);
      Swal.fire({
        title: activo ? "¡Desactivado!" : "¡Activado!",
        text: `Docente ${activo ? "desactivado" : "activado"} correctamente`,
        icon: "success",
        confirmButtonColor: "#f97316",
        timer: 2000,
        showConfirmButton: false,
      });
      cargarDocentes();
    } catch (error) {
      Swal.fire({
        title: "No se pudo cambiar el estado",
        text: obtenerDetalleError(error, `No se pudo ${accion} el docente`),
        icon: "error",
        confirmButtonColor: "#f97316",
      });
    }
  };

  const eliminarDocente = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar docente?",
      html:
        "<strong>Se eliminará (soft delete).</strong><br/>" +
        "Si el docente tiene alumnos asignados, NO se permitirá.<br/><br/>" +
        "Podrás restaurarlo desde la vista de eliminados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      background: "#fff",
      backdrop: `rgba(0,0,0,0.4)`,
    });

    if (!confirm.isConfirmed) return;

    try {
      await eliminarDocenteAdmin(id);
      Swal.fire({
        title: "¡Eliminado!",
        text: "Docente eliminado correctamente",
        icon: "success",
        confirmButtonColor: "#f97316",
        timer: 2000,
        showConfirmButton: false,
      });
      cargarDocentes();
    } catch (error) {
      Swal.fire({
        title: "No se pudo eliminar",
        text: obtenerDetalleError(error, "No se pudo eliminar el docente"),
        icon: "error",
        confirmButtonColor: "#f97316",
      });
    }
  };

  const restaurarDocente = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Restaurar docente?",
      text: "El docente volverá a estar activo.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, restaurar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#64748b",
    });

    if (!confirm.isConfirmed) return;

    try {
      await restaurarDocenteAdmin(id);
      Swal.fire({
        title: "¡Restaurado!",
        text: "Docente restaurado correctamente",
        icon: "success",
        confirmButtonColor: "#f97316",
        timer: 1800,
        showConfirmButton: false,
      });
      cargarDocentes();
    } catch (error) {
      Swal.fire({
        title: "No se pudo restaurar",
        text: obtenerDetalleError(error, "No se pudo restaurar el docente"),
        icon: "error",
        confirmButtonColor: "#f97316",
      });
    }
  };

  // Estado vacío
  const EstadoVacio = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
        <MdSchool className="w-16 h-16 text-orange-600" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {verEliminados ? "No hay docentes eliminados" : "No hay docentes registrados"}
      </h3>
      <p className="text-slate-600 text-center max-w-md mb-6">
        {verEliminados
          ? "Cuando elimines un docente (soft delete), aparecerá aquí para poder restaurarlo."
          : "Comienza agregando docentes al sistema para que puedan gestionar cursos y estudiantes."}
      </p>

      {!verEliminados && (
        <button
          onClick={() => setModalCrear(true)}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:via-amber-600 hover:to-yellow-700 transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
        >
          <MdAdd size={20} />
          Crear Primer Docente
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando docentes...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
        * { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Fredoka', 'Poppins', sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>

      {/* HEADER COMÚN */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            Gestión de Docentes
          </h1>
          <p className="text-sm text-slate-600">
            {verEliminados
              ? "Vista: eliminados (puedes restaurar)"
              : "Vista: activos/no eliminados"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVerEliminados((v) => !v)}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 flex items-center gap-2"
            title="Cambiar vista"
          >
            <MdReplay />
            {verEliminados ? "Ver normales" : "Ver eliminados"}
          </button>

          {!verEliminados && (
            <button
              onClick={() => setModalCrear(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600 text-white font-semibold shadow-lg hover:from-orange-600 hover:via-amber-600 hover:to-yellow-700 transition-all"
            >
              <MdAdd size={22} />
              Crear Docente
            </button>
          )}
        </div>
      </div>

      {/* LISTA */}
      {docentes.length === 0 ? (
        <EstadoVacio />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <MdPerson className="text-orange-500" />
                      Docente
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <MdEmail className="text-orange-500" />
                      Email
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <MdSchool className="text-orange-500" />
                      Especialidad
                    </div>
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-bold text-slate-700">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {docentes.map((d, index) => (
                  <tr
                    key={d.id}
                    className={`border-b border-slate-100 hover:bg-orange-50/30 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    } ${!d.activo ? "opacity-60" : ""}`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                            d.activo
                              ? "bg-gradient-to-br from-orange-400 to-amber-500"
                              : "bg-gradient-to-br from-slate-400 to-slate-500"
                          }`}
                        >
                          {d.usuario.nombre.charAt(0)}
                          {d.usuario.apellido.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            {d.usuario.nombre} {d.usuario.apellido}
                          </span>
                          {!verEliminados && (
                            <div className="mt-1">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  d.activo
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {d.activo ? "● Activo" : "● Inactivo"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-700">{d.usuario.email}</td>

                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                        {d.especialidad || "Sin asignar"}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        {verEliminados ? (
                          <button
                            onClick={() => restaurarDocente(d.id)}
                            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-sm hover:scale-105 transition"
                            title="Restaurar"
                          >
                            Restaurar
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => toggleDocente(d.id, d.activo)}
                              className={`p-2 rounded-lg text-white transition-all shadow-sm hover:scale-105 ${
                                d.activo
                                  ? "bg-amber-500 hover:bg-amber-600"
                                  : "bg-green-500 hover:bg-green-600"
                              }`}
                              title={d.activo ? "Desactivar" : "Activar"}
                            >
                              {d.activo ? <MdToggleOff size={20} /> : <MdToggleOn size={20} />}
                            </button>

                            <button
                              onClick={() => {
                                setDocenteEditar(d);
                                setModalEditar(true);
                              }}
                              className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm hover:scale-105"
                              title="Editar"
                            >
                              <MdEdit size={20} />
                            </button>

                            <button
                              onClick={() => eliminarDocente(d.id)}
                              className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all shadow-sm hover:scale-105"
                              title="Eliminar (soft delete)"
                            >
                              <MdDelete size={20} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-3 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Total:{" "}
              <span className="font-bold text-orange-600">{docentes.length}</span>
            </p>
          </div>
        </div>
      )}

      {/* MODALES */}
      <ModalCrearDocente
        open={modalCrear}
        onClose={() => setModalCrear(false)}
        onCreated={cargarDocentes}
      />

      <ModalEditarDocente
        open={modalEditar}
        docente={docenteEditar}
        onClose={() => setModalEditar(false)}
        onUpdated={cargarDocentes}
      />
    </>
  );
}
