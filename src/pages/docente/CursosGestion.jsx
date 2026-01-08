import { useEffect, useState } from "react";

import {
  listarCursos,
  eliminarCurso,
} from "../../services/cursosService";

import ModalCrearCurso from "../../components/cursos/ModalCrearCurso";
import ModalEditarCurso from "../../components/cursos/ModalEditarCurso";

import {
  MdDelete,
  MdEdit,
  MdAdd,
  MdSchool,
} from "react-icons/md";

export default function CursosGestion() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalCrear, setModalCrear] = useState(false);
  const [cursoEditar, setCursoEditar] = useState(null);

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

  const eliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este curso?")) return;

    try {
      await eliminarCurso(id);
      cargarCursos();
    } catch (error) {
      console.error("Error eliminando curso:", error);
      alert("Hubo un error al eliminar el curso.");
    }
  };

  return (
    <div className="p-8 animate-fade">

      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <MdSchool size={40} className="text-blue-700" />
          <h1 className="text-4xl font-extrabold text-blue-700 drop-shadow-sm">
            Gestión de Cursos
          </h1>
        </div>

        <button
          onClick={() => setModalCrear(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl 
                     shadow-lg hover:bg-blue-700 hover:scale-105 transition-all"
        >
          <MdAdd size={22} />
          Nuevo Curso
        </button>
      </div>

      {/* LISTA DE CURSOS */}
      <div className="
        bg-white/80 backdrop-blur-md 
        rounded-3xl shadow-xl border border-white/40
        p-6
      ">
        {loading ? (
          <p className="text-gray-600 animate-pulse">Cargando cursos...</p>
        ) : cursos.length === 0 ? (
          <p className="text-gray-500 italic text-center py-6">
            Aún no has creado ningún curso.
          </p>
        ) : (

          <div className="overflow-x-auto">
            <table className="w-full rounded-xl overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr className="text-left text-sm uppercase">
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Nivel</th>
                  <th className="p-4">Código</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {cursos.map((curso) => (
                  <tr
                    key={curso.id}
                    className="border-b border-gray-200 hover:bg-blue-50 transition"
                  >
                    <td className="p-4 font-semibold">{curso.nombre}</td>
                    <td className="p-4">{curso.nivel}</td>
                    <td className="p-4">{curso.codigo_acceso}</td>

                    <td className="p-4">
                      {curso.activo ? (
                        <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-medium">
                          Activo
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-lg bg-red-100 text-red-600 font-medium">
                          Inactivo
                        </span>
                      )}
                    </td>

                    <td className="p-4 flex justify-center gap-3">

                      {/* EDITAR */}
                      <button
                        onClick={() => setCursoEditar(curso)}
                        className="p-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 
                                   shadow-md transition"
                      >
                        <MdEdit size={20} className="text-black" />
                      </button>

                      {/* ELIMINAR */}
                      <button
                        onClick={() => eliminar(curso.id)}
                        className="p-3 rounded-xl bg-red-600 hover:bg-red-700 
                                   shadow-md text-white transition"
                      >
                        <MdDelete size={20} />
                      </button>

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

    </div>
  );
}
