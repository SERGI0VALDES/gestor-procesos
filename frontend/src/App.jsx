// src/App.jsx

import React from "react";
// Importa aquí tu navegador (o “router”) que contiene <BrowserRouter> y <Routes>
import AppNavigator from "./navigation/navigation";

export default function App() {
  return (
    // Aquí va tu lógica de Layout global si la tuvieras (Header, Footer, etc.)
    <AppNavigator />
  );
}
