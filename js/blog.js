// Blog category filter functionality
const catBtns = document.querySelectorAll('.blog-cat-btn');
const blogCards = document.querySelectorAll('.blog-card');

catBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active from all
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.getAttribute('data-category');
    blogCards.forEach(card => {
      if (cat === 'featured' || card.getAttribute('data-category') === cat) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});
