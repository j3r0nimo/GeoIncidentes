# GeoIncidentes

### Objetivo general

Desarrollo de una aplicación web que permita visualizar, filtrar y representar gráficamente los incidentes viales
ocurridos en el Partido de Coronel Rosales.

### Alcance y limitaciones

El proyecto se centra en la recolección y visualización de incidentes viales registrados en el Partido de Coronel
Rosales, en base a fuentes periodísticas y registros locales. El sistema ofrece una plataforma de exploración y
representación gráfica de los datos, pero no incluye análisis estadístico avanzado ni predicciones de
tendencias. Dichas tareas se consideran parte del trabajo de especialistas en cada campo, quienes podrán
emplear esta herramienta como apoyo a su labor. Los datos incluyen el tramo de la Ruta Nac. 3 que llega
hasta el sector de la rotonda de Grunbeing, por su importancia como nexo conectivo con la ciudad de Bahía
Blanca

### Guia de arranque

Tener en cuenta que las variables de entorno API_KEY del backend y VITE_API_KEY del frontend deben tener IDENTICO contenido. Hay un valor pasado por e-mail.

INSTALACION DE LA BASE DE DATOS:
En la variable MONGO_URI= , en el .env del backend, se define si se desea instalar local o en la nube.
En modo local REQUIERE mongoDB instalado.
Para el modo en la nube, el valor se pasa por e-mail.

Para correr el proyecto de manera local vamos a tener que abrir 2 terminales.
Terminal Backend:
- cd backend: ubicarnos en la carpeta del backend.
- npm install: instalar las dependencias de la carpeta.
- usamos el archivo .env.template para la creacion del .env y agregamos los datos que faltan.

- en caso de usar la base de datos de manera local:
  - npm run seed:all: crear y poblar la base de datos.
- en caso de usar la base de datos de la nube:
  - no hace falta correr npm run seed, ya que la base de datos ya esta poblada
  
- npm run start: correr el backend en entorno de produccion.

Terminal Frontend:
- cd frontend: ubicarnos en la carpeta del frontend.
- npm install: instalar las dependencias de la carpeta.
- usamos el archivo .env.template para la creacion del .env y agregamos los datos que faltan.
- npm run dev: correr el frontend en entorno de desarrollo.
- npm run build: generar build de produccion.
- npm run preview: previsualizar el build.

## Créditos

Proyecto Final de la Tecnicatura Universitaria de Programación en la Universidad Tecnológica Nacional, Facultad Regional Bahía Blanca, Grupo 14, a cargo de:

- Jerónimo BALTIAN ORTIZ
- Jimena MARTINEZ ARANA
- Carlos Alberto ARCE
