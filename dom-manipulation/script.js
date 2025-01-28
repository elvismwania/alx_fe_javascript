const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const quoteForm = document.getElementById('add-quote-form');
const quoteList = document.getElementById('quoteList');
const exportJSONButton = document.getElementById('exportJSON');
const importJSONInput = document.getElementById('importJSON');

// Load quotes from localStorage on page load
let quotes = loadQuotesFromLocalStorage();

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = quote.text;

  // Store the last viewed quote index in sessionStorage (optional)
  sessionStorage.setItem('lastViewedQuoteIndex', randomIndex);
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
  return storedQuotes? JSON.parse(storedQuotes): [
    { text: "The only way to do great work is to love what you do.", category: "Inspirational" },
    { text: "The mind is everything. What you think you become.", category: "Mindfulness" }
    //... more initial quotes if needed
  ];
}

function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function exportToJSON() {
  const jsonString = JSON.stringify(quotes);
  const blob = new Blob([jsonString], { type: 'application/json' }); // Corrected line
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();
}

function importFromJsonFile(event) {
  const file = event.target.files;
  const reader = new FileReader();
  reader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes); // Use spread operator to add imported quotes
    saveQuotesToLocalStorage();
    // Optionally update the displayed quote list
  };
  reader.readAsText(file);
}

newQuoteButton.addEventListener('click', showRandomQuote);
createAddQuoteForm();
exportJSONButton.addEventListener('click', exportToJSON);
importJSONInput.addEventListener('change', importFromJsonFile);

// Optionally, display the last viewed quote when the page loads
const lastViewedIndex = sessionStorage.getItem('lastViewedQuoteIndex');
if (lastViewedIndex!== null) {
  quoteDisplay.innerHTML = quotes[lastViewedIndex].text;
}
