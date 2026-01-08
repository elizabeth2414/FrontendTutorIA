// src/pages/docente/LecturasDocente.jsx

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
} from "react-icons/md";

export default function LecturasDocente() {
  const navigate = useNavigate();

  const [lecturas, setLecturas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [lecturaEdit, setLecturaEdit] = useState(null);

  const [generandoIA, setGenerandoIA] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    categoria_id: "",
    curso_id: "",
    nivel_dificultad: 1,
    edad_recomendada: 7,
    etiquetas: [],
    audio_url: "",
  });

  const [error, setError] = useState("");

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
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // Modales
  // ==========================================================
  const abrirModalCrear = () => {
    setForm({
      titulo: "",
      contenido: "",
      categoria_id: "",
      curso_id: "",
      nivel_dificultad: 1,
      edad_recomendada: 7,
      etiquetas: [],
      audio_url: "",
    });
    setError("");
    setModalCrear(true);
  };

  const abrirModalEditar = (lec) => {
    setLecturaEdit(lec);
    setForm({
      titulo: lec.titulo || "",
      contenido: lec.contenido || "",
      categoria_id: lec.categoria_id || "",
      curso_id: lec.curso_id || "",
      nivel_dificultad: lec.nivel_dificultad || 1,
      edad_recomendada: lec.edad_recomendada || 7,
      etiquetas: lec.etiquetas || [],
      audio_url: lec.audio_url || "",
    });
    setError("");
    setModalEditar(true);
  };

  const cerrarModales = () => {
    setModalCrear(false);
    setModalEditar(false);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================================
  // Crear lectura
  // ==========================================================
  const handleCrear = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!form.titulo.trim() || !form.contenido.trim()) {
      setError("El título y contenido son obligatorios.");
      return;
    }

    // Validar que categoría y curso no estén vacíos
    if (!form.categoria_id || !form.curso_id) {
      setError("Debes seleccionar una categoría y un curso.");
      return;
    }

    // Construir payload explícitamente
    const payload = {
      titulo: form.titulo.trim(),
      contenido: form.contenido.trim(),
      categoria_id: Number(form.categoria_id),
      curso_id: Number(form.curso_id),
      nivel_dificultad: Number(form.nivel_dificultad),
      edad_recomendada: Number(form.edad_recomendada),
      etiquetas: Array.isArray(form.etiquetas) ? form.etiquetas : [],
      audio_url: form.audio_url.trim() || null,
    };

    // Debug: ver qué se está enviando
    console.log("📤 Enviando lectura:", payload);

    try {
      const result = await crearLectura(payload);
      console.log("✅ Lectura creada:", result);
      
      cerrarModales();
      await cargarTodo();
      
      alert("✅ Lectura creada exitosamente");
    } catch (err) {
      console.error("❌ Error completo:", err);
      console.error("❌ Response:", err.response?.data);
      
      // Mostrar error más descriptivo
      const errorMsg = err.response?.data?.detail 
        || err.message 
        || "Error creando lectura";
      setError(errorMsg);
    }
  };

  // ==========================================================
  // Editar lectura
  // ==========================================================
  const handleEditar = async (e) => {
    e.preventDefault();

    // Validar campos
    if (!form.titulo.trim() || !form.contenido.trim()) {
      setError("El título y contenido son obligatorios.");
      return;
    }

    if (!form.categoria_id || !form.curso_id) {
      setError("Debes seleccionar una categoría y un curso.");
      return;
    }

    const payload = {
      titulo: form.titulo.trim(),
      contenido: form.contenido.trim(),
      categoria_id: Number(form.categoria_id),
      curso_id: Number(form.curso_id),
      nivel_dificultad: Number(form.nivel_dificultad),
      edad_recomendada: Number(form.edad_recomendada),
      etiquetas: Array.isArray(form.etiquetas) ? form.etiquetas : [],
      audio_url: form.audio_url.trim() || null,
    };

    console.log("📤 Actualizando lectura:", payload);

    try {
      await actualizarLectura(lecturaEdit.id, payload);
      
      cerrarModales();
      await cargarTodo();
      
      alert("✅ Lectura actualizada exitosamente");
    } catch (err) {
      console.error("❌ Error:", err);
      console.error("❌ Response:", err.response?.data);
      
      const errorMsg = err.response?.data?.detail 
        || err.message 
        || "Error editando lectura";
      setError(errorMsg);
    }
  };

  // ==========================================================
  // Eliminar lectura
  // ==========================================================
  const handleEliminar = async (id) => {
    if (!confirm("¿Estás seguro de eliminar esta lectura?")) return;

    try {
      await eliminarLectura(id);
      await cargarTodo();
      alert("✅ Lectura eliminada exitosamente");
    } catch (err) {
      console.error("❌ Error eliminando:", err);
      alert("Error eliminando lectura");
    }
  };

  // ==========================================================
  // GENERAR ACTIVIDADES IA - VERSIÓN MEJORADA CON MEJOR MANEJO DE ERRORES
  // ==========================================================
  const handleGenerarIA = async (lectura) => {
    if (
      !confirm(
        `¿Deseas generar actividades IA para la lectura "${lectura.titulo}"?`
      )
    )
      return;

    try {
      setGenerandoIA(true);

      console.log("📤 Enviando solicitud IA para lectura:", lectura.id);
      console.log("📤 Parámetros:", {
        num_preguntas: 5,
        incluir_verdadero_falso: true,
        incluir_multiple_choice: true,
        dificultad: lectura.nivel_dificultad,
        idioma: "es",
      });

      const response = await generarActividadesIA(lectura.id, {
        num_preguntas: 5,
        incluir_verdadero_falso: true,
        incluir_multiple_choice: true,
        dificultad: lectura.nivel_dificultad,
        idioma: "es",
      });

      console.log("✅ Respuesta IA exitosa:", response);

      alert("✅ Actividades generadas correctamente 🎉");
      navigate(`/docente/menu/lecturas/${lectura.id}/actividades`);
    } catch (err) {
      // Logging detallado del error
      console.error("❌ Error completo:", err);
      console.error("❌ Error message:", err.message);
      console.error("❌ Error response:", err.response);
      console.error("❌ Error request:", err.request);
      console.error("❌ Error status:", err.response?.status);
      console.error("❌ Error data:", err.response?.data);
      console.error("❌ Error config:", err.config);

      // Determinar el mensaje de error apropiado
      let errorMsg = "Error generando actividades con IA";
      
      if (err.response) {
        // El servidor respondió con un código de error
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 404) {
          errorMsg = "Endpoint no encontrado. Verifica la URL del servicio.";
        } else if (status === 500) {
          errorMsg = data?.detail || "Error interno del servidor.";
        } else if (status === 401 || status === 403) {
          errorMsg = "No autorizado. Verifica tu sesión.";
        } else if (status === 400) {
          errorMsg = data?.detail || "Datos inválidos en la petición.";
        } else {
          errorMsg = data?.detail 
            || data?.message 
            || `Error del servidor (${status})`;
        }
      } else if (err.request) {
        // La petición se hizo pero no hubo respuesta
        errorMsg = "No se pudo conectar con el servidor. Verifica:\n" +
                  "- Que el backend esté corriendo\n" +
                  "- Tu conexión a internet\n" +
                  "- La URL del servicio";
      } else {
        // Error al configurar la petición
        errorMsg = `Error de configuración: ${err.message}`;
      }

      alert(`❌ ${errorMsg}`);
    } finally {
      setGenerandoIA(false);
    }
  };

  return (
    <div className="p-6">
      {/* LOADER MODERNO PARA IA */}
      {generandoIA && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-lg font-semibold text-blue-700">
              Generando actividades con IA...
            </p>
            <p className="text-gray-600 text-sm">Por favor espera unos segundos</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          <MdLibraryBooks size={32} />
          Lecturas
        </h1>

        <button
          onClick={abrirModalCrear}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <MdAdd size={22} />
          Nueva Lectura
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="ml-3 text-gray-500">Cargando lecturas...</p>
          </div>
        ) : lecturas.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">
            No hay lecturas aún. Crea tu primera lectura.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2 px-3">Título</th>
                  <th className="py-2 px-3">Curso</th>
                  <th className="py-2 px-3">Categoría</th>
                  <th className="py-2 px-3">Edad</th>
                  <th className="py-2 px-3">Audio</th>
                  <th className="py-2 px-3 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {lecturas.map((l) => (
                  <tr key={l.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 font-medium">{l.titulo}</td>
                    <td className="py-3 px-3">
                      {cursos.find((c) => c.id === l.curso_id)?.nombre || "N/A"}
                    </td>
                    <td className="py-3 px-3">
                      {categorias.find((x) => x.id === l.categoria_id)?.nombre || "N/A"}
                    </td>
                    <td className="py-3 px-3">{l.edad_recomendada} años</td>
                    <td className="py-3 px-3">
                      {l.audio_url ? (
                        <span className="text-green-600">✓ Sí</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>

                    {/* ACCIONES */}
                    <td className="py-3 px-3">
                      <div className="flex justify-center gap-2">
                        {/* VER ACTIVIDADES */}
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1 transition-colors text-sm"
                          onClick={() =>
                            navigate(`/docente/menu/lecturas/${l.id}/actividades`)
                          }
                          title="Ver actividades"
                        >
                          <MdAutoStories size={16} />
                          Ver
                        </button>

                        {/* GENERAR ACTIVIDADES IA */}
                        <button
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded flex items-center gap-1 transition-colors text-sm"
                          onClick={() => handleGenerarIA(l)}
                          title="Generar actividades con IA"
                        >
                          <MdSmartToy size={16} />
                          IA
                        </button>

                        {/* EDITAR */}
                        <button
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          onClick={() => abrirModalEditar(l)}
                          title="Editar lectura"
                        >
                          <MdEdit size={20} />
                        </button>

                        {/* ELIMINAR */}
                        <button
                          className="text-red-600 hover:text-red-800 transition-colors"
                          onClick={() => handleEliminar(l.id)}
                          title="Eliminar lectura"
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
        )}
      </div>

      {/* MODALES */}
      {modalCrear && (
        <ModalLectura
          title="Nueva Lectura"
          form={form}
          categorias={categorias}
          cursos={cursos}
          error={error}
          cerrarModales={cerrarModales}
          handleChange={handleChange}
          handleSubmit={handleCrear}
        />
      )}

      {modalEditar && (
        <ModalLectura
          title="Editar Lectura"
          form={form}
          categorias={categorias}
          cursos={cursos}
          error={error}
          cerrarModales={cerrarModales}
          handleChange={handleChange}
          handleSubmit={handleEditar}
        />
      )}
    </div>
  );
}

