const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const quoteForm = document.getElementById('add-quote-form');
const quoteList = document.getElementById('quoteList');
const exportJSONButton = document.getElementById('exportJSON');
const importJSONInput = document.getElementById('importJSON');
const categoryFilter = document.getElementById('categoryFilter'); // Get the filter dropdown

// Load quotes from localStorage on page load
let quotes = loadQuotesFromLocalStorage();

function showRandomQuote() {
  const selectedCategory = categoryFilter.value; // Get the selected category
  const filteredQuotes = selectedCategory === 'all'
  ? quotes
  : quotes.filter(quote => quote.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
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

  // Update the category filter options
  populateCategories();
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
  const blob = new Blob([jsonString], { type: 'application/json' });
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
    quotes.push(...importedQuotes);
    saveQuotesToLocalStorage();
    populateCategories(); // Update categories after import
    // Optionally update the displayed quote list
  };
  reader.readAsText(file);
}

function populateCategories() {
  const categories = new Set(quotes.map(quote => quote.category));
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Load the last selected category from localStorage
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
  }
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === 'all'
  ? quotes
  : quotes.filter(quote => quote.category === selectedCategory);

  // Update the displayed quotes (You'll need to adjust this based on how you're displaying quotes)
  // For example, if you're using quoteList to display a list of quotes:
  quoteList.innerHTML = ''; // Clear the current list
  filteredQuotes.forEach(quote => {
    const listItem = document.createElement('li');
    listItem.textContent = `${quote.text} (${quote.category})`;
    quoteList.appendChild(listItem);
  });

  // If you're only displaying a single quote at a time, you might update quoteDisplay.innerHTML instead.

  // Store the selected category in localStorage
  localStorage.setItem('lastSelectedCategory', selectedCategory);
}

// Event listeners
newQuoteButton.addEventListener('click', showRandomQuote);
createAddQuoteForm();
exportJSONButton.addEventListener('click', exportToJSON);
importJSONInput.addEventListener('change', importFromJsonFile);
categoryFilter.addEventListener('change', () => {
  filterQuotes();
  showRandomQuote(); // Update the displayed quote after filtering
});

// Call populateCategories initially to populate the filter options
populateCategories();

// Optionally, display the last viewed quote when the page loads
const lastViewedIndex = sessionStorage.getItem('lastViewedQuoteIndex');
if (lastViewedIndex!== null) {
  quoteDisplay.innerHTML = quotes[lastViewedIndex].text;
}
