# GLIA - Manual de Documentación Técnica y del Usuario

GLIA es una aplicación web responsiva y dockerizada diseñada para catalogar y realizar un seguimiento inteligente de tu consumo de medios: **películas**, **series** y **libros**. 

La aplicación destaca por su estética moderna *dark-navy* con efectos de *glassmorphism*, control nativo de superposiciones (`<dialog>`), uso de la cámara web para capturas de portadas y persistencia de datos local robusta.

---

## 🛠️ Tecnologías Utilizadas

La arquitectura de GLIA está diseñada para ser extremadamente ligera, auto-contenida, segura y libre de problemas de compilación nativa en entornos de contenedores:

### Backend
- **Node.js (v24)**: Entorno de ejecución principal.
- **Express.js (v4.19)**: Servidor web y router para APIs REST y archivos estáticos.
- **`node:sqlite` (Nativo)**: Base de datos SQLite experimental introducida nativamente en Node.js (desde v22.5.0). Al no requerir dependencias externas como `sqlite3` o `better-sqlite3`, se elimina la necesidad de compilar código C++ en Docker, logrando compilaciones instantáneas y portables a cualquier arquitectura (ARM64, x86_64).
- **Multer**: Middleware para gestionar subidas de archivos en formato `multipart/form-data`.
- **Fetch API (Nativo)**: Usado para descargar imágenes externas directamente al almacenamiento local en el servidor, protegiendo al usuario de enlaces caídos o problemas de CORS.

### Frontend
- **HTML5 Semántico**: Estructura limpia y uso de la API nativa `<dialog>` con el atributo `closedby="any"` para diálogos y ventanas modales modernas.
- **CSS3 (Vanilla)**: Hoja de estilos premium basada en variables CSS. Implementa:
  - Diseño responsivo mediante CSS Grids, Flexbox y Media Queries.
  - Efectos visuales avanzados: *Glassmorphic panels* (`backdrop-filter`), sombras con brillo de neón, gradientes de texto y transiciones fluidas.
  - Animaciones personalizadas (efecto de respiración en el logotipo y barras de progreso fluidas).
  - Barras de desplazamiento personalizadas.
- **JavaScript (Vanilla - ES6)**: Lógica cliente modular e interactiva que incluye:
  - Gestión asíncrona del estado local.
  - **MediaDevices API & WebRTC**: Acceso y transmisión en vivo de la cámara para capturas en tiempo real.
  - Gestión inteligente del flujo de formularios y validaciones de páginas/minutos.
  - Control de fallback para cerrar diálogos al hacer clic fuera (*light-dismiss*) compatible con Safari y navegadores antiguos.

### DevOps y Contenedores
- **Docker**: Imagen optimizada basada en `node:24-alpine` para un tamaño de contenedor mínimo y máxima seguridad (corriendo bajo usuario no privilegido `node`).
- **Docker Compose**: Automatización del levantamiento del contenedor y mapeo del volumen persistente `glia-data` para asegurar que las imágenes y la base de datos se mantengan intactas entre reinicios.

---

## 🌟 Funcionalidades Detalladas

### 1. Panel de Control (Dashboard)
- **Visualización Limitada**: El panel principal muestra un máximo de **3 resultados** ordenados por fecha de actualización por tipo de consumo (Películas, Series y Libros).
- **Filtros por Estado**: Cada sección posee botones de pestañas que permiten filtrar la visualización rápida entre:
  - **Películas/Series**: Recientes, Quiero Ver, Mirando / Re-viendo.
  - **Libros**: Recientes, Quiero Leer, Leyendo / Re-leyendo.
- **Exclusión de Completados**: Los elementos finalizados (estado *Vista* o *Leído*) se ocultan automáticamente del panel principal, manteniéndolo libre de desorden y enfocado en lo que tienes pendiente o en curso.
- **Tarjetas Dinámicas**: Muestran la portada en formato vertical 9:16 (ideal para pósters cinematográficos y portadas de libros, o un icono representativo de categoría en gradiente si no posee), título, sinopsis (truncada elegantemente a 2 líneas), plataformas de streaming, progreso (barra de porcentaje y estado de minutaje/páginas) e indicador de estrellas.
- **Navegación Rápida por Estadísticas**: Al hacer clic en cualquiera de las cuatro tarjetas de estadísticas en la parte superior del panel, la app despliega automáticamente el catálogo completo pre-filtrado por esa categoría o estado.

### 2. Catálogo de Películas
- **Datos Soportados**: Nombre, género, sinopsis, minutaje actual, duración total (opcional), plataforma de streaming y cantidad de veces vistas.
- **Calificación**: Sistema de 1 a 5 estrellas. Por lógica de negocio, **solo se habilita si el título ha sido visto al menos 1 vez** (`veces_visto >= 1`).
- **Estados de Visualización**:
  - *Quiero Ver*: Restablece minutajes e inhabilita estrellas.
  - *Mirando*: Progreso activo en minutos.
  - *Re-viendo*: Estado automático activado si estás mirando el título pero ya lo has visto completo previamente (`veces_visto >= 1`).
  - *Vista*: Marca el minutaje actual al máximo y establece `veces_visto` como mínimo en 1, habilitando la calificación estelar.

### 3. Catálogo de Series
- Mismas características que las películas, incluyendo:
  - **Temporada y Episodio**: Campos dedicados para saber exactamente en qué capítulo te encuentras.
  - **Barra de Progreso por Episodio**: Si defines la duración total del capítulo en minutos, se renderiza una barra de progreso que indica el porcentaje completado de ese episodio.

