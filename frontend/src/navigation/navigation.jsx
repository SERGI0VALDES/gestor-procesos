// src/navigation/navigation.js

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ROUTES } from "../constants/routes";

//  procesos (sreens)
import ListaProcesosScreen from "../screens/Procesos/ListaProcesosScreen.jsx";
import DetalleProcesoScreen from "../screens/Procesos/DetalleProcesoScreen.jsx";
//  solicitudes (screens)
import RegistroSolicitudScreen from "../../src/screens/Solicitudes/RegistroSolicitudScreen.jsx";
import GestionSolicitudesScreen from "../../src/screens/Solicitudes/GestionSolicitudesScreen";

export default function AppNavigator() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Registro de solicitudes */}
        <Route
          path={`/${ROUTES.REGISTRO_SOLICITUD.toLowerCase()}`}
          element={<RegistroSolicitudScreen />}
        />
        {/* Gestión de solicitudes */}
        <Route
          path={`/${ROUTES.GESTION_SOLICITUDES.toLowerCase()}`}
          element={<GestionSolicitudesScreen />}
        />
        {/* Lista de procesos aprobados */}
        <Route
          path={`/${ROUTES.LISTA_PROCESOS.toLowerCase()}`}
          element={<ListaProcesosScreen />}
        />
        {/* Detalle de un proceso específico */}
        <Route
          path={`/${ROUTES.DETALLE_PROCESO.toLowerCase()}/:procesoId`}
          element={<DetalleProcesoScreen />}
        />

        {/* Redirigir a registroSolicitud si la ruta no coincide */}
        <Route
          path="*"
          element={
            <Navigate
              to={`/${ROUTES.REGISTRO_SOLICITUD.toLowerCase()}`}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
