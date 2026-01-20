// Katz ACE Hardware - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Add page loaded class for animations
    document.body.classList.add('page-loaded');
    
    // Initialize slideshow
    initSlider();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Update store open/closed status
    updateStoreStatus();
    
    // Initialize scroll effects
    initScrollEffects();
    
    // Initialize scroll to top button
    initScrollToTop();
    
    // Initialize scroll progress indicator
    initScrollProgress();
    
    // Add active page indicator to nav
    highlightCurrentPage();
    
    // Initialize animated counters
    initCounters();

});

// Slideshow functionality
function initSlider() {
    const slides = document.querySelectorAll('#slider .slide');
    const captions = document.querySelectorAll('.nivo-html-caption');
    const prevBtn = document.querySelector('.nivo-prevNav');
    const nextBtn = document.querySelector('.nivo-nextNav');
    const sliderWrapper = document.querySelector('.slider-wrapper');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let slideInterval;
    
    // Create caption display container
    const captionDisplay = document.createElement('div');
    captionDisplay.className = 'caption-display';
    sliderWrapper.appendChild(captionDisplay);
    
    // Create dot navigation
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', function() {
            stopSlideshow();
            showSlide(i);
            startSlideshow();
        });
        dotsContainer.appendChild(dot);
    }
    sliderWrapper.appendChild(dotsContainer);
    
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    
    // Show first slide
    showSlide(0);
    
    // Start auto-advance
    startSlideshow();
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Show current slide
        slides[index].classList.add('active');
        
        // Update caption with animation reset
        if (captions[index]) {
            captionDisplay.innerHTML = captions[index].innerHTML;
            
            // Re-trigger animations by forcing reflow
            const h1 = captionDisplay.querySelector('h1');
            const p = captionDisplay.querySelector('p');
            const buttons = captionDisplay.querySelector('.slide-buttons');
            
            [h1, p, buttons].forEach(el => {
                if (el) {
                    el.style.animation = 'none';
                    el.offsetHeight; // Force reflow
                    el.style.animation = '';
                }
            });
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) next = 0;
        showSlide(next);
    }
    
    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 0) prev = slides.length - 1;
        showSlide(prev);
    }
    
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 6000);
    }
    
    function stopSlideshow() {
        clearInterval(slideInterval);
    }
    
    // Navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            stopSlideshow();
            nextSlide();
            startSlideshow();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            stopSlideshow();
            prevSlide();
            startSlideshow();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            stopSlideshow();
            prevSlide();
            startSlideshow();
        } else if (e.key === 'ArrowRight') {
            stopSlideshow();
            nextSlide();
            startSlideshow();
        }
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderWrapper.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    sliderWrapper.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            stopSlideshow();
            if (diff > 0) {
                nextSlide(); // Swipe left = next
            } else {
                prevSlide(); // Swipe right = prev
            }
            startSlideshow();
        }
    }
}

// Mobile menu toggle
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const menuContainer = document.querySelector('.menu-navigation-container');
    const expandedItems = document.querySelectorAll('.menu > li.expanded');
    
    if (navToggle && menuContainer) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            menuContainer.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Update toggle text for accessibility
            const isOpen = menuContainer.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isOpen);
            navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        });
    }
    
    // Handle dropdown toggle on mobile - reattach on resize
    function setupMobileDropdowns() {
        expandedItems.forEach(function(item) {
            const link = item.querySelector(':scope > a');
            if (link) {
                // Remove existing listener to prevent duplicates
                link.removeEventListener('click', handleDropdownClick);
                
                if (window.innerWidth <= 992) {
                    link.addEventListener('click', handleDropdownClick);
                }
            }
        });
    }
    
    function handleDropdownClick(e) {
        if (window.innerWidth <= 992) {
            e.preventDefault();
            const item = e.target.closest('li.expanded');
            
            // Close other open dropdowns
            expandedItems.forEach(function(other) {
                if (other !== item) {
                    other.classList.remove('open');
                }
            });
            
            item.classList.toggle('open');
        }
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            const menuWrap = document.querySelector('.menu-wrap');
            if (menuContainer && !menuWrap.contains(e.target)) {
                menuContainer.classList.remove('active');
                navToggle.textContent = 'Navigation';
                expandedItems.forEach(item => item.classList.remove('open'));
            }
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuContainer.classList.contains('active')) {
            menuContainer.classList.remove('active');
            navToggle.textContent = 'Navigation';
            expandedItems.forEach(item => item.classList.remove('open'));
        }
    });
    
    // Re-setup dropdowns on window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            setupMobileDropdowns();
            
            // Reset menu state on desktop
            if (window.innerWidth > 992) {
                menuContainer.classList.remove('active');
                navToggle.textContent = 'Navigation';
                expandedItems.forEach(item => item.classList.remove('open'));
            }
        }, 100);
    });
    
    // Initial setup
    setupMobileDropdowns();
}

