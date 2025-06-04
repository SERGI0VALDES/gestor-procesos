# backend/main.py

from fastapi import FastAPI, HTTPException, Path, Body
from fastapi.middleware.cors import CORSMiddleware
from uuid import UUID
from typing import List

from schemas import (
    SolicitudCreate,
    SolicitudInDB,
    SolicitudUpdate,
    ProcesoCreate,
    ProcesoInDB,
    ProcesoUpdate,
)
from db import solicitudes_db, procesos_db

app = FastAPI(
    title="API de Gestión de Solicitudes y Procesos",
    description="Backend que maneja SolicitudesProcesos y Procesos según el esquema proporcionado",
    version="1.0.0"
)

# Habilitar CORS para que el frontend (React/Vite en 5173) pueda llamar sin bloqueo:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# -------------------------------------------------------
# RUTAS PARA SolicitudesProcesos
# -------------------------------------------------------

@app.get("/api/solicitudes", response_model=List[SolicitudInDB])
async def listar_solicitudes():
    """
    Devuelve todas las solicitudes registradas.
    """
    return solicitudes_db


@app.post("/api/solicitudes", response_model=SolicitudInDB, status_code=201)
async def crear_solicitud(payload: SolicitudCreate = Body(...)):
    """
    Crea una nueva solicitud. Genera automáticamente id_solicitud (UUID) y fecha_creacion si no se envía.
    """
    nueva = SolicitudInDB(**payload.dict())
    solicitudes_db.append(nueva)
    return nueva


@app.get("/api/solicitudes/{id_solicitud}", response_model=SolicitudInDB)
async def obtener_solicitud(id_solicitud: UUID = Path(..., description="ID de la solicitud (UUID)")):
    """
    Devuelve la solicitud con el id_solicitud dado. Si no existe, regresa 404.
    """
    for sol in solicitudes_db:
        if sol.id_solicitud == id_solicitud:
            return sol
    raise HTTPException(status_code=404, detail="Solicitud no encontrada")


@app.put("/api/solicitudes/{id_solicitud}", response_model=SolicitudInDB)
async def actualizar_solicitud(
    id_solicitud: UUID = Path(..., description="ID de la solicitud a actualizar"),
    payload: SolicitudUpdate = Body(...),
):
    """
    Actualiza campos de la solicitud con id_solicitud.
    Solo los campos enviados en el payload serán modificados.
    """
    for idx, sol in enumerate(solicitudes_db):
        if sol.id_solicitud == id_solicitud:
            datos_actualizados = sol.dict()
            # Reemplaza solo los campos que vienen en payload (que no sean None)
            for campo, valor in payload.dict(exclude_unset=True).items():
                datos_actualizados[campo] = valor
            sol_actualizado = SolicitudInDB(**datos_actualizados)
            solicitudes_db[idx] = sol_actualizado
            return sol_actualizado
    raise HTTPException(status_code=404, detail="Solicitud no encontrada")


@app.delete("/api/solicitudes/{id_solicitud}", status_code=204)
async def eliminar_solicitud(id_solicitud: UUID = Path(..., description="ID de la solicitud a eliminar")):
    """
    Elimina la solicitud con id_solicitud dado.
    """
    for idx, sol in enumerate(solicitudes_db):
        if sol.id_solicitud == id_solicitud:
            # Antes de eliminar la solicitud, opcionalmente eliminar procesos asociados:
            solicitudes_db.pop(idx)
            return
    raise HTTPException(status_code=404, detail="Solicitud no encontrada")


# -------------------------------------------------------
# RUTAS PARA Procesos
# -------------------------------------------------------

@app.get("/api/procesos", response_model=List[ProcesoInDB])
async def listar_procesos():
    """
    Devuelve todos los procesos creados.
    """
    return procesos_db


@app.get("/api/procesos/por-solicitud/{id_solicitud}", response_model=List[ProcesoInDB])
async def listar_procesos_por_solicitud(id_solicitud: UUID = Path(..., description="ID de la solicitud")):
    """
    Devuelve todos los procesos asociados a una solicitud específica.
    """
    filtrados = [p for p in procesos_db if p.id_solicitud == id_solicitud]
    return filtrados


@app.post("/api/procesos", response_model=ProcesoInDB, status_code=201)
async def crear_proceso(payload: ProcesoCreate = Body(...)):
    """
    Crea un nuevo proceso. Verifica que la solicitud exista antes.
    """
    # Verificar que la solicitud exista
    existe = any(sol.id_solicitud == payload.id_solicitud for sol in solicitudes_db)
    if not existe:
        raise HTTPException(status_code=404, detail="No existe la solicitud asociada")

    nuevo = ProcesoInDB(**payload.dict())
    procesos_db.append(nuevo)
    return nuevo


@app.get("/api/procesos/{id_proceso}", response_model=ProcesoInDB)
async def obtener_proceso(id_proceso: UUID = Path(..., description="ID del proceso")):
    """
    Devuelve el proceso con el id_proceso dado.
    """
    for proc in procesos_db:
        if proc.id_proceso == id_proceso:
            return proc
    raise HTTPException(status_code=404, detail="Proceso no encontrado")


@app.put("/api/procesos/{id_proceso}", response_model=ProcesoInDB)
async def actualizar_proceso(
    id_proceso: UUID = Path(..., description="ID del proceso a actualizar"),
    payload: ProcesoUpdate = Body(...),
):
    """
    Actualiza campos del proceso con id_proceso.
    """
    for idx, proc in enumerate(procesos_db):
        if proc.id_proceso == id_proceso:
            datos = proc.dict()
            for campo, valor in payload.dict(exclude_unset=True).items():
                datos[campo] = valor
            proc_actualizado = ProcesoInDB(**datos)
            procesos_db[idx] = proc_actualizado
            return proc_actualizado
    raise HTTPException(status_code=404, detail="Proceso no encontrado")


@app.delete("/api/procesos/{id_proceso}", status_code=204)
async def eliminar_proceso(id_proceso: UUID = Path(..., description="ID del proceso a eliminar")):
    """
    Elimina el proceso con el id_proceso dado.
    """
    for idx, proc in enumerate(procesos_db):
        if proc.id_proceso == id_proceso:
            procesos_db.pop(idx)
            return
    raise HTTPException(status_code=404, detail="Proceso no encontrado")
