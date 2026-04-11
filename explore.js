// elements
const quotesGrid = document.getElementById("quotesGrid");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const sortSelect = document.getElementById("sortSelect");

let allQuotes = [];


// fetch quotes
async function fetchQuotes() {
  quotesGrid.innerHTML = `<div class="loader"></div>`;

  try {
    const res = await fetch("https://dummyjson.com/quotes?limit=100");
    const data = await res.json();

    allQuotes = data.quotes;

    applyAll(); // run filters immediately

  } catch (err) {
    quotesGrid.innerHTML = "Failed to load 😢";
  }
}


// display
function displayQuotes(data) {
  quotesGrid.innerHTML = "";

  if (data.length === 0) {
    quotesGrid.innerHTML = `
      <p style="text-align:center;">No results found 😢</p>
    `;
    return;
  }

  data.map(q => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <p class="quote">"${q.quote}"</p>
      <p class="author">- ${q.author}</p>

      <div class="actions">
        <button onclick="copyQuote('${q.quote}')">📋</button>
      </div>
    `;

    quotesGrid.appendChild(div);
  });
}


// main
function applyAll() {

  let result = [...allQuotes];

  // search
  const search = searchInput.value.toLowerCase();

  result = result.filter(q =>
    q.quote.toLowerCase().includes(search) ||
    q.author.toLowerCase().includes(search)
  );

  // filter
  if (filterSelect.value === "short") {
    result = result.filter(q => q.quote.length < 80);
  } else if (filterSelect.value === "long") {
    result = result.filter(q => q.quote.length > 80);
  }

  // sort
  if (sortSelect.value === "author") {
    result.sort((a, b) => a.author.localeCompare(b.author));
  } else if (sortSelect.value === "length") {
    result.sort((a, b) => a.quote.length - b.quote.length);
  }

  displayQuotes(result);
}


// copy function
function copyQuote(text) {
  navigator.clipboard.writeText(text);
  alert("Copied!");
}



let timeout;

searchInput.addEventListener("input", () => {
  clearTimeout(timeout);
  timeout = setTimeout(applyAll, 300);
});


// events
filterSelect.addEventListener("change", applyAll);
sortSelect.addEventListener("change", applyAll);


// init
fetchQuotes();

const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  themeToggle.textContent = isDark ? "☀️" : "🌙";

  localStorage.setItem("theme", isDark ? "dark" : "light");
});

function updateFavCount() {
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];
  const el = document.getElementById("favCountNav");
  if (el) el.textContent = favs.length;
}

updateFavCount();