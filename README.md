# Gestor de Procesos

Este repositorio contiene un proyecto completo de Gestor de Procesos, dividido en dos partes claramente separadas:

backend/: API REST desarrollada con FastAPI y ejecutada con Uvicorn.

frontend/: Interfaz de usuario construida con React (usando Vite como bundler) que consume la API del backend.

A continuación encontrarás las instrucciones detalladas para que cualquier persona pueda clonar este repositorio, instalar las dependencias y ejecutar el proyecto en su propia máquina.

# Tabla de contenidos

1. Requisitos previos
2. Estructura del proyecto
3. Configuración del Backend (FastAPI)
4. Crear y activar el entorno virtual
5. Instalar dependencias
6. Variables de entorno
7. Ejecutar el servidor
8. Configuración del Frontend (React + Vite)
9. Instalar dependencias
10. Variables de entorno
11. Ejecutar el servidor de desarrollo
12. Probar la aplicación
13. Verificar la API con Swagger UI
14. Verificar el frontend en el navegador
15. Scripts disponibles
16. Notas.

# Requisitos previos

Antes de comenzar, asegúrate de contar con lo siguiente instalado en tu sistema:
1. Git (para clonar el repositorio)
2. Python 3.9+
  Se recomienda instalarlo a través de python.org o un gestor de versiones como pyenv.  
3. Node.js 16+ y npm 8+ (o la versión que recomiende Vite en su documentación)
  Puedes descargar Node.js desde nodejs.org.
4. (Opcional, pero recomendado) Visual Studio Code u otro editor con soporte para Python y JavaScript/JSX.
5. cURL o Postman (para probar la API desde la terminal o interfaz gráfica).

# Configuración del Backend (FastAPI)
# Crear y activar el entorno virtual

1. Abre una terminal y navega a la carpeta backend/:
  cd D:\gestor-procesos\backend
2. (Solo la primera vez) Crea un entorno virtual de Python:
  python -m venv venv
3. Activa el entorno virtual:
  venv\Scripts\activate

# Instalar dependencias
Con el entorno virtual activo, instala las dependencias listadas en requirements.txt:
  pip install -r requirements.txt
De manera predeterminada, requirements.txt incluye:
  fastapi
  uvicorn
  pydantic

# Ejecutar el servidor (Backend)
Con el entorno virtual activo y las dependencias instaladas, levanta el servidor de FastAPI usando Uvicorn:
### uvicorn main:app --reload

# Configuración del Frontend (React + Vite)

Instalar dependencias (Frontend)
1. Abre otra terminal (o pestaña) y navega a la carpeta frontend/:
  cd D:\gestor-procesos\frontend
2. Instala todas las dependencias de Node definidas en package.json:
  npm install


# Ejecutar el servidor de desarrollo (Frontend)

Con las dependencias instaladas y las variables configuradas, levanta el servidor de desarrollo de Vite:

npm run dev

# Probar la aplicación

Para comprobar que tanto el backend como el frontend estén conectados y funcionando correctamente, realiza estas dos pruebas:

# Verificar la API con Swagger UI

1. Asegúrate de que el backend esté corriendo (ejecutaste uvicorn main:app --reload en backend/).
2. En tu navegador, abre:
  http://localhost:8000/docs
3. Verás la documentación interactiva generada por FastAPI.
4. Prueba la ruta POST /api/solicitudes haciendo clic en “Try it out” y llenando un JSON de ejemplo, por ejemplo:
  {
  "descripcion": "Prueba desde Swagger",
  "tipo_area": "TI",
  "responsable_seguimiento": "María García",
  "fecha_estimacion": "2025-07-10T00:00:00Z",
  "estatus": "pendiente",
  "folio": "SWAGGER-001",
  "fecha_aprobacion": null,
  "retroalimentacion": null,
  "aprobado_por": null
}
5. Luego, verifica con GET /api/solicitudes que la solicitud recién creada aparece en la lista.

# Verificar el frontend en el navegador
1. Asegúrate de que el frontend esté corriendo (ejecutaste npm run dev en frontend/).
2.Abre el navegador en:
  http://localhost:5173/
3. Navega a la pantalla de Registro de Solicitud (o la ruta principal).
4. Completa el formulario de “Registro de Petición de Proceso” con datos de prueba y haz clic en “Enviar Solicitud”.
  - Si todo está bien, deberías ser redirigido automáticamente a la pantalla de “Gestión de Solicitudes”, donde se muestra la lista con la nueva solicitud.

# Notas adicionales

- Estructura de carpetas: Asegúrate de NO mover manualmente archivos mientras el servidor de Vite o Uvicorn estén en ejecución, ya que pueden quedar bloqueados.
  
- Renombrar rutas: 
    Si cambias nombres de archivos (por ejemplo, .jsx o .js), recuerda actualizar los import relativos en los componentes de React.
  
- Variables de entorno:
    Backend: si usas un archivo .env, FastAPI con python-dotenv lo cargará automáticamente.
    Frontend: tras editar frontend/.env, es imprescindible reiniciar Vite (npm run dev).
  
- CORS: El backend está configurado para permitir peticiones desde http://localhost:5173 (puerto por defecto de Vite). Si modificas el puerto del frontend, actualiza el origen permitido en main.py.
  
- Base de datos real: Actualmente, el backend usa listas en memoria (db.py). Al reiniciar Uvicorn, los datos se perderán. Para producción, es recomendable integrar un motor relacional (PostgreSQL, MySQL, SQLite, etc.) usando un ORM como SQLAlchemy.





