// src/screens/Procesos/ListaProcesosScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerProcesos } from "../../services/api";
import { ROUTES } from "../../constants/routes";

export default function ListaProcesosScreen() {
  const navigate = useNavigate();
  const [procesos, setProcesos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await obtenerProcesos();
        setProcesos(response.data);
      } catch (err) {
        console.error("Error al obtener procesos:", err);
        setError("No se pudieron cargar los procesos. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <p>Cargando procesos...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="title">Gestión de Procesos Aprobados</h2>

      {error && <div className="error-text">{error}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>ID Proceso</th>
            <th>Fecha Inicio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {procesos.map((proc) => (
            <tr key={proc.id}>
              <td>{proc.id}</td>
              <td>{new Date(proc.fecha_inicio).toLocaleDateString()}</td>
              <td>{proc.estado}</td>
              <td>
                <button
                  onClick={() =>
                    navigate(
                      `/${ROUTES.DETALLE_PROCESO.toLowerCase()}/${proc.id}`
                    )
                  }
                  className="button-primary"
                  style={{ padding: "0.4rem 0.8rem" }}
                >
                  Ver Detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
