// API helper module for GLIA Catalog

const API = {
  async getItems() {
    const res = await fetch('/api/items');
    if (!res.ok) throw new Error('Error al obtener los ítems');
    return res.json();
  },

  async getItem(id) {
    const res = await fetch(`/api/items/${id}`);
    if (!res.ok) throw new Error('Error al obtener el ítem');
    return res.json();
  },

  async addItem(item) {
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al agregar el ítem');
    }
    return res.json();
  },

  async updateItem(id, item) {
    const res = await fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al actualizar el ítem');
    }
    return res.json();
  },

  async deleteItem(id) {
    const res = await fetch(`/api/items/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar el ítem');
    return res.json();
  },

  async getStats() {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Error al obtener estadísticas');
    return res.json();
  },

  async uploadImageFile(file) {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Error al subir la imagen');
    return res.json(); // returns { url: '/uploads/...' }
  },

  async uploadImageUrl(url) {
    const res = await fetch('/api/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    if (!res.ok) throw new Error('Error al descargar la imagen de internet');
    return res.json(); // returns { url: '/uploads/...', fallback: boolean }
  }
};
