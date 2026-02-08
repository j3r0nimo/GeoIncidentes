# Frontend Proyecto final

---

## Objetivo General

Desarrollo de una Single Page Application (SPA) que permita la
visualización, administración y representación gráfica de los incidentes
viales ocurridos en el Partido de Coronel Rosales.

El frontend proporciona una interfaz interactiva para:

- Gestión CRUD de incidentes (usuarios administradores)
- Visualización geográfica de los hechos
- Análisis estadístico mediante gráficos
- Aplicación de filtros dinámicos sobre los datos
- Generación de reportes exportables

---

## Alcance y Funcionalidad

La aplicación permite:

- Crear, editar y eliminar incidentes viales.
- Visualizar los hechos en un mapa interactivo.
- Filtrar información por:
  - Rango de fechas
  - Tipo de incidente
  - Medio de transporte
  - Sector
  - Palabras clave
- Analizar estadísticas mediante gráficos de torta.
- Exportar reportes en PDF y XLSX.
- Navegación protegida mediante autenticación con JWT.
- Consumo seguro de la API mediante API Key.

El sistema está orientado a la exploración y visualización de datos, no
al análisis predictivo avanzado.

---

## Arquitectura

El frontend está desarrollado como una **Single Page Application
(SPA)**, utilizando React y React Router DOM para la navegación sin
recarga de página.

Se comunica con el backend mediante peticiones HTTP autenticadas,
utilizando:

- API Key
- Token JWT (Bearer Token)

---

## Tecnologías Utilizadas

- **Vite** -- Entorno de desarrollo y build
- **React** -- Construcción de la interfaz
- **JavaScript**
- **Bootstrap + CSS** -- Diseño responsive
- **React Router DOM** -- Enrutamiento del lado del cliente
- **Leaflet** -- Renderizado del mapa interactivo
- **Chart.js** -- Visualización de estadísticas
- **Vitest** -- Testing unitario

---

## Manejo de Formularios con Imágenes

Para la creación y edición de incidentes que incluyen imágenes se
utiliza `FormData` en lugar de JSON.

Esto permite:

- Enviar datos de texto e imágenes (archivos .jpg) en una misma
    petición.
- En edición, mantener la imagen existente sin necesidad de volver a
    subirla.
- Cumplir con los requisitos del backend que utiliza `multer` para la
    gestión de archivos.

---

## Geolocalización

Mediante Leaflet se implementa un mapa interactivo que:

- Ubica cada incidente según su latitud y longitud.
- Permite visualizar detalles mediante popups.
- Se integra con el sistema de filtros.
- Refleja dinámicamente los cambios en la base de datos.

Además, se incorpora un gráfico de torta que representa estadísticas
como:

- Sectores con mayor incidencia
- Medios de transporte más involucrados
- Tipos de hechos más frecuentes

---

## Generación de Reportes

El sistema permite exportar reportes dinámicos en formato:

- **PDF**
- **XLSX (Excel)**

Los reportes se generan en función de los filtros aplicados en el panel de búsqueda:

- Tipo de hecho
- Medio involucrado
- Sector
- Rango de fechas
- Periodo horario
- Presencia de fallecidos
- Palabra clave

El frontend construye automáticamente la query string correspondiente y realiza la solicitud a los endpoints del backend:

GET /api/reports/incidentes/pdf\
GET /api/reports/incidentes/xlsx

Los archivos se descargan automáticamente en el navegador.

Esta funcionalidad garantiza coherencia entre:

- Datos visualizados
- Estadísticas mostradas
- Información exportada

---

## Instalación

Se asume que el backend se encuentra correctamente configurado y en
ejecución.

1. Clonar el repositorio.
2. Abrir una terminal en la carpeta del proyecto.
3. Instalar dependencias:

``` bash
npm install
```

1. Crear el archivo `.env` basándose en `.env.template`.

Variables importantes:

- `VITE_API_URL`
- `VITE_API_KEY` (Debe ser idéntica a la del backend)

1. Ejecutar entorno de desarrollo:

``` bash
npm run dev
```

La aplicación se ejecutará en:

    http://localhost:5173/

---

## Scripts Disponibles

``` bash
npm run dev        # Entorno de desarrollo
npm run build      # Genera build de producción
npm run preview    # Previsualiza el build
npm test           # Ejecuta tests
```

---

## Entorno de Producción

Para generar la versión optimizada:

``` bash
npm run build
```

Esto creará la carpeta `dist/`, lista para ser desplegada en un servidor
estático.

---

## Testing

El proyecto incluye pruebas unitarias utilizando **Vitest**.

Ejecución:

``` bash
npm test
```

---

## Integración con Backend

El frontend consume la API desarrollada en:

- Node.js
- Express
- MongoDB

El acceso a los endpoints requiere:

- API Key válida
- Token JWT obtenido mediante login

El sistema incluye rutas protegidas para garantizar que solo
administradores autenticados puedan realizar operaciones CRUD.

---

## Carpetas utilizadas

- Public: imagenes del sitio
- Src:
  - Api: archivo de conexion al backend
  - Components: funciones complejas fundamentales para el funcionamiento del sitio
  - Pages: paginas en las cuales el usuario va a recorrer
  - Styles: archivo css para el diseño del sitio
  - Utils: funciones simples requeridas en ciertas paginas
- Test: ejecucion de test del frontend

---

## Créditos

Proyecto Final de la Tecnicatura Universitaria de Programación\
Universidad Tecnológica Nacional -- Facultad Regional Bahía Blanca\
Grupo 14

- Jerónimo BALTIAN ORTIZ\
- Jimena MARTÍNEZ ARANA\
- Carlos Alberto ARCE
