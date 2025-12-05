// Data: baby names + sample Unsplash photos
const data = [
  { name: "Ava", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80&auto=format&fit=crop" },
  { name: "Mia", img: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=1200&q=80&auto=format&fit=crop" },
  { name: "Olivia", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&auto=format&fit=crop" },
  { name: "Emma", img: "https://images.unsplash.com/photo-1520975924059-d59aeb13b6b3?w=1200&q=80&auto=format&fit=crop" },
  { name: "Sophia", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80&auto=format&fit=crop" },
  { name: "Isabella", img: "https://images.unsplash.com/photo-1533777857889-4be9c3f86b54?w=1200&q=80&auto=format&fit=crop" },
  { name: "Charlotte", img: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=1200&q=80&auto=format&fit=crop" },
  { name: "Amelia", img: "https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?w=1200&q=80&auto=format&fit=crop" }
];

// color palettes for name banners
const palettes = [
  "linear-gradient(90deg,#ff6b81,#ff9aa2)",
  "linear-gradient(90deg,#7c5cff,#9aa2ff)",
  "linear-gradient(90deg,#ffb86b,#ffd38f)",
  "linear-gradient(90deg,#4dd0e1,#66e7ff)",
  "linear-gradient(90deg,#ff7ab6,#ff9ecf)"
];

const cardsEl = document.getElementById("cards");
const favoritesPanel = document.getElementById("favorites-panel");
const favListEl = document.getElementById("favorites-list");
const favCountEl = document.getElementById("fav-count");
const openFavBtn = document.getElementById("open-favorites");
const closeFavBtn = document.getElementById("close-favorites");
const downloadFavBtn = document.getElementById("download-favs");

let favorites = JSON.parse(localStorage.getItem("mothercare.favs") || "[]");

function renderCards(){
  cardsEl.innerHTML = "";
  data.forEach((item, idx) => {
    const palette = palettes[idx % palettes.length];
    const card = document.createElement("article");
    card.className = "card";
    card.setAttribute("role","listitem");

    card.innerHTML = `
      <div class="image-wrap">
        <img src="${item.img}" alt="Baby named ${item.name}" loading="lazy" />
        <div class="name-banner" style="background:${palette}">
          <div class="name-text">${item.name}</div>
          <button class="heart-btn" data-name="${item.name}">
            <span class="heart">♡</span>
          </button>
        </div>
      </div>
      <div class="meta">
        <div class="desc">Sweet, gentle & adorable</div>
        <div class="age">Newborn</div>
      </div>
    `;
    const heartBtn = card.querySelector(".heart-btn");
    heartBtn.addEventListener("click", () => toggleFavorite(item));
    cardsEl.appendChild(card);
  });
  updateHearts();
}

function isFavorited(name){
  return favorites.some(f => f.name === name);
}

function toggleFavorite(item){
  if(isFavorited(item.name)){
    favorites = favorites.filter(f => f.name !== item.name);
  } else {
    favorites.push(item);
  }
  localStorage.setItem("mothercare.favs", JSON.stringify(favorites));
  updateHearts();
  renderFavorites();
}

function updateHearts(){
  document.querySelectorAll(".heart-btn").forEach(btn => {
    const name = btn.dataset.name;
    const heart = btn.querySelector(".heart");
    if(isFavorited(name)){
      heart.textContent = "♥";
      heart.style.color = "#ff2d5c";
    } else {
      heart.textContent = "♡";
      heart.style.color = "#ff6b81";
    }
  });
  favCountEl.textContent = favorites.length;
}

// Favorites panel UI
function renderFavorites(){
  favListEl.innerHTML = "";
  if(favorites.length === 0){
    favListEl.innerHTML = `<li class="fav-empty" style="padding:12px;color:#666">No favourites yet — tap the heart on any card to save.</li>`;
    favCountEl.textContent = 0;
    return;
  }
  favorites.forEach(f => {
    const li = document.createElement("li");
    li.className = "fav-item";
    li.innerHTML = `
      <img src="${f.img}" alt="${f.name}" loading="lazy" />
      <div>
        <div class="fav-name">${f.name}</div>
        <div style="font-size:12px;color:#777">Saved</div>
      </div>
      <button class="fav-remove" title="Remove ${f.name}">✕</button>
    `;
    li.querySelector(".fav-remove").addEventListener("click", () => {
      favorites = favorites.filter(x => x.name !== f.name);
      localStorage.setItem("mothercare.favs", JSON.stringify(favorites));
      renderFavorites();
      updateHearts();
    });
    favListEl.appendChild(li);
  });
  favCountEl.textContent = favorites.length;
}

// open/close favorites
openFavBtn.addEventListener("click", () => {
  favoritesPanel.setAttribute("aria-hidden", "false");
  renderFavorites();
});
closeFavBtn.addEventListener("click", () => {
  favoritesPanel.setAttribute("aria-hidden", "true");
});

// download favorites as JSON
downloadFavBtn.addEventListener("click", () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(favorites, null, 2));
  const dl = document.createElement("a");
  dl.setAttribute("href", dataStr);
  dl.setAttribute("download", "mothercare-favourites.json");
  document.body.appendChild(dl);
  dl.click();
  dl.remove();
});

// init
renderCards();
renderFavorites();
updateHearts();