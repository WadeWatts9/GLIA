// Camera Helper module for GLIA Catalog using HTML5 MediaDevices API

const CameraHelper = {
  stream: null,

  async getDevices() {
    try {
      // Prompt permissions if not already granted by doing a quick request
      // (enumerateDevices often returns empty labels if permission is not granted)
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch (err) {
      console.error('Error al enumerar dispositivos de cámara:', err);
      return [];
    }
  },

  async startCamera(videoElement, selectElement) {
    this.stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("La cámara no está disponible en este navegador o contexto. Nota: En dispositivos móviles, el navegador requiere una conexión segura (HTTPS) para habilitar el uso de la cámara.");
      return false;
    }

    let constraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'environment' // default to back camera on mobile
      }
    };

    // If a specific camera is selected, use its deviceId
    if (selectElement && selectElement.value) {
      constraints.video = {
        deviceId: { exact: selectElement.value }
      };
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      console.warn("Fallo al iniciar cámara con restricciones ideales. Intentando fallback simple...", err);
      try {
        // Fallback to basic video stream (works on most devices/front cameras/older hardware)
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      } catch (fallbackErr) {
        console.error("Error al iniciar cámara incluso con fallback:", fallbackErr);
        alert("No se pudo acceder a ninguna cámara en este dispositivo.");
        return false;
      }
    }

    try {
      videoElement.srcObject = this.stream;
      
      // Populate select dropdown if it's empty
      if (selectElement && selectElement.options.length <= 1) {
        const devices = await this.getDevices();
        selectElement.innerHTML = '';
        
        if (devices.length === 0) {
          const opt = document.createElement('option');
          opt.value = '';
          opt.text = 'Cámara por defecto';
          selectElement.appendChild(opt);
        } else {
          devices.forEach((device, index) => {
            const opt = document.createElement('option');
            opt.value = device.deviceId;
            opt.text = device.label || `Cámara ${index + 1}`;
            selectElement.appendChild(opt);
          });
        }
      }
      return true;
    } catch (err) {
      console.error('Error al configurar flujo de video:', err);
      return false;
    }
  },

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  },

  capturePhoto(videoElement, canvasElement) {
    if (!videoElement || !canvasElement) return null;

    const context = canvasElement.getContext('2d');
    const width = videoElement.videoWidth || 640;
    const height = videoElement.videoHeight || 480;

    canvasElement.width = width;
    canvasElement.height = height;

    // Draw the current video frame on canvas.
    // Note: We do NOT mirror the output because if the user captures a book or movie cover,
    // mirroring would reverse the text and make it unreadable.
    context.drawImage(videoElement, 0, 0, width, height);

    return new Promise((resolve) => {
      canvasElement.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.85); // Save as JPEG for better compression
    });
  }
};
