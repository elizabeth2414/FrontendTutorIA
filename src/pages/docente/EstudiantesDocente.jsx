import { useEffect, useState } from "react";
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
  MdWarning,
  MdCheckCircle,
  MdError,
  MdClose,
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
  
  // Modales personalizados
  const [modalConfirm, setModalConfirm] = useState({ show: false, estudiante: null });
  const [modalAlert, setModalAlert] = useState({ show: false, tipo: '', mensaje: '' });

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
      setModalAlert({ 
        show: true, 
        tipo: 'error', 
        mensaje: 'Error al cargar los datos. Intenta nuevamente.' 
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
  const eliminar = (estudiante) => {
    setModalConfirm({ show: true, estudiante });
  };

  const confirmarEliminar = async () => {
    const estudiante = modalConfirm.estudiante;
    setModalConfirm({ show: false, estudiante: null });

    try {
      await eliminarEstudianteDocente(estudiante.id);
      cargarTodo();
      setModalAlert({ 
        show: true, 
        tipo: 'success', 
        mensaje: 'Estudiante eliminado correctamente' 
      });
    } catch (err) {
      console.error("Error eliminando estudiante:", err);
      setModalAlert({ 
        show: true, 
        tipo: 'error', 
        mensaje: 'No se pudo eliminar al estudiante. Intenta nuevamente.' 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando estudiantes...</p>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <MdPeople size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white mb-0.5">Estudiantes</h1>
                <p className="text-xs text-blue-100">{estudiantesFiltrados.length} estudiantes</p>
              </div>
            </div>

            <button
              onClick={() => setMostrarCrear(true)}
              className="p-2 bg-white text-blue-600 rounded-lg shadow-md hover:bg-blue-50 transition"
            >
              <MdPersonAdd size={20} />
            </button>
          </div>
        </div>

        {/* Búsqueda móvil */}
        <div className="fixed top-20 left-0 right-0 bg-white px-4 py-3 shadow-md z-20 border-b border-slate-200">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Contenido móvil */}
        <main className="pt-36 px-4 pb-8">
          {estudiantesFiltrados.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-slate-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                {searchTerm ? (
                  <MdSearch size={32} className="text-blue-600" />
                ) : (
                  <MdPeople size={32} className="text-blue-600" />
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
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
                  className="bg-white rounded-xl shadow-md p-4 border border-slate-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-900 mb-1">
                        {e.nombre} {e.apellido}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {e.curso_nombre || '—'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          const data = await obtenerEstudianteDocente(e.id);
                          setEstudianteEditar(data);
                        }}
                        className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                      >
                        <MdEdit size={16} />
                      </button>
                      <button
                        onClick={() => eliminar(e)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600">
                    <span className="font-medium">Nivel:</span> {e.nivel_educativo || '—'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden md:block min-h-screen bg-white pt-6">
        <main className="max-w-7xl mx-auto px-6 py-6">
          {/* Header desktop */}
          <div className="flex justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                <MdPeople size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  Gestión de Estudiantes
                </h1>
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
                  className="w-64 pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={() => setMostrarCrear(true)}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition"
              >
                <MdPersonAdd size={20} />
                Agregar Estudiante
              </button>
            </div>
          </div>

          {/* Contenido desktop */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {estudiantesFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {searchTerm ? (
                    <MdSearch size={40} className="text-blue-600" />
                  ) : (
                    <MdPeople size={40} className="text-blue-600" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
                </h3>
                <p className="text-slate-500 mb-4">
                  {searchTerm 
                    ? `No hay resultados para "${searchTerm}"`
                    : 'Agrega tu primer estudiante para comenzar'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setMostrarCrear(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    <MdPersonAdd size={20} />
                    Agregar Primer Estudiante
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-bold text-slate-700">
                        Nombre
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-bold text-slate-700">
                        Apellido
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-bold text-slate-700">
                        Curso
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-bold text-slate-700">
                        Nivel
                      </th>
                      <th className="py-3 px-4 text-center text-sm font-bold text-slate-700">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {estudiantesFiltrados.map((e) => (
                      <tr
                        key={e.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                      >
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {e.nombre}
                        </td>
                        <td className="py-3 px-4 text-slate-700">{e.apellido}</td>
                        <td className="py-3 px-4 text-slate-700">{e.curso_nombre || '—'}</td>
                        <td className="py-3 px-4 text-slate-700">{e.nivel_educativo || '—'}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={async () => {
                                const data = await obtenerEstudianteDocente(e.id);
                                setEstudianteEditar(data);
                              }}
                              className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                              title="Editar estudiante"
                            >
                              <MdEdit size={18} />
                            </button>
                            <button
                              onClick={() => eliminar(e)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                              title="Eliminar estudiante"
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
            )}
          </div>
        </main>
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

      {/* MODAL DE CONFIRMACIÓN ELIMINAR */}
      {modalConfirm.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <MdWarning className="text-red-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Eliminar Estudiante
                </h3>
              </div>
              <button
                onClick={() => setModalConfirm({ show: false, estudiante: null })}
                className="p-1 hover:bg-slate-100 rounded-lg transition"
              >
                <MdClose size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-slate-700 mb-2">
                ¿Estás seguro de eliminar a <strong>{modalConfirm.estudiante?.nombre} {modalConfirm.estudiante?.apellido}</strong>?
              </p>
              <p className="text-sm text-slate-500">
                Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setModalConfirm({ show: false, estudiante: null })}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ALERTA */}
      {modalAlert.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  modalAlert.tipo === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {modalAlert.tipo === 'success' ? (
                    <MdCheckCircle className="text-green-600" size={24} />
                  ) : (
                    <MdError className="text-red-600" size={24} />
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {modalAlert.tipo === 'success' ? 'Éxito' : 'Error'}
                </h3>
              </div>
              <button
                onClick={() => setModalAlert({ show: false, tipo: '', mensaje: '' })}
                className="p-1 hover:bg-slate-100 rounded-lg transition"
              >
                <MdClose size={24} />
              </button>
            </div>

            <p className="text-slate-700 mb-6">{modalAlert.mensaje}</p>

            <button
              onClick={() => setModalAlert({ show: false, tipo: '', mensaje: '' })}
              className={`w-full px-4 py-2.5 text-white rounded-lg font-semibold transition ${
                modalAlert.tipo === 'success' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
