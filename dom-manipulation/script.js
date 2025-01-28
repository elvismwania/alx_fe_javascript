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
  quoteDisplay.textContent = quote.text;
}

function addQuote() {
  const newQuote = {
    text: newQuoteText.value,
    category: newQuoteCategory.value
  };
  quotes.push(newQuote);
  // Clear the input fields
  newQuoteText.value = "";
  newQuoteCategory.value = "";
  // Optionally display a success message or update the quote display
}

newQuoteButton.addEventListener('click', showRandomQuote);
