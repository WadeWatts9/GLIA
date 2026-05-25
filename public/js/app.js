// GLIA Catalog Application Logic

// Application State
let appState = {
  items: [],
  stats: {},
  activeFilters: {
    movie: 'all',
    series: 'all',
    book: 'all'
  },
  editingItemId: null,
  capturedBlob: null,
  activeImageTab: 'url' // 'url', 'upload', 'camera'
};

// Popular Genres Lists
const POPULAR_GENRES = {
  movie: ['Acción', 'Aventura', 'Ciencia Ficción', 'Comedia', 'Drama', 'Documental', 'Fantasía', 'Terror', 'Suspenso', 'Romance', 'Animación', 'Musical', 'Biopic'],
  series: ['Acción', 'Aventura', 'Ciencia Ficción', 'Comedia', 'Drama', 'Documental', 'Fantasía', 'Terror', 'Suspenso', 'Romance', 'Animación', 'Misterio', 'Miniserie'],
  book: ['Novela', 'Ciencia Ficción', 'Fantasía', 'Misterio', 'Suspenso', 'Romance', 'Terror', 'Biografía', 'Autoayuda', 'Ensayo', 'Poesía', 'Didáctico', 'Aventura']
};

// DOM Elements
const elements = {
  // Stats
  statMovies: document.querySelector('#stat-movies .stat-value'),
  statSeries: document.querySelector('#stat-series .stat-value'),
  statBooks: document.querySelector('#stat-books .stat-value'),
  statActive: document.querySelector('#stat-active .stat-value'),

  // Grids
  gridMovies: document.getElementById('grid-movies'),
  gridSeries: document.getElementById('grid-series'),
  gridBooks: document.getElementById('grid-books'),
  gridExplore: document.getElementById('grid-explore'),

  // Header Actions
  btnAddItem: document.getElementById('btn-add-item'),
  btnExplore: document.getElementById('btn-explore'),

  // Modals
  itemModal: document.getElementById('item-modal'),
  cameraModal: document.getElementById('camera-modal'),
  exploreModal: document.getElementById('explore-modal'),
  progressModal: document.getElementById('progress-modal'),

  // Item Form
  itemForm: document.getElementById('item-form'),
  modalTitle: document.getElementById('modal-title'),
  itemId: document.getElementById('item-id'),
  itemTitle: document.getElementById('item-title'),
  itemGenreSelect: document.getElementById('item-genre-select'),
  itemGenreCustom: document.getElementById('item-genre-custom'),
  itemStatus: document.getElementById('item-status'),
  itemSynopsis: document.getElementById('item-synopsis'),
  itemPlatform: document.getElementById('item-platform'),
  itemViewCount: document.getElementById('item-view-count'),
  itemReadCount: document.getElementById('item-read-count'),
  itemCurrentTime: document.getElementById('item-current-time'),
  itemTotalTime: document.getElementById('item-total-time'),
  itemSeason: document.getElementById('item-season'),
  itemEpisode: document.getElementById('item-episode'),
  itemTotalSeasons: document.getElementById('item-total-seasons'),
  seasonsEpisodesContainer: document.getElementById('seasons-episodes-container'),
  itemTotalPages: document.getElementById('item-total-pages'),
  itemCurrentPage: document.getElementById('item-current-page'),
  itemRatingInput: document.getElementById('item-rating'),
  starsContainer: document.getElementById('stars-container'),
  btnSaveItem: document.getElementById('btn-save-item'),

  // Image upload elements
  imgTabs: document.querySelectorAll('.img-tab-btn'),
  imgPanels: document.querySelectorAll('.img-panel'),
  itemImageUrl: document.getElementById('item-image-url'),
  itemImageFile: document.getElementById('item-image-file'),
  fileNamePreview: document.querySelector('.file-name-preview'),
  btnInitCamera: document.getElementById('btn-init-camera'),
  cameraCapturedPreview: document.getElementById('camera-captured-preview'),
  cameraFallbackMsg: document.querySelector('.camera-fallback-msg'),
  finalImageUrl: document.getElementById('final-image-url'),
  imagePreviewThumbContainer: document.querySelector('.image-preview-thumbnail-container'),
  imageThumbnailPreview: document.getElementById('image-thumbnail-preview'),
  btnRemovePreview: document.getElementById('btn-remove-preview'),

  // Camera Modal Elements
  webcamVideo: document.getElementById('webcam-video'),
  webcamCanvas: document.getElementById('webcam-canvas'),
  cameraSelect: document.getElementById('camera-select'),
  btnShutter: document.getElementById('btn-shutter'),
  btnCloseCameraModal: document.getElementById('btn-close-camera-modal'),

  // Explore Modal Elements
  exploreSearch: document.getElementById('explore-search'),
  exploreFilterType: document.getElementById('explore-filter-type'),
  exploreFilterStatus: document.getElementById('explore-filter-status'),
  exploreSort: document.getElementById('explore-sort'),

  // Quick Progress Modal Elements
  progressForm: document.getElementById('progress-form'),
  progressItemId: document.getElementById('progress-item-id'),
  progressItemType: document.getElementById('progress-item-type'),
  progressItemImg: document.getElementById('progress-item-img'),
  progressItemTitle: document.getElementById('progress-item-title'),
  progressItemMeta: document.getElementById('progress-item-meta'),
  progressMovieFields: document.getElementById('progress-movie-fields'),
  progressMovieMinutes: document.getElementById('progress-movie-minutes'),
  progressMovieTotalLabel: document.getElementById('progress-movie-total-label'),
  progressSeriesFields: document.getElementById('progress-series-fields'),
  progressSeriesSeason: document.getElementById('progress-series-season'),
  progressSeriesEpisode: document.getElementById('progress-series-episode'),
  progressSeriesEpisodeTotalLabel: document.getElementById('progress-series-episode-total-label'),
  progressSeriesMinutes: document.getElementById('progress-series-minutes'),
  progressSeriesTotalLabel: document.getElementById('progress-series-total-label'),
  progressBookFields: document.getElementById('progress-book-fields'),
  progressBookAddPages: document.getElementById('progress-book-add-pages'),
  btnQuickAddPages: document.getElementById('btn-quick-add-pages'),
  progressBookCurrentPage: document.getElementById('progress-book-current-page'),
  progressBookTotalLabel: document.getElementById('progress-book-total-label'),
  progressPlatformField: document.getElementById('progress-platform-field'),
  progressPlatform: document.getElementById('progress-platform'),
  progressStatus: document.getElementById('progress-status'),
  progressViewCountGroup: document.getElementById('progress-view-count-group'),
  progressCountLabel: document.getElementById('progress-count-label'),
  progressViewCount: document.getElementById('progress-view-count'),
  progressRatingGroup: document.getElementById('progress-rating-group'),
  progressStarsContainer: document.getElementById('progress-stars-container'),
  progressRatingInput: document.getElementById('progress-rating'),

  // Preview Modal Elements
  previewModal: document.getElementById('preview-modal'),
  previewImg: document.getElementById('preview-img'),
  previewImgFallback: document.getElementById('preview-img-fallback'),
  previewFallbackEmoji: document.getElementById('preview-fallback-emoji'),
  previewStatus: document.getElementById('preview-status'),
  previewPlatform: document.getElementById('preview-platform'),
  previewGenre: document.getElementById('preview-genre'),
  previewTitle: document.getElementById('preview-title'),
  previewProgressBlock: document.getElementById('preview-progress-block'),
  previewProgressText: document.getElementById('preview-progress-text'),
  previewProgressFill: document.getElementById('preview-progress-fill'),
  previewSeriesInfo: document.getElementById('preview-series-info'),
  previewSeriesText: document.getElementById('preview-series-text'),
  previewCountLabel: document.getElementById('preview-count-label'),
  previewCountText: document.getElementById('preview-count-text'),
  previewRatingStars: document.getElementById('preview-rating-stars'),
  previewSynopsis: document.getElementById('preview-synopsis'),
  btnPreviewEdit: document.getElementById('btn-preview-edit')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  init();
});

