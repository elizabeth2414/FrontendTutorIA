// src/pages/admin/EstudiantesAdminGestion.jsx

import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import Logger from "../../logs/logger";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function EstudiantesAdminGestion() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filtrados, setFiltrados] = useState([]);

  const [loading, setLoading] = useState(true);

  // Filtros
  const [buscar, setBuscar] = useState("");
  const [filtroDocente, setFiltroDocente] = useState("");
  const [filtroNivel, setFiltroNivel] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  // Paginación
  const [pagina, setPagina] = useState(1);
  const porPagina = 6;

  const cargarEstudiantes = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/admin/estudiantes");
      Logger.api("GET /admin/estudiantes", res.data);

      setEstudiantes(res.data || []);
      setFiltrados(res.data || []);
    } catch (error) {
      Logger.error("Error listando estudiantes (admin)", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  // FILTRADO + BUSCADOR
  useEffect(() => {
    let lista = [...estudiantes];

    // Buscar por nombre o correo
    if (buscar.trim() !== "") {
      lista = lista.filter((e) =>
        `${e.usuario?.nombre} ${e.usuario?.apellido}`
          .toLowerCase()
          .includes(buscar.toLowerCase()) ||
        e.usuario?.email?.toLowerCase().includes(buscar.toLowerCase())
      );
    }

    // Filtrar por docente
    if (filtroDocente !== "") {
      lista = lista.filter(
        (e) => e.docente?.usuario?.nombre === filtroDocente
      );
    }

    // Filtrar por nivel educativo
    if (filtroNivel !== "") {
      lista = lista.filter((e) => e.nivel_educativo === filtroNivel);
    }

    // Filtrar por estado
    if (filtroEstado !== "") {
      lista = lista.filter((e) =>
        filtroEstado === "activo" ? e.activo === true : e.activo === false
      );
    }

    setFiltrados(lista);
    setPagina(1);
  }, [buscar, filtroDocente, filtroNivel, filtroEstado, estudiantes]);

  // PAGINACIÓN
  const inicio = (pagina - 1) * porPagina;
  const datosPagina = filtrados.slice(inicio, inicio + porPagina);
  const totalPaginas = Math.ceil(filtrados.length / porPagina);

  // EXPORTAR EXCEL
  const exportarExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(estudiantes);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Estudiantes");

    XLSX.writeFile(libro, "estudiantes.xlsx");
  };

  // EXPORTAR PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Listado de Estudiantes", 14, 14);
    doc.autoTable({
      startY: 18,
      head: [["Nombre", "Correo", "Nivel", "Docente"]],
      body: estudiantes.map((e) => [
        `${e.usuario?.nombre} ${e.usuario?.apellido}`,
        e.usuario?.email,
        e.nivel_educativo,
        e.docente?.usuario
          ? `${e.docente.usuario.nombre} ${e.docente.usuario.apellido}`
          : "—",
      ]),
    });

    doc.save("estudiantes.pdf");
  };

  return (
    <div className="p-8 animate-fade">

      {/* TÍTULO */}
      <h1 className="text-4xl font-extrabold text-blue-600 drop-shadow mb-8">
        🎓 Gestión de Estudiantes
      </h1>

      {/* FILTROS / BUSCADOR */}
      <div
        className="
        bg-white/80 backdrop-blur-md border border-white/40 
        rounded-3xl shadow-lg p-5 mb-6
      "
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            className="
              px-4 py-3 rounded-xl border 
              focus:ring-2 focus:ring-blue-300 outline-none
            "
          />

          {/* Filtro docente */}
          <select
            value={filtroDocente}
            onChange={(e) => setFiltroDocente(e.target.value)}
            className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Todos los docentes</option>
            {estudiantes
              .filter((e) => e.docente?.usuario)
              .map((e, i) => (
                <option key={i} value={e.docente.usuario.nombre}>
                  {e.docente.usuario.nombre} {e.docente.usuario.apellido}
                </option>
              ))}
          </select>

          {/* Filtro nivel */}
          <select
            value={filtroNivel}
            onChange={(e) => setFiltroNivel(e.target.value)}
            className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Todos los niveles</option>
            <option value="1">1ro</option>
            <option value="2">2do</option>
            <option value="3">3ro</option>
            <option value="4">4to</option>
            <option value="5">5to</option>
          </select>

          {/* Filtro estado */}
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Todos</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>

        {/* Botones exportar */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={exportarExcel}
            className="
              bg-green-500 text-white px-4 py-2 rounded-lg 
              hover:bg-green-600 shadow
            "
          >
            📗 Exportar Excel
          </button>

          <button
            onClick={exportarPDF}
            className="
              bg-red-500 text-white px-4 py-2 rounded-lg 
              hover:bg-red-600 shadow
            "
          >
            📕 Exportar PDF
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div
        className="
          bg-white/80 backdrop-blur-md border border-white/40 
          rounded-3xl shadow-xl p-4 overflow-x-auto
        "
      >
        {loading ? (
          <p className="text-gray-600 animate-pulse">Cargando estudiantes...</p>
        ) : filtrados.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No hay estudiantes que coincidan con el filtro.
          </p>
        ) : (
          <table className="w-full rounded-xl overflow-hidden">
            <thead className="bg-blue-600 text-white text-sm uppercase">
              <tr>
                <th className="p-4 text-left">Nombre</th>
                <th className="p-4 text-left">Correo</th>
                <th className="p-4 text-left">Nivel educativo</th>
                <th className="p-4 text-left">Docente</th>
              </tr>
            </thead>

            <tbody>
              {datosPagina.map((e, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-blue-50 transition"
                >
                  <td className="p-4 font-semibold">
                    {e.usuario
                      ? `${e.usuario.nombre} ${e.usuario.apellido}`
                      : "—"}
                  </td>

                  <td className="p-4">{e.usuario?.email || "—"}</td>

                  <td className="p-4">{e.nivel_educativo || "—"}</td>

                  <td className="p-4">
                    {e.docente?.usuario ? (
                      `${e.docente.usuario.nombre} ${e.docente.usuario.apellido}`
                    ) : (
                      <span className="text-gray-400 italic">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINACIÓN */}
      <div className="flex justify-center gap-3 mt-6">
        {[...Array(totalPaginas)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPagina(i + 1)}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold transition
              ${
                pagina === i + 1
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-blue-100 hover:bg-blue-200"
              }
            `}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
