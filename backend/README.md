# API de incidentes de tránsito en el Partido de Coronel Rosales

## Objetivo general

Desarrollo de una aplicación web que permita visualizar, filtrar y representar gráficamente los incidentes viales ocurridos en el Partido de Coronel Rosales.

## Alcance y limitaciones

El proyecto se centra en la recolección y visualización de incidentes viales registrados en el Partido de Coronel Rosales, en base a fuentes periodísticas y registros locales. El sistema ofrece una plataforma de exploración y representación gráfica de los datos, pero no incluye análisis estadístico avanzado ni predicciones de tendencias. Dichas tareas se consideran parte del trabajo de especialistas en cada campo, quienes podrán emplear esta herramienta como apoyo a su labor. Los datos incluyen el tramo de la Ruta Nac. 3 que llega hasta el sector de la rotonda de Grunbeing, por su importancia como nexo conectivo con la ciudad de Bahía Blanca

## API Technicals

- **API**: Tecnicamente, la aplicación es una API, Application Programming Interface, con capacidad de ejecutar las operaciones de obtención, inserción, actualización y eliminación de datos.

- **Backend**: Node.js, Express, JavaScript
- **Database**: MongoDB
- **Security & Authentication**:
  - JWT with Bearer token authentication (`jsonwebtoken`)
  - API KEY validation para la totalidad de las rutas de la API.
  - Password hashing (`crypto` / `bcrypt`)
  - Protection against brute-force attacks (login attempts)
  - Rate limiting per IP (`express-rate-limit`)
  - Input sanitization (`express-mongo-sanitize`)
  - HTTP security headers (`helmet`)
- **File Uploads**: `multer` for handling images and attachments
  - El tipo MIME del archivo es validado, así como su tamaño y peso.

### Documentación interactiva con Swagger

La API cuenta con documentación Swagger disponible en `/api/docs`:

En modo local, en http://localhost:3000/api/docs

- Permite explorar todos los endpoints (GET, POST, PUT, DELETE) de manera interactiva.
- Se puede probar la API directamente desde el navegador usando **Try it out**.
- Para endpoints protegidos, incluye soporte de **API Key** y **JWT Bearer token**.
- Respuestas documentadas: códigos 200/201 y errores 400, 401, 403, 404.
- Pruebas en tiempo real: envía datos y recibe respuestas desde la interfaz.

#### Mini-tutorial de ejemplo: flujo mínimo

1. **Login**
   - Endpoint: `POST /api/auth/login`
   - Proporcionar usuario y contraseña válidos (según email registrado).
   - Completar los campos requeridos y presionar **Execute**.
   - Swagger devuelve un **JWT token** que será usado en los endpoints protegidos.

2. **Obtener incidentes**
   - Endpoint: `GET /api/incidentes`
   - Hacer click en **Try it out** en Swagger.
   - Ingresar la **API Key** en el header `x-api-key`.
   - Incluir el token JWT si el endpoint lo requiere.
   - Ejecutar y revisar la respuesta JSON con la lista de incidentes.

## Logger

El backend incluye un sistema de logger personalizado, diseñado para funcionar tanto en entornos de desarrollo como de producción.

- Utilidad de logger centralizada (`src/utils/logger.js`)
- Soporta distintos niveles de log:
  - `info`
  - `warn`
  - `error`
- Los logs:
  - Se escriben en un archivo persistente (`server.log`)
  - Se muestran por consola en entornos que no son de producción
- Cada entrada de log incluye:
  - Timestamp en formato ISO
  - Nivel de log
  - Mensaje
  - Metadatos opcionales (serializados en JSON)
- Salida por consola con colores en modo desarrollo para mejorar la legibilidad
- El comportamiento se adapta automáticamente según la variable `NODE_ENV`

El sistema de logging se utiliza en toda la aplicación, incluyendo:

- Manejo de solicitudes a la API
- Eventos de seguridad (por ejemplo, API key inválida o solicitudes bloqueadas)
- Reporte de errores
- Mensajes de depuración y operación

## Inicio

- Se asume que la Base de datos no existe o que sus colecciones están vacías.

## Instalación

Pasos para la instalación:

- `npm install`
- crear el archivo `.env`, ajustando adecuadamente los valores
- existe un archivo de referencia: `.env.template`
- JWT_SECRET en particular, debe ser extensa y aleatoria.
- API_KEY debe existir también en el frontend y ser de contenido IDENTICO en ambos servicios
- Crear & poblar la base de datos: `npm run seed:all`
- Ejecución en entorno de desarrollo: `npm run dev`
- Ejecución en entorno de producción: `npm run start` para uso genérico
- Ejecución en entorno de producción: `npm run start:prod`

