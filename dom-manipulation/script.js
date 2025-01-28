const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const quoteForm = document.getElementById('add-quote-form');
const quoteList = document.getElementById('quoteList');
const exportJSONButton = document.getElementById('exportJSON');
const importJSONInput = document.getElementById('importJSON');
const categoryFilter = document.getElementById('categoryFilter');
const syncStatus = document.getElementById('syncStatus'); // Get the sync status div

const apiEndpoint = 'https://jsonplaceholder.typicode.com/posts'; // JSONPlaceholder endpoint

// Load quotes from localStorage on page load
let quotes = loadQuotesFromLocalStorage();
let lastSyncTimestamp = localStorage.getItem('lastSyncTimestamp') || 0;

function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
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
    { text: "The only way to do great work is to love what you do.", category: "Inspirational", lastModified: Date.now() },
    { text: "The mind is everything. What you think you become.", category: "Mindfulness", lastModified: Date.now() }
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

  // Update the displayed quotes
  quoteList.innerHTML = '';
  filteredQuotes.forEach(quote => {
    const listItem = document.createElement('li');
    listItem.textContent = `${quote.text} (${quote.category})`;
    quoteList.appendChild(listItem);
  });

  // Store the selected category in localStorage
  localStorage.setItem('lastSelectedCategory', selectedCategory);
}

// Fetch quotes from server (using JSONPlaceholder)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(apiEndpoint);
    const data = await response.json();
    // Adapt the data to match your quote format
    return data.map(post => ({
      id: post.id,
      text: post.title, // Using title as quote text
      category: 'General', // You might need to adjust this
      lastModified: Date.now() - Math.floor(Math.random() * 1000000) // Simulate different timestamps
    }));
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return;
  }
}

// Send new quote to server (using JSONPlaceholder)
async function sendNewQuoteToServer(newQuote) {
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: newQuote.text, // Adapt to JSONPlaceholder format
        body: '...', // You might need to adjust this
        userId: 1 // You might need to adjust this
      })
    });
    const data = await response.json();
    // Adapt the response to match your quote format
    return {
      id: data.id,
      text: data.title,
      category: newQuote.category,
      lastModified: Date.now()
    };
  } catch (error) {
    console.error('Error sending quote:', error);
    return null;
  }
}

// Update quote on server (using JSONPlaceholder - you might need to adapt this)
async function updateQuoteOnServer(quote) {
  try {
    const response = await fetch(`${apiEndpoint}/${quote.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: quote.id,
        title: quote.text, // Adapt to JSONPlaceholder format
        body: '...', // You might need to adjust this
        userId: 1 // You might need to adjust this
      })
    });
    const data = await response.json();
    // Adapt the response to match your quote format
    return {
      id: data.id,
      text: data.title,
      category: quote.category,
      lastModified: Date.now()
    };
  } catch (error) {
    console.error('Error updating quote:', error);
    return null;
  }
}

// Sync quotes with server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let conflictsResolved = false;

  // 1. Add new local quotes to server
  const newLocalQuotes = quotes.filter(localQuote =>!localQuote.id);
  for (const newQuote of newLocalQuotes) {
    const addedQuote = await sendNewQuoteToServer(newQuote);
    if (addedQuote) {
      newQuote.id = addedQuote.id;
      newQuote.lastModified = addedQuote.lastModified;
    }
  }

  // 2. Update existing quotes (conflict resolution - server wins)
  for (const serverQuote of serverQuotes) {
    const localQuote = quotes.find(localQuote => localQuote.id === serverQuote.id);
    if (localQuote) {
      if (localQuote.lastModified < serverQuote.lastModified) {
        // Server quote is newer, update local
        const index = quotes.indexOf(localQuote);
        quotes[index] = serverQuote;
        conflictsResolved = true;
      }
    } else {
      quotes.push(serverQuote);
    }
  }

  // Display sync status
  if (conflictsResolved) {
    syncStatus.textContent = 'Last sync: ' + new Date().toLocaleString() + ' (Conflicts resolved)';
  } else {
    syncStatus.textContent = 'Last sync: ' + new Date().toLocaleString();
  }

  lastSyncTimestamp = Date.now();
  localStorage.setItem('lastSyncTimestamp', lastSyncTimestamp);
  saveQuotesToLocalStorage();
  populateCategories();
}

// Call syncQuotes periodically (e.g., every 5 seconds)
setInterval(syncQuotes, 5000);

// Event listeners
newQuoteButton.addEventListener('click', showRandomQuote);
createAddQuoteForm();
exportJSONButton.addEventListener('click', exportToJSON);
importJSONInput.addEventListener('change', importFromJsonFile);
categoryFilter.addEventListener('change', () => {
  filterQuotes();
  showRandomQuote();
});

// Call populateCategories initially to populate the filter options
populateCategories();

// Optionally, display the last viewed quote when the page loads
const lastViewedIndex = sessionStorage.getItem('lastViewedQuoteIndex');
if (lastViewedIndex!== null) {
  quoteDisplay.innerHTML = quotes[lastViewedIndex].text;
}
