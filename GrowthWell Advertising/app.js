// GrowthWell Advertising Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    const backToTopBtn = document.getElementById('back-to-top');
    const contactForm = document.getElementById('contact-form');
    const sections = document.querySelectorAll('section[id]');

    // Mobile Navigation Toggle
    function showMenu() {
        navMenu.classList.add('show-menu');
        document.body.style.overflow = 'hidden';
    }

    function hideMenu() {
        navMenu.classList.remove('show-menu');
        document.body.style.overflow = 'auto';
    }

    // Event Listeners for Mobile Menu
    if (navToggle) {
        navToggle.addEventListener('click', showMenu);
    }

    if (navClose) {
        navClose.addEventListener('click', hideMenu);
    }

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', hideMenu);
    });

    // Close menu when clicking outside
    navMenu.addEventListener('click', (e) => {
        if (e.target === navMenu) {
            hideMenu();
        }
    });

    // Header Scroll Effect
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class to header
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Show/hide back to top button
        if (scrollTop > 500) {
            backToTopBtn.classList.remove('hidden');
        } else {
            backToTopBtn.classList.add('hidden');
        }

        // Update active navigation link
        updateActiveNavLink();
    }

    // Update Active Navigation Link based on scroll position
    function updateActiveNavLink() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const headerHeight = header.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current link
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    // Smooth Scrolling for Navigation Links
    function smoothScroll(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            smoothScroll(targetId);
            hideMenu();
        });
    });

    // Handle CTA button clicks
    const ctaButtons = document.querySelectorAll('a[href="#contact"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            smoothScroll('contact');
        });
    });

    // Back to Top Button
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Form Validation and Submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
    }

    function handleFormSubmission(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const service = formData.get('service');
        const message = formData.get('message');

        // Basic validation
        const errors = [];

        if (!name || name.trim().length < 2) {
            errors.push('Please enter a valid name (minimum 2 characters)');
        }

        if (!email || !isValidEmail(email)) {
            errors.push('Please enter a valid email address');
        }

        if (phone && !isValidPhone(phone)) {
            errors.push('Please enter a valid phone number');
        }

        if (!message || message.trim().length < 10) {
            errors.push('Please enter a message (minimum 10 characters)');
        }

        // Display errors or submit form
        if (errors.length > 0) {
            showFormErrors(errors);
        } else {
            submitForm(formData);
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    function showFormErrors(errors) {
        // Remove existing error messages
        const existingErrors = contactForm.querySelectorAll('.form-error');
        existingErrors.forEach(error => error.remove());

        // Create error container
        const errorContainer = document.createElement('div');
        errorContainer.className = 'form-error';
        errorContainer.style.cssText = `
            background: rgba(var(--color-error-rgb), 0.1);
            border: 1px solid var(--color-error);
            color: var(--color-error);
            padding: var(--space-12);
            border-radius: var(--radius-base);
            margin-bottom: var(--space-16);
            font-size: var(--font-size-sm);
        `;

        // Add error messages
        const errorList = document.createElement('ul');
        errorList.style.cssText = 'margin: 0; padding-left: var(--space-16);';
        
        errors.forEach(error => {
            const errorItem = document.createElement('li');
            errorItem.textContent = error;
            errorList.appendChild(errorItem);
        });

        errorContainer.appendChild(errorList);
        contactForm.insertBefore(errorContainer, contactForm.firstChild);

        // Scroll to form
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function submitForm(formData) {
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            showFormSuccess();
            contactForm.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }

    function showFormSuccess() {
        // Remove existing messages
        const existingMessages = contactForm.querySelectorAll('.form-error, .form-success');
        existingMessages.forEach(message => message.remove());

        // Create success message
        const successContainer = document.createElement('div');
        successContainer.className = 'form-success';
        successContainer.style.cssText = `
            background: rgba(var(--color-success-rgb), 0.1);
            border: 1px solid var(--color-success);
            color: var(--color-success);
            padding: var(--space-16);
            border-radius: var(--radius-base);
            margin-bottom: var(--space-16);
            font-size: var(--font-size-base);
            text-align: center;
        `;
        successContainer.innerHTML = `
            <strong>Thank you for your message!</strong><br>
            We'll get back to you within 24 hours.
        `;

        contactForm.insertBefore(successContainer, contactForm.firstChild);

        // Remove success message after 5 seconds
        setTimeout(() => {
            successContainer.remove();
        }, 5000);

        // Scroll to success message
        successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Intersection Observer for Animation Triggers
    function setupAnimationObserver() {
        const animatedElements = document.querySelectorAll('.service__card, .portfolio__card, .pricing__card, .testimonial__card, .blog__card');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Statistics Counter Animation
    function animateCounters() {
        const counters = document.querySelectorAll('.stat__number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCountUp(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    function animateCountUp(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/[\d,]/g, '');
        const duration = 2000;
        const steps = 60;
        const increment = number / steps;
        const stepDuration = duration / steps;

        let currentNumber = 0;
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= number) {
                currentNumber = number;
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentNumber) + suffix;
        }, stepDuration);
    }

    // Testimonials Carousel (if needed)
    function setupTestimonialsCarousel() {
        const testimonials = document.querySelector('.testimonials__grid');
        if (!testimonials) return;

        // Add swipe functionality for mobile
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        testimonials.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        testimonials.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        testimonials.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;

            const diffX = startX - currentX;
            if (Math.abs(diffX) > 50) {
                // Add carousel navigation logic here if needed
                console.log('Swipe detected:', diffX > 0 ? 'left' : 'right');
            }
        });
    }

    // Lazy Loading for Images (if any images are added later)
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Service Card Hover Effects
    function setupServiceCardEffects() {
        const serviceCards = document.querySelectorAll('.service__card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // Initialize all functionality
    function init() {
        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);
        
        // Setup animations and observers
        setupAnimationObserver();
        animateCounters();
        setupTestimonialsCarousel();
        setupLazyLoading();
        setupServiceCardEffects();
        
        // Initial scroll handler call
        handleScroll();
        
        // Add loading complete class
        document.body.classList.add('loaded');
    }

    // Handle resize events
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768) {
                hideMenu();
            }
        }, 250);
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Close mobile menu with Escape key
        if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
            hideMenu();
        }
        
        // Handle Enter key on interactive elements
        if (e.key === 'Enter') {
            const target = e.target;
            if (target.classList.contains('nav__toggle')) {
                showMenu();
            } else if (target.classList.contains('nav__close')) {
                hideMenu();
            }
        }
    });

    // Performance optimization: Throttle scroll events
    let scrollTimer;
    const originalHandleScroll = handleScroll;
    handleScroll = function() {
        if (scrollTimer) return;
        scrollTimer = setTimeout(() => {
            originalHandleScroll();
            scrollTimer = null;
        }, 16); // ~60fps
    };

    // Initialize the application
    init();

    // Add some console logging for debugging
    console.log('GrowthWell Advertising website loaded successfully!');
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for potential testing or external use
window.GrowthWellApp = {
    smoothScroll,
    handleFormSubmission,
    showMenu,
    hideMenu
};