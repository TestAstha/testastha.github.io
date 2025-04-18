// Blog category filter functionality
const catBtns = document.querySelectorAll('.tab-btn');
const blogCards = Array.from(document.querySelectorAll('.flat-blog-card'));
const blogGrid = document.querySelector('.lovable-blog-grid');

function getCardDate(card) {
  // Looks for .flat-blog-date inside the card and parses the date
  const dateEl = card.querySelector('.flat-blog-date');
  if (!dateEl) return 0;
  // Accepts formats like 'Nov 10, 2024' or 'Jan 8, 2025'
  const dateStr = dateEl.textContent.trim();
  const parsed = Date.parse(dateStr);
  return isNaN(parsed) ? 0 : parsed;
}

function sortAndDisplayCards(cards) {
  // Remove all cards
  blogGrid.innerHTML = '';
  // Append in order
  cards.forEach(card => blogGrid.appendChild(card));
}

catBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.textContent.trim().toLowerCase();
    let visibleCards = [];
    blogCards.forEach(card => {
      const cardCats = card.getAttribute('data-category').split(' ');
      if (cat === 'all') {
        card.style.display = '';
        visibleCards.push(card);
      } else if (cat === 'featured') {
        if (cardCats.includes('featured')) {
          card.style.display = '';
          visibleCards.push(card);
        } else {
          card.style.display = 'none';
        }
      } else {
        if (cardCats.includes(cat)) {
          card.style.display = '';
          visibleCards.push(card);
        } else {
          card.style.display = 'none';
        }
      }
    });
    // Sort cards by date descending for all tabs except featured
    if (cat !== 'featured') {
      visibleCards.sort((a, b) => getCardDate(b) - getCardDate(a));
    }
    sortAndDisplayCards(visibleCards);
  });
});

// On page load, force Featured tab as default
window.addEventListener('DOMContentLoaded', () => {
  // Remove active from all, add to Featured
  const catBtns = document.querySelectorAll('.tab-btn');
  catBtns.forEach(btn => btn.classList.remove('active'));
  const featuredBtn = Array.from(catBtns).find(btn => btn.textContent.trim().toLowerCase() === 'featured');
  if (featuredBtn) {
    featuredBtn.classList.add('active');
    const cat = 'featured';
    let visibleCards = [];
    const blogCards = Array.from(document.querySelectorAll('.flat-blog-card'));
    blogCards.forEach(card => {
      const cardCats = card.getAttribute('data-category').split(' ');
      if (cardCats.includes('featured')) {
        card.style.display = '';
        visibleCards.push(card);
      } else {
        card.style.display = 'none';
      }
    });
    // Sort not needed for featured
    const blogGrid = document.querySelector('.lovable-blog-grid');
    blogGrid.innerHTML = '';
    visibleCards.forEach(card => blogGrid.appendChild(card));
  }
});
