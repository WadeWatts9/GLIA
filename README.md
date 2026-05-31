# GLIA - Manual de Documentación Técnica y del Usuario

GLIA es una aplicación web responsiva y dockerizada diseñada para catalogar y realizar un seguimiento inteligente de tu consumo de medios: **películas**, **series** y **libros**. 

El nombre **GLIA** proviene de las células gliales (o glía), las cuales tradicionalmente eran consideradas el simple "pegamento" de las neuronas, pero que la neurociencia moderna reconoce como participantes activas y fundamentales en la formación, consolidación y almacenamiento de la memoria, así como en la plasticidad sináptica (los astrocitos modulan las conexiones neuronales y aportan energía metabólica, mientras que la microglía esculpe los circuitos eliminando conexiones débiles). De manera análoga, esta aplicación funciona como ese soporte de memoria que ayuda a consolidar, estructurar y dar seguimiento a nuestras experiencias de consumo multimedia.

Este proyecto surge como respuesta a una necesidad personal como desarrollador: la de llevar adelante un registro propio, personalizado y autocontenido de mis consumos multimedia cotidianos, sin depender de plataformas externas de terceros y manteniendo el control absoluto sobre mis datos.

La aplicación destaca por su estética moderna *dark-navy* con efectos de *glassmorphism*, control nativo de superposiciones (`<dialog>`), uso de la cámara web para capturas de portadas y persistencia de datos local robusta.

---

## 🛠️ Tecnologías Utilizadas

La arquitectura de GLIA está diseñada para ser extremadamente ligera, auto-contenida, segura y portable a cualquier arquitectura (x86_64 y ARM64):

### Backend
- **Node.js (v24)**: Entorno de ejecución principal.
- **Express.js (v4.19)**: Servidor web y router para APIs REST y archivos estáticos.
- **`better-sqlite3`**: Librería SQLite madura y estable de alto rendimiento. Compila un módulo nativo en C++ durante la construcción de la imagen Docker (las herramientas necesarias se incluyen y eliminan automáticamente del Dockerfile para mantener la imagen liviana). Compatible con cualquier arquitectura soportada por Alpine Linux (x86_64, ARM64).
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
├── database.js                 # Inicialización y queries de SQLite (better-sqlite3)
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

## 🚀 Guía de Deploy

### Requisitos Previos
- **Docker** y **Docker Compose** instalados y en ejecución.
- **Git** instalado (para clonar el repositorio en el servidor).

---

### 🖥️ Deploy en Servidor (ZimaOS / Linux / NAS)

Esta es la forma recomendada para correr GLIA en un servidor doméstico o NAS con ZimaOS, Unraid, TrueNAS, Ubuntu Server, o cualquier distribución Linux con Docker.

#### 1. Clonar el repositorio

Conéctate al servidor por SSH y clona el proyecto:

```bash
git clone https://github.com/WadeWatts9/GLIA.git
cd GLIA
```

#### 2. Construir y levantar el contenedor

> ⚠️ **Importante:** Siempre usá `--build` en el primer deploy o después de actualizar el código. Esto garantiza que Docker recompile la imagen con las últimas dependencias (incluyendo `better-sqlite3`).

```bash
docker compose up -d --build
```

Este comando:
1. Descarga la imagen base `node:24-alpine`.
2. Instala las herramientas de compilación necesarias para `better-sqlite3` (`python3`, `make`, `g++`).
3. Ejecuta `npm ci --omit=dev` para instalar solo dependencias de producción y compilar el módulo nativo.
4. Elimina las herramientas de compilación para mantener la imagen liviana.
5. Crea el volumen persistente `glia-data` (base de datos SQLite + portadas subidas).
6. Levanta el servidor en el puerto **3000**.

#### 3. Verificar que el contenedor está corriendo

```bash
docker compose ps
```

Deberías ver el contenedor `glia-app` con estado `Up`. Para ver los logs en tiempo real:

```bash
docker compose logs -f
```

#### 4. Acceder a la aplicación

Desde cualquier dispositivo en tu red local:

```
http://<IP-DEL-SERVIDOR>:3000
```

Por ejemplo: `http://192.168.1.100:3000`

> 💡 En ZimaOS podés encontrar la IP del servidor en el panel de control, o ejecutando `ip addr` en la terminal.

---

### 🔄 Actualizar GLIA a una nueva versión

Cuando haya cambios nuevos en el repositorio:

```bash
git pull
docker compose up -d --build
```

Tus datos (base de datos y portadas) se conservan intactos gracias al volumen `glia-data`.

---

### 🛑 Detener el contenedor

```bash
docker compose down
```

> Esto **no elimina** el volumen de datos. Para eliminar también los datos (¡irreversible!):
> ```bash
> docker compose down -v
> ```

---

### 💾 Backup de datos

Todos los datos persistentes (base de datos SQLite y portadas) se almacenan en el volumen Docker `glia-data`. Para hacer un backup manual:

```bash
# Encontrar la ruta física del volumen
docker volume inspect glia-data

# Copiar el contenido a una carpeta local
docker run --rm -v glia-data:/data -v $(pwd):/backup alpine \
  tar czf /backup/glia-backup-$(date +%Y%m%d).tar.gz -C /data .
```

---

### 🧑‍💻 Ejecución Local en Desarrollo

Si deseas ejecutar la aplicación sin Docker (requiere Node.js >= v22.5.0 y herramientas de compilación nativas instaladas):

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor:
   ```bash
   npm start
   ```
3. La aplicación estará activa en: **`http://localhost:3000`**.
