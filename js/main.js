// Dynamic text animation with typing effect
const dynamicText = document.querySelector('.dynamic-text');
if (dynamicText) {  // Only run typing animation if element exists
    const words = ['Create', 'Design', 'Code', 'Build'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            dynamicText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            const displayText = currentWord.substring(0, charIndex + 1);
            dynamicText.innerHTML = displayText + (charIndex < currentWord.length - 1 ? '<span style="color: #9870fe;">_</span>' : '');
            charIndex++;
        }

        let typingSpeed = isDeleting ? 100 : 150;

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // Pause at the end of word
            setTimeout(() => isDeleting = true, 1500);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before starting new word
        }

        setTimeout(type, typingSpeed);
    }

    // Start the typing animation
    type();
}

// Theme Toggle
console.log('Theme toggle script starting...');
const themeToggle = document.getElementById('theme-toggle');
console.log('Theme toggle button:', themeToggle);
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function getCurrentTheme() {
    const theme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    console.log('Current theme:', theme);
    return theme;
}

function setTheme(theme) {
    console.log('Setting theme to:', theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update moon icon
    const moonIcon = document.querySelector('.moon-icon');
    console.log('Moon icon element:', moonIcon);
    if (moonIcon) {
        moonIcon.classList.toggle('fa-sun', theme === 'light');
        moonIcon.classList.toggle('fa-moon', theme === 'dark');
    }
    
    // Update theme-aware images
    updateThemeAwareImages(theme);
}

// Function to update theme-aware images based on current theme
function updateThemeAwareImages(theme) {
    const themeAwareImages = document.querySelectorAll('.theme-aware-image');
    
    themeAwareImages.forEach(img => {
        const lightSrc = img.getAttribute('data-light-src');
        const darkSrc = img.getAttribute('data-dark-src');
        if (theme === 'dark' && darkSrc) {
            img.src = darkSrc;
        } else if (lightSrc) {
            img.src = lightSrc;
        }
    });
}

// Ensure theme-aware images are updated on initial load and theme change
document.addEventListener('DOMContentLoaded', function() {
    const initialTheme = document.documentElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    updateThemeAwareImages(initialTheme);
});

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    const initialTheme = getCurrentTheme();
    console.log('Initial theme:', initialTheme);
    setTheme(initialTheme);
});

// Theme toggle click handler
if (themeToggle) {
    console.log('Adding click handler to theme toggle');
    themeToggle.addEventListener('click', () => {
        console.log('Theme toggle clicked');
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        console.log('Switching from', currentTheme, 'to', newTheme);
        setTheme(newTheme);
    });
} else {
    console.log('Theme toggle button not found!');
}

// Handle system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    console.log('System theme changed:', e.matches ? 'dark' : 'light');
    setTheme(e.matches ? 'dark' : 'light');
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        
        // Toggle icon
        const icon = mobileMenuBtn.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add scroll event listener for navbar
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
});

// Initialize animations when elements come into view
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all work items
document.querySelectorAll('.work-item').forEach(item => {
    observer.observe(item);
});

// Update active menu item based on scroll position
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

function updateActiveMenuItem() {
    const scrollPosition = window.scrollY + 100; // Offset for nav bar height

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// Update active state on scroll
window.addEventListener('scroll', updateActiveMenuItem);

// Update active state on click
navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        navItems.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
        
        // Close mobile menu after click
        navLinks.classList.remove('active');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
    });
});

// Services Carousel
function initServicesCarousel() {
    const container = document.querySelector('.services-container');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    
    if (!container) return;
    
    // Force recalculation of container width
    setTimeout(() => {
        // Check if scrolling is needed
        const isScrollNeeded = container.scrollWidth > container.clientWidth;
        
        // Always show arrows on mobile, tablet, and medium desktop screens
        if (window.innerWidth <= 1630) {
            if (prevBtn && nextBtn) {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
            }
        } else {
            // On larger desktop sizes, only show if scrolling is needed
            if (prevBtn && nextBtn) {
                prevBtn.style.display = isScrollNeeded ? 'flex' : 'none';
                nextBtn.style.display = isScrollNeeded ? 'flex' : 'none';
            }
        }
    }, 100);

    let startX;
    let scrollLeft;
    let isDragging = false;

    // Mouse events for dragging
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        container.style.cursor = 'grabbing';
    });

    container.addEventListener('mouseleave', () => {
        isDragging = false;
        container.style.cursor = 'grab';
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab';
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        container.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('touchend', () => {
        isDragging = false;
    });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });

    // Arrow navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            container.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            container.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });
    }
    
    // Handle resize
    window.addEventListener('resize', () => {
        setTimeout(() => {
            const isScrollNeeded = container.scrollWidth > container.clientWidth;
            
            // Always show arrows on mobile, tablet, and medium desktop screens
            if (window.innerWidth <= 1630) {
                if (prevBtn && nextBtn) {
                    prevBtn.style.display = 'flex';
                    nextBtn.style.display = 'flex';
                }
            } else {
                // On larger desktop sizes, only show if scrolling is needed
                if (prevBtn && nextBtn) {
                    prevBtn.style.display = isScrollNeeded ? 'flex' : 'none';
                    nextBtn.style.display = isScrollNeeded ? 'flex' : 'none';
                }
            }
        }, 100);
    });
}

