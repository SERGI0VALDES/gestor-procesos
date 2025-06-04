# backend/db.py
# Simular la “base de datos” con listas en memoria
from typing import List
from schemas import SolicitudInDB, ProcesoInDB

# Litado global de Solicitudes y Procesos (en memoria)
# Inicialmente vacíos. En un proyecto real los reemplazaríamos con llamadas a la base de datos.

solicitudes_db: List[SolicitudInDB] = []
procesos_db: List[ProcesoInDB] = []
