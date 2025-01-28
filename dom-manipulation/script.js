const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const quoteForm = document.getElementById('add-quote-form');
const quoteList = document.getElementById('quoteList');
const exportJSONButton = document.getElementById('exportJSON');
const importJSONInput = document.getElementById('importJSON');

let quotes = [];

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
  saveQuotesToLocalStorage();
}

function addQuoteToList(quote) {
  const listItem = document.createElement('li');
  listItem.textContent = `${quote.text} (${quote.category})`;
  quoteList.appendChild(listItem);
}

function createAddQuoteForm() {
  quoteForm.addEventListener('submit', addQuote);
}

function loadQuotesFromLocalStorage() {
  const storedQuotes = localStorage.getItem('quotes');
  return storedQuotes ? JSON.parse(storedQuotes) : [];
}

function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function exportToJSON() {
  const jsonString = JSON.stringify(quotes);
  const blob = new Blob([jsonString], { type: 'text/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotesToLocalStorage();
    // Optionally update the displayed quote list
  };
  reader.readAsText(file);
}

newQuoteButton.addEventListener('click', showRandomQuote);
createAddQuoteForm();

// Optionally, display the last viewed quote when the page loads
const lastViewedIndex = sessionStorage.getItem('lastViewedQuoteIndex');
if (lastViewedIndex !== null) {
  quoteDisplay.innerHTML = quotes[lastViewedIndex].text;
}

// Initialize export and import buttons
exportJSONButton.addEventListener('click', exportToJSON);
importJSONInput.addEventListener('change', importFromJsonFile);