## Ingreso via Postman

- Por criterios de evaluación, la API incorpora una API KEY en todas sus rutas.
- Para probar la API en Postman, es necesario agregar `x-api-key` en el header. ver mail
- el login permite, ademas, obtener el token. ver mail.
- Para POST, PUT, DELETE en Postman, es necesario, ademas, ingresar el token logrado con el login.
- En Postman y con los valores recibidos en el mail, acceder a:
- POST http://localhost:3000/api/auth/login
- Completar las variables Headers `Authorization: ver email` `x-api-key: ver email`
- En Body raw, { `username: ver email` `password: ver email` }

## Colecciones GET en Postman

- Cumplido el login inicial via Postman, que ingresa la API KEY.
- GET http://localhost:3000/api/incidentes
- GET http://localhost:3000/api/incidentes?page=&limit=&keyword=
- GET http://localhost:3000/api/incidentes/:id
- GET http://localhost:3000/api/reports/incidentes/pdf
- GET http://localhost:3000/api/reports/incidentes/xlsx

## Colecciones CRUD en Postman

- Cumplido el login inicial via Postman, que ingresa la API KEY.
- Completar la variable Header `Authorization:`, agregando el token obtenido en el login. ver email.
- POST http://localhost:3000/api/auth/
- POST http://localhost:3000/api/incidentes
- PUT http://localhost:3000/api/incidentes
- DELETE http://localhost:3000/api/incidentes/:id

## Incidente collection

Para su uso en Postman POST, PUT, DELETE, el siguiente es el body raw necesario, con ejemplos válidos:

- `{
"fecha": "2022-01-06",
"hora": "20:00",
"incidente": "choque",
"medio": "motocicleta",
"vehiculo": "Ciclomotor",
"patente": "JJJ999",
"heridos": 2,
"fallecidos": 0,
"direccion": "Brown 390",
"sector": "Centro. Punta Alta.",
"lugar": "calle",
"posicion": {
    "lat": -38.880859,
    "lng": -62.07568    
    },
"imagen": "20220106_1.jpg",
"descripcion": "Choque entre motos.",
"web": "https://elrosalenio.com.ar/noticias/06/01/2022/10034816/siniestro-vial-entre-motos-deja-dos-heridos-leves"
}`

- ACLARACION: En Postman se debe usar Body -> form-data, porque existen elementos de tipo objeto: posicion e imagen
- `imagen` debe declararse como tipo `File`
- `posicion` debe dividirse en dos campos, ambos de tipo `Text`: `posicion.lat` y `posicion.lng`

## Reportes

- La API permite descargar reportes de incidentes de tránsito en dos formatos:

- PDF: Documento con formato profesional, adecuado para impresión o revisión offline. Incluye todos los campos de cada incidente con fechas, ubicaciones y descripciones detalladas.

- XLSX: Formato de hoja de cálculo, ideal para análisis de datos o importación en Excel u otras herramientas. Contiene todo el conjunto de datos con columnas para cada atributo del incidente.

- Ambos endpoints de reporte están protegidos mediante la API Key y permiten aplicar filtros por rango de fechas u otros criterios a través de la API.

- Cumplido el login inicial via Postman, que ingresa la API KEY.
- GET http://localhost:3000/api/reports/incidentes/pdf
- GET http://localhost:3000/api/reports/incidentes/xlsx
- GET http://localhost:3000/api/reports/incidentes/pdf?tipo=&medio=&desde=&hasta=&sector=&keyword=&fallecidos=&periodo=
- GET http://localhost:3000/api/reports/incidentes/xlsx?tipo=&medio=&desde=&hasta=&sector=&keyword=&fallecidos=&periodo=

## Testing

El testing tiene test unitarios y de integración, un directorio dedicado y su propio archivo de configuración, .env.test

Ejecución de todos los tests:

- npm test

Solamente testing unitarios:

- npm run test:unit

Solamente testing de integración:

- npm run test:integration

## Créditos

Proyecto Final de la Tecnicatura Universitaria de Programación en la Universidad Tecnológica Nacional, Facultad Regional Bahía Blanca, Grupo 14, a cargo de:

- Jerónimo BALTIAN ORTIZ
- Jimena MARTINEZ ARANA
- Carlos Alberto ARCE