### 4. Catálogo de Libros
- **Datos Soportados**: Nombre, género, sinopsis, páginas totales, página actual y cantidad de veces leído.
- **Seguimiento del Progreso de Lectura**:
  - Cuenta con dos métodos intuitivos para registrar tu avance:
    1. **Suma de Páginas**: Puedes ingresar cuántas páginas leíste en tu sesión (por ejemplo, "20"). El sistema sumará este valor a tu página actual y restará la diferencia del total de páginas restantes (la "altura" restante).
    2. **Especificar Página Exacta**: Permite escribir directamente el número de página en el que estás actualmente.
  - Cuenta con una barra de progreso porcentual del total del libro.
- **Estados de Lectura**:
  - *Quiero Leer*: Restablece páginas e inhabilita estrellas.
  - *Leyendo*: Progreso de lectura activo.
  - *Re-leyendo*: Estado activado si estás leyendo pero ya lo has completado antes (`veces_leido >= 1`).
  - *Leído*: Completa automáticamente el total de páginas del libro y establece `veces_leido` en 1 como mínimo.

### 5. Carga de Imágenes Multiorigen
Al agregar o editar cualquier título, puedes definir la portada usando tres opciones:
- **Desde Internet (URL)**: Ingresas la URL directa de la imagen. El backend la descarga en segundo plano y la guarda en la carpeta local `/uploads` para asegurar que el título conserve su portada aun si el enlace original desaparece. Si la descarga falla, se conserva la URL remota como plan de respaldo (*fallback*).
- **Subida de Archivos**: Permite arrastrar o seleccionar imágenes directamente desde tu computadora o dispositivo móvil.
- **Sacar Foto**: Activa la cámara en vivo mediante la cámara web de tu dispositivo en una ventana emergente. Al capturar, se guarda y previsualiza la imagen en formato JPEG comprimido para ahorrar espacio. En teléfonos celulares, esta opción se integra adicionalmente con la aplicación de cámara nativa del sistema operativo.

### 6. Sistema de Géneros Auto-alimentado
- **Menú Desplegable Dinámico**: El formulario de creación y edición compila y muestra los géneros más populares según el tipo de consumo seleccionado (Películas, Series, Libros) combinados con todos los géneros únicos ya guardados en tu base de datos para ese tipo.
- **Entrada Manual**: Al final del menú desplegable se añade la opción **"Otro..."**. Al seleccionarla, se muestra dinámicamente un cuadro de texto para ingresar un nuevo género de forma manual, el cual se registrará y alimentará la lista desplegable en los próximos registros.

### 7. Vista Previa Detallada de Títulos
- **Detalles Integrados**: Al hacer clic sobre la portada o el título de cualquier tarjeta de la interfaz (en la cuadrícula principal o el explorador), se abre una ventana modal con los detalles de ese título.
- **Layout de Vista Previa**: Muestra la portada en tamaño completo (9:16), sinopsis completa, plataforma, avance en minutaje o páginas con barra de porcentaje, veces consumido y calificación en estrellas, además de un botón directo para editar la información.

### 8. Explorador de Catálogo Completo
- Un buscador global integrado mediante el botón **"Explorar Todo"** que despliega un diálogo emergente interactivo:
  - Búsqueda en tiempo real por coincidencia en títulos, géneros o sinopsis.
  - Filtrado específico por tipo de consumo (Películas, Series, Libros).
  - Filtrado específico por estado (En Curso, Guardados para Después, Completados).
  - Ordenamiento por: Último modificado (recientes), Alfabético (A-Z) o Calificación estelar.

---

## 📁 Estructura del Proyecto

El código está estructurado de forma modular y limpia:

```text
GLIA/
├── Dockerfile                  # Configuración de imagen de Docker (Alpine)
├── docker-compose.yml          # Orquestación y persistencia de volúmenes
├── package.json                # Definición de dependencias npm
├── server.js                   # Servidor Express, APIs de subida y descargas
├── database.js                 # Inicialización y queries de SQLite (node:sqlite)
├── data/                       # Carpeta persistente mapeada en Docker
│   ├── glia.db                 # Archivo de Base de Datos SQLite
│   └── uploads/                # Archivo físico de portadas (subidas/cámara/url)
└── public/                     # Archivos de interfaz web (Frontend)
    ├── index.html              # Estructura HTML principal de la SPA
    ├── css/
    │   └── styles.css          # Estilos responsivos, glassmorphism y variables
    └── js/
        ├── api.js              # Controlador de peticiones Fetch
        ├── camera.js           # API de manejo de dispositivos de captura
        └── app.js              # Gestión de eventos, estados y renderizado DOM
```

---

## 🚀 Guía de Inicio

### Requisitos Previos
- **Docker** y **Docker Compose** instalados y en ejecución.

### Ejecución con Docker (Recomendado)
Para iniciar la aplicación de forma rápida con persistencia configurada, abre tu terminal en el directorio raíz del proyecto y ejecuta:

```bash
docker compose up -d
```

Este comando:
1. Compilará la imagen de Node.js v24.
2. Descargará las dependencias de producción.
3. Creará el volumen con nombre `glia-data` (donde se guardarán tus bases de datos y portadas).
4. Levantará el servidor en el puerto **3000**.

Accede a la app en: **[http://localhost:3000](http://localhost:3000)**.

### Ejecución Local en Desarrollo
Si deseas ejecutar la aplicación sin Docker (requiere Node.js >= v22.5.0):

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor:
   ```bash
   npm start
   ```
3. La aplicación estará activa en: **`http://localhost:3000`**.
