const titles = [
  {
    id: "midnight-signal",
    name: "Midnight Signal",
    type: "series",
    tag: "New series",
    year: "2026",
    rating: "97% Match",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=900&q=80",
    description:
      "A late-night radio host discovers a coded broadcast that connects missing people across three cities.",
    trending: true,
  },
  {
    id: "redline-city",
    name: "Redline City",
    type: "movie",
    tag: "Action thriller",
    year: "2025",
    rating: "93% Match",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    description:
      "A driver with one last job races through a citywide blackout while every crew in town hunts the same package.",
    trending: true,
  },
  {
    id: "shadow-harbor",
    name: "Shadow Harbor",
    type: "series",
    tag: "Mystery",
    year: "2026",
    rating: "91% Match",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    description:
      "When a coastal town vanishes from every map, one detective follows the tide into a case that refuses to stay buried.",
    trending: true,
  },
  {
    id: "after-orbit",
    name: "After Orbit",
    type: "movie",
    tag: "Sci-fi",
    year: "2024",
    rating: "89% Match",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80",
    description:
      "Two stranded engineers must decide whether the signal from Earth is a rescue call or a warning.",
    trending: true,
  },
  {
    id: "court-of-fire",
    name: "Court of Fire",
    type: "series",
    tag: "Drama",
    year: "2025",
    rating: "95% Match",
    image: "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=900&q=80",
    description:
      "A young attorney takes on a powerful dynasty after an old trial exposes a hidden political machine.",
    trending: false,
  },
  {
    id: "neon-west",
    name: "Neon West",
    type: "movie",
    tag: "Adventure",
    year: "2023",
    rating: "88% Match",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    description:
      "A washed-up stunt rider and a runaway coder cross the desert to expose the company tracking them.",
    trending: false,
  },
  {
    id: "vault-nine",
    name: "Vault Nine",
    type: "series",
    tag: "Heist",
    year: "2026",
    rating: "92% Match",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80",
    description:
      "Six specialists break into the safest building ever designed, only to learn the vault was built to keep something inside.",
    trending: true,
  },
  {
    id: "last-frame",
    name: "Last Frame",
    type: "movie",
    tag: "Documentary",
    year: "2025",
    rating: "90% Match",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80",
    description:
      "A lost roll of film sends a filmmaker across continents to reconstruct a forgotten star's final week.",
    trending: false,
  },
];

const trendingRow = document.querySelector("#trendingRow");
const libraryGrid = document.querySelector("#libraryGrid");
const searchInput = document.querySelector("#searchInput");
const tabs = document.querySelectorAll("[data-filter]");
const watchlistCount = document.querySelector("#watchlistCount");
const modal = document.querySelector("#previewModal");
const modalImage = document.querySelector("#modalImage");
const modalMeta = document.querySelector("#modalMeta");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const saveCurrentButton = document.querySelector("[data-save-current]");

let activeFilter = "all";
let activeTitle = titles[0];
const savedTitles = new Set(JSON.parse(localStorage.getItem("nitflixSaved") || "[]"));

function persistSaved() {
  localStorage.setItem("nitflixSaved", JSON.stringify([...savedTitles]));
  watchlistCount.textContent = savedTitles.size;
}

function matchesFilter(title) {
  if (activeFilter === "all") return true;
  if (activeFilter === "new") return Number(title.year) >= 2025;
  return title.type === activeFilter;
}

function matchesSearch(title) {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return true;
  return [title.name, title.type, title.tag, title.year].some((value) =>
    value.toLowerCase().includes(query)
  );
}

function cardTemplate(title) {
  const button = document.createElement("button");
  button.className = "title-card";
  button.type = "button";
  button.dataset.id = title.id;
  button.innerHTML = `
    <img src="${title.image}" alt="${title.name} poster" loading="lazy">
    ${savedTitles.has(title.id) ? '<span class="save-badge" aria-label="Saved">âœ“</span>' : ""}
    <span class="card-info">
      <h3>${title.name}</h3>
      <p>${title.rating} â€¢ ${title.year} â€¢ ${title.tag}</p>
    </span>
  `;
  button.addEventListener("click", () => openPreview(title));
  return button;
}

function render() {
  const filteredTitles = titles.filter((title) => matchesFilter(title) && matchesSearch(title));
  const trendingTitles = filteredTitles.filter((title) => title.trending);

  trendingRow.replaceChildren(...trendingTitles.map(cardTemplate));
  libraryGrid.replaceChildren(...filteredTitles.map(cardTemplate));

  if (!trendingTitles.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No trending titles match your search.";
    trendingRow.append(empty);
  }

  if (!filteredTitles.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No titles found.";
    libraryGrid.append(empty);
  }
}

function openPreview(title) {
  activeTitle = title;
  modalImage.src = title.image;
  modalImage.alt = `${title.name} preview`;
  modalMeta.textContent = `${title.rating} â€¢ ${title.year} â€¢ ${title.tag}`;
  modalTitle.textContent = title.name;
  modalDescription.textContent = title.description;
  saveCurrentButton.textContent = savedTitles.has(title.id) ? "Saved" : "Save";
  modal.showModal();
}

function toggleSave(title) {
  if (savedTitles.has(title.id)) {
    savedTitles.delete(title.id);
  } else {
    savedTitles.add(title.id);
  }
  persistSaved();
  saveCurrentButton.textContent = savedTitles.has(title.id) ? "Saved" : "Save";
  render();
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
    activeFilter = tab.dataset.filter;
    render();
  });
});

searchInput.addEventListener("input", render);

document.querySelector("[data-open-featured]").addEventListener("click", () => openPreview(titles[0]));
document.querySelector("[data-scroll-trending]").addEventListener("click", () => {
  document.querySelector("#trending").scrollIntoView({ behavior: "smooth" });
});
document.querySelector("[data-close-modal]").addEventListener("click", () => modal.close());
document.querySelector("[data-save-current]").addEventListener("click", () => toggleSave(activeTitle));
document.querySelector("[data-clear-watchlist]").addEventListener("click", () => {
  savedTitles.clear();
  persistSaved();
  render();
});

window.addEventListener("scroll", () => {
  document.querySelector("[data-topbar]").classList.toggle("is-solid", window.scrollY > 20);
});

persistSaved();
render();
