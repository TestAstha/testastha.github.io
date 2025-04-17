// Blog Carousel (Mobile Only)
(function() {
  function isMobile() {
    return window.innerWidth <= 768;
  }
  function getBlogSlides() {
    // Get all blog-post-detailed.exact-ref from the grid
    return Array.from(document.querySelectorAll('.blog-grid-detailed .blog-post-detailed.exact-ref'));
  }
  function renderBlogCarousel(slides) {
    const carousel = document.querySelector('.blog-carousel');
    const indicatorsContainer = document.getElementById('blog-indicators');
    if (!carousel || !indicatorsContainer) return;
    carousel.innerHTML = '';
    indicatorsContainer.innerHTML = '';
    // Create a horizontal container for slides
    const container = document.createElement('div');
    container.className = 'blog-container';
    slides.forEach((slide, i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'blog-slide';
      wrapper.appendChild(slide.cloneNode(true));
      container.appendChild(wrapper);
      // Indicator
      const dot = document.createElement('span');
      dot.className = 'blog-indicator' + (i === 0 ? ' active' : '');
      dot.dataset.index = i;
      indicatorsContainer.appendChild(dot);
    });
    carousel.appendChild(container);
  }
  function initBlogCarousel() {
    if (!isMobile()) {
      document.querySelector('.blog-carousel-wrapper').style.display = 'none';
      document.querySelector('.blog-grid-detailed').style.display = '';
      return;
    }
    const slides = getBlogSlides();
    if (!slides.length) return;
    document.querySelector('.blog-carousel-wrapper').style.display = 'block';
    document.querySelector('.blog-grid-detailed').style.display = 'none';
    renderBlogCarousel(slides);
    let currentIndex = 0;
    const container = document.querySelector('.blog-container');
    const slidesList = Array.from(container.children);
    const prevBtn = document.getElementById('blog-prev');
    const nextBtn = document.getElementById('blog-next');
    const indicatorsContainer = document.getElementById('blog-indicators');
    const allDots = indicatorsContainer.querySelectorAll('.blog-indicator');

    function scrollToSlide(idx) {
      if (!container) return;
      const slide = slidesList[idx];
      if (!slide) return;
      // Center the slide in the container
      const containerWidth = container.offsetWidth;
      const slideWidth = slide.offsetWidth;
      const scrollLeft = slide.offsetLeft - (containerWidth - slideWidth) / 2;
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }

    function updateCarousel() {
      allDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === slidesList.length - 1;
      scrollToSlide(currentIndex);
    }
    prevBtn.onclick = () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    };
    nextBtn.onclick = () => {
      if (currentIndex < slidesList.length - 1) {
        currentIndex++;
        updateCarousel();
      }
    };
    allDots.forEach(dot => {
      dot.onclick = () => {
        currentIndex = Number(dot.dataset.index);
        updateCarousel();
      };
    });
    // Touch swipe
    let touchStartX = 0;
    let touchEndX = 0;
    container.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    container.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold && currentIndex < slidesList.length - 1) {
        currentIndex++;
        updateCarousel();
      } else if (touchEndX > touchStartX + swipeThreshold && currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    }, { passive: true });
    updateCarousel();
  }
  window.addEventListener('DOMContentLoaded', initBlogCarousel);
  window.addEventListener('resize', initBlogCarousel);
})();
