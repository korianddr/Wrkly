// Smooth scroll to signup section
function scrollToSignup() {
    const signupSection = document.getElementById('signup');
    if (signupSection) {
        signupSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Form handling with enhanced animations
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.signup-form');
    const messageEl = document.getElementById('form-message');
    const submitBtn = form?.querySelector('button[type="submit"]');
    
    if (form && messageEl) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const email = formData.get('email');
            
            // Add loading state
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }
            
            // Basic email validation
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address. 🦉', 'error');
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
                return;
            }
            
            // Submit the form
            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showMessage('Thanks for joining the waitlist! We\'ll be in touch soon. 🎉', 'success');
                    form.reset();
                    
                    // Add success animation
                    if (submitBtn) {
                        submitBtn.classList.add('success-bounce');
                        setTimeout(() => {
                            submitBtn.classList.remove('success-bounce');
                        }, 600);
                    }
                    
                    // Track successful form submission
                    trackEvent('form_submit', {
                        email: email,
                        status: 'success'
                    });
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                showMessage('Oops! Something went wrong. Please try again. 😅', 'error');
                
                // Track failed form submission
                trackEvent('form_submit', {
                    email: email,
                    status: 'error',
                    error: error.message
                });
            } finally {
                // Remove loading state
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
            }
        });
    }
});

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form messages
function showMessage(message, type) {
    const messageEl = document.getElementById('form-message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `form-message ${type}`;
        messageEl.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }
    }
}

// Simple analytics tracking function
function trackEvent(eventName, data = {}) {
    // This would integrate with your analytics service
    // For now, just log to console for debugging
    console.log('Analytics Event:', eventName, data);
    
    // Example of how to send to an analytics service:
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, data);
    // }
    
    // Or send to your own analytics endpoint:
    // fetch('/analytics', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ event: eventName, data: data })
    // });
}

// Track CTA clicks using data-analytics attributes
document.addEventListener('click', function(e) {
    const analyticsAttribute = e.target.getAttribute('data-analytics');
    if (analyticsAttribute) {
        trackEvent(analyticsAttribute, {
            element: e.target.tagName,
            text: e.target.textContent.trim(),
            href: e.target.href || null
        });
    }
});

// Enhanced interactions and accessibility
document.addEventListener('DOMContentLoaded', function() {
    // Add focus ring to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, [tabindex]');
    
    interactiveElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '3px solid var(--ring)';
            this.style.outlineOffset = '3px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Add playful hover effects to cards
    const cards = document.querySelectorAll('.step-card, .feature-card, .solution-step-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) rotate(2deg) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Owl animation triggers
    const owlImages = document.querySelectorAll('img[src*="owl"]');
    owlImages.forEach(owl => {
        owl.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            this.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
        
        owl.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Enhanced header scroll effect with playful animations
let lastScrollTop = 0;
const header = document.getElementById('site-header');
let ticking = false;

function updateHeader() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down - hide header with bounce
        header.style.transform = 'translateY(-100%)';
        header.style.boxShadow = 'none';
    } else {
        // Scrolling up - show header with bounce
        header.style.transform = 'translateY(0)';
        header.style.boxShadow = 'var(--shadow-lg)';
    }
    
    // Wordmark stays with header (no parallax effect)
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
}, false);

// Add transition to header for smooth hide/show
if (header) {
    header.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
}

// Add floating particles effect (optional)
function createFloatingParticles() {
    const particles = [];
    const colors = ['var(--accent)', 'var(--secondary)', 'var(--accent-yellow)'];
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
        `;
        
        document.body.appendChild(particle);
        particles.push(particle);
        
        // Animate particle
        function animateParticle() {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const duration = 3000 + Math.random() * 2000;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.transition = `all ${duration}ms linear`;
            
            setTimeout(animateParticle, duration);
        }
        
        animateParticle();
    }
}

// Sending custom clicks to GoatCounter

// "Get the app" in header
document.getElementById('nav-get-app').addEventListener('click', function() {
  goatcounter.count({
    path: 'click_nav-get-app',   // custom event name
    event: true            // marks it as a custom event
  });
});

// "Get the app" in hero section
document.getElementById('btn-hero-get-app').addEventListener('click', function() {
  goatcounter.count({
    path: 'click_btn-hero-get-app',
    event: true
  });
});

// "Join the waitlist" in footer form
document.getElementById('btn-join-waitlist').addEventListener('click', function() {
  goatcounter.count({
    path: 'click_btn-join-waitlist',
    event: true
  });
});

// Scroll depth tracking
// (function(){
//   const marks = [25, 50, 75, 100];
//   const fired = new Set();
//   window.addEventListener('scroll', () => {
//     const doc = document.documentElement;
//     const pct = ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
//     marks.forEach(m => {
//       if (pct >= m && !fired.has(m)) {
//         fired.add(m);
//         goatcounter.count({ path: 'scroll_' + m, event: true });
//       }
//     });
//   }, { passive: true });
// })();