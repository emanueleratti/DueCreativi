// Projects Loader per Home Page
// Carica l'elenco dei progetti e genera dinamicamente le PROJECT CARD

async function loadProjectsList() {
  try {
    const response = await fetch("projects/projects-list.json");
    if (!response.ok) {
      throw new Error(`Errore nel caricamento della lista progetti: ${response.status}`);
    }
    const data = await response.json();
    await renderProjects(data.projects);
  } catch (error) {
    console.error("Errore nel caricamento dei progetti:", error);
  }
}

async function renderProjects(projectsList) {
  const projectsContainer = document.querySelector("#projects .project-wrapper");
  if (!projectsContainer) {
    console.error("Container progetti non trovato");
    return;
  }

  // Pulisci il container
  projectsContainer.innerHTML = "";

  // Carica i dati di ogni progetto e crea le card
  for (const projectId of projectsList) {
    try {
      const projectData = await loadProjectData(projectId);
      if (projectData) {
        const projectCard = createProjectCard(projectId, projectData);
        projectsContainer.appendChild(projectCard);
      }
    } catch (error) {
      console.error(`Errore nel caricamento del progetto ${projectId}:`, error);
    }
  }
}

async function loadProjectData(projectId) {
  try {
    const response = await fetch(`projects/${projectId}.json`);
    if (!response.ok) {
      throw new Error(`Progetto ${projectId} non trovato`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Errore nel caricamento del progetto ${projectId}:`, error);
    return null;
  }
}

function createProjectCard(projectId, projectData) {
  // Crea il div della colonna
  const colDiv = document.createElement("div");
  colDiv.className = "col d-flex flex-column align-items-start gap-2";

  // Crea il link - percorso relativo alla root
  const link = document.createElement("a");
  const projectPath = `projects/${projectId}.html`;
  link.href = projectPath;
  link.className = "project-card d-block rounded-4 overflow-hidden mb-2";
  
  // Debug: verifica il percorso generato
  console.log(`Link generato per ${projectId}: ${projectPath}`);

  // Crea l'immagine
  const img = document.createElement("img");
  img.src = projectData.thumbnail || `assets/projects/${projectId}_1.webp`;
  img.alt = projectData.title || projectId;
  img.className = "w-100 h-100 object-fit-cover d-block";

  // Aggiungi l'immagine al link
  link.appendChild(img);

  // Crea il titolo del progetto
  const title = document.createElement("h6");
  title.className = "sans-serif-5";
  title.textContent = projectData.title || "Progetto";

  // Crea la descrizione del progetto
  const description = document.createElement("p");
  description.className = "text-style";
  description.textContent = projectData.shortDescription || "Descrizione del progetto";

  // Aggiungi link e titolo alla colonna
  colDiv.appendChild(link);
  colDiv.appendChild(title);
  colDiv.appendChild(description);

  return colDiv;
}

// Carica i progetti quando il DOM è pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadProjectsList);
} else {
  loadProjectsList();
}

