// Projects Carousel (Research Section Style)
(function() {
  // Only run on mobile or tablet (carousel visible)
  function isMobileOrTablet() {
    return window.innerWidth <= 1199 && document.querySelector('.projects-carousel-wrapper')?.style.display !== 'none';
  }

  function isTablet() {
    return window.innerWidth >= 769 && window.innerWidth <= 1199;
  }

  function getFilteredSlides(category) {
    // Get all project-item elements from the grid (source of truth)
    const allSlides = Array.from(document.querySelectorAll('.project-grid .project-item'));
    if (category === 'all') return allSlides;
    return allSlides.filter(item => item.getAttribute('data-category').includes(category));
  }

  function renderCarousel(slides) {
    const carousel = document.querySelector('.projects-carousel');
    const indicatorsContainer = document.getElementById('projects-indicators');
    if (!carousel || !indicatorsContainer) return;
    carousel.innerHTML = '';
    indicatorsContainer.innerHTML = '';

    if (isTablet()) {
      // 2 cards per slide on tablet
      for (let i = 0; i < slides.length; i += 2) {
        const wrapper = document.createElement('div');
        wrapper.className = 'projects-slide';
        if (i === 0) wrapper.classList.add('active');
        wrapper.appendChild(slides[i].cloneNode(true));
        if (slides[i + 1]) wrapper.appendChild(slides[i + 1].cloneNode(true));
        carousel.appendChild(wrapper);
        // Indicator for each slide (pair)
        const dot = document.createElement('span');
        dot.className = 'projects-indicator' + (i === 0 ? ' active' : '');
        dot.dataset.index = i / 2;
        indicatorsContainer.appendChild(dot);
      }
    } else {
      // 1 card per slide (mobile/desktop)
      slides.forEach((slide, i) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'projects-slide';
        if (i === 0) wrapper.classList.add('active');
        wrapper.appendChild(slide.cloneNode(true));
        carousel.appendChild(wrapper);
        // Indicator
        const dot = document.createElement('span');
        dot.className = 'projects-indicator' + (i === 0 ? ' active' : '');
        dot.dataset.index = i;
        indicatorsContainer.appendChild(dot);
      });
    }
  }

  function initProjectsCarousel(category = 'all') {
    if (!isMobileOrTablet()) return;
    const slides = getFilteredSlides(category);
    renderCarousel(slides);
    let currentIndex = 0;
    const carousel = document.querySelector('.projects-carousel');
    const prevBtn = document.getElementById('projects-prev');
    const nextBtn = document.getElementById('projects-next');
    const indicatorsContainer = document.getElementById('projects-indicators');
    const allSlides = carousel.querySelectorAll('.projects-slide');
    const allDots = indicatorsContainer.querySelectorAll('.projects-indicator');

    function updateCarousel() {
      allSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
      });
      allDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === allSlides.length - 1;
    }

    prevBtn.onclick = () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    };
    nextBtn.onclick = () => {
      if (currentIndex < allSlides.length - 1) {
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

    // Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    carousel.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carousel.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold && currentIndex < allSlides.length - 1) {
        currentIndex++;
        updateCarousel();
      } else if (touchEndX > touchStartX + swipeThreshold && currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    }
  }

  // Listen for tab-btn clicks
  document.addEventListener('DOMContentLoaded', function() {
    if (!isMobileOrTablet()) return;
    let activeCategory = 'all';
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        activeCategory = btn.getAttribute('data-category');
        initProjectsCarousel(activeCategory);
      });
    });
    initProjectsCarousel(activeCategory);
  });

  // Re-init on resize
  window.addEventListener('resize', function() {
    if (isMobileOrTablet()) {
      let activeBtn = document.querySelector('.tab-btn.active');
      let category = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
      initProjectsCarousel(category);
    }
  });
})();
