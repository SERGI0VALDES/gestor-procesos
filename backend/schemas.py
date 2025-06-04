# backend/schemas.py

from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime


class SolicitudBase(BaseModel):
    descripcion: str = Field(..., description="Descripción de la solicitud")
    tipo_area: str = Field(..., max_length=50, description="Tipo de área (varchar(50))")
    responsable_seguimiento: str = Field(..., max_length=150, description="Responsable de seguimiento")
    fecha_creacion: datetime = Field(default_factory=datetime.utcnow, description="Fecha de creación")
    fecha_estimacion: Optional[datetime] = Field(None, description="Fecha estimada (datetime)")
    estatus: str = Field(..., max_length=50, description="Estatus (varchar(50))")
    folio: str = Field(..., max_length=50, description="Folio (varchar(50))")
    fecha_aprobacion: Optional[datetime] = Field(None, description="Fecha de aprobación (datetime)")
    retroalimentacion: Optional[str] = Field(None, description="Retroalimentación (texto)")
    aprobado_por: Optional[str] = Field(None, max_length=150, description="Aprobado por (varchar(150))")


class SolicitudCreate(SolicitudBase):
    """
    Para crear una nueva solicitud, no se requiere el id_solicitud (lo genera el sistema).
    """


class SolicitudUpdate(BaseModel):
    """
    Para actualizar solo campos que puedan cambiar tras crear la solicitud.
    """
    descripcion: Optional[str] = None
    tipo_area: Optional[str] = None
    responsable_seguimiento: Optional[str] = None
    fecha_estimacion: Optional[datetime] = None
    estatus: Optional[str] = None
    folio: Optional[str] = None
    fecha_aprobacion: Optional[datetime] = None
    retroalimentacion: Optional[str] = None
    aprobado_por: Optional[str] = None


class SolicitudInDB(SolicitudBase):
    id_solicitud: UUID = Field(default_factory=uuid4, description="ID de la solicitud (UUID)")

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id_solicitud": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "descripcion": "Solicitud para reponer impresora",
                "tipo_area": "TI",
                "responsable_seguimiento": "Juan Pérez",
                "fecha_creacion": "2025-06-01T15:34:00Z",
                "fecha_estimacion": "2025-06-10T00:00:00Z",
                "estatus": "pendiente",
                "folio": "SOL-2025-001",
                "fecha_aprobacion": None,
                "retroalimentacion": None,
                "aprobado_por": None
            }
        }


# -----------------------
# Modelos para "Procesos"
# -----------------------

class ProcesoBase(BaseModel):
    nombre: str = Field(..., max_length=150, description="Nombre del proceso (varchar(150))")
    descripcion: Optional[str] = Field(None, description="Descripción (texto)")
    id_solicitud: UUID = Field(..., description="ID de la solicitud asociada (UUID)")
    fecha_registro: Optional[datetime] = Field(default_factory=datetime.utcnow, description="Fecha de registro")

class ProcesoCreate(ProcesoBase):
    """
    Para crear un proceso, el id_proceso se genera automáticamente.
    """


class ProcesoUpdate(BaseModel):
    """
    Para actualizar campos del proceso (podrías permitir cambiar nombre o descripción)
    """
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    fecha_registro: Optional[datetime] = None


class ProcesoInDB(ProcesoBase):
    id_proceso: UUID = Field(default_factory=uuid4, description="ID del proceso (UUID)")

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id_proceso": "3fa85f64-5717-4562-b3fc-2c963f66afd7",
                "nombre": "Proceso de aprobación de impresora",
                "descripcion": "Revisión de factibilidad y compra de insumos",
                "id_solicitud": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "fecha_registro": "2025-06-05T10:00:00Z"
            }
        }