async function init() {
  // 1. Register Dialog Fallback for Safari & older browsers
  Object.values(elements).forEach(el => {
    if (el && el.tagName === 'DIALOG') {
      registerDialogFallback(el);
    }
  });

  // 2. Event Listeners setup
  setupEventListeners();

  // 3. Load initial data
  await loadAndRender();
}

// Fallback for light-dismiss on <dialog>
function registerDialogFallback(dialog) {
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isDialogContent) {
        if (dialog.id === 'camera-modal') {
          CameraHelper.stopCamera();
        }
        dialog.close();
      }
    });
  }
  
  // Also stop camera if closed via Escape key
  dialog.addEventListener('cancel', () => {
    if (dialog.id === 'camera-modal') {
      CameraHelper.stopCamera();
    }
  });
}

  // Setup Event Listeners
  function setupEventListeners() {
    // Navigation & Open Modals
    elements.btnAddItem.addEventListener('click', () => openItemModal());
    elements.btnExplore.addEventListener('click', () => openExploreModal());

    // Stats cards click navigation
    document.getElementById('stat-movies').addEventListener('click', () => {
      openExploreModal();
      elements.exploreFilterType.value = 'movie';
      updateExploreStatusOptions('movie');
      renderExploreGrid();
    });
    document.getElementById('stat-series').addEventListener('click', () => {
      openExploreModal();
      elements.exploreFilterType.value = 'series';
      updateExploreStatusOptions('series');
      renderExploreGrid();
    });
    document.getElementById('stat-books').addEventListener('click', () => {
      openExploreModal();
      elements.exploreFilterType.value = 'book';
      updateExploreStatusOptions('book');
      renderExploreGrid();
    });
    document.getElementById('stat-active').addEventListener('click', () => {
      openExploreModal();
      elements.exploreFilterType.value = 'all';
      updateExploreStatusOptions('all');
      elements.exploreFilterStatus.value = 'watching';
      renderExploreGrid();
    });

  // Form Content Type Change (Radio Buttons)
  document.querySelectorAll('input[name="type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      updateFormFieldsForType(e.target.value);
    });
  });

  // Form Image Tabs
  elements.imgTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      elements.imgTabs.forEach(t => t.classList.remove('active'));
      elements.imgPanels.forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      const source = tab.getAttribute('data-source');
      appState.activeImageTab = source;
      document.getElementById(`panel-${source}`).classList.add('active');
      
      // If switching away from camera panel, stop camera
      if (source !== 'camera') {
        CameraHelper.stopCamera();
      }
    });
  });

  // File Input Preview
  elements.itemImageFile.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      elements.fileNamePreview.textContent = file.name;
      
      const objectUrl = URL.createObjectURL(file);
      elements.imageThumbnailPreview.src = objectUrl;
      elements.imagePreviewThumbContainer.classList.remove('hidden');
      elements.finalImageUrl.value = ''; // Prioritize new uploaded file
    } else {
      elements.fileNamePreview.textContent = 'Ningún archivo seleccionado';
    }
  });

  // URL Input Preview
  elements.itemImageUrl.addEventListener('input', () => {
    const url = elements.itemImageUrl.value.trim();
    if (url) {
      elements.imageThumbnailPreview.src = url;
      elements.imagePreviewThumbContainer.classList.remove('hidden');
      elements.finalImageUrl.value = url;
    } else {
      elements.imageThumbnailPreview.src = '';
      elements.imagePreviewThumbContainer.classList.add('hidden');
      elements.finalImageUrl.value = '';
    }
  });

  // Camera Init inside Form
  elements.btnInitCamera.addEventListener('click', () => {
    openCameraModal();
  });

  // Camera Shutter
  elements.btnShutter.addEventListener('click', async () => {
    const blob = await CameraHelper.capturePhoto(elements.webcamVideo, elements.webcamCanvas);
    if (blob) {
      appState.capturedBlob = blob;
      
      // Display captured image preview in the form panel
      const objectUrl = URL.createObjectURL(blob);
      elements.cameraCapturedPreview.src = objectUrl;
      elements.cameraCapturedPreview.classList.remove('hidden');
      elements.cameraFallbackMsg.classList.add('hidden');
      elements.btnInitCamera.textContent = 'Sacar otra foto';
      
      // Update visual thumbnail preview
      elements.finalImageUrl.value = ''; // Clear URL input to prioritize file upload
      elements.imageThumbnailPreview.src = objectUrl;
      elements.imagePreviewThumbContainer.classList.remove('hidden');
      
      CameraHelper.stopCamera();
      elements.cameraModal.close();
    }
  });

  elements.btnCloseCameraModal.addEventListener('click', () => {
    CameraHelper.stopCamera();
    elements.cameraModal.close();
  });

  // Camera Select Dropdown Switch
  elements.cameraSelect.addEventListener('change', () => {
    CameraHelper.startCamera(elements.webcamVideo, elements.cameraSelect);
  });

  // Remove thumbnail preview
  elements.btnRemovePreview.addEventListener('click', () => {
    resetImageFields();
  });

  // Genre Select Dropdown Change
  elements.itemGenreSelect.addEventListener('change', (e) => {
    if (e.target.value === 'other') {
      elements.itemGenreCustom.classList.remove('hidden');
      elements.itemGenreCustom.focus();
    } else {
      elements.itemGenreCustom.classList.add('hidden');
      elements.itemGenreCustom.value = '';
    }
  });

  // Total Seasons Change (Series)
  elements.itemTotalSeasons.addEventListener('input', () => {
    const totalSeasons = parseInt(elements.itemTotalSeasons.value) || 0;
    renderSeasonsEpisodesInputs(totalSeasons);
  });

  // Form Stats Dependency: View Count / Read Count change enables rating stars
  elements.itemViewCount.addEventListener('input', () => {
    toggleStarsContainerState(parseInt(elements.itemViewCount.value) || 0);
  });
  elements.itemReadCount.addEventListener('input', () => {
    toggleStarsContainerState(parseInt(elements.itemReadCount.value) || 0);
  });

  // Form Status Change: Auto-updates view/read count when status changes
  elements.itemStatus.addEventListener('change', (e) => {
    const status = e.target.value;
    const type = document.querySelector('input[name="type"]:checked').value;
    
    if (type === 'book') {
      if (status === 'read') {
        elements.itemReadCount.value = Math.max(1, parseInt(elements.itemReadCount.value) || 0);
        elements.itemCurrentPage.value = elements.itemTotalPages.value;
      } else if (status === 'want_to_read') {
        elements.itemReadCount.value = 0;
        elements.itemCurrentPage.value = 0;
      }
      toggleStarsContainerState(parseInt(elements.itemReadCount.value) || 0);
    } else {
      if (status === 'watched') {
        elements.itemViewCount.value = Math.max(1, parseInt(elements.itemViewCount.value) || 0);
        if (elements.itemTotalTime.value > 0) {
          elements.itemCurrentTime.value = elements.itemTotalTime.value;
        }
      } else if (status === 'want_to_watch') {
        elements.itemViewCount.value = 0;
        elements.itemCurrentTime.value = 0;
      }
      toggleStarsContainerState(parseInt(elements.itemViewCount.value) || 0);
    }
  });

  // Stars rating click handler
  setupStarsRating(elements.starsContainer, elements.itemRatingInput);
  setupStarsRating(elements.progressStarsContainer, elements.progressRatingInput);

  // Form Submission
  elements.itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveItem();
  });

  // Dashboard filter tabs
  document.querySelectorAll('.filter-tabs').forEach(tabContainer => {
    const type = tabContainer.getAttribute('data-type');
    tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tabContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        appState.activeFilters[type] = btn.getAttribute('data-status');
        renderDashboardSection(type);
      });
    });
  });

  // Explore Toolbar events
  elements.exploreSearch.addEventListener('input', () => renderExploreGrid());
  elements.exploreFilterType.addEventListener('change', (e) => {
    updateExploreStatusOptions(e.target.value);
    renderExploreGrid();
  });
  elements.exploreFilterStatus.addEventListener('change', () => renderExploreGrid());
  elements.exploreSort.addEventListener('change', () => renderExploreGrid());

  // Quick Progress Modal Events
  elements.progressForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveQuickProgress();
  });

  // Quick Progress - series season change updates episode total label
  elements.progressSeriesSeason.addEventListener('input', () => {
    const seasonVal = parseInt(elements.progressSeriesSeason.value) || 1;
    const itemId = elements.progressItemId.value;
    const currentItem = appState.items.find(item => item.id == itemId);
    if (currentItem && currentItem.seasons_info) {
      try {
        const seasonsList = JSON.parse(currentItem.seasons_info);
        const episodesInThisSeason = seasonsList[seasonVal - 1] || 0;
        if (episodesInThisSeason > 0) {
          elements.progressSeriesEpisodeTotalLabel.textContent = `/ ${episodesInThisSeason} eps`;
          elements.progressSeriesEpisodeTotalLabel.style.display = 'inline';
        } else {
          elements.progressSeriesEpisodeTotalLabel.style.display = 'none';
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      elements.progressSeriesEpisodeTotalLabel.style.display = 'none';
    }
  });

  // Quick Progress - book add pages click
  elements.btnQuickAddPages.addEventListener('click', () => {
    const addVal = parseInt(elements.progressBookAddPages.value) || 0;
    const currentVal = parseInt(elements.progressBookCurrentPage.value) || 0;
    const totalVal = parseInt(elements.progressBookTotalLabel.textContent.replace('/ ', '').replace(' págs', '')) || 0;
    
    if (addVal > 0) {
      let newVal = currentVal + addVal;
      if (totalVal > 0 && newVal > totalVal) newVal = totalVal;
      elements.progressBookCurrentPage.value = newVal;
      elements.progressBookAddPages.value = ''; // Reset add input
      
      // Auto toggle to read if it reached total
      if (totalVal > 0 && newVal === totalVal) {
        elements.progressStatus.value = 'read';
        elements.progressViewCount.value = Math.max(1, parseInt(elements.progressViewCount.value) || 0);
      }
    }
  });

  // Quick Progress auto-status mapping
  elements.progressStatus.addEventListener('change', (e) => {
    const status = e.target.value;
    const type = elements.progressItemType.value;
    
    if (type === 'book') {
      if (status === 'read') {
        elements.progressViewCount.value = Math.max(1, parseInt(elements.progressViewCount.value) || 0);
        const totalPages = parseInt(elements.progressBookTotalLabel.textContent.replace('/ ', '').replace(' págs', '')) || 0;
        elements.progressBookCurrentPage.value = totalPages;
      } else if (status === 'want_to_read') {
        elements.progressViewCount.value = 0;
        elements.progressBookCurrentPage.value = 0;
      }
      toggleProgressRatingVisibility(parseInt(elements.progressViewCount.value) || 0);
    } else {
      if (status === 'watched') {
        elements.progressViewCount.value = Math.max(1, parseInt(elements.progressViewCount.value) || 0);
        const totalMin = parseInt(elements.progressMovieTotalLabel.textContent.replace('/ ', '').replace(' min', '')) || 0;
        if (totalMin > 0) {
          elements.progressMovieMinutes.value = totalMin;
          elements.progressSeriesMinutes.value = totalMin;
        }
      } else if (status === 'want_to_watch') {
        elements.progressViewCount.value = 0;
        elements.progressMovieMinutes.value = 0;
        elements.progressSeriesMinutes.value = 0;
      }
      toggleProgressRatingVisibility(parseInt(elements.progressViewCount.value) || 0);
    }
  });
  
  elements.progressViewCount.addEventListener('input', () => {
    toggleProgressRatingVisibility(parseInt(elements.progressViewCount.value) || 0);
  });
}

// Load and Render Data
async function loadAndRender() {
  try {
    appState.items = await API.getItems();
    appState.stats = await API.getStats();
    
    renderStats();
    renderDashboardSection('movie');
    renderDashboardSection('series');
    renderDashboardSection('book');
  } catch (err) {
    console.error('Error al cargar datos:', err);
  }
}

// Render Stats Counters
function renderStats() {
  elements.statMovies.textContent = appState.stats.movies || 0;
  elements.statSeries.textContent = appState.stats.series || 0;
  elements.statBooks.textContent = appState.stats.books || 0;
  elements.statActive.textContent = (appState.stats.watching || 0) + (appState.stats.reading || 0);
}

// Render Dashboard Grid per content type
function renderDashboardSection(type) {
  const grid = type === 'movie' ? elements.gridMovies : (type === 'series' ? elements.gridSeries : elements.gridBooks);
  if (!grid) return;
  
  grid.innerHTML = '';
  
  const statusFilter = appState.activeFilters[type];
  
  // Filter items matching type and exclude completed items (watched / read) from the dashboard completely
  let filteredItems = appState.items.filter(item => item.type === type && item.status !== 'watched' && item.status !== 'read');
  
  if (statusFilter !== 'all') {
    if (statusFilter === 'watching') {
      // Include watching and rewatching
      filteredItems = filteredItems.filter(item => item.status === 'watching' || item.status === 'rewatching');
    } else if (statusFilter === 'reading') {
      // Include reading and rereading
      filteredItems = filteredItems.filter(item => item.status === 'reading' || item.status === 'rereading');
    } else {
      filteredItems = filteredItems.filter(item => item.status === statusFilter);
    }
  }
  
  // Take top 3 most recently updated
  const top3 = filteredItems.slice(0, 3);
  
  if (top3.length === 0) {
    grid.innerHTML = `
      <div class="empty-placeholder">
        <p>No se encontraron títulos en este estado</p>
        <button class="btn btn-secondary btn-sm" onclick="openItemModal(null, '${type}')">
          ➕ Agregar uno ahora
        </button>
      </div>
    `;
    return;
  }
  
  top3.forEach(item => {
    grid.appendChild(createCardElement(item));
  });
}

// Create Card DOM Element
function createCardElement(item) {
  const card = document.createElement('article');
  card.className = 'item-card';
  card.setAttribute('data-id', item.id);
  
  // Localize status
  const statusLabels = {
    want_to_watch: 'Quiero ver',
    watching: 'Mirando',
    rewatching: 'Re-viendo',
    watched: 'Vista',
    want_to_read: 'Quiero leer',
    reading: 'Leyendo',
    rereading: 'Re-leyendo',
    read: 'Leído'
  };
  const statusLabel = statusLabels[item.status] || item.status;
  
  // Format fallback emoji/gradient if image is missing
  let imageHTML = '';
  if (item.image_url) {
    imageHTML = `<img src="${item.image_url}" alt="${item.title}" class="card-image" onerror="this.src=''; this.className='hidden'; this.nextElementSibling.classList.remove('hidden')">`;
  }
  
  const fallbackEmojis = { movie: '🎬', series: '📺', book: '📚' };
  const fallbackEmoji = fallbackEmojis[item.type] || '🍿';
  
  const fallbackHTML = `
    <div class="card-image-fallback ${item.image_url ? 'hidden' : ''}">
      <span>${fallbackEmoji}</span>
    </div>
  `;

  // Platform label
  const platformHTML = (item.platform && item.platform !== 'None') 
    ? `<span class="platform-badge">${item.platform}</span>` 
    : '';

  // Progress Bar / Season Info
  let progressHTML = '';
  if (item.type === 'book') {
    const total = item.total_pages || 0;
    const current = item.current_page || 0;
    const pct = total > 0 ? Math.round((current / total) * 100) : 0;
    progressHTML = `
      <div class="card-progress-container">
        <div class="progress-label-row">
          <span>Progreso de Lectura</span>
          <span>${current}/${total} págs (${pct}%)</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  } else if (item.type === 'series') {
    let seasonsList = [];
    try {
      if (item.seasons_info) {
        seasonsList = JSON.parse(item.seasons_info);
      }
    } catch (e) {
      console.error(e);
    }

    let pct = 0;
    let progressLabel = '';
    let hasEpisodesData = false;
    let episodesInThisSeason = 0;

    if (seasonsList.length > 0 && item.season <= seasonsList.length) {
      episodesInThisSeason = seasonsList[item.season - 1] || 0;
      if (episodesInThisSeason > 0) {
        pct = Math.round((item.episode / episodesInThisSeason) * 100);
        progressLabel = `Ep. ${item.episode}/${episodesInThisSeason} (${pct}%)`;
        hasEpisodesData = true;
      }
    }

    if (!hasEpisodesData) {
      const currentMin = item.current_time_minutes || 0;
      const totalMin = item.total_time_minutes || 0;
      pct = totalMin > 0 ? Math.round((currentMin / totalMin) * 100) : 0;
      progressLabel = `${currentMin}${totalMin > 0 ? `/${totalMin}` : ''} min${totalMin > 0 ? ` (${pct}%)` : ''}`;
      hasEpisodesData = totalMin > 0;
    }

    progressHTML = `
      <div class="card-progress-container">
        <div class="progress-label-row">
          <span>Temp. ${item.season}${!hasEpisodesData || seasonsList.length === 0 ? ` • Ep. ${item.episode}` : ''}</span>
          <span>${progressLabel}</span>
        </div>
        ${pct > 0 || hasEpisodesData ? `
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${pct}%"></div>
          </div>
        ` : ''}
      </div>
    `;
  } else if (item.type === 'movie') {
    const currentMin = item.current_time_minutes || 0;
    const totalMin = item.total_time_minutes || 0;
    const pct = totalMin > 0 ? Math.round((currentMin / totalMin) * 100) : 0;
    
    if (currentMin > 0 || totalMin > 0) {
      progressHTML = `
        <div class="card-progress-container">
          <div class="progress-label-row">
            <span>Progreso</span>
            <span>${currentMin}${totalMin > 0 ? `/${totalMin}` : ''} min</span>
          </div>
          ${totalMin > 0 ? `
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${pct}%"></div>
            </div>
          ` : ''}
        </div>
      `;
    }
  }

  // Rating Stars
  let ratingHTML = '<span class="no-rating">Sin calificar</span>';
  if (item.rating) {
    ratingHTML = '';
    for (let i = 1; i <= 5; i++) {
      ratingHTML += `<span style="color: ${i <= item.rating ? '#ffb703' : 'rgba(255,255,255,0.1)'}">★</span>`;
    }
  }

  // View/Read count label
  const countWord = item.type === 'book' ? 'leído' : 'visto';
  const countValue = item.view_count || 0;
  const countHTML = `<span class="view-counter">${countValue} ${countValue === 1 ? countWord : countWord + 's'}</span>`;

  card.innerHTML = `
    <div class="card-image-wrapper">
      ${imageHTML}
      ${fallbackHTML}
      <span class="status-badge status-${item.status}">${statusLabel}</span>
      ${platformHTML}
    </div>
    <div class="card-details">
      <div class="card-meta">
        <span class="card-genre">${item.genre || 'General'}</span>
      </div>
      <h3 class="card-title">${item.title}</h3>
      <p class="card-synopsis">${item.synopsis || 'Sin sinopsis disponible.'}</p>
      
      ${progressHTML}
      
      <div class="card-footer">
        <div class="card-rating">
          ${ratingHTML}
        </div>
        ${countHTML}
      </div>
      
      <div class="card-actions">
        <button class="btn btn-secondary btn-sm btn-quick-progress">Progreso</button>
        <button class="btn btn-secondary btn-sm btn-preview-item">Info</button>
        <button class="btn btn-secondary btn-sm btn-edit-item">Editar</button>
        <button class="btn btn-danger btn-sm btn-delete-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    </div>
  `;

  // Bind Actions on Card
  card.querySelector('.btn-quick-progress').addEventListener('click', (e) => {
    e.stopPropagation();
    openProgressModal(item);
  });
  
  card.querySelector('.btn-preview-item').addEventListener('click', (e) => {
    e.stopPropagation();
    openPreviewModal(item);
  });
  
  card.querySelector('.btn-edit-item').addEventListener('click', (e) => {
    e.stopPropagation();
    openItemModal(item);
  });
  
  card.querySelector('.btn-delete-item').addEventListener('click', async (e) => {
    e.stopPropagation();
    if (confirm(`¿Estás seguro de que deseas eliminar "${item.title}"?`)) {
      try {
        await API.deleteItem(item.id);
        await loadAndRender();
      } catch (err) {
        alert(err.message);
      }
    }
  });

  // Bind click on poster or title to preview item
  card.querySelector('.card-image-wrapper').addEventListener('click', (e) => {
    e.stopPropagation();
    openPreviewModal(item);
  });
  card.querySelector('.card-title').addEventListener('click', (e) => {
    e.stopPropagation();
    openPreviewModal(item);
  });

  return card;
}

// Stars Rating Event Bindings
function setupStarsRating(container, inputElement) {
  const stars = container.querySelectorAll('.star-rating');
  
  stars.forEach(star => {
    star.addEventListener('click', () => {
      if (container.classList.contains('disabled')) return;
      
      const rating = parseInt(star.getAttribute('data-value'));
      inputElement.value = rating;
      
      // Update UI active states
      stars.forEach(s => {
        const val = parseInt(s.getAttribute('data-value'));
        if (val <= rating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
  });
}

// Reset visual stars rating UI
function resetStarsUI(container) {
  container.querySelectorAll('.star-rating').forEach(s => s.classList.remove('active'));
}

// Enable/Disable stars rating in form based on view/read count
function toggleStarsContainerState(count) {
  if (count >= 1) {
    elements.starsContainer.classList.remove('disabled');
    elements.starsContainer.title = "Calificar título";
  } else {
    elements.starsContainer.classList.add('disabled');
    elements.starsContainer.title = "Debes haberlo visto o leído al menos 1 vez para calificarlo";
    elements.itemRatingInput.value = "";
    resetStarsUI(elements.starsContainer);
  }
}

// Enable/Disable stars rating in progress modal
function toggleProgressRatingVisibility(count) {
  if (count >= 1) {
    elements.progressRatingGroup.classList.remove('hidden');
  } else {
    elements.progressRatingGroup.classList.add('hidden');
    elements.progressRatingInput.value = "";
    resetStarsUI(elements.progressStarsContainer);
  }
}

// Open Item Form Dialog (Add / Edit Mode)
function openItemModal(item = null, defaultType = 'movie') {
  appState.editingItemId = item ? item.id : null;
  appState.capturedBlob = null;
  resetForm();

  if (item) {
    elements.modalTitle.textContent = 'Editar Título';
    elements.itemId.value = item.id;
    elements.itemTitle.value = item.title;
    populateGenreOptions(item.type, item.genre);
    elements.itemSynopsis.value = item.synopsis;

    // Check type radio button
    document.getElementById(`type-${item.type}`).checked = true;
    updateFormFieldsForType(item.type);

    // Populate type-specific values
    elements.itemStatus.value = item.status;
    
    if (item.type === 'book') {
      elements.itemTotalPages.value = item.total_pages;
      elements.itemCurrentPage.value = item.current_page;
      elements.itemReadCount.value = item.view_count; // In SQLite view_count maps to read_count
    } else {
      elements.itemPlatform.value = item.platform || 'None';
      elements.itemViewCount.value = item.view_count;
      elements.itemCurrentTime.value = item.current_time_minutes;
      elements.itemTotalTime.value = item.total_time_minutes;
      if (item.type === 'series') {
        elements.itemSeason.value = item.season;
        elements.itemEpisode.value = item.episode;
        
        let seasonsList = [];
        try {
          if (item.seasons_info) {
            seasonsList = JSON.parse(item.seasons_info);
          }
        } catch (e) {
          console.error("Error al decodificar seasons_info:", e);
        }
        
        elements.itemTotalSeasons.value = seasonsList.length || '';
        renderSeasonsEpisodesInputs(seasonsList.length, seasonsList);
      }
    }

    // Toggle stars state
    const viewCount = item.type === 'book' ? item.view_count : item.view_count;
    toggleStarsContainerState(viewCount);
    
    // Rating star active states
    if (item.rating) {
      elements.itemRatingInput.value = item.rating;
      elements.starsContainer.querySelectorAll('.star-rating').forEach(s => {
        const val = parseInt(s.getAttribute('data-value'));
        if (val <= item.rating) s.classList.add('active');
      });
    }

    // Image preview
    if (item.image_url) {
      elements.finalImageUrl.value = item.image_url;
      if (item.image_url.startsWith('http://') || item.image_url.startsWith('https://')) {
        elements.itemImageUrl.value = item.image_url;
      } else {
        elements.itemImageUrl.value = '';
      }
      elements.imageThumbnailPreview.src = item.image_url;
      elements.imagePreviewThumbContainer.classList.remove('hidden');
    }
  } else {
    elements.modalTitle.textContent = 'Agregar Nuevo Título';
    document.getElementById(`type-${defaultType}`).checked = true;
    updateFormFieldsForType(defaultType);
    toggleStarsContainerState(0);
    populateGenreOptions(defaultType, null);
  }

  // Open native dialog
  elements.itemModal.showModal();
}

// Reset Form fields and previews
function resetForm() {
  elements.itemForm.reset();
  elements.itemId.value = '';
  elements.itemRatingInput.value = '';
  resetStarsUI(elements.starsContainer);
  resetImageFields();
  if (elements.itemTotalSeasons) elements.itemTotalSeasons.value = '';
  if (elements.seasonsEpisodesContainer) elements.seasonsEpisodesContainer.innerHTML = '';
  
  // reset default active image tab to url
  elements.imgTabs.forEach(t => t.classList.remove('active'));
  elements.imgPanels.forEach(p => p.classList.remove('active'));
  elements.imgTabs[0].classList.add('active');
  elements.imgPanels[0].classList.add('active');
  appState.activeImageTab = 'url';
}

function resetImageFields() {
  elements.itemImageUrl.value = '';
  elements.itemImageFile.value = '';
  elements.fileNamePreview.textContent = 'Ningún archivo seleccionado';
  elements.cameraCapturedPreview.src = '';
  elements.cameraCapturedPreview.classList.add('hidden');
  elements.cameraFallbackMsg.classList.remove('hidden');
  elements.btnInitCamera.textContent = 'Iniciar Cámara Web';
  elements.finalImageUrl.value = '';
  elements.imagePreviewThumbContainer.classList.add('hidden');
  elements.imageThumbnailPreview.src = '';
  appState.capturedBlob = null;
}

// Dynamically render episode input fields per season
function renderSeasonsEpisodesInputs(totalSeasons, preExistingList = []) {
  elements.seasonsEpisodesContainer.innerHTML = '';
  
  if (totalSeasons <= 0) return;
  
  const title = document.createElement('label');
  title.textContent = 'Episodios por Temporada';
  title.style.marginTop = '10px';
  elements.seasonsEpisodesContainer.appendChild(title);
  
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(120px, 1fr))';
  grid.style.gap = '12px';
  
  for (let i = 1; i <= totalSeasons; i++) {
    const val = preExistingList[i - 1] || 10; // Default to 10 episodes if not specified
    
    const group = document.createElement('div');
    group.className = 'form-group';
    group.innerHTML = `
      <label style="font-size: 11px; text-transform: none;">Temp. ${i}</label>
      <input type="number" class="season-episodes-input" data-season="${i}" min="1" value="${val}" style="padding: 8px 12px; font-size: 13px;">
    `;
    grid.appendChild(group);
  }
  
  elements.seasonsEpisodesContainer.appendChild(grid);
}

// Toggle Fields depending on Type (movie, series, book)
function updateFormFieldsForType(type) {
  // Hide all
  document.querySelectorAll('.form-type-fields').forEach(f => f.classList.remove('active'));
  
  // Populate Status Options
  elements.itemStatus.innerHTML = '';
  
  if (type === 'movie') {
    document.getElementById('media-specific-fields').classList.add('active');
    
    elements.itemStatus.innerHTML = `
      <option value="want_to_watch">Quiero Ver</option>
      <option value="watching">Mirando</option>
      <option value="rewatching">Re-viendo</option>
      <option value="watched">Vista</option>
    `;
  } else if (type === 'series') {
    document.getElementById('media-specific-fields').classList.add('active');
    document.getElementById('series-specific-fields').classList.add('active');
    
    elements.itemStatus.innerHTML = `
      <option value="want_to_watch">Quiero Ver</option>
      <option value="watching">Mirando</option>
      <option value="rewatching">Re-viendo</option>
      <option value="watched">Vista</option>
    `;
  } else if (type === 'book') {
    document.getElementById('book-specific-fields').classList.add('active');
    
    elements.itemStatus.innerHTML = `
      <option value="want_to_read">Quiero Leer</option>
      <option value="reading">Leyendo</option>
      <option value="rereading">Re-leyendo</option>
      <option value="read">Leído</option>
    `;
  }
  
  // Dynamically repopulate genres based on newly selected type
  populateGenreOptions(type, null);
}

// Populate Genre Select options dynamically from popular list and existing catalog genres
function populateGenreOptions(type, selectedGenre = null) {
  // 1. Get popular genres for this specific type
  const popular = POPULAR_GENRES[type] || [];
  
  // 2. Get unique genres already saved in DB for this specific type
  const existing = [...new Set(appState.items.filter(item => item.type === type).map(item => item.genre).filter(Boolean))].sort();
  
  // 3. Combine both lists (removing duplicates)
  const combined = [...new Set([...popular, ...existing])].sort();
  
  // Clear select
  elements.itemGenreSelect.innerHTML = '';
  
  // Add default empty option
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.text = 'Seleccionar género...';
  elements.itemGenreSelect.appendChild(defaultOpt);
  
  // Add combined genres
  combined.forEach(genre => {
    const opt = document.createElement('option');
    opt.value = genre;
    opt.text = genre;
    elements.itemGenreSelect.appendChild(opt);
  });
  
  // Add "Otro" option
  const otherOpt = document.createElement('option');
  otherOpt.value = 'other';
  otherOpt.text = 'Otro...';
  elements.itemGenreSelect.appendChild(otherOpt);
  
  // Handle selected value
  if (selectedGenre) {
    if (combined.includes(selectedGenre)) {
      elements.itemGenreSelect.value = selectedGenre;
      elements.itemGenreCustom.classList.add('hidden');
      elements.itemGenreCustom.value = '';
    } else {
      elements.itemGenreSelect.value = 'other';
      elements.itemGenreCustom.value = selectedGenre;
      elements.itemGenreCustom.classList.remove('hidden');
    }
  } else {
    elements.itemGenreSelect.value = '';
    elements.itemGenreCustom.classList.add('hidden');
    elements.itemGenreCustom.value = '';
  }
}

// Save Item (Add or Update)
async function saveItem() {
  // Disable button and show saving status
  const originalBtnText = elements.btnSaveItem.textContent;
  elements.btnSaveItem.disabled = true;
  elements.btnSaveItem.textContent = 'Guardando...';

  try {
    const type = document.querySelector('input[name="type"]:checked').value;
    const title = elements.itemTitle.value.trim();
    if (!title) throw new Error('El título es requerido');
    
    let finalImageUrl = elements.finalImageUrl.value; // pre-existing url

    // Handle Image uploads based on active tab
    if (appState.activeImageTab === 'url') {
      const urlInput = elements.itemImageUrl.value.trim();
      if (urlInput && urlInput !== finalImageUrl) {
        // Upload url to be downloaded locally
        const uploadRes = await API.uploadImageUrl(urlInput);
        finalImageUrl = uploadRes.url;
      }
    } else if (appState.activeImageTab === 'upload') {
      const fileInput = elements.itemImageFile.files[0];
      if (fileInput) {
        const uploadRes = await API.uploadImageFile(fileInput);
        finalImageUrl = uploadRes.url;
      }
    } else if (appState.activeImageTab === 'camera') {
      if (appState.capturedBlob) {
        const file = new File([appState.capturedBlob], "capture.jpg", { type: "image/jpeg" });
        const uploadRes = await API.uploadImageFile(file);
        finalImageUrl = uploadRes.url;
      }
    }

    // Build Item data payload
    const genreValue = elements.itemGenreSelect.value === 'other' 
      ? elements.itemGenreCustom.value.trim() 
      : elements.itemGenreSelect.value;

    const itemData = {
      type,
      title,
      image_url: finalImageUrl,
      genre: genreValue,
      synopsis: elements.itemSynopsis.value.trim(),
      status: elements.itemStatus.value,
      rating: elements.itemRatingInput.value ? parseInt(elements.itemRatingInput.value) : null
    };

    if (type === 'book') {
      itemData.total_pages = parseInt(elements.itemTotalPages.value) || 0;
      itemData.current_page = parseInt(elements.itemCurrentPage.value) || 0;
      itemData.view_count = parseInt(elements.itemReadCount.value) || 0; // map read count to view_count in DB
    } else {
      itemData.platform = elements.itemPlatform.value;
      itemData.view_count = parseInt(elements.itemViewCount.value) || 0;
      itemData.current_time_minutes = parseInt(elements.itemCurrentTime.value) || 0;
      itemData.total_time_minutes = parseInt(elements.itemTotalTime.value) || 0;
      
      if (type === 'series') {
        itemData.season = parseInt(elements.itemSeason.value) || 1;
        itemData.episode = parseInt(elements.itemEpisode.value) || 1;
        
        // Collect seasons_info
        const inputs = elements.seasonsEpisodesContainer.querySelectorAll('.season-episodes-input');
        const seasonsList = [];
        inputs.forEach(input => {
          seasonsList.push(parseInt(input.value) || 1);
        });
        itemData.seasons_info = JSON.stringify(seasonsList);
      }
    }

    // Validation
    if (type === 'book' && itemData.current_page > itemData.total_pages) {
      throw new Error('La página actual no puede ser mayor que la cantidad de páginas');
    }
    if (type === 'movie' || type === 'series') {
      if (itemData.total_time_minutes > 0 && itemData.current_time_minutes > itemData.total_time_minutes) {
        throw new Error('El minutaje actual no puede exceder la duración total');
      }
    }
    if (type === 'series') {
      const inputs = elements.seasonsEpisodesContainer.querySelectorAll('.season-episodes-input');
      const seasonsList = [];
      inputs.forEach(input => {
        seasonsList.push(parseInt(input.value) || 1);
      });
      if (seasonsList.length > 0) {
        if (itemData.season > seasonsList.length) {
          throw new Error(`La temporada actual (${itemData.season}) no puede ser mayor que el total de temporadas (${seasonsList.length})`);
        }
        const episodesInThisSeason = seasonsList[itemData.season - 1] || 0;
        if (itemData.episode > episodesInThisSeason) {
          throw new Error(`El episodio actual (${itemData.episode}) no puede ser mayor que el total de episodios para la Temporada ${itemData.season} (${episodesInThisSeason})`);
        }
      }
    }

    if (appState.editingItemId) {
      await API.updateItem(appState.editingItemId, itemData);
    } else {
      await API.addItem(itemData);
    }

    // Close and reload
    elements.itemModal.close();
    await loadAndRender();
  } catch (err) {
    alert(err.message);
  } finally {
    elements.btnSaveItem.disabled = false;
    elements.btnSaveItem.textContent = originalBtnText;
  }
}

// Open webcam streaming overlay
async function openCameraModal() {
  elements.cameraSelect.innerHTML = '<option value="">Cargando cámaras...</option>';
  elements.cameraModal.showModal();
  
  const started = await CameraHelper.startCamera(elements.webcamVideo, elements.cameraSelect);
  if (!started) {
    elements.cameraModal.close();
  }
}

// Open Quick Progress Modal
function openProgressModal(item) {
  elements.progressItemId.value = item.id;
  elements.progressItemType.value = item.type;
  elements.progressItemTitle.textContent = item.title;
  
  // Image preview in progress
  if (item.image_url) {
    elements.progressItemImg.src = item.image_url;
    elements.progressItemImg.classList.remove('hidden');
  } else {
    elements.progressItemImg.classList.add('hidden');
  }

  // Type labels and forms
  const types = { movie: '🎬 Película', series: '📺 Serie', book: '📚 Libro' };
  elements.progressItemMeta.textContent = types[item.type] || item.type;

  // Hide all progress subpanels
  elements.progressMovieFields.classList.add('hidden');
  elements.progressSeriesFields.classList.add('hidden');
  elements.progressBookFields.classList.add('hidden');
  elements.progressPlatformField.classList.add('hidden');
  
  // Status select list population
  elements.progressStatus.innerHTML = '';

  if (item.type === 'book') {
    elements.progressBookFields.classList.remove('hidden');
    elements.progressBookCurrentPage.value = item.current_page;
    elements.progressBookTotalLabel.textContent = `/ ${item.total_pages} págs`;
    
    elements.progressStatus.innerHTML = `
      <option value="want_to_read">Quiero Leer</option>
      <option value="reading">Leyendo</option>
      <option value="rereading">Re-leyendo</option>
      <option value="read">Leído</option>
    `;
    elements.progressCountLabel.textContent = 'Veces leído';
    elements.progressViewCount.value = item.view_count; // DB view_count holds read count for books
    elements.progressBookAddPages.value = '';
    
  } else {
    elements.progressPlatformField.classList.remove('hidden');
    elements.progressPlatform.value = item.platform || 'None';
    elements.progressCountLabel.textContent = 'Veces visto';
    elements.progressViewCount.value = item.view_count;

    elements.progressStatus.innerHTML = `
      <option value="want_to_watch">Quiero Ver</option>
      <option value="watching">Mirando</option>
      <option value="rewatching">Re-viendo</option>
      <option value="watched">Vista</option>
    `;

    if (item.type === 'movie') {
      elements.progressMovieFields.classList.remove('hidden');
      elements.progressMovieMinutes.value = item.current_time_minutes;
      elements.progressMovieTotalLabel.textContent = `/ ${item.total_time_minutes} min`;
    } else if (item.type === 'series') {
      elements.progressSeriesFields.classList.remove('hidden');
      elements.progressSeriesSeason.value = item.season;
      elements.progressSeriesEpisode.value = item.episode;
      elements.progressSeriesMinutes.value = item.current_time_minutes;
      elements.progressSeriesTotalLabel.textContent = `/ ${item.total_time_minutes} min`;

      let seasonsList = [];
      try {
        if (item.seasons_info) {
          seasonsList = JSON.parse(item.seasons_info);
        }
      } catch (e) {
        console.error(e);
      }
      
      const episodesInThisSeason = (seasonsList.length > 0 && item.season <= seasonsList.length) 
        ? (seasonsList[item.season - 1] || 0) 
        : 0;

      if (episodesInThisSeason > 0) {
        elements.progressSeriesEpisodeTotalLabel.textContent = `/ ${episodesInThisSeason} eps`;
        elements.progressSeriesEpisodeTotalLabel.style.display = 'inline';
      } else {
        elements.progressSeriesEpisodeTotalLabel.style.display = 'none';
      }
    }
  }

  // Select current status
  elements.progressStatus.value = item.status;

  // Toggle stars rating visibility based on view/read count
  toggleProgressRatingVisibility(item.view_count);
  resetStarsUI(elements.progressStarsContainer);
  
  if (item.rating) {
    elements.progressRatingInput.value = item.rating;
    elements.progressStarsContainer.querySelectorAll('.star-rating').forEach(s => {
      const val = parseInt(s.getAttribute('data-value'));
      if (val <= item.rating) s.classList.add('active');
    });
  }

  elements.progressModal.showModal();
}

// Save Quick Progress
async function saveQuickProgress() {
  const id = elements.progressItemId.value;
  const type = elements.progressItemType.value;
  
  try {
    // Fetch current item details
    const currentItem = appState.items.find(item => item.id == id);
    if (!currentItem) throw new Error('Ítem no encontrado');

    const updatedItem = { ...currentItem };
    updatedItem.status = elements.progressStatus.value;
    updatedItem.rating = elements.progressRatingInput.value ? parseInt(elements.progressRatingInput.value) : null;

    if (type === 'book') {
      updatedItem.current_page = parseInt(elements.progressBookCurrentPage.value) || 0;
      updatedItem.view_count = parseInt(elements.progressViewCount.value) || 0; // SQLite view_count
      
      // Auto status update if they finished pages
      if (updatedItem.total_pages > 0 && updatedItem.current_page >= updatedItem.total_pages) {
        updatedItem.current_page = updatedItem.total_pages;
        if (updatedItem.status !== 'read' && updatedItem.status !== 'rereading') {
          updatedItem.status = 'read';
          updatedItem.view_count = Math.max(1, updatedItem.view_count);
        }
      }
    } else {
      updatedItem.platform = elements.progressPlatform.value;
      updatedItem.view_count = parseInt(elements.progressViewCount.value) || 0;
      
      if (type === 'movie') {
        updatedItem.current_time_minutes = parseInt(elements.progressMovieMinutes.value) || 0;
        
        // Auto status watched if current time >= total duration
        if (updatedItem.total_time_minutes > 0 && updatedItem.current_time_minutes >= updatedItem.total_time_minutes) {
          updatedItem.current_time_minutes = updatedItem.total_time_minutes;
          if (updatedItem.status !== 'watched' && updatedItem.status !== 'rewatching') {
            updatedItem.status = 'watched';
            updatedItem.view_count = Math.max(1, updatedItem.view_count);
          }
        }
      } else if (type === 'series') {
        updatedItem.season = parseInt(elements.progressSeriesSeason.value) || 1;
        updatedItem.episode = parseInt(elements.progressSeriesEpisode.value) || 1;
        updatedItem.current_time_minutes = parseInt(elements.progressSeriesMinutes.value) || 0;

        // Auto status watched if they completed the last episode of the last season
        let seasonsList = [];
        try {
          if (updatedItem.seasons_info) {
            seasonsList = JSON.parse(updatedItem.seasons_info);
          }
        } catch (e) {
          console.error(e);
        }
        if (seasonsList.length > 0) {
          const totalSeasons = seasonsList.length;
          const lastSeasonEpisodes = seasonsList[totalSeasons - 1] || 0;
          if (updatedItem.season >= totalSeasons && updatedItem.episode >= lastSeasonEpisodes) {
            updatedItem.season = totalSeasons;
            updatedItem.episode = lastSeasonEpisodes;
            if (updatedItem.status !== 'watched' && updatedItem.status !== 'rewatching') {
              updatedItem.status = 'watched';
              updatedItem.view_count = Math.max(1, updatedItem.view_count);
            }
          }
        }

        // Auto status watched if current time >= total duration (optional helper)
        if (updatedItem.total_time_minutes > 0 && updatedItem.current_time_minutes >= updatedItem.total_time_minutes) {
          updatedItem.current_time_minutes = updatedItem.total_time_minutes;
        }
      }
    }

    // Validations
    if (type === 'book' && updatedItem.current_page > updatedItem.total_pages) {
      throw new Error('La página actual no puede superar las páginas totales');
    }
    if (type === 'movie' || type === 'series') {
      if (updatedItem.total_time_minutes > 0 && updatedItem.current_time_minutes > updatedItem.total_time_minutes) {
        throw new Error('El minutaje actual no puede superar la duración del video');
      }
    }
    if (type === 'series') {
      let seasonsList = [];
      try {
        if (updatedItem.seasons_info) {
          seasonsList = JSON.parse(updatedItem.seasons_info);
        }
      } catch (e) {
        console.error(e);
      }
      if (seasonsList.length > 0) {
        if (updatedItem.season > seasonsList.length) {
          throw new Error(`La temporada actual (${updatedItem.season}) no puede ser mayor que el total de temporadas (${seasonsList.length})`);
        }
        const episodesInThisSeason = seasonsList[updatedItem.season - 1] || 0;
        if (updatedItem.episode > episodesInThisSeason) {
          throw new Error(`El episodio actual (${updatedItem.episode}) no puede ser mayor que el total de episodios para la Temporada ${updatedItem.season} (${episodesInThisSeason})`);
        }
      }
    }

    await API.updateItem(id, updatedItem);
    elements.progressModal.close();
    await loadAndRender();
  } catch (err) {
    alert(err.message);
  }
}

// Open Catalog Exploration Modal
function openExploreModal() {
  elements.exploreSearch.value = '';
  elements.exploreFilterType.value = 'all';
  updateExploreStatusOptions('all');
  elements.exploreSort.value = 'updated';
  
  renderExploreGrid();
  elements.exploreModal.showModal();
}

// Dynamically populate explore status options depending on type
function updateExploreStatusOptions(type) {
  elements.exploreFilterStatus.innerHTML = '<option value="all">Todos los estados</option>';
  
  if (type === 'all') {
    elements.exploreFilterStatus.innerHTML += `
      <option value="watching">Mirando / Leyendo</option>
      <option value="want_to">Quiero ver / leer</option>
      <option value="completed">Visto / Leído</option>
    `;
  } else if (type === 'book') {
    elements.exploreFilterStatus.innerHTML += `
      <option value="want_to_read">Quiero Leer</option>
      <option value="reading">Leyendo</option>
      <option value="rereading">Re-leyendo</option>
      <option value="read">Leídos</option>
    `;
  } else {
    elements.exploreFilterStatus.innerHTML += `
      <option value="want_to_watch">Quiero Ver</option>
      <option value="watching">Mirando</option>
      <option value="rewatching">Re-viendo</option>
      <option value="watched">Vistas</option>
    `;
  }
}

// Render filtered exploration catalog grid
function renderExploreGrid() {
  elements.gridExplore.innerHTML = '';
  
  const searchVal = elements.exploreSearch.value.trim().toLowerCase();
  const typeVal = elements.exploreFilterType.value;
  const statusVal = elements.exploreFilterStatus.value;
  const sortVal = elements.exploreSort.value;

  let filtered = [...appState.items];

  // 1. Search Filter
  if (searchVal) {
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(searchVal) ||
      (item.genre && item.genre.toLowerCase().includes(searchVal)) ||
      (item.synopsis && item.synopsis.toLowerCase().includes(searchVal))
    );
  }

  // 2. Type Filter
  if (typeVal !== 'all') {
    filtered = filtered.filter(item => item.type === typeVal);
  }

  // 3. Status Filter
  if (statusVal !== 'all') {
    if (statusVal === 'watching') {
      filtered = filtered.filter(item => item.status === 'watching' || item.status === 'rewatching' || item.status === 'reading' || item.status === 'rereading');
    } else if (statusVal === 'want_to') {
      filtered = filtered.filter(item => item.status === 'want_to_watch' || item.status === 'want_to_read');
    } else if (statusVal === 'completed') {
      filtered = filtered.filter(item => item.status === 'watched' || item.status === 'read');
    } else {
      filtered = filtered.filter(item => item.status === statusVal);
    }
  }

  // 4. Sorting
  if (sortVal === 'alpha') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortVal === 'rating') {
    // Sort highest rating first, nulls at bottom
    filtered.sort((a, b) => {
      const rA = a.rating || 0;
      const rB = b.rating || 0;
      return rB - rA;
    });
  } else {
    // Default: Sort by updated_at DESC (which is how they come from DB, but let's be explicit)
    filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }

  if (filtered.length === 0) {
    elements.gridExplore.innerHTML = '<div class="empty-placeholder">No se encontraron títulos que coincidan con los filtros.</div>';
    return;
  }

  filtered.forEach(item => {
    elements.gridExplore.appendChild(createCardElement(item));
  });
}

// Open detailed item preview dialog
function openPreviewModal(item) {
  if (!item) return;

  elements.previewTitle.textContent = item.title;
  elements.previewGenre.textContent = item.genre || 'General';
  elements.previewSynopsis.textContent = item.synopsis || 'Sin sinopsis disponible.';

  // Image & Fallback
  if (item.image_url) {
    elements.previewImg.src = item.image_url;
    elements.previewImg.classList.remove('hidden');
    elements.previewImgFallback.classList.add('hidden');
  } else {
    elements.previewImg.src = '';
    elements.previewImg.classList.add('hidden');
    elements.previewImgFallback.classList.remove('hidden');
    
    // Set fallback emoji
    const emojis = { movie: '🎬', series: '📺', book: '📚' };
    elements.previewFallbackEmoji.textContent = emojis[item.type] || '🍿';
  }

  // Status Badge
  elements.previewStatus.className = `status-badge status-${item.status}`;
  
  const statusLabels = {
    want_to_watch: 'Quiero ver',
    watching: 'Mirando',
    rewatching: 'Re-viendo',
    watched: 'Vista',
    want_to_read: 'Quiero leer',
    reading: 'Leyendo',
    rereading: 'Re-leyendo',
    read: 'Leído'
  };
  elements.previewStatus.textContent = statusLabels[item.status] || item.status;

  // Platform Badge
  if ((item.type === 'movie' || item.type === 'series') && item.platform && item.platform !== 'None') {
    elements.previewPlatform.textContent = item.platform;
    elements.previewPlatform.classList.remove('hidden');
  } else {
    elements.previewPlatform.classList.add('hidden');
  }

  // Progress fields and Series Info
  elements.previewProgressBlock.classList.add('hidden');
  elements.previewSeriesInfo.classList.add('hidden');

  if (item.type === 'book') {
    elements.previewProgressBlock.classList.remove('hidden');
    elements.previewCountLabel.textContent = 'Veces leído';
    elements.previewCountText.textContent = `${item.view_count || 0} ${item.view_count === 1 ? 'vez' : 'veces'}`;
    
    const total = item.total_pages || 0;
    const current = item.current_page || 0;
    const pct = total > 0 ? Math.round((current / total) * 100) : 0;
    
    elements.previewProgressText.textContent = `Pág. ${current} / ${total} págs (${pct}%)`;
    elements.previewProgressFill.style.width = `${pct}%`;
  } else {
    elements.previewCountLabel.textContent = 'Veces visto';
    elements.previewCountText.textContent = `${item.view_count || 0} ${item.view_count === 1 ? 'vez' : 'veces'}`;

    if (item.type === 'series') {
      elements.previewSeriesInfo.classList.remove('hidden');
      
      let seasonsList = [];
      try {
        if (item.seasons_info) {
          seasonsList = JSON.parse(item.seasons_info);
        }
      } catch (e) {
        console.error(e);
      }

      let episodesInThisSeason = 0;
      if (seasonsList.length > 0 && item.season <= seasonsList.length) {
        episodesInThisSeason = seasonsList[item.season - 1] || 0;
      }

      if (seasonsList.length > 0) {
        elements.previewSeriesText.textContent = `Temporada ${item.season} / ${seasonsList.length}, Episodio ${item.episode}${episodesInThisSeason > 0 ? ` / ${episodesInThisSeason}` : ''}`;
      } else {
        elements.previewSeriesText.textContent = `Temporada ${item.season}, Episodio ${item.episode}`;
      }

      // If we have seasons_info, show episode-based progress bar for series
      if (seasonsList.length > 0 && episodesInThisSeason > 0) {
        const pct = Math.round((item.episode / episodesInThisSeason) * 100);
        elements.previewProgressBlock.classList.remove('hidden');
        elements.previewProgressText.textContent = `Episodio ${item.episode} / ${episodesInThisSeason} (${pct}%)`;
        elements.previewProgressFill.style.width = `${pct}%`;
      } else {
        // Fallback to minutes progress if minutes exist
        const currentMin = item.current_time_minutes || 0;
        const totalMin = item.total_time_minutes || 0;
        const pct = totalMin > 0 ? Math.round((currentMin / totalMin) * 100) : 0;

        if (totalMin > 0 || currentMin > 0) {
          elements.previewProgressBlock.classList.remove('hidden');
          elements.previewProgressText.textContent = `${currentMin}${totalMin > 0 ? ` / ${totalMin}` : ''} min${totalMin > 0 ? ` (${pct}%)` : ''}`;
          elements.previewProgressFill.style.width = totalMin > 0 ? `${pct}%` : '0%';
        }
      }
    } else {
      // Movie minutes progress
      const currentMin = item.current_time_minutes || 0;
      const totalMin = item.total_time_minutes || 0;
      const pct = totalMin > 0 ? Math.round((currentMin / totalMin) * 100) : 0;

      if (totalMin > 0 || currentMin > 0) {
        elements.previewProgressBlock.classList.remove('hidden');
        elements.previewProgressText.textContent = `${currentMin}${totalMin > 0 ? ` / ${totalMin}` : ''} min${totalMin > 0 ? ` (${pct}%)` : ''}`;
        elements.previewProgressFill.style.width = totalMin > 0 ? `${pct}%` : '0%';
      }
    }
  }

  // Rating Stars
  elements.previewRatingStars.innerHTML = '';
  if (item.rating) {
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.textContent = '★';
      star.style.color = i <= item.rating ? '#ffb703' : 'rgba(255,255,255,0.1)';
      elements.previewRatingStars.appendChild(star);
    }
  } else {
    elements.previewRatingStars.textContent = 'Sin calificar';
  }

  // Bind Edit button click action
  elements.btnPreviewEdit.onclick = () => {
    elements.previewModal.close();
    openItemModal(item);
  };

  elements.previewModal.showModal();
}
