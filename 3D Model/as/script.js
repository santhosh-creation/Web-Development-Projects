const buttons = document.querySelectorAll('nav button');
const cards = document.querySelectorAll('.card');
const searchInput = document.getElementById('search');
const darkToggle = document.getElementById('darkToggle');

// Dark Mode Toggle Logic
// Check saved theme or default to dark (as per your original logic)
let savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || savedTheme === null) {
  document.body.classList.add('dark');
  darkToggle.checked = true;
} else {
  document.body.classList.remove('dark');
  darkToggle.checked = false;
}

// Toggle on change
darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});


// Function to clear search and reset filters
function clearSearchAndFilter() {
    searchInput.value = ''; // Clear search input
    cards.forEach(card => {
        card.style.display = 'block'; // Show all cards
    });
    // Remove active class from all filter buttons
    buttons.forEach(btn => btn.classList.remove('active'));
}

// Filter by category
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    clearSearchAndFilter(); // Clear search and reset display when a filter button is clicked
    btn.classList.add('active'); // Add active class to the clicked button

    const filter = btn.getAttribute('data-filter');
    cards.forEach(card => {
      // Use 'grid' display to maintain grid layout when visible
      card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
    });
  });
});

// Live search
searchInput.addEventListener('input', () => {
  // Remove active class from filter buttons when searching
  buttons.forEach(btn => btn.classList.remove('active'));

  const term = searchInput.value.toLowerCase();
  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const altText = card.querySelector('model-viewer').getAttribute('alt').toLowerCase(); // Search alt text too

    // Check if title or alt text includes the search term
    card.style.display = (title.includes(term) || altText.includes(term)) ? 'block' : 'none';
  });
});


// Model Modal Viewer
const modal = document.getElementById("modelModal");
const modalViewer = document.getElementById("modalModel");
const closeBtn = document.querySelector(".close");

// When any model card is clicked
cards.forEach(card => {
  card.addEventListener('click', () => {
    const modelSrc = card.querySelector("model-viewer").getAttribute("src");
    modalViewer.setAttribute("src", modelSrc);
    modal.classList.add("is-active"); // Show modal using class
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  });
});

// Close modal when 'x' is clicked
closeBtn.addEventListener('click', () => {
  modal.classList.remove("is-active"); // Hide modal using class
  modalViewer.removeAttribute("src"); // Stop rendering
  document.body.style.overflow = ''; // Restore background scrolling
});

// Close modal if clicking outside modal content
window.addEventListener('click', e => {
  if (e.target === modal) {
    modal.classList.remove("is-active");
    modalViewer.removeAttribute("src");
    document.body.style.overflow = '';
  }
});

// Optional: Close modal with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('is-active')) {
    modal.classList.remove("is-active");
    modalViewer.removeAttribute("src");
    document.body.style.overflow = '';
  }
});

// Initialize 'All' filter button as active on load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('nav button[data-filter="all"]').classList.add('active');
});