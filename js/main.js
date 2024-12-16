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
            dynamicText.textContent = displayText + (charIndex < currentWord.length - 1 ? '_' : '');
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
}

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
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
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
