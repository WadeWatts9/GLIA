# GLIA - Manual de Documentación Técnica y del Usuario

GLIA es una aplicación web responsiva y dockerizada diseñada para catalogar y realizar un seguimiento inteligente de tu consumo de medios: **películas**, **series** y **libros**. 

El nombre **GLIA** proviene de las células gliales (o glía), las cuales tradicionalmente eran consideradas el simple "pegamento" de las neuronas, pero que la neurociencia moderna reconoce como participantes activas y fundamentales en la formación, consolidación y almacenamiento de la memoria, así como en la plasticidad sináptica (los astrocitos modulan las conexiones neuronales y aportan energía metabólica, mientras que la microglía esculpe los circuitos eliminando conexiones débiles). De manera análoga, esta aplicación funciona como ese soporte de memoria que ayuda a consolidar, estructurar y dar seguimiento a nuestras experiencias de consumo multimedia.

Este proyecto surge como respuesta a una necesidad personal como desarrollador: la de llevar adelante un registro propio, personalizado y autocontenido de mis consumos multimedia cotidianos, sin depender de plataformas externas de terceros y manteniendo el control absoluto sobre mis datos.

La aplicación destaca por su estética moderna *dark-navy* con efectos de *glassmorphism*, control nativo de superposiciones (`<dialog>`), uso de la cámara web para capturas de portadas y persistencia de datos local robusta.

---

## 🛠️ Tecnologías Utilizadas

La arquitectura de GLIA está diseñada para ser extremadamente ligera, auto-contenida, segura y libre de dependencias nativas de compilación:

### Backend
- **Node.js (v24)**: Entorno de ejecución principal.
- **Express.js (v4.19)**: Servidor web y router para APIs REST y archivos estáticos.
- **`node:sqlite` (Nativo)**: Base de datos SQLite integrada en Node.js desde v22.5.0, estabilizada en Node.js 24 (sin requerir flags experimentales). Al ser nativa del runtime, no necesita dependencias externas ni compilación de código C++, logrando builds instantáneos y portables a cualquier arquitectura (ARM64, x86_64).
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
├── database.js                 # Inicialización y queries de SQLite (node:sqlite nativo)
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

La imagen de GLIA se construye automáticamente en GitHub Actions y se publica en el registro de contenedores de GitHub (`ghcr.io`) con cada push a `main`. No es necesario compilar nada en el servidor.

### Requisitos Previos
- **Docker** instalado y en ejecución (no se necesita Docker Compose).
- **Git** instalado (solo si querés clonar el repo para actualizar fácilmente).

---

### 🖥️ Deploy en Servidor (ZimaOS / Linux / NAS)

#### Opción A — Con un solo comando `docker run` (recomendado para ZimaOS)

No necesitás clonar el repositorio ni tener Docker Compose. Solo ejecutá:

```bash
docker run -d \
  --name glia-app \
  --restart unless-stopped \
  -p 3000:3000 \
  -v glia-data:/app/data \
  ghcr.io/wadewatts9/glia:latest
```

Docker descargará la imagen automáticamente y levantará el servidor.

#### Opción B — Con Docker Compose

Si tenés Docker Compose disponible, cloná el repositorio y ejecutá:

```bash
git clone https://github.com/WadeWatts9/GLIA.git
cd GLIA
docker compose up -d
```

> Sin `--build`, ya que la imagen se descarga directamente desde `ghcr.io`.

---

#### Verificar que el contenedor está corriendo

```bash
docker ps
```

Deberías ver `glia-app` con estado `Up`. Para ver los logs en tiempo real:

```bash
docker logs -f glia-app
```

#### Acceder a la aplicación

Desde cualquier dispositivo en tu red local:

```
http://<IP-DEL-SERVIDOR>:3000
```

Por ejemplo: `http://192.168.1.100:3000`

> 💡 En ZimaOS podés encontrar la IP del servidor en el panel de control, o ejecutando `ip addr` en la terminal.

---

### 🔄 Actualizar GLIA a una nueva versión

Cuando haya una nueva versión publicada:

```bash
docker pull ghcr.io/wadewatts9/glia:latest
docker stop glia-app
docker rm glia-app
docker run -d \
  --name glia-app \
  --restart unless-stopped \
  -p 3000:3000 \
  -v glia-data:/app/data \
  ghcr.io/wadewatts9/glia:latest
```

Tus datos (base de datos y portadas) se conservan intactos gracias al volumen `glia-data`.

---

### 🛑 Detener el contenedor

```bash
docker stop glia-app
```

> Esto **no elimina** el volumen de datos. Para eliminar también los datos (¡irreversible!):
> ```bash
> docker stop glia-app && docker rm glia-app
> docker volume rm glia-data
> ```

---

### 💾 Backup de datos

Todos los datos persistentes (base de datos SQLite y portadas) se almacenan en el volumen Docker `glia-data`. Para hacer un backup manual:

```bash
docker run --rm \
  -v glia-data:/data \
  -v $(pwd):/backup \
  alpine \
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

