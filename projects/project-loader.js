// Project Template Loader
// Carica i dati del progetto da un file JSON e popola il template HTML

async function loadProjectData() {
  // Ottieni il nome del file HTML corrente (es. "cowork-versilia.html")
  const currentPage = window.location.pathname.split("/").pop();
  const projectId = currentPage.replace(".html", "");
  // Il JSON è nella stessa cartella dell'HTML
  const jsonPath = `${projectId}.json`;

  try {
    const response = await fetch(jsonPath);
    if (!response.ok) {
      throw new Error(`Errore nel caricamento del progetto: ${response.status}`);
    }
    const projectData = await response.json();
    renderProject(projectData);
  } catch (error) {
    console.error("Errore nel caricamento dei dati del progetto:", error);
    // Fallback: mostra un messaggio di errore o mantiene il contenuto statico
  }
}

function renderProject(data) {
  // Aggiorna il titolo della pagina
  if (data.titleFull) {
    document.title = data.titleFull;
  }

  // Aggiorna l'h1 del hero
  const heroTitle = document.querySelector("#hero h1");
  if (heroTitle && data.title) {
    // Gestisce il titolo con eventuali break line
    const titleParts = data.title.split(" ");
    if (titleParts.length > 1) {
      // Se ci sono più parole, metti un break dopo la prima
      heroTitle.innerHTML = `${titleParts[0]} <br />${titleParts.slice(1).join(" ")}`;
    } else {
      heroTitle.textContent = data.title;
    }
  }

  // Aggiorna i badge/tags
  const badgeContainer = document.querySelector("#intro .badge-buttons");
  if (badgeContainer && data.tags && Array.isArray(data.tags)) {
    badgeContainer.innerHTML = data.tags
      .map((tag) => `<span class="btn-lg">${tag}</span>`)
      .join("");
  }

  // Aggiorna la descrizione
  const description = document.querySelector("#intro .text-style");
  if (description && data.description) {
    description.textContent = data.description;
  }

  // Aggiorna le immagini principali
  const mainImagesContainer = document.querySelector(
    "#projects .row.row-cols-1"
  );
  if (mainImagesContainer && data.images?.main && Array.isArray(data.images.main)) {
    mainImagesContainer.innerHTML = data.images.main
      .map(
        (img) => `
      <div class="col">
        <img
          src="${img.src}"
          alt="${img.alt || ""}"
          class="img-fluid rounded-4 object-fit-cover w-100 h-100"
        />
      </div>
    `
      )
      .join("");
  }

  // Aggiorna le immagini secondarie
  const secondaryImagesContainer = document.querySelector(
    "#projects .row.row-cols-1.row-cols-lg-2"
  );
  if (
    secondaryImagesContainer &&
    data.images?.secondary &&
    Array.isArray(data.images.secondary)
  ) {
    secondaryImagesContainer.innerHTML = data.images.secondary
      .map(
        (img) => `
      <div class="col d-flex justify-content-center">
        <img
          src="${img.src}"
          alt="${img.alt || ""}"
          class="img-fluid rounded-4 object-fit-cover small-img"
        />
      </div>
    `
      )
      .join("");
  }
}

// Carica i dati quando il DOM è pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadProjectData);
} else {
  loadProjectData();
}