// Store open/closed status
function updateStoreStatus() {
    const statusElement = document.getElementById('open_or_closed');
    if (!statusElement) return;
    
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1-6 = Mon-Sat
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour + (minute / 60);
    
    let isOpen = false;
    
    if (day === 0) {
        // Sunday: 8am - 6pm
        isOpen = currentTime >= 8 && currentTime < 18;
    } else if (day >= 1 && day <= 6) {
        // Monday - Saturday: 7am - 6pm
        isOpen = currentTime >= 7 && currentTime < 18;
    }
    
    if (isOpen) {
        statusElement.textContent = 'open';
        statusElement.className = 'open';
    } else {
        statusElement.textContent = 'closed';
        statusElement.className = 'closed';
    }
}

// Scroll effects for header
function initScrollEffects() {
    const header = document.querySelector('#header_wrapper');
    const topHeader = document.querySelector('.topheader');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow and compact mode on scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.12)';
            if (topHeader) {
                topHeader.classList.add('scrolled');
            }
        } else {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.06)';
            if (topHeader) {
                topHeader.classList.remove('scrolled');
            }
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#modal') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Highlight current day in footer hours
    highlightCurrentDay();
}

// Highlight current day in footer store hours
function highlightCurrentDay() {
    const footerHours = document.querySelector('.footer-hours');
    if (!footerHours) return;
    
    const days = footerHours.querySelectorAll('li');
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Map JS day index to our list index (our list starts with Monday)
    const listIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    if (days[listIndex]) {
        days[listIndex].classList.add('today');
    }
}

// Scroll to top button
function initScrollToTop() {
    const scrollBtn = document.getElementById('scroll-top');
    if (!scrollBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 400) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initialize scroll reveal animations
    initScrollReveal();
}

// Scroll reveal animations for elements
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.dept-card, .trust-item, .service-card, .footer-col');
    
    if (revealElements.length === 0) return;
    
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(function(el) {
        el.classList.add('reveal-on-scroll');
        revealObserver.observe(el);
    });
}

// Newsletter signup handler
function handleNewsletterSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    
    // Show success message (in a real implementation, this would send to a server)
    form.innerHTML = '<div class="newsletter-success"><i class="fa-solid fa-check-circle"></i> Thank you for subscribing! We\'ll keep you updated.</div>';
    
    return false;
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Highlight current page in navigation
function highlightCurrentPage() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#main-menu a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || 
            (currentPath === '' && linkPath === 'index.html') ||
            (currentPath === 'index.html' && linkPath === 'index.html')) {
            link.classList.add('current-page');
        }
    });
}

// Animated counter for trust section numbers
function initCounters() {
    const counters = document.querySelectorAll('.trust-number');
    if (counters.length === 0) return;
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.getAttribute('data-count');
                if (finalValue) {
                    animateCounter(target, parseInt(finalValue));
                }
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(function(counter) {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeProgress);
        
        element.textContent = current + (element.getAttribute('data-suffix') || '');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}
