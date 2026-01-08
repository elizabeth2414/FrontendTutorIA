// src/pages/docente/EstudiantesDocente.jsx

import { useEffect, useState } from "react";
import {
  getEstudiantesDocente,
  getCursosDocente,
  eliminarEstudianteDocente,
  obtenerEstudianteDocente,
} from "../../services/docentesService";

import { MdPersonAdd, MdEdit, MdDelete } from "react-icons/md";

import ModalCrearEstudiante from "../../components/docente/ModalCrearEstudiante";
import ModalEditarEstudiante from "../../components/docente/ModalEditarEstudiante";

export default function EstudiantesDocente() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [estudianteEditar, setEstudianteEditar] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  // ==========================
  // ELIMINAR
  // ==========================
  const eliminar = async () => {
    try {
      await eliminarEstudianteDocente(confirmarEliminar.id);
      setConfirmarEliminar(null);
      cargarTodo();
    } catch (err) {
      console.error("No se pudo eliminar al estudiante");
    }
  };

  return (
    <div className="p-6 animate-fade">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-blue-700 drop-shadow">
          Gestión de Estudiantes
        </h1>

        <button
          onClick={() => setMostrarCrear(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow-md transition"
        >
          <MdPersonAdd size={22} />
          Agregar Estudiante
        </button>
      </div>

      {/* TABLA DISEÑO COMPLETO */}
      <div className="bg-white border border-blue-100 rounded-3xl shadow-lg overflow-hidden">

        {/* HEADER TABLA */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-lg font-semibold tracking-wide">
            Lista de Estudiantes
          </h2>
        </div>

        {/* CONTENIDO */}
        {loading ? (
          <p className="text-gray-500 p-6">Cargando estudiantes...</p>
        ) : estudiantes.length === 0 ? (
          <p className="text-gray-500 italic p-6">Aún no hay estudiantes registrados.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-700 border-b">
                <th className="py-4 px-6 text-sm font-semibold tracking-wide">NOMBRE</th>
                <th className="py-4 px-6 text-sm font-semibold tracking-wide">APELLIDO</th>
                <th className="py-4 px-6 text-sm font-semibold tracking-wide">CURSO</th>
                <th className="py-4 px-6 text-sm font-semibold tracking-wide">NIVEL</th>
                <th className="py-4 px-6 text-sm font-semibold tracking-wide text-center">ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {estudiantes.map((e, idx) => (
                <tr
                  key={e.id}
                  className={`border-b hover:bg-blue-50 transition ${
                    idx % 2 === 0 ? "bg-white" : "bg-blue-50/20"
                  }`}
                >
                  <td className="py-4 px-6 font-medium text-gray-800">{e.nombre}</td>
                  <td className="py-4 px-6 text-gray-800">{e.apellido}</td>
                  <td className="py-4 px-6 text-gray-800">{e.curso_nombre}</td>
                  <td className="py-4 px-6 text-gray-800">{e.nivel_educativo}</td>

                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-3">

                      {/* EDITAR */}
                      <button
                        className="p-2 bg-yellow-400 text-black rounded-lg shadow hover:bg-yellow-500 transition"
                        title="Editar"
                        onClick={async () => {
                          const data = await obtenerEstudianteDocente(e.id);
                          setEstudianteEditar(data);
                        }}
                      >
                        <MdEdit size={20} />
                      </button>

                      {/* ELIMINAR */}
                      <button
                        className="p-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                        title="Eliminar"
                        onClick={() => setConfirmarEliminar(e)}
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

      {/* MODAL ELIMINAR */}
      {confirmarEliminar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md">

            <h3 className="text-xl font-bold text-red-600 mb-2 text-center">
              ¿Eliminar estudiante?
            </h3>

            <p className="text-gray-700 text-center mb-6">
              ¿Seguro que deseas eliminar a  
              <b> {confirmarEliminar.nombre} {confirmarEliminar.apellido} </b>?  
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmarEliminar(null)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>

              <button
                onClick={eliminar}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
