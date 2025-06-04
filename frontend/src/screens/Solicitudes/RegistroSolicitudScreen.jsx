// src/screens/Solicitudes/RegistroSolicitudScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearSolicitud } from "../../services/api";
import { ROUTES } from "../../constants/routes";

export default function RegistroSolicitudScreen() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoProceso, setTipoProceso] = useState("");
  const [fechaDeseada, setFechaDeseada] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const opcionesTipoProceso = [
    "Alta de equipo",
    "Cambio de procedimiento",
    "Actualización de manual",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !descripcion.trim() || !tipoProceso) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const payload = {
        titulo,
        descripcion,
        tipo_proceso: tipoProceso,
        fecha_deseada: fechaDeseada,
      };
      await crearSolicitud(payload);
      navigate(`/${ROUTES.GESTION_SOLICITUDES.toLowerCase()}`);
    } catch (err) {
      console.error("Error al crear solicitud:", err);
      setError("Ocurrió un error al enviar la solicitud. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Registro de Petición de Proceso</h2>

      {error && <div className="error-text">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Título <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="input"
            placeholder="Ej. Inclusión de nuevo equipo"
            required
          />
        </div>

        <div className="form-group">
          <label>
            Descripción <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="textarea"
            placeholder="Describa detalladamente el proceso que requiere"
            required
          />
        </div>

        <div className="form-group">
          <label>
            Tipo de Proceso <span style={{ color: "red" }}>*</span>
          </label>
          <select
            value={tipoProceso}
            onChange={(e) => setTipoProceso(e.target.value)}
            className="select"
            required
          >
            <option value="">-- Selecciona un tipo --</option>
            {opcionesTipoProceso.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Fecha Deseada</label>
          <input
            type="date"
            value={fechaDeseada}
            onChange={(e) => setFechaDeseada(e.target.value)}
            className="input"
          />
        </div>

        {/* Si más adelante agregas un <input type="file" />, ponle className="input" o crea una clase específica. */}

        <button
          type="submit"
          className="button-primary"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar Solicitud"}
        </button>
      </form>
    </div>
  );
}
