// script.js
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');

let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspirational" },
  { text: "The mind is everything. What you think you become.", category: "Mindfulness" },
  //... more quotes
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = quote.text; // Corrected line
}

function addQuote() {
  const newQuote = {
    text: newQuoteText.value,
    category: newQuoteCategory.value
  };
  quotes.push(newQuote);
  newQuoteText.value = "";
  newQuoteCategory.value = "";
}

newQuoteButton.addEventListener('click', showRandomQuote);
