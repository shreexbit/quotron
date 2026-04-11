// elements
const generateBtn = document.getElementById("generateBtn");
const mainQuote = document.getElementById("mainQuote");
const quotesGrid = document.getElementById("quotesGrid");
const themeToggle = document.getElementById("themeToggle");

let quotesData = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


// random quote
async function getRandomQuote() {
  mainQuote.innerHTML = `<div class="loader"></div>`;

  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    const data = await res.json();

    mainQuote.innerHTML = `
      <p class="quote">"${data.quote}"</p>
      <p class="author">- ${data.author}</p>

      <div class="actions">
        <button class="copy-main">📋 Copy</button>
        <button class="share-main">🔗 Share</button>
      </div>
    `;

    // copy
    document.querySelector(".copy-main").addEventListener("click", () => {
      copyQuote(data.quote);
    });

    //  share
    document.querySelector(".share-main").addEventListener("click", () => {
      shareQuote(data.quote);
    });

  } catch (err) {
    mainQuote.innerHTML = `<p>Failed to load 😢</p>`;
  }
}


// fetch quotes
async function fetchQuotes() {
  quotesGrid.innerHTML = `<div class="loader"></div>`;

  try {
    const res = await fetch("https://dummyjson.com/quotes?limit=12");
    const data = await res.json();

    quotesData = data.quotes;
    displayQuotes(quotesData);

  } catch (err) {
    quotesGrid.innerHTML = "Error loading quotes 😢";
  }
}


// display quotes
function displayQuotes(data) {
  quotesGrid.innerHTML = "";

  data.map(q => {
    const isFav = favorites.find(f => f.id === q.id);

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <p class="quote">"${q.quote}"</p>
      <p class="author">- ${q.author}</p>

      <div class="actions">
        <button class="copy-btn">📋</button>
        <button class="fav-btn">${isFav ? "❤️" : "🤍"}</button>
      </div>
    `;

    // copy button
    div.querySelector(".copy-btn").addEventListener("click", () => {
      copyQuote(q.quote);
    });

    // favorite button
    div.querySelector(".fav-btn").addEventListener("click", () => {
      toggleFavorite(q);
    });

    quotesGrid.appendChild(div);
  });
}


// favorties logic
function toggleFavorite(q) {
  const exists = favorites.find(f => f.id === q.id);

  if (exists) {
    favorites = favorites.filter(f => f.id !== q.id);
  } else {
    favorites.push(q);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayQuotes(quotesData);
  updateFavCount();
}


// copy function
function copyQuote(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      alert("Copied!");
    })
    .catch(() => {
      alert("Failed to copy 😢");
    });
}


// share function
function shareQuote(text) {
  if (navigator.share) {
    navigator.share({ text: text });
  } else {
    alert("Sharing not supported");
  }
}


// theme change toggle
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  if (themeToggle) themeToggle.textContent = "☀️";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀️" : "🌙";

    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}


// events
if (generateBtn) {
  generateBtn.addEventListener("click", getRandomQuote);
}


getRandomQuote();
fetchQuotes();
updateFavCount();