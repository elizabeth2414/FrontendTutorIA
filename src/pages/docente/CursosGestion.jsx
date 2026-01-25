import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  listarCursos,
  eliminarCurso,
  actualizarCurso,
} from "../../services/cursosService";

import ModalCrearCurso from "../../components/cursos/ModalCrearCurso";
import ModalEditarCurso from "../../components/cursos/ModalEditarCurso";

import {
  MdDelete,
  MdEdit,
  MdAdd,
  MdSchool,
  MdToggleOn,
  MdToggleOff,
  MdSearch,
} from "react-icons/md";

export default function CursosGestion() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalCrear, setModalCrear] = useState(false);
  const [cursoEditar, setCursoEditar] = useState(null);

  const cargarCursos = async () => {
    try {
      setLoading(true);
      const data = await listarCursos();
      console.log("Cursos cargados:", data);
      setCursos(data || []);
    } catch (error) {
      console.error("Error cargando cursos:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los cursos",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  // Filtrar cursos por búsqueda
  const cursosFiltrados = cursos.filter((curso) => {
    const searchLower = searchTerm.toLowerCase();
    
    const nombre = (curso.nombre || '').toString().toLowerCase();
    const nivel = (curso.nivel || '').toString().toLowerCase();
    const codigo = (curso.codigo_acceso || '').toString().toLowerCase();
    
    return (
      nombre.includes(searchLower) ||
      nivel.includes(searchLower) ||
      codigo.includes(searchLower)
    );
  });

  const eliminar = async (curso) => {
    // Modal de confirmación
    const confirm = await Swal.fire({
      title: "⚠️ ¿Eliminar Curso?",
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p style="margin-bottom: 1rem;"><strong>Curso:</strong> ${curso.nombre}</p>
          <p style="margin-bottom: 1rem;"><strong>Nivel:</strong> ${curso.nivel}</p>
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
            <p style="margin: 0; color: #92400e; font-size: 0.875rem;">
              <strong>⚠️ Advertencia:</strong> Si este curso tiene estudiantes inscritos, lecturas o actividades, NO podrá ser eliminado.
            </p>
          </div>
          <p style="color: #64748b; font-size: 0.875rem;">Esta acción no se puede deshacer.</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      await eliminarCurso(curso.id);
      
      await Swal.fire({
        title: "¡Eliminado!",
        text: "El curso ha sido eliminado correctamente",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        showConfirmButton: false,
      });

      cargarCursos();
    } catch (error) {
      console.error("Error eliminando curso:", error);
      
      // Detectar tipo de error
      const errorMsg = error?.response?.data?.detail || error?.message || "";
      
      console.log("Error completo:", error);
      console.log("Mensaje de error:", errorMsg);
      
      // Error de relaciones (foreign key)
      if (errorMsg.toLowerCase().includes("foreign") || 
          errorMsg.toLowerCase().includes("constraint") ||
          errorMsg.toLowerCase().includes("estudiante") ||
          errorMsg.toLowerCase().includes("lectura") ||
          errorMsg.toLowerCase().includes("actividad") ||
          errorMsg.toLowerCase().includes("relacionados")) {
        
        await Swal.fire({
          title: "No se puede eliminar",
          html: `
            <div style="text-align: left; padding: 1rem;">
              <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                <p style="margin: 0; color: #991b1b; font-size: 0.875rem;">
                  <strong>Este curso tiene datos relacionados:</strong>
                </p>
                <ul style="margin-top: 0.5rem; margin-bottom: 0; padding-left: 1.5rem; color: #991b1b; font-size: 0.875rem;">
                  <li>Estudiantes inscritos</li>
                  <li>Lecturas creadas</li>
                  <li>Actividades asociadas</li>
                </ul>
              </div>
              <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.5rem;">
                <strong>Opciones disponibles:</strong>
              </p>
              <ul style="margin-top: 0; padding-left: 1.5rem; color: #64748b; font-size: 0.875rem;">
                <li>Desactiva el curso para que no aparezca en listados</li>
                <li>Elimina primero los datos relacionados</li>
                <li>Contacta al administrador del sistema</li>
              </ul>
            </div>
          `,
          icon: "error",
          confirmButtonColor: "#9333ea",
          confirmButtonText: "Entendido",
        });
      } else {
        // Error genérico
        await Swal.fire({
          title: "Error",
          html: `
            <div style="text-align: left; padding: 1rem;">
              <p style="margin-bottom: 1rem;">No se pudo eliminar el curso.</p>
              <div style="background: #f1f5f9; padding: 0.75rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.75rem; color: #475569;">
                ${errorMsg || 'Error desconocido'}
              </div>
            </div>
          `,
          icon: "error",
          confirmButtonColor: "#9333ea",
        });
      }
    }
  };

  const toggleEstado = async (curso) => {
    const accion = curso.activo ? "desactivar" : "activar";
    
    const confirm = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} Curso?`,
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p style="margin-bottom: 1rem;"><strong>Curso:</strong> ${curso.nombre}</p>
          <p style="color: #64748b; font-size: 0.875rem;">
            ${curso.activo 
              ? "Los estudiantes no podrán acceder a este curso mientras esté inactivo."
              : "Los estudiantes podrán acceder nuevamente a este curso."}
          </p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
      confirmButtonColor: curso.activo ? "#f59e0b" : "#10b981",
      cancelButtonColor: "#64748b",
    });

    if (!confirm.isConfirmed) return;

    try {
      await actualizarCurso(curso.id, { ...curso, activo: !curso.activo });
      
      await Swal.fire({
        title: curso.activo ? "¡Desactivado!" : "¡Activado!",
        text: `Curso ${curso.activo ? "desactivado" : "activado"} correctamente`,
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        showConfirmButton: false,
      });

      cargarCursos();
    } catch (error) {
      console.error("Error actualizando estado:", error);
      Swal.fire({
        title: "Error",
        text: `No se pudo ${accion} el curso`,
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
        
        * {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Fredoka', 'Poppins', sans-serif;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      {/* VERSIÓN MÓVIL */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 animate-fadeIn p-4">
        {/* Header móvil */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-slate-900 mb-1">Gestión de Cursos</h1>
          <p className="text-sm text-slate-600">Administra los cursos del sistema</p>
        </div>

        {/* Botón crear móvil */}
        <button
          onClick={() => setModalCrear(true)}
          className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all"
        >
          <MdAdd size={22} />
          Crear Curso
        </button>

        {/* Búsqueda móvil */}
        <div className="mb-4">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Lista móvil */}
        {cursosFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-slate-200">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              {searchTerm ? (
                <MdSearch size={32} className="text-purple-600" />
              ) : (
                <MdSchool size={32} className="text-purple-600" />
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {searchTerm ? 'No se encontraron cursos' : 'No hay cursos'}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {searchTerm 
                ? 'Intenta con otro término de búsqueda'
                : 'Crea tu primer curso para comenzar'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setModalCrear(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white rounded-lg font-semibold shadow-lg"
              >
                <MdAdd size={18} />
                Crear Curso
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {cursosFiltrados.map((curso) => (
              <div
                key={curso.id}
                className={`bg-white rounded-xl shadow-sm p-4 border border-slate-200 ${
                  !curso.activo ? 'opacity-60' : ''
                }`}
              >
                {/* Nombre y badge de estado */}
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    {curso.nombre}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      curso.activo
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {curso.activo ? "● Activo" : "● Inactivo"}
                    </span>
                    <span className="text-xs text-slate-500">Nivel {curso.nivel}</span>
                  </div>
                </div>

                {/* Código */}
                <div className="mb-3">
                  <span className="text-xs text-slate-500">Código de acceso:</span>
                  <p className="font-mono text-sm font-semibold text-purple-600">{curso.codigo_acceso}</p>
                </div>

                {/* Acciones */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => toggleEstado(curso)}
                    className={`flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-white font-semibold text-xs transition-all shadow-sm ${
                      curso.activo 
                        ? 'bg-amber-500 hover:bg-amber-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                    title={curso.activo ? 'Desactivar' : 'Activar'}
                  >
                    {curso.activo ? <MdToggleOff size={18} /> : <MdToggleOn size={18} />}
                    {curso.activo ? 'Desact.' : 'Activar'}
                  </button>
                  <button
                    onClick={() => setCursoEditar(curso)}
                    className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white font-semibold text-xs transition-all shadow-sm"
                  >
                    <MdEdit size={18} />
                    Editar
                  </button>
                  <button
                    onClick={() => eliminar(curso)}
                    className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-xs transition-all shadow-sm"
                  >
                    <MdDelete size={18} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 animate-fadeIn p-6">
        {/* Header desktop */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 text-white flex items-center justify-center shadow-lg">
                <MdSchool size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Gestión de Cursos</h1>
                <p className="text-sm text-slate-600">
                  Administra los cursos de tu institución
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Búsqueda desktop */}
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar curso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={() => setModalCrear(true)}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all"
              >
                <MdAdd size={20} />
                Nuevo Curso
              </button>
            </div>
          </div>
        </div>

        {/* Contenido desktop */}
        {cursosFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-slate-200">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {searchTerm ? (
                <MdSearch size={40} className="text-purple-600" />
              ) : (
                <MdSchool size={40} className="text-purple-600" />
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {searchTerm ? 'No se encontraron cursos' : 'No hay cursos registrados'}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm 
                ? `No hay resultados para "${searchTerm}"`
                : 'Crea tu primer curso para comenzar a gestionar estudiantes'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setModalCrear(true)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all"
              >
                <MdAdd size={20} />
                Crear Primer Curso
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <MdSchool className="text-purple-500" />
                        Nombre
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-bold text-slate-700">
                      Nivel
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-bold text-slate-700">
                      Código
                    </th>
                    {/* ❌ COLUMNA ESTADO ELIMINADA */}
                    <th className="py-4 px-6 text-center text-sm font-bold text-slate-700">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {cursosFiltrados.map((curso, index) => (
                    <tr
                      key={curso.id}
                      className={`border-b border-slate-100 hover:bg-purple-50/30 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      } ${!curso.activo ? 'opacity-60' : ''}`}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <span className="font-semibold text-slate-900 block mb-1">
                            {curso.nombre}
                          </span>
                          {/* Badge de estado debajo del nombre */}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold inline-block ${
                            curso.activo 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {curso.activo ? '● Activo' : '● Inactivo'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-700">Nivel {curso.nivel}</td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm font-semibold text-purple-600">
                          {curso.codigo_acceso}
                        </span>
                      </td>
                      {/* ❌ CELDA ESTADO ELIMINADA */}
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => toggleEstado(curso)}
                            className={`p-2 rounded-lg text-white transition-all shadow-sm hover:scale-105 ${
                              curso.activo 
                                ? 'bg-amber-500 hover:bg-amber-600' 
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                            title={curso.activo ? 'Desactivar' : 'Activar'}
                          >
                            {curso.activo ? <MdToggleOff size={20} /> : <MdToggleOn size={20} />}
                          </button>
                          <button
                            onClick={() => setCursoEditar(curso)}
                            className="p-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white transition-all shadow-sm hover:scale-105"
                            title="Editar"
                          >
                            <MdEdit size={20} />
                          </button>
                          <button
                            onClick={() => eliminar(curso)}
                            className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all shadow-sm hover:scale-105"
                            title="Eliminar permanentemente"
                          >
                            <MdDelete size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer tabla */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-3 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Total de cursos: <span className="font-bold text-purple-600">{cursosFiltrados.length}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MODALES */}
      {modalCrear && (
        <ModalCrearCurso
          onClose={() => setModalCrear(false)}
          onCreated={cargarCursos}
        />
      )}

      {cursoEditar && (
        <ModalEditarCurso
          curso={cursoEditar}
          onClose={() => setCursoEditar(null)}
          onUpdated={cargarCursos}
        />
      )}
    </>
  );
}