// Project Filtering
document.addEventListener('DOMContentLoaded', function() {
    // Project filtering
    const tabBtns = document.querySelectorAll('.tab-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const projectsContainer = document.querySelector('.projects-container');
    
    // Set default category to 'featured' on load
    let defaultCategory = 'featured';
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-category') === defaultCategory) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    // Ensure only featured projects are visible on load
    projectItems.forEach(item => {
        if (item.getAttribute('data-category').includes(defaultCategory)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');
            filterProjects(category);
        });
    });

    // Function to filter projects
    function filterProjects(category) {
        // Show/hide projects based on category
        projectItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category').includes(category)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Also filter the cloned items in the mobile carousel
        if (projectsContainer) {
            const mobileItems = projectsContainer.querySelectorAll('.project-item');
            mobileItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category').includes(category)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }
    }
    
    // Mobile carousel
    const prevArrow = document.querySelector('.project-prev-arrow');
    const nextArrow = document.querySelector('.project-next-arrow');
    
    // Clone project items for mobile carousel
    if (projectsContainer) {
        projectItems.forEach(item => {
            const clone = item.cloneNode(true);
            projectsContainer.appendChild(clone);
        });
        
        // Handle arrow clicks
        if (prevArrow && nextArrow) {
            prevArrow.addEventListener('click', () => {
                projectsContainer.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                });
            });
            
            nextArrow.addEventListener('click', () => {
                projectsContainer.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // Show/hide carousel based on screen size
    const projectGrid = document.querySelector('.project-grid');
    const projectsWrapper = document.querySelector('.projects-wrapper');
    
    function handleResize() {
        if (window.innerWidth <= 768) {
            if (projectGrid) projectGrid.style.display = 'none';
            if (projectsWrapper) projectsWrapper.style.display = 'block';
        } else {
            if (projectGrid) projectGrid.style.display = 'grid';
            if (projectsWrapper) projectsWrapper.style.display = 'none';
        }
    }
    
    // Initial check
    handleResize();
    
    // Listen for window resize
    window.addEventListener('resize', handleResize);
});

// Stats Counter Animation
function initStatsCounter() {
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (!statsSection || !statNumbers.length) return;
    
    // Store the target values
    const targetValues = [];
    statNumbers.forEach(stat => {
        const value = parseInt(stat.textContent);
        targetValues.push(value);
        // Set initial value to 0
        stat.textContent = '0';
    });
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Function to animate counting
    function animateCount(index, targetValue) {
        let currentValue = 0;
        const duration = 2000; // 2 seconds
        const interval = 50; // Update every 50ms
        const increment = targetValue / (duration / interval);
        
        const counter = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(counter);
            }
            statNumbers[index].textContent = Math.floor(currentValue) + '+';
        }, interval);
    }
    
    // Flag to track if animation has been triggered
    let animated = false;
    
    // Check on scroll
    function checkScroll() {
        if (!animated && isInViewport(statsSection)) {
            animated = true;
            targetValues.forEach((value, index) => {
                animateCount(index, value);
            });
        }
    }
    
    // Initial check
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
}

// Custom Cursor Implementation
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.cursor');
    const cursorBall = document.querySelector('.cursor__ball--big');
    const cursorSmall = document.querySelector('.cursor__ball--small');
    
    if (cursor && cursorBall && cursorSmall && window.innerWidth > 768) {
        document.addEventListener('mousemove', e => {
            cursor.style.display = 'block';
            
            // Position the cursor elements at the mouse position
            const posX = e.clientX;
            const posY = e.clientY;
            
            // Apply position with transform for better performance
            cursorBall.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
            
            // Small cursor follows with slight delay for effect
            setTimeout(() => {
                cursorSmall.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
            }, 100);
        });
        
        // Hide cursor when it leaves the window
        document.addEventListener('mouseout', () => {
            cursor.style.display = 'none';
        });
        
        document.addEventListener('mouseover', () => {
            cursor.style.display = 'block';
        });
        
        // Add hover effect for clickable elements
        const clickables = document.querySelectorAll('a, button, .project-item, .service-card, .nav-links li, .tab-btn');
        clickables.forEach(element => {
            element.addEventListener('mouseover', () => {
                cursorBall.classList.add('cursor-hover');
                cursorSmall.classList.add('cursor-hover');
            });
            
            element.addEventListener('mouseout', () => {
                cursorBall.classList.remove('cursor-hover');
                cursorSmall.classList.remove('cursor-hover');
            });
        });
    }
});

