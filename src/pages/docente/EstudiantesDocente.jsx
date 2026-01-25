import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  getEstudiantesDocente,
  getCursosDocente,
  eliminarEstudianteDocente,
  obtenerEstudianteDocente,
} from "../../services/docentesService";

import { 
  MdPersonAdd, 
  MdEdit, 
  MdDelete, 
  MdPeople,
  MdSearch,
} from "react-icons/md";

import ModalCrearEstudiante from "../../components/docente/ModalCrearEstudiante";
import ModalEditarEstudiante from "../../components/docente/ModalEditarEstudiante";

export default function EstudiantesDocente() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [estudianteEditar, setEstudianteEditar] = useState(null);

  // ==========================
  // CARGAR TODO
  // ==========================
  const cargarTodo = async () => {
    try {
      setLoading(true);
      const [estData, cursosData] = await Promise.all([
        getEstudiantesDocente(),
        getCursosDocente(),
      ]);

      setEstudiantes(estData || []);
      setCursos(cursosData || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los datos. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  // ==========================
  // FILTRAR ESTUDIANTES
  // ==========================
  const estudiantesFiltrados = estudiantes.filter((estudiante) => {
    const searchLower = searchTerm.toLowerCase();
    
    const nombre = (estudiante.nombre || '').toString().toLowerCase();
    const apellido = (estudiante.apellido || '').toString().toLowerCase();
    const curso = (estudiante.curso_nombre || '').toString().toLowerCase();
    
    return (
      nombre.includes(searchLower) ||
      apellido.includes(searchLower) ||
      curso.includes(searchLower)
    );
  });

  // ==========================
  // ELIMINAR
  // ==========================
  const eliminar = async (estudiante) => {
    const confirm = await Swal.fire({
      title: "⚠️ ¿Eliminar Estudiante?",
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p style="margin-bottom: 1rem;">
            <strong>Estudiante:</strong> ${estudiante.nombre} ${estudiante.apellido}
          </p>
          <p style="margin-bottom: 1rem;">
            <strong>Curso:</strong> ${estudiante.curso_nombre || 'Sin curso'}
          </p>
          <p style="color: #64748b; font-size: 0.875rem;">
            Esta acción no se puede deshacer.
          </p>
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
      await eliminarEstudianteDocente(estudiante.id);
      
      await Swal.fire({
        title: "¡Eliminado!",
        text: "Estudiante eliminado correctamente",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        showConfirmButton: false,
      });

      cargarTodo();
    } catch (err) {
      console.error("Error eliminando estudiante:", err);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar al estudiante. Intenta nuevamente.",
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
          <p className="text-slate-600 font-medium">Cargando estudiantes...</p>
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
          <h1 className="text-xl font-bold text-slate-900 mb-1">Gestión de Estudiantes</h1>
          <p className="text-sm text-slate-600">Administra los estudiantes de tus cursos</p>
        </div>

        {/* Botón crear móvil */}
        <button
          onClick={() => setMostrarCrear(true)}
          className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all"
        >
          <MdPersonAdd size={22} />
          Agregar Estudiante
        </button>

        {/* Búsqueda móvil */}
        <div className="mb-4">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Lista móvil */}
        {estudiantesFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-slate-200">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              {searchTerm ? (
                <MdSearch size={32} className="text-purple-600" />
              ) : (
                <MdPeople size={32} className="text-purple-600" />
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes'}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {searchTerm 
                ? 'Intenta con otro término de búsqueda'
                : 'Agrega tu primer estudiante para comenzar'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setMostrarCrear(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white rounded-lg font-semibold shadow-lg"
              >
                <MdPersonAdd size={18} />
                Agregar Estudiante
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {estudiantesFiltrados.map((e) => (
              <div
                key={e.id}
                className="bg-white rounded-xl shadow-sm p-4 border border-slate-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">
                      {e.nombre} {e.apellido}
                    </h3>
                    <div className="flex flex-col gap-1">
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold inline-block w-fit">
                        {e.curso_nombre || 'Sin curso'}
                      </span>
                      <span className="text-xs text-slate-500">
                        Nivel {e.nivel_educativo || '—'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        const data = await obtenerEstudianteDocente(e.id);
                        setEstudianteEditar(data);
                      }}
                      className="p-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white transition-all shadow-sm"
                    >
                      <MdEdit size={16} />
                    </button>
                    <button
                      onClick={() => eliminar(e)}
                      className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all shadow-sm"
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
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
                <MdPeople size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Gestión de Estudiantes</h1>
                <p className="text-sm text-slate-600">
                  Administra los estudiantes de tus cursos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Búsqueda desktop */}
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar estudiante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={() => setMostrarCrear(true)}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all"
              >
                <MdPersonAdd size={20} />
                Agregar Estudiante
              </button>
            </div>
          </div>
        </div>

        {/* Contenido desktop */}
        {estudiantesFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-slate-200">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {searchTerm ? (
                <MdSearch size={40} className="text-purple-600" />
              ) : (
                <MdPeople size={40} className="text-purple-600" />
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm 
                ? `No hay resultados para "${searchTerm}"`
                : 'Agrega tu primer estudiante para comenzar'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setMostrarCrear(true)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all"
              >
                <MdPersonAdd size={20} />
                Agregar Primer Estudiante
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
                        <MdPeople className="text-purple-500" />
                        Nombre
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-bold text-slate-700">
                      Apellido
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-bold text-slate-700">
                      Curso
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-bold text-slate-700">
                      Nivel
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-slate-700">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {estudiantesFiltrados.map((e, index) => (
                    <tr
                      key={e.id}
                      className={`border-b border-slate-100 hover:bg-purple-50/30 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        {e.nombre}
                      </td>
                      <td className="py-4 px-6 text-slate-700">{e.apellido}</td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          {e.curso_nombre || 'Sin curso'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-700">Nivel {e.nivel_educativo || '—'}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={async () => {
                              const data = await obtenerEstudianteDocente(e.id);
                              setEstudianteEditar(data);
                            }}
                            className="p-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white transition-all shadow-sm hover:scale-105"
                            title="Editar"
                          >
                            <MdEdit size={18} />
                          </button>
                          <button
                            onClick={() => eliminar(e)}
                            className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all shadow-sm hover:scale-105"
                            title="Eliminar"
                          >
                            <MdDelete size={18} />
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
                Total de estudiantes: <span className="font-bold text-purple-600">{estudiantesFiltrados.length}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL CREAR */}
      {mostrarCrear && (
        <ModalCrearEstudiante
          cursos={cursos}
          onClose={() => setMostrarCrear(false)}
          onCreated={cargarTodo}
        />
      )}

      {/* MODAL EDITAR */}
      {estudianteEditar && (
        <ModalEditarEstudiante
          estudiante={estudianteEditar}
          cursos={cursos}
          onClose={() => setEstudianteEditar(null)}
          onUpdated={cargarTodo}
        />
      )}
    </>
  );
}
