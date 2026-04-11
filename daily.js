// dom elements
const dailyQuote = document.getElementById("dailyQuote");
const moodSelect = document.getElementById("moodSelect");
const grid = document.getElementById("quotesGrid");

// store quotes
let allQuotes = [];


// fetch quotes from api
async function fetchQuotes() {
  try {
    const res = await fetch("https://dummyjson.com/quotes?limit=100");
    const data = await res.json();

    allQuotes = data.quotes;

    if (!allQuotes.length) {
      dailyQuote.innerHTML = "no quotes found";
      return;
    }

    showDaily();
    displayQuotes(allQuotes);

  } catch (err) {
    console.error(err);
    dailyQuote.innerHTML = "api failed";
  }
}


// show daily quote using localstorage
function showDaily() {
  const today = new Date().toDateString();
  let saved = JSON.parse(localStorage.getItem("dailyQuote"));

  let quote;

  if (saved && saved.date === today) {
    quote = saved.quote;
  } else {
    quote = allQuotes[Math.floor(Math.random() * allQuotes.length)];

    localStorage.setItem("dailyQuote", JSON.stringify({
      date: today,
      quote: quote
    }));
  }

  if (!quote) {
    dailyQuote.innerHTML = "no quote";
    return;
  }

  dailyQuote.innerHTML = `
    <p class="quote">"${quote.quote}"</p>
    <p class="author">- ${quote.author}</p>
  `;
}


// display quotes in grid
function displayQuotes(data) {
  grid.innerHTML = "";

  data.forEach(q => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <p class="quote">"${q.quote}"</p>
      <p class="author">- ${q.author}</p>
    `;

    grid.appendChild(div);
  });
}


// filter by mood
moodSelect.addEventListener("change", () => {
  const val = moodSelect.value.toLowerCase();

  if (!val) return displayQuotes(allQuotes);

  const filtered = allQuotes.filter(q =>
    q.quote.toLowerCase().includes(val)
  );

  displayQuotes(filtered);
});


// load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}


// toggle theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";

  localStorage.setItem("theme", isDark ? "dark" : "light");
});


// init
fetchQuotes();