import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Solicitudes
export const crearSolicitud = (datos) => API.post("/solicitudes", datos);
export const obtenerSolicitudes = () => API.get("/solicitudes");
export const obtenerSolicitudPorId = (id) => API.get(`/solicitudes/${id}`);
export const actualizarSolicitud = (id, datos) => API.put(`/solicitudes/${id}`, datos);
export const eliminarSolicitud = (id) => API.delete(`/solicitudes/${id}`);

// Procesos
export const crearProceso = (datos) => API.post("/procesos", datos);
export const obtenerProcesos = () => API.get("/procesos");
export const obtenerProcesosPorSolicitud = (id_solicitud) =>
  API.get(`/procesos/por-solicitud/${id_solicitud}`);
export const obtenerProcesoPorId = (id) => API.get(`/procesos/${id}`);
export const actualizarProceso = (id, datos) => API.put(`/procesos/${id}`, datos);
export const eliminarProceso = (id) => API.delete(`/procesos/${id}`);

export default API;
