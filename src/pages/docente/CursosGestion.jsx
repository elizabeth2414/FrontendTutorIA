import { useEffect, useState } from "react";

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
  MdWarning,
  MdCheckCircle,
  MdError,
  MdClose,
  MdSearch,
} from "react-icons/md";

export default function CursosGestion() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalCrear, setModalCrear] = useState(false);
  const [cursoEditar, setCursoEditar] = useState(null);
  
  // Modales de confirmación
  const [modalConfirm, setModalConfirm] = useState({ show: false, tipo: '', curso: null });
  const [modalAlert, setModalAlert] = useState({ show: false, tipo: '', mensaje: '' });

  const cargarCursos = async () => {
    try {
      setLoading(true);
      const data = await listarCursos();
      setCursos(data);
    } catch (error) {
      console.error("Error cargando cursos:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  // Filtrar cursos por búsqueda
  const cursosFiltrados = cursos.filter((curso) => {
    const searchLower = searchTerm.toLowerCase();
    
    // Convertir a string y manejar valores null/undefined
    const nombre = (curso.nombre || '').toString().toLowerCase();
    const nivel = (curso.nivel || '').toString().toLowerCase();
    const codigo = (curso.codigo_acceso || '').toString().toLowerCase();
    
    return (
      nombre.includes(searchLower) ||
      nivel.includes(searchLower) ||
      codigo.includes(searchLower)
    );
  });

  const eliminar = (curso) => {
    setModalConfirm({ show: true, tipo: 'eliminar', curso });
  };

  const confirmarEliminar = async () => {
    const curso = modalConfirm.curso;
    setModalConfirm({ show: false, tipo: '', curso: null });

    try {
      await eliminarCurso(curso.id);
      cargarCursos();
      setModalAlert({ show: true, tipo: 'success', mensaje: 'Curso eliminado correctamente' });
    } catch (error) {
      console.error("Error eliminando curso:", error);
      setModalAlert({ show: true, tipo: 'error', mensaje: 'Hubo un error al eliminar el curso' });
    }
  };

  const toggleEstado = (curso) => {
    setModalConfirm({ show: true, tipo: curso.activo ? 'desactivar' : 'activar', curso });
  };

  const confirmarToggle = async () => {
    const curso = modalConfirm.curso;
    const nuevoEstado = !curso.activo;
    setModalConfirm({ show: false, tipo: '', curso: null });

    try {
      await actualizarCurso(curso.id, { ...curso, activo: nuevoEstado });
      cargarCursos();
      setModalAlert({ 
        show: true, 
        tipo: 'success', 
        mensaje: nuevoEstado ? 'Curso activado correctamente' : 'Curso desactivado correctamente' 
      });
    } catch (error) {
      console.error("Error actualizando estado del curso:", error);
      setModalAlert({ show: true, tipo: 'error', mensaje: 'Hubo un error al actualizar el estado del curso' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando cursos...</p>
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
                <MdSchool size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white mb-0.5">Cursos</h1>
                <p className="text-xs text-blue-100">{cursosFiltrados.length} cursos</p>
              </div>
            </div>

            <button
              onClick={() => setModalCrear(true)}
              className="p-2 bg-white text-blue-600 rounded-lg shadow-md hover:bg-blue-50 transition"
            >
              <MdAdd size={20} />
            </button>
          </div>
        </div>

        {/* Búsqueda móvil */}
        <div className="fixed top-20 left-0 right-0 bg-white px-4 py-3 shadow-md z-20 border-b border-slate-200">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Contenido móvil */}
        <main className="pt-36 px-4 pb-8">{/* Aumentado pt para búsqueda */}
          {cursosFiltrados.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-slate-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                {searchTerm ? (
                  <MdSearch size={32} className="text-blue-600" />
                ) : (
                  <MdSchool size={32} className="text-blue-600" />
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
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
                  className="bg-white rounded-xl shadow-md p-4 border border-slate-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-900 mb-1">
                        {curso.nombre}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          curso.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}>
                          {curso.activo ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleEstado(curso)}
                        className={`p-2 rounded-lg transition ${
                          curso.activo
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                        title={curso.activo ? "Desactivar curso" : "Activar curso"}
                      >
                        {curso.activo ? <MdToggleOff size={16} /> : <MdToggleOn size={16} />}
                      </button>
                      <button
                        onClick={() => setCursoEditar(curso)}
                        className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                        title="Editar curso"
                      >
                        <MdEdit size={16} />
                      </button>
                      <button
                        onClick={() => eliminar(curso)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        title="Eliminar curso"
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">Nivel:</span>
                      <p className="font-medium text-slate-700">{curso.nivel}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Código:</span>
                      <p className="font-medium text-slate-700">{curso.codigo_acceso}</p>
                    </div>
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
                <MdSchool size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  Gestión de Cursos
                </h1>
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
                  className="w-64 pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={() => setModalCrear(true)}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition"
              >
                <MdAdd size={20} />
                Nuevo Curso
              </button>
            </div>
          </div>

          {/* Contenido desktop */}
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
            {cursosFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {searchTerm ? (
                    <MdSearch size={40} className="text-blue-600" />
                  ) : (
                    <MdSchool size={40} className="text-blue-600" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {searchTerm ? 'No se encontraron cursos' : 'No hay cursos registrados'}
                </h3>
                <p className="text-slate-500 mb-4">
                  {searchTerm 
                    ? `No hay resultados para "${searchTerm}"`
                    : 'Crea tu primer curso para comenzar a gestionar estudiantes'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setModalCrear(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    <MdAdd size={20} />
                    Crear Primer Curso
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
                        Nivel
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-bold text-slate-700">
                        Código
                      </th>
                      <th className="py-3 px-4 text-center text-sm font-bold text-slate-700">
                        Estado
                      </th>
                      <th className="py-3 px-4 text-center text-sm font-bold text-slate-700">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {cursosFiltrados.map((curso) => (
                      <tr
                        key={curso.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                      >
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {curso.nombre}
                        </td>
                        <td className="py-3 px-4 text-slate-700">{curso.nivel}</td>
                        <td className="py-3 px-4 text-slate-700 font-mono text-sm">
                          {curso.codigo_acceso}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              curso.activo
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {curso.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => toggleEstado(curso)}
                              className={`p-2 rounded-lg transition ${
                                curso.activo
                                  ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              }`}
                              title={curso.activo ? "Desactivar curso" : "Activar curso"}
                            >
                              {curso.activo ? <MdToggleOff size={18} /> : <MdToggleOn size={18} />}
                            </button>
                            <button
                              onClick={() => setCursoEditar(curso)}
                              className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                              title="Editar curso"
                            >
                              <MdEdit size={18} />
                            </button>
                            <button
                              onClick={() => eliminar(curso)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                              title="Eliminar curso"
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

      {/* MODALES - Se muestran igual en móvil y desktop */}
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

      {/* MODAL DE CONFIRMACIÓN */}
      {modalConfirm.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  modalConfirm.tipo === 'eliminar' 
                    ? 'bg-red-100' 
                    : modalConfirm.tipo === 'desactivar'
                    ? 'bg-orange-100'
                    : 'bg-blue-100'
                }`}>
                  {modalConfirm.tipo === 'eliminar' ? (
                    <MdDelete className="text-red-600" size={24} />
                  ) : modalConfirm.tipo === 'desactivar' ? (
                    <MdToggleOff className="text-orange-600" size={24} />
                  ) : (
                    <MdToggleOn className="text-blue-600" size={24} />
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {modalConfirm.tipo === 'eliminar' 
                    ? 'Eliminar Curso' 
                    : modalConfirm.tipo === 'desactivar'
                    ? 'Desactivar Curso'
                    : 'Activar Curso'}
                </h3>
              </div>
              <button
                onClick={() => setModalConfirm({ show: false, tipo: '', curso: null })}
                className="p-1 hover:bg-slate-100 rounded-lg transition"
              >
                <MdClose size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-slate-700 mb-2">
                {modalConfirm.tipo === 'eliminar' 
                  ? `¿Estás seguro de eliminar el curso "${modalConfirm.curso?.nombre}"?`
                  : modalConfirm.tipo === 'desactivar'
                  ? `¿Desactivar el curso "${modalConfirm.curso?.nombre}"?`
                  : `¿Activar el curso "${modalConfirm.curso?.nombre}"?`}
              </p>
              <p className="text-sm text-slate-500">
                {modalConfirm.tipo === 'eliminar' 
                  ? 'Esta acción no se puede deshacer.'
                  : modalConfirm.tipo === 'desactivar'
                  ? 'Los estudiantes no podrán acceder a este curso mientras esté inactivo.'
                  : 'Los estudiantes podrán acceder nuevamente a este curso.'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setModalConfirm({ show: false, tipo: '', curso: null })}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={modalConfirm.tipo === 'eliminar' ? confirmarEliminar : confirmarToggle}
                className={`flex-1 px-4 py-2.5 text-white rounded-lg font-semibold transition ${
                  modalConfirm.tipo === 'eliminar'
                    ? 'bg-red-600 hover:bg-red-700'
                    : modalConfirm.tipo === 'desactivar'
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {modalConfirm.tipo === 'eliminar' 
                  ? 'Eliminar' 
                  : modalConfirm.tipo === 'desactivar'
                  ? 'Desactivar'
                  : 'Activar'}
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
