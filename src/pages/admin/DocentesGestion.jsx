import { useEffect, useState } from "react";
import {
  listarDocentesAdmin,
  eliminarDocenteAdmin,
} from "../../services/adminService";

import Swal from "sweetalert2";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";

import ModalCrearDocente from "../../components/admin/ModalCrearDocente";
import ModalEditarDocente from "../../components/admin/ModalEditarDocente";

export default function DocentesGestion() {
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [docenteEditar, setDocenteEditar] = useState(null);

  const cargarDocentes = async () => {
    setLoading(true);
    try {
      const data = await listarDocentesAdmin();
      setDocentes(data || []);
    } catch (error) {
      console.error("Error cargando docentes:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarDocentes();
  }, []);

  const eliminarDocente = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar Docente?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      await eliminarDocenteAdmin(id);
      Swal.fire("Eliminado", "Docente eliminado correctamente", "success");
      cargarDocentes();
    }
  };

  return (
    <div className="p-6 animate-fade">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-blue-700 drop-shadow-sm">
          Gestión de Docentes
        </h1>

        <button
          onClick={() => setModalCrear(true)}
          className="
            flex items-center gap-2 px-5 py-3 rounded-xl 
            bg-blue-600 text-white font-semibold shadow-lg 
            hover:bg-blue-700 hover:scale-105 transition
          "
        >
          <MdAdd size={22} />
          Crear Docente
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center text-gray-700 font-semibold animate-pulse">
          Cargando información...
        </div>
      ) : docentes.length === 0 ? (
        <div className="text-center bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-10 shadow-md">
          <p className="text-gray-700 text-lg font-medium">
            No hay docentes registrados actualmente.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden border border-gray-200">
            <thead className="bg-blue-50 text-blue-700 font-semibold text-sm">
              <tr>
                <th className="p-3 border-b">Nombre</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Especialidad</th>
                <th className="p-3 border-b">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {docentes.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-gray-100 transition border-b text-center"
                >
                  <td className="p-3">
                    {d.usuario.nombre} {d.usuario.apellido}
                  </td>
                  <td className="p-3">{d.usuario.email}</td>
                  <td className="p-3">{d.especialidad || "Sin asignar"}</td>

                  <td className="p-3 flex justify-center gap-3">

                    {/* EDITAR */}
                    <button
                      className="
                        p-2 rounded-lg bg-yellow-400/80 
                        hover:bg-yellow-500 transition shadow-md
                      "
                      onClick={() => {
                        setDocenteEditar(d);
                        setModalEditar(true);
                      }}
                    >
                      <MdEdit size={20} className="text-white" />
                    </button>

                    {/* ELIMINAR */}
                    <button
                      className="
                        p-2 rounded-lg bg-red-500/80 
                        hover:bg-red-600 transition shadow-md
                      "
                      onClick={() => eliminarDocente(d.id)}
                    >
                      <MdDelete size={20} className="text-white" />
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* MODALES */}
      <ModalCrearDocente
        open={modalCrear}
        onClose={() => setModalCrear(false)}
        onCreated={cargarDocentes}
      />

      <ModalEditarDocente
        open={modalEditar}
        docente={docenteEditar}
        onClose={() => setModalEditar(false)}
        onUpdated={cargarDocentes}
      />
    </div>
  );
}
