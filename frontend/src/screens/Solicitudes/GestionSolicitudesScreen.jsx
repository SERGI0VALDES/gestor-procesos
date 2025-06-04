// src/screens/Solicitudes/GestionSolicitudesScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerSolicitudes,
  actualizarSolicitud,
} from "../../services/api";
import { ROUTES } from "../../constants/routes";

export default function GestionSolicitudesScreen() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [comentarioAdmin, setComentarioAdmin] = useState("");
  const [accionType, setAccionType] = useState(""); // "aprobar" o "rechazar"
  const [loadingAccion, setLoadingAccion] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await obtenerSolicitudes();
        setSolicitudes(response.data);
      } catch (err) {
        console.error("Error al obtener solicitudes:", err);
        setError("No se pudieron cargar las solicitudes. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const abrirModal = (sol, tipoAccion) => {
    setSolicitudSeleccionada(sol);
    setAccionType(tipoAccion);
    setComentarioAdmin("");
    setModalVisible(true);
  };

  const procesarSolicitud = async () => {
    if (!solicitudSeleccionada) return;
    setLoadingAccion(true);
    setError(null);

    try {
      const payload = {
        estado: accionType === "aprobar" ? "aprobada" : "rechazada",
        comentario_admin: comentarioAdmin,
      };

      await actualizarSolicitud(solicitudSeleccionada.id, payload);
      const response = await obtenerSolicitudes();
      setSolicitudes(response.data);

      setModalVisible(false);
      setSolicitudSeleccionada(null);
    } catch (err) {
      console.error("Error al procesar solicitud:", err);
      setError("No se pudo actualizar la solicitud. Intenta de nuevo.");
    } finally {
      setLoadingAccion(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Cargando solicitudes...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="title">Gestión de Solicitudes de Procesos</h2>

      {error && <div className="error-text">{error}</div>}

      <button
        onClick={() => navigate(`/${ROUTES.REGISTRO_SOLICITUD.toLowerCase()}`)}
        className="button-primary"
        style={{ marginBottom: "1rem" }}
      >
        + Nueva Solicitud
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Fecha Creación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((sol) => (
            <tr key={sol.id}>
              <td>{sol.id}</td>
              <td>{sol.titulo}</td>
              <td>{new Date(sol.fecha_creacion).toLocaleDateString()}</td>
              <td>{sol.estado}</td>
              <td>
                {sol.estado === "pendiente" ? (
                  <>
                    <button
                      onClick={() => abrirModal(sol, "aprobar")}
                      className="button-primary"
                      style={{ marginRight: "0.5rem", padding: "0.4rem 0.8rem" }}
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => abrirModal(sol, "rechazar")}
                      className="button-danger"
                      style={{ padding: "0.4rem 0.8rem" }}
                    >
                      Rechazar
                    </button>
                  </>
                ) : (
                  <span>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de aprobación/rechazo */}
      {modalVisible && solicitudSeleccionada && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {accionType === "aprobar"
                  ? "Aprobar Solicitud"
                  : "Rechazar Solicitud"}
              </h3>
            </div>

            <div className="modal-body">
              <p>
                <strong>ID:</strong> {solicitudSeleccionada.id}
              </p>
              <p>
                <strong>Título:</strong> {solicitudSeleccionada.titulo}
              </p>
              <p>
                <strong>Descripción:</strong>{" "}
                {solicitudSeleccionada.descripcion}
              </p>
              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label>
                  Comentarios{" "}
                  {accionType === "rechazar"
                    ? "de rechazo"
                    : "de aprobación"}
                  :
                </label>
                <textarea
                  value={comentarioAdmin}
                  onChange={(e) => setComentarioAdmin(e.target.value)}
                  className="textarea"
                  rows={3}
                  placeholder={
                    accionType === "rechazar"
                      ? "Motivo del rechazo"
                      : "Observaciones administrativas"
                  }
                />
              </div>
              {error && <div className="error-text">{error}</div>}
            </div>

            <div className="modal-footer">
              <button
                onClick={() => {
                  setModalVisible(false);
                  setSolicitudSeleccionada(null);
                  setError(null);
                }}
                className="button-secondary"
                disabled={loadingAccion}
              >
                Cancelar
              </button>
              <button
                onClick={procesarSolicitud}
                className={
                  accionType === "aprobar"
                    ? "button-primary"
                    : "button-danger"
                }
                disabled={loadingAccion}
              >
                {loadingAccion
                  ? "Procesando..."
                  : accionType === "aprobar"
                  ? "Confirmar Aprobación"
                  : "Confirmar Rechazo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
