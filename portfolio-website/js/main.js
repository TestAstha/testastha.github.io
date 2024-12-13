// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
const getCurrentTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return prefersDarkScheme.matches ? 'dark' : 'light';
};

// Apply theme
const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', theme);
};

// Initialize theme
applyTheme(getCurrentTheme());

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
});

// Handle system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    const newTheme = e.matches ? 'dark' : 'light';
    applyTheme(newTheme);
});

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
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
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

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Menu toggle
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-content')) {
            navLinks.classList.remove('active');
        }
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
        });
    });
});

// Services Carousel
function initServicesCarousel() {
    const container = document.querySelector('.services-container');
    const cards = document.querySelectorAll('.service-card');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    
    if (!container || window.innerWidth > 768) return;

    let startX;
    let scrollLeft;
    let isDragging = false;

    // Add dots
    const dotsContainer = document.querySelector('.services-dots');
    if (!dotsContainer.children.length) {
        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dotsContainer.appendChild(dot);
        });
    }

    const dots = document.querySelectorAll('.dot');

    // Navigation arrows
    prevBtn.addEventListener('click', () => {
        const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
        container.scrollBy({
            left: -cardWidth,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', () => {
        const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
        container.scrollBy({
            left: cardWidth,
            behavior: 'smooth'
        });
    });

    // Touch events
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });

    container.addEventListener('touchend', () => {
        isDragging = false;
        snapToNearestCard();
    });

    // Mouse events for desktop testing
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
        snapToNearestCard();
    });

    container.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    // Snap to nearest card
    function snapToNearestCard() {
        const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
        const scrollPosition = container.scrollLeft;
        const nearestCard = Math.round(scrollPosition / cardWidth);
        
        container.scrollTo({
            left: nearestCard * cardWidth,
            behavior: 'smooth'
        });
    }

    // Update active dot and arrows
    function updateNavigation() {
        const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
        const index = Math.round(container.scrollLeft / cardWidth);
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Update arrows
        prevBtn.style.opacity = index === 0 ? '0.3' : '1';
        nextBtn.style.opacity = index === cards.length - 1 ? '0.3' : '1';
    }

    // Dot navigation
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
            container.scrollTo({
                left: i * cardWidth,
                behavior: 'smooth'
            });
        });
    });

    container.addEventListener('scroll', updateNavigation);
    window.addEventListener('resize', updateNavigation);
    
    // Initial state
    updateNavigation();
}

// Initialize carousel
window.addEventListener('load', initServicesCarousel);
window.addEventListener('resize', initServicesCarousel);
