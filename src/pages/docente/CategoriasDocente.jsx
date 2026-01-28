import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  listarCategorias,
  eliminarCategoria,
} from "../../services/categoriasService";

import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdCategory,
  MdSearch,
} from "react-icons/md";

import ModalCrearCategoria from "../../components/categorias/ModalCrearCategoria";
import ModalEditarCategoria from "../../components/categorias/ModalEditarCategoria";

export default function CategoriasDocente() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState(null);

  // =========================
  // CARGAR CATEGORÍAS
  // =========================
  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const data = await listarCategorias();
      setCategorias(data || []);
    } catch (err) {
      console.error("Error cargando categorias", err);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar las categorías. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // =========================
  // FILTRAR CATEGORÍAS
  // =========================
  const categoriasFiltradas = categorias.filter((categoria) => {
    const searchLower = searchTerm.toLowerCase();
    const nombre = (categoria.nombre || '').toString().toLowerCase();
    return nombre.includes(searchLower);
  });

  // =========================
  // ELIMINAR CATEGORÍA
  // =========================
  const eliminar = async (categoria) => {
    const confirm = await Swal.fire({
      title: "⚠️ ¿Eliminar Categoría?",
      html: `
        <div style="text-align: left; padding: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background-color: ${categoria.color}; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              ${categoria.icono || '📁'}
            </div>
            <div>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${categoria.nombre}</p>
              <p style="margin: 0; color: #64748b; font-size: 14px;">Edad: ${categoria.edad_minima} - ${categoria.edad_maxima} años</p>
            </div>
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
      await eliminarCategoria(categoria.id);
      
      await Swal.fire({
        title: "¡Eliminada!",
        text: "La categoría ha sido eliminada correctamente",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        showConfirmButton: false,
      });

      cargarCategorias();
    } catch (err) {
      console.error("Error eliminando categoría:", err);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar la categoría. Intenta nuevamente.",
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
          <p className="text-slate-600 font-medium">Cargando categorías...</p>
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
          <h1 className="text-xl font-bold text-slate-900 mb-1">Gestión de Categorías</h1>
          <p className="text-sm text-slate-600">Administra las categorías de contenido</p>
        </div>

        {/* Botón crear móvil */}
        <button
          onClick={() => setMostrarCrear(true)}
          className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all"
        >
          <MdAdd size={22} />
          Nueva Categoría
        </button>

        {/* Búsqueda móvil */}
        <div className="mb-4">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Lista móvil */}
        {categoriasFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-slate-200">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              {searchTerm ? (
                <MdSearch size={32} className="text-purple-600" />
              ) : (
                <MdCategory size={32} className="text-purple-600" />
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {searchTerm ? 'No se encontraron categorías' : 'No hay categorías'}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {searchTerm 
                ? 'Intenta con otro término de búsqueda'
                : 'Crea tu primera categoría para comenzar'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setMostrarCrear(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white rounded-lg font-semibold shadow-lg"
              >
                <MdAdd size={18} />
                Nueva Categoría
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {categoriasFiltradas.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-xl shadow-sm p-4 border border-slate-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-10 h-10 rounded-lg shadow-sm flex items-center justify-center text-xl"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.icono || '📁'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-900 mb-1">
                        {c.nombre}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Edad: {c.edad_minima} - {c.edad_maxima} años
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setCategoriaEditar(c)}
                      className="p-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white transition-all shadow-sm"
                    >
                      <MdEdit size={16} />
                    </button>
                    <button
                      onClick={() => eliminar(c)}
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
                <MdCategory size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Gestión de Categorías</h1>
                <p className="text-sm text-slate-600">
                  Administra las categorías de contenido
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Búsqueda desktop */}
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={() => setMostrarCrear(true)}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all"
              >
                <MdAdd size={20} />
                Nueva Categoría
              </button>
            </div>
          </div>
        </div>

        {/* Contenido desktop */}
        {categoriasFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-slate-200">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {searchTerm ? (
                <MdSearch size={40} className="text-purple-600" />
              ) : (
                <MdCategory size={40} className="text-purple-600" />
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {searchTerm ? 'No se encontraron categorías' : 'No hay categorías registradas'}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm 
                ? `No hay resultados para "${searchTerm}"`
                : 'Crea tu primera categoría para comenzar'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setMostrarCrear(true)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all"
              >
                <MdAdd size={20} />
                Nueva Categoría
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
                        <MdCategory className="text-purple-500" />
                        Nombre
                      </div>
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-slate-700">
                      Edad Mín
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-slate-700">
                      Edad Máx
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-slate-700">
                      Color
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-slate-700">
                      Icono
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-slate-700">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {categoriasFiltradas.map((c, index) => (
                    <tr
                      key={c.id}
                      className={`border-b border-slate-100 hover:bg-purple-50/30 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg shadow-sm flex items-center justify-center text-lg"
                            style={{ backgroundColor: c.color }}
                          >
                            {c.icono || '📁'}
                          </div>
                          <span className="font-semibold text-slate-900">{c.nombre}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center text-slate-700">{c.edad_minima}</td>
                      <td className="py-4 px-6 text-center text-slate-700">{c.edad_maxima}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-slate-300 shadow-sm"
                            style={{ backgroundColor: c.color }}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center text-xl">{c.icono || '—'}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setCategoriaEditar(c)}
                            className="p-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white transition-all shadow-sm hover:scale-105"
                            title="Editar"
                          >
                            <MdEdit size={18} />
                          </button>
                          <button
                            onClick={() => eliminar(c)}
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
                Total de categorías: <span className="font-bold text-purple-600">{categoriasFiltradas.length}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL CREAR */}
      {mostrarCrear && (
        <ModalCrearCategoria
          onClose={() => setMostrarCrear(false)}
          onCreated={cargarCategorias}
        />
      )}

      {/* MODAL EDITAR */}
      {categoriaEditar && (
        <ModalEditarCategoria
          categoria={categoriaEditar}
          onClose={() => setCategoriaEditar(null)}
          onUpdated={cargarCategorias}
        />
      )}
    </>
  );
}