// Initialize all interactive elements
document.addEventListener('DOMContentLoaded', function() {
    initServicesCarousel();
    initStatsCounter();
    initResearchTabs();
});

// Research Tabs Functionality
function initResearchTabs() {
    const tabs = document.querySelectorAll('.research-tab');
    const tabContents = document.querySelectorAll('.research-tab-content');
    
    if (tabs.length && tabContents.length) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding content
                const tabId = tab.getAttribute('data-tab');
                const content = document.getElementById(tabId + '-content');
                if (content) {
                    content.classList.add('active');
                }
            });
        });
    }
    
    // Initialize research carousels
    initResearchCarousels();
}

// Initialize research carousels
function initResearchCarousels() {
    initCarousel('patents');
    initCarousel('publications');
}

// Initialize individual carousel
function initCarousel(type) {
    const slides = document.querySelectorAll(`#${type}-content .research-slide`);
    const prevBtn = document.getElementById(`${type}-prev`);
    const nextBtn = document.getElementById(`${type}-next`);
    const indicators = document.querySelectorAll(`#${type}-indicators .research-indicator`);
    
    if (!slides.length || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    
    // Set initial state
    updateSlides();
    
    // Add event listeners to buttons
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlides();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlides();
        }
    });
    
    // Add event listeners to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateSlides();
        });
    });
    
    // Update slides and controls
    function updateSlides() {
        // Update slides
        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        // Update buttons
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === slides.length - 1;
    }
    
    // Add swipe support for mobile
    const carousel = document.querySelector(`#${type}-content .research-carousel`);
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold && currentIndex < slides.length - 1) {
            // Swipe left - next slide
            currentIndex++;
            updateSlides();
        } else if (touchEndX > touchStartX + swipeThreshold && currentIndex > 0) {
            // Swipe right - previous slide
            currentIndex--;
            updateSlides();
        }
    }
}

// Services section navigation
const servicesContainer = document.querySelector('.services-container');
const prevArrow = document.querySelector('.prev-arrow');
const nextArrow = document.querySelector('.next-arrow');

function updateServicesArrows() {
    const isScrollNeeded = servicesContainer.scrollWidth > servicesContainer.clientWidth;
    
    // Only show arrows if scrolling is needed
    if (isScrollNeeded) {
        prevArrow.style.display = 'flex';
        nextArrow.style.display = 'flex';
        
        // Update arrow states based on scroll position
        prevArrow.style.opacity = servicesContainer.scrollLeft <= 0 ? '0.5' : '1';
        nextArrow.style.opacity = 
            servicesContainer.scrollLeft >= servicesContainer.scrollWidth - servicesContainer.clientWidth 
            ? '0.5' : '1';
    } else {
        prevArrow.style.display = 'none';
        nextArrow.style.display = 'none';
    }
}

// Add scroll event listener to update arrow states
servicesContainer.addEventListener('scroll', updateServicesArrows);

// Update arrows on load and resize
updateServicesArrows();
window.addEventListener('resize', updateServicesArrows);

if (prevArrow && nextArrow) {
    prevArrow.addEventListener('click', () => {
        servicesContainer.scrollBy({
            left: -servicesContainer.offsetWidth,
            behavior: 'smooth'
        });
    });

    nextArrow.addEventListener('click', () => {
        servicesContainer.scrollBy({
            left: servicesContainer.offsetWidth,
            behavior: 'smooth'
        });
    });
}

// --- Project Carousel Population for Small Screens ---
function syncProjectsCarousel() {
  const grid = document.querySelector('.project-grid');
  const carousel = document.querySelector('.projects-container');
  if (!grid || !carousel) return;

  // Only populate if empty (avoids duplicates)
  if (window.innerWidth <= 900 && carousel.children.length === 0) {
    const cards = grid.querySelectorAll('.project-item');
    cards.forEach(card => {
      carousel.appendChild(card.cloneNode(true));
    });
  }
}
window.addEventListener('DOMContentLoaded', syncProjectsCarousel);
window.addEventListener('resize', syncProjectsCarousel);

// --- Project Carousel Arrow Functionality ---
function setupProjectCarouselArrows() {
  // Target ALL project wrappers instead of just the first one
  document.querySelectorAll('.projects-wrapper').forEach(wrapper => {
    const container = wrapper.querySelector('.projects-container');
    const prev = wrapper.querySelector('.project-prev-arrow');
    const next = wrapper.querySelector('.project-next-arrow');
    if (!container || !prev || !next) return;

    // Use addEventListener instead of onclick to avoid overwriting
    prev.addEventListener('click', () => {
      container.scrollBy({ left: -container.offsetWidth * 0.85, behavior: 'smooth' });
    });
    next.addEventListener('click', () => {
      container.scrollBy({ left: container.offsetWidth * 0.85, behavior: 'smooth' });
    });
  });
}
window.addEventListener('DOMContentLoaded', setupProjectCarouselArrows);
window.addEventListener('resize', setupProjectCarouselArrows);
