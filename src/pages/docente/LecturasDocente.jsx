import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  listarLecturas,
  crearLectura,
  actualizarLectura,
  eliminarLectura,
} from "../../services/lecturasService";

import { listarCategorias } from "../../services/categoriasService";
import { getCursosDocente } from "../../services/docentesService";
import { generarActividadesIA } from "../../services/iaActividadesService";

import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdLibraryBooks,
  MdAutoStories,
  MdSmartToy,
  MdSearch,
  MdWarning,
  MdCheckCircle,
  MdError,
} from "react-icons/md";

import ModalCrearLectura from "../../components/lecturas/ModalCrearLectura";
import ModalEditarLectura from "../../components/lecturas/ModalEditarLectura";

export default function LecturasDocente() {
  const navigate = useNavigate();

  const [lecturas, setLecturas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [lecturaEdit, setLecturaEdit] = useState(null);

  const [generandoIA, setGenerandoIA] = useState(false);

  // Modales personalizados
  const [modalConfirm, setModalConfirm] = useState({ show: false, lectura: null, type: '' });
  const [modalAlert, setModalAlert] = useState({ show: false, tipo: '', mensaje: '' });

  // ==========================================================
  // Cargar información
  // ==========================================================
  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    try {
      setLoading(true);
      const [lec, cat, crs] = await Promise.all([
        listarLecturas(),
        listarCategorias(),
        getCursosDocente(),
      ]);

      setLecturas(lec);
      setCategorias(cat);
      setCursos(crs);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setModalAlert({
        show: true,
        tipo: 'error',
        mensaje: 'Error al cargar las lecturas. Intenta nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // Filtrar lecturas
  // ==========================================================
  const lecturasFiltradas = lecturas.filter((lectura) => {
    const searchLower = searchTerm.toLowerCase();
    const titulo = (lectura.titulo || '').toString().toLowerCase();
    const cursoNombre = cursos.find(c => c.id === lectura.curso_id)?.nombre?.toLowerCase() || '';
    const categoriaNombre = categorias.find(c => c.id === lectura.categoria_id)?.nombre?.toLowerCase() || '';
    
    return titulo.includes(searchLower) || 
           cursoNombre.includes(searchLower) || 
           categoriaNombre.includes(searchLower);
  });

  // ==========================================================
  // Modales
  // ==========================================================
  const abrirModalCrear = () => {
    setModalCrear(true);
  };

  const abrirModalEditar = (lec) => {
    setLecturaEdit(lec);
    setModalEditar(true);
  };

  const cerrarModales = () => {
    setModalCrear(false);
    setModalEditar(false);
    setLecturaEdit(null);
  };

  // ==========================================================
  // Eliminar lectura
  // ==========================================================
  const handleEliminar = (lectura) => {
    setModalConfirm({ show: true, lectura, type: 'delete' });
  };

  const confirmarEliminar = async () => {
    const lectura = modalConfirm.lectura;
    setModalConfirm({ show: false, lectura: null, type: '' });

    try {
      await eliminarLectura(lectura.id);
      await cargarTodo();
      setModalAlert({
        show: true,
        tipo: 'success',
        mensaje: 'Lectura eliminada correctamente'
      });
    } catch (err) {
      console.error("Error eliminando:", err);
      setModalAlert({
        show: true,
        tipo: 'error',
        mensaje: 'No se pudo eliminar la lectura. Intenta nuevamente.'
      });
    }
  };

  // ==========================================================
  // GENERAR ACTIVIDADES IA
  // ==========================================================
  const handleGenerarIA = (lectura) => {
    setModalConfirm({ show: true, lectura, type: 'ia' });
  };

  const confirmarGenerarIA = async () => {
    const lectura = modalConfirm.lectura;
    setModalConfirm({ show: false, lectura: null, type: '' });
    
    try {
      setGenerandoIA(true);

      console.log("📤 Generando actividades IA para:", lectura.id);

      const response = await generarActividadesIA(lectura.id, {
        num_preguntas: 5,
        incluir_verdadero_falso: true,
        incluir_multiple_choice: true,
        dificultad: lectura.nivel_dificultad,
        idioma: "es",
      });

      console.log("✅ Actividades generadas:", response);

      setModalAlert({
        show: true,
        tipo: 'success',
        mensaje: 'Actividades generadas correctamente con IA'
      });

      setTimeout(() => {
        navigate(`/docente/menu/lecturas/${lectura.id}/actividades`);
      }, 1500);

    } catch (err) {
      console.error("❌ Error generando actividades:", err);
      
      let errorMsg = "Error generando actividades con IA";
      
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 404) {
          errorMsg = "Servicio de IA no disponible. Verifica la configuración.";
        } else if (status === 500) {
          errorMsg = data?.detail || "Error interno del servidor de IA.";
        } else if (status === 401 || status === 403) {
          errorMsg = "No autorizado. Verifica tu sesión.";
        } else {
          errorMsg = data?.detail || `Error del servidor (${status})`;
        }
      } else if (err.request) {
        errorMsg = "No se pudo conectar con el servicio de IA. Verifica que el backend esté corriendo.";
      }

      setModalAlert({
        show: true,
        tipo: 'error',
        mensaje: errorMsg
      });
    } finally {
      setGenerandoIA(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando lecturas...</p>
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

      {/* LOADER PARA IA */}
      {generandoIA && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-sm mx-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Generando actividades
            </h3>
            <p className="text-slate-600 text-center">
              La IA está creando actividades personalizadas. Por favor espera...
            </p>
          </div>
        </div>
      )}

      {/* VERSIÓN MÓVIL */}
      <div className="md:hidden min-h-screen bg-white">
        {/* Header móvil fijo */}
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 shadow-lg z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <MdLibraryBooks size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white mb-0.5">Lecturas</h1>
                <p className="text-xs text-blue-100">{lecturasFiltradas.length} lecturas</p>
              </div>
            </div>

            <button
              onClick={abrirModalCrear}
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
              placeholder="Buscar por título, curso o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Contenido móvil */}
        <main className="pt-36 px-4 pb-8">
          {lecturasFiltradas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-slate-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                {searchTerm ? (
                  <MdSearch size={32} className="text-blue-600" />
                ) : (
                  <MdLibraryBooks size={32} className="text-blue-600" />
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {searchTerm ? 'No se encontraron lecturas' : 'No hay lecturas'}
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                {searchTerm 
                  ? 'Intenta con otro término de búsqueda'
                  : 'Crea tu primera lectura para comenzar'}
              </p>
              {!searchTerm && (
                <button
                  onClick={abrirModalCrear}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
                >
                  <MdAdd size={18} />
                  Nueva Lectura
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {lecturasFiltradas.map((lectura) => (
                <div
                  key={lectura.id}
                  className="bg-white rounded-xl shadow-md p-4 border border-slate-200"
                >
                  <div className="mb-3">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">
                      {lectura.titulo}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                        {cursos.find(c => c.id === lectura.curso_id)?.nombre || 'N/A'}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md">
                        {categorias.find(c => c.id === lectura.categoria_id)?.nombre || 'N/A'}
                      </span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md">
                        {lectura.edad_recomendada} años
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/docente/menu/lecturas/${lectura.id}/actividades`)}
                      className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition flex items-center justify-center gap-1"
                    >
                      <MdAutoStories size={14} />
                      Ver
                    </button>
                    <button
                      onClick={() => handleGenerarIA(lectura)}
                      className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-200 transition flex items-center justify-center gap-1"
                    >
                      <MdSmartToy size={14} />
                      IA
                    </button>
                    <button
                      onClick={() => abrirModalEditar(lectura)}
                      className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                    >
                      <MdEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleEliminar(lectura)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      <MdDelete size={16} />
                    </button>
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
                <MdLibraryBooks size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  Gestión de Lecturas
                </h1>
                <p className="text-sm text-slate-600">
                  Administra las lecturas y genera actividades con IA
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Búsqueda desktop */}
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por título, curso o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={abrirModalCrear}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition"
              >
                <MdAdd size={20} />
                Nueva Lectura
              </button>
            </div>
          </div>

          {/* Contenido desktop */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {lecturasFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {searchTerm ? (
                    <MdSearch size={40} className="text-blue-600" />
                  ) : (
                    <MdLibraryBooks size={40} className="text-blue-600" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {searchTerm ? 'No se encontraron lecturas' : 'No hay lecturas registradas'}
                </h3>
                <p className="text-slate-500 mb-4">
                  {searchTerm 
                    ? `No hay resultados para "${searchTerm}"`
                    : 'Crea tu primera lectura para comenzar'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={abrirModalCrear}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    <MdAdd size={20} />
                    Nueva Lectura
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-bold text-slate-700">
                        Título
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-bold text-slate-700">
                        Curso
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-bold text-slate-700">
                        Categoría
                      </th>
                      <th className="py-3 px-4 text-center text-sm font-bold text-slate-700">
                        Edad
                      </th>
                      <th className="py-3 px-4 text-center text-sm font-bold text-slate-700">
                        Audio
                      </th>
                      <th className="py-3 px-4 text-center text-sm font-bold text-slate-700">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {lecturasFiltradas.map((lectura) => (
                      <tr
                        key={lectura.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                      >
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-900">{lectura.titulo}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {cursos.find(c => c.id === lectura.curso_id)?.nombre || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {categorias.find(c => c.id === lectura.categoria_id)?.nombre || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-center text-slate-700">
                          {lectura.edad_recomendada} años
                        </td>
                        <td className="py-3 px-4 text-center">
                          {lectura.audio_url ? (
                            <span className="text-green-600 font-semibold">✓ Sí</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => navigate(`/docente/menu/lecturas/${lectura.id}/actividades`)}
                              className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition flex items-center gap-1"
                              title="Ver actividades"
                            >
                              <MdAutoStories size={16} />
                              Ver
                            </button>
                            <button
                              onClick={() => handleGenerarIA(lectura)}
                              className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-200 transition flex items-center gap-1"
                              title="Generar con IA"
                            >
                              <MdSmartToy size={16} />
                              IA
                            </button>
                            <button
                              onClick={() => abrirModalEditar(lectura)}
                              className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                              title="Editar"
                            >
                              <MdEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleEliminar(lectura)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
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
            )}
          </div>
        </main>
      </div>

      {/* MODAL CREAR */}
      {modalCrear && (
        <ModalCrearLectura
          categorias={categorias}
          cursos={cursos}
          onClose={cerrarModales}
          onCreated={() => {
            cargarTodo();
            setModalAlert({
              show: true,
              tipo: 'success',
              mensaje: 'Lectura creada exitosamente'
            });
          }}
        />
      )}

      {/* MODAL EDITAR */}
      {modalEditar && lecturaEdit && (
        <ModalEditarLectura
          lectura={lecturaEdit}
          categorias={categorias}
          cursos={cursos}
          onClose={cerrarModales}
          onUpdated={() => {
            cargarTodo();
            setModalAlert({
              show: true,
              tipo: 'success',
              mensaje: 'Lectura actualizada exitosamente'
            });
          }}
        />
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      {modalConfirm.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  modalConfirm.type === 'delete' ? 'bg-red-100' : 'bg-purple-100'
                }`}>
                  {modalConfirm.type === 'delete' ? (
                    <MdWarning className="text-red-600" size={24} />
                  ) : (
                    <MdSmartToy className="text-purple-600" size={24} />
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {modalConfirm.type === 'delete' ? 'Eliminar Lectura' : 'Generar Actividades'}
                </h3>
              </div>
              <button
                onClick={() => setModalConfirm({ show: false, lectura: null, type: '' })}
                className="p-1 hover:bg-slate-100 rounded-lg transition"
              >
                <MdClose size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-slate-700 mb-2">
                {modalConfirm.type === 'delete' 
                  ? `¿Estás seguro de eliminar la lectura "${modalConfirm.lectura?.titulo}"?`
                  : `¿Deseas generar actividades con IA para "${modalConfirm.lectura?.titulo}"?`
                }
              </p>
              <p className="text-sm text-slate-500">
                {modalConfirm.type === 'delete'
                  ? 'Esta acción no se puede deshacer.'
                  : 'Se generarán 5 actividades automáticamente.'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setModalConfirm({ show: false, lectura: null, type: '' })}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={modalConfirm.type === 'delete' ? confirmarEliminar : confirmarGenerarIA}
                className={`flex-1 px-4 py-2.5 text-white rounded-lg font-semibold transition ${
                  modalConfirm.type === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {modalConfirm.type === 'delete' ? 'Eliminar' : 'Generar'}
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
