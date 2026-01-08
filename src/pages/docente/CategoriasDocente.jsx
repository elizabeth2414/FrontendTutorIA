import { useEffect, useState } from "react";
import {
  listarCategorias,
  eliminarCategoria,
} from "../../services/categoriasService";

import { MdAdd, MdEdit, MdDelete, MdCategory } from "react-icons/md";
import ModalCrearCategoria from "../../components/categorias/ModalCrearCategoria";
import ModalEditarCategoria from "../../components/categorias/ModalEditarCategoria";

export default function CategoriasDocente() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [categoriaEliminar, setCategoriaEliminar] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // =========================
  // ELIMINAR CATEGORÍA
  // =========================
  const eliminar = async () => {
    try {
      await eliminarCategoria(categoriaEliminar.id);
      setCategoriaEliminar(null);
      cargarCategorias();
    } catch (err) {
      console.error("Error eliminando categoría", err);
    }
  };

  return (
    <div className="p-6 animate-fade">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-blue-700 flex items-center gap-2 drop-shadow">
          <MdCategory size={32} />
          Gestión de Categorías
        </h1>

        <button
          onClick={() => setMostrarCrear(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow-md transition"
        >
          <MdAdd size={22} />
          Nueva Categoría
        </button>
      </div>

      {/* CUADRO PRINCIPAL */}
      <div className="bg-white border border-blue-200 rounded-3xl shadow-lg overflow-hidden">

        {/* HEADER TABLA */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-lg font-semibold tracking-wide">
            Lista de Categorías
          </h2>
        </div>

        {/* CONTENIDO */}
        {loading ? (
          <p className="text-gray-500 p-6">Cargando categorías...</p>
        ) : categorias.length === 0 ? (
          <p className="text-gray-500 italic p-6">
            No hay categorías aún.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-700 bg-blue-50">
                <th className="py-4 px-6 font-semibold">NOMBRE</th>
                <th className="py-4 px-6 font-semibold">EDAD MIN</th>
                <th className="py-4 px-6 font-semibold">EDAD MAX</th>
                <th className="py-4 px-6 font-semibold">COLOR</th>
                <th className="py-4 px-6 font-semibold">ICONO</th>
                <th className="py-4 px-6 text-center font-semibold">
                  ACCIONES
                </th>
              </tr>
            </thead>

            <tbody>
              {categorias.map((c, idx) => (
                <tr
                  key={c.id}
                  className={`border-b hover:bg-blue-50 transition ${
                    idx % 2 === 0 ? "bg-white" : "bg-blue-50/20"
                  }`}
                >
                  <td className="py-4 px-6 font-medium">{c.nombre}</td>
                  <td className="py-4 px-6">{c.edad_minima}</td>
                  <td className="py-4 px-6">{c.edad_maxima}</td>

                  <td className="py-4 px-6">
                    <div
                      className="w-6 h-6 rounded-full border shadow"
                      style={{ backgroundColor: c.color }}
                    />
                  </td>

                  <td className="py-4 px-6">{c.icono || "-"}</td>

                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-3">

                      {/* EDITAR */}
                      <button
                        className="p-2 bg-yellow-400 text-black rounded-lg shadow hover:bg-yellow-500 transition"
                        title="Editar categoría"
                        onClick={() => setCategoriaEditar(c)}
                      >
                        <MdEdit size={20} />
                      </button>

                      {/* ELIMINAR */}
                      <button
                        className="p-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                        title="Eliminar categoría"
                        onClick={() => setCategoriaEliminar(c)}
                      >
                        <MdDelete size={20} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* MODAL CONFIRMAR ELIMINAR */}
      {categoriaEliminar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className="
              bg-white/90 backdrop-blur-xl
              rounded-3xl shadow-2xl
              w-full max-w-md p-6
              border border-red-200 animate-fade
            "
          >
            <h3 className="text-2xl font-extrabold text-red-600 text-center mb-3">
              ¿Eliminar categoría?
            </h3>

            <p className="text-gray-700 text-center mb-6">
              Estás a punto de eliminar la categoría:
              <br />
              <span className="font-semibold text-gray-900">
                {categoriaEliminar.nombre}
              </span>
              <br />
              <span className="text-sm text-gray-500">
                Esta acción no se puede deshacer.
              </span>
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setCategoriaEliminar(null)}
                className="px-5 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancelar
              </button>

              <button
                onClick={eliminar}
                className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition shadow-md"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
