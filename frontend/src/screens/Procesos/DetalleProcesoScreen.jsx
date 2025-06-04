// src/screens/Procesos/DetalleProcesoScreen.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerProcesoPorId, actualizarProceso } from "../../services/api";

export default function DetalleProcesoScreen() {
  const { procesoId } = useParams();
  const navigate = useNavigate();

  const [proceso, setProceso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nuevoEstado, setNuevoEstado] = useState("");
  const [notaAdmin, setNotaAdmin] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await obtenerProcesoPorId(procesoId);
        setProceso(response.data);
        setNuevoEstado(response.data.estado);
      } catch (err) {
        console.error("Error al obtener proceso:", err);
        setError("No se pudo cargar el detalle del proceso.");
      } finally {
        setLoading(false);
      }
    })();
  }, [procesoId]);

  const handleActualizar = async () => {
    setError(null);
    try {
      const payload = {
        estado: nuevoEstado,
        nota_admin: notaAdmin,
      };
      await actualizarProceso(procesoId, payload);
      const response = await obtenerProcesoPorId(procesoId);
      setProceso(response.data);
      setNotaAdmin("");
      alert("Proceso actualizado correctamente.");
    } catch (err) {
      console.error("Error al actualizar proceso:", err);
      setError("No se pudo actualizar el proceso.");
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Cargando detalles del proceso...</p>
      </div>
    );
  }

  if (!proceso) {
    return (
      <div className="container">
        <p>Proceso no encontrado.</p>
        <button onClick={() => navigate(-1)} className="button-secondary">
          Volver atrás
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="title">Detalle del Proceso #{proceso.id}</h2>

      {error && <div className="error-text">{error}</div>}

      <p>
        <strong>Título de la Solicitud:</strong> {proceso.solicitud.titulo}
      </p>
      <p>
        <strong>Descripción de la Solicitud:</strong>{" "}
        {proceso.solicitud.descripcion}
      </p>
      <p>
        <strong>Tipo de Proceso:</strong> {proceso.solicitud.tipo_proceso}
      </p>
      <p>
        <strong>Fecha de Aprobación:</strong>{" "}
        {new Date(proceso.fecha_aprobacion).toLocaleDateString()}
      </p>
      <p>
        <strong>Estado Actual:</strong> {proceso.estado}
      </p>
      <p>
        <strong>Responsable Asignado:</strong> {proceso.responsable || "—"}
      </p>
      <p>
        <strong>Notas Administrativas:</strong> {proceso.notas_admin || "—"}
      </p>

      <div style={{ marginTop: "1.5rem" }}>
        <h3>Actualizar Proceso</h3>
        <div className="form-group">
          <label>Estado</label>
          <select
            value={nuevoEstado}
            onChange={(e) => setNuevoEstado(e.target.value)}
            className="select"
          >
            <option value="en_progreso">En Progreso</option>
            <option value="completado">Completado</option>
            <option value="en_espera">En Espera</option>
          </select>
        </div>

        <div className="form-group">
          <label>Nota Administrativa</label>
          <textarea
            value={notaAdmin}
            onChange={(e) => setNotaAdmin(e.target.value)}
            className="textarea"
            placeholder="Agrega alguna observación o comentario"
          />
        </div>

        <button onClick={handleActualizar} className="button-primary">
          Guardar Cambios
        </button>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="button-secondary"
        style={{ marginTop: "2rem" }}
      >
        Volver a Lista de Procesos
      </button>
    </div>
  );
}