/* ======================================================
   COMPONENTE DE MODAL DE CREAR / EDITAR LECTURAS
====================================================== */
function ModalLectura({
  title,
  form,
  categorias,
  cursos,
  error,
  cerrarModales,
  handleChange,
  handleSubmit,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={cerrarModales}
          type="button"
        >
          <MdClose size={24} />
        </button>

        <h2 className="text-2xl font-bold text-blue-700 mb-6">{title}</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ingresa el título de la lectura"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-2">
              Contenido <span className="text-red-500">*</span>
            </label>
            <textarea
              name="contenido"
              value={form.contenido}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              rows={5}
              placeholder="Escribe el contenido de la lectura..."
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              name="categoria_id"
              value={form.categoria_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Curso <span className="text-red-500">*</span>
            </label>
            <select
              name="curso_id"
              value={form.curso_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            >
              <option value="">Seleccione un curso</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Edad Recomendada <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="edad_recomendada"
              value={form.edad_recomendada}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              min={5}
              max={18}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Nivel de Dificultad <span className="text-red-500">*</span>
            </label>
            <select
              name="nivel_dificultad"
              value={form.nivel_dificultad}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            >
              <option value="1">1 - Muy Fácil</option>
              <option value="2">2 - Fácil</option>
              <option value="3">3 - Medio</option>
              <option value="4">4 - Difícil</option>
              <option value="5">5 - Muy Difícil</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-2">
              URL de Audio <span className="text-gray-500 text-sm">(opcional)</span>
            </label>
            <input
              name="audio_url"
              value={form.audio_url}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="https://ejemplo.com/audio.mp3"
              type="url"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t">
            <button
              type="button"
              onClick={cerrarModales}
              className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Guardar Lectura
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
