import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  listarLecturas,
  eliminarLectura,
  desactivarLectura,
} from "../../services/lecturasService";

import { listarCategorias } from "../../services/categoriasService";
import { getCursosDocente } from "../../services/docentesService";
import { generarActividadesIA } from "../../services/iaActividadesService";

import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdLibraryBooks,
  MdAutoStories,
  MdSmartToy,
  MdSearch,
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
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar las lecturas. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setLoading(false);
    }
  };


  const lecturasFiltradas = lecturas.filter((lectura) => {
    const searchLower = searchTerm.toLowerCase();
    const titulo = (lectura.titulo || '').toString().toLowerCase();
    const cursoNombre = cursos.find(c => c.id === lectura.curso_id)?.nombre?.toLowerCase() || '';
    const categoriaNombre = categorias.find(c => c.id === lectura.categoria_id)?.nombre?.toLowerCase() || '';
    
    return titulo.includes(searchLower) || 
           cursoNombre.includes(searchLower) || 
           categoriaNombre.includes(searchLower);
  });


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


  const handleEliminar = async (lectura) => {
    const confirm = await Swal.fire({
      title: "⚠️ ¿Eliminar Lectura?",
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p style="margin: 0 0 0.5rem 0; font-weight: bold; font-size: 16px;">${lectura.titulo}</p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
            <span style="padding: 0.25rem 0.5rem; background-color: #dbeafe; color: #1e40af; border-radius: 0.375rem; font-size: 12px;">
              ${cursos.find(c => c.id === lectura.curso_id)?.nombre || 'N/A'}
            </span>
            <span style="padding: 0.25rem 0.5rem; background-color: #e9d5ff; color: #7e22ce; border-radius: 0.375rem; font-size: 12px;">
              ${categorias.find(c => c.id === lectura.categoria_id)?.nombre || 'N/A'}
            </span>
          </div>
          <p style="color: #64748b; font-size: 0.875rem; margin: 0;">
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
      await eliminarLectura(lectura.id);
      
      await Swal.fire({
        title: "¡Eliminada!",
        text: "La lectura ha sido eliminada correctamente",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        showConfirmButton: false,
      });

      cargarTodo();
    } catch (err) {
      console.error("Error eliminando:", err);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar la lectura. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  // ==========================================================
  // GENERAR ACTIVIDADES IA
  // ==========================================================
  const handleGenerarIA = async (lectura) => {
    const confirm = await Swal.fire({
      title: "🤖 Generar Actividades con IA",
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p style="margin: 0 0 0.5rem 0; font-weight: bold;">${lectura.titulo}</p>
          <p style="color: #64748b; font-size: 0.875rem; margin: 0 0 1rem 0;">
            Se generarán automáticamente 5 actividades personalizadas usando inteligencia artificial.
          </p>
          <div style="background-color: #f3e8ff; padding: 0.75rem; border-radius: 0.5rem; border-left: 4px solid #9333ea;">
            <p style="margin: 0; font-size: 0.875rem; color: #6b21a8;">
              <strong>Incluye:</strong> Preguntas de opción múltiple y verdadero/falso adaptadas al nivel de dificultad.
            </p>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, generar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#9333ea",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

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

      await Swal.fire({
        title: "¡Actividades generadas!",
        text: "Las actividades han sido creadas exitosamente con IA",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate(`/docente/menu/lecturas/${lectura.id}/actividades`);
      }, 2000);

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

      Swal.fire({
        title: "Error",
        text: errorMsg,
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setGenerandoIA(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando lecturas...</p>
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
      <div className="md:hidden min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 animate-fadeIn p-4">
        {/* Header móvil */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-slate-900 mb-1">Gestión de Lecturas</h1>
          <p className="text-sm text-slate-600">Administra lecturas y genera actividades con IA</p>
        </div>

        {/* Botón crear móvil */}
        <button
          onClick={abrirModalCrear}
          className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all"
        >
          <MdAdd size={22} />
          Nueva Lectura
        </button>

        {/* Búsqueda móvil */}
        <div className="mb-4">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por título, curso o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Lista móvil */}
        {lecturasFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-slate-200">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              {searchTerm ? (
                <MdSearch size={32} className="text-purple-600" />
              ) : (
                <MdLibraryBooks size={32} className="text-purple-600" />
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white rounded-lg font-semibold shadow-lg"
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
                className="bg-white rounded-xl shadow-sm p-4 border border-slate-200"
              >
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    {lectura.titulo}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-semibold">
                      {cursos.find(c => c.id === lectura.curso_id)?.nombre || 'N/A'}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md font-semibold">
                      {categorias.find(c => c.id === lectura.categoria_id)?.nombre || 'N/A'}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md font-semibold">
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
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-lg text-xs font-semibold hover:from-purple-600 hover:to-violet-700 transition flex items-center justify-center gap-1"
                  >
                    <MdSmartToy size={14} />
                    IA
                  </button>
                  <button
                    onClick={() => abrirModalEditar(lectura)}
                    className="p-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white transition-all shadow-sm"
                  >
                    <MdEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleEliminar(lectura)}
                    className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all shadow-sm"
                  >
                    <MdDelete size={16} />
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
                <MdLibraryBooks size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Gestión de Lecturas</h1>
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
                  className="w-80 pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={abrirModalCrear}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all"
              >
                <MdAdd size={20} />
                Nueva Lectura
              </button>
            </div>
          </div>
        </div>

        {/* Contenido desktop */}
        {lecturasFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-slate-200">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {searchTerm ? (
                <MdSearch size={40} className="text-purple-600" />
              ) : (
                <MdLibraryBooks size={40} className="text-purple-600" />
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {searchTerm ? 'No se encontraron lecturas' : 'No hay lecturas registradas'}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm 
                ? `No hay resultados para "${searchTerm}"`
                : 'Crea tu primera lectura para comenzar'}
            </p>
            {!searchTerm && (
              <button
                onClick={abrirModalCrear}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all"
              >
                <MdAdd size={20} />
                Nueva Lectura
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
                        <MdLibraryBooks className="text-purple-500" />
                        Título
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-bold text-slate-700">
                      Curso
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-bold text-slate-700">
                      Categoría
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-slate-700">
                      Edad
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-slate-700">
                      Audio
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-slate-700">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {lecturasFiltradas.map((lectura, index) => (
                    <tr
                      key={lectura.id}
                      className={`border-b border-slate-100 hover:bg-purple-50/30 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-900">{lectura.titulo}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-700">
                        {cursos.find(c => c.id === lectura.curso_id)?.nombre || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-slate-700">
                        {categorias.find(c => c.id === lectura.categoria_id)?.nombre || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-center text-slate-700">
                        {lectura.edad_recomendada} años
                      </td>
                      <td className="py-4 px-6 text-center">
                        {lectura.audio_url ? (
                          <span className="text-green-600 font-semibold">✓ Sí</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
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
                            className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-lg text-xs font-semibold hover:from-purple-600 hover:to-violet-700 transition flex items-center gap-1"
                            title="Generar con IA"
                          >
                            <MdSmartToy size={16} />
                            IA
                          </button>
                          <button
                            onClick={() => abrirModalEditar(lectura)}
                            className="p-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white transition-all shadow-sm hover:scale-105"
                            title="Editar"
                          >
                            <MdEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleEliminar(lectura)}
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
                Total de lecturas: <span className="font-bold text-purple-600">{lecturasFiltradas.length}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL CREAR */}
      {modalCrear && (
        <ModalCrearLectura
          categorias={categorias}
          cursos={cursos}
          onClose={cerrarModales}
          onCreated={() => {
            cargarTodo();
            cerrarModales();
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
            cerrarModales();
          }}
        />
      )}
    </>
  );
}
