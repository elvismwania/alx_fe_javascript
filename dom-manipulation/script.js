const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const quoteForm = document.getElementById('add-quote-form');
const quoteList = document.getElementById('quoteList');

let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspirational" },
  { text: "The mind is everything. What you think you become.", category: "Mindfulness" },
  //... more quotes
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = quote.text;
}

function addQuote(event) {
  event.preventDefault();

  const newQuote = {
    text: newQuoteText.value,
    category: newQuoteCategory.value
  };
  quotes.push(newQuote);
  newQuoteText.value = "";
  newQuoteCategory.value = "";

  addQuoteToList(newQuote);
}

function addQuoteToList(quote) {
  const listItem = document.createElement('li');
  listItem.textContent = `${quote.text} (${quote.category})`;
  quoteList.appendChild(listItem);
}

function createAddQuoteForm() {
  quoteForm.addEventListener('submit', addQuote);
}

newQuoteButton.addEventListener('click', showRandomQuote);
createAddQuoteForm();
