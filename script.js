/* ============================================
   MIMAS ICONIC - JAVASCRIPT
   Main functionality
   ============================================ */

// ============================================
// NAVIGATION SCROLL EFFECT
// ============================================
const nav = document.getElementById('navbar');
const body = document.body;

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

if (hamburger && mobileMenu && mobileMenuClose) {
    // Open/Close menu
    hamburger.addEventListener('click', () => {
        const isActive = hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';

        // Update ARIA
        hamburger.setAttribute('aria-expanded', isActive);
    });

    // Close menu with X button
    mobileMenuClose.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
    });

    // Close menu when clicking a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}


// ============================================
// COOKIES BANNER
// ============================================
const cookiesBanner = document.getElementById('cookies-banner');
const acceptCookiesBtn = document.getElementById('accept-cookies');
const rejectCookiesBtn = document.getElementById('reject-cookies');
const fixedCta = document.querySelector('.fixed-cta');

if (cookiesBanner && acceptCookiesBtn && rejectCookiesBtn) {
    // Check if user has already made a choice
    const cookiesAccepted = localStorage.getItem('cookies-accepted');

    if (!cookiesAccepted) {
        setTimeout(() => {
            cookiesBanner.classList.add('visible');
            // Hide fixed CTA when cookies banner is visible
            if (fixedCta && fixedCta.classList.contains('visible')) {
                fixedCta.style.display = 'none';
            }
        }, 1000);
    }

    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookies-accepted', 'true');
        cookiesBanner.classList.remove('visible');
        // Restore fixed CTA
        if (fixedCta) {
            fixedCta.style.display = '';
        }

        // Here you can initialize analytics or other tracking scripts
        // Example: gtag('consent', 'update', { 'analytics_storage': 'granted' });
    });

    rejectCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookies-accepted', 'false');
        cookiesBanner.classList.remove('visible');
        // Restore fixed CTA
        if (fixedCta) {
            fixedCta.style.display = '';
        }
    });
}

// ============================================
// PROMOTIONAL MODAL - ICONIC DUALITY
// ============================================
const modalOverlay = document.getElementById('promo-modal');
const modalClose = document.querySelector('.modal-close');
const newsletterForm = document.getElementById('newsletter-form');
const formSuccess = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-btn');
let closeModal = () => {};

if (modalOverlay && modalClose && newsletterForm) {
    // Check if user has already seen the modal in this session
    const modalShown = sessionStorage.getItem('promo-modal-shown');

    if (!modalShown) {
        // Show modal after 10 seconds (changed from 5 to 10)
        setTimeout(() => {
            modalOverlay.classList.add('visible');
            sessionStorage.setItem('promo-modal-shown', 'true');
            body.style.overflow = 'hidden';
        }, 10000); // Changed to 10 seconds
    }

    // Close modal function
    closeModal = function () {
        modalOverlay.classList.remove('visible');
        body.style.overflow = '';
    };

    // Close modal on button click
    modalClose.addEventListener('click', closeModal);

    // Close modal on overlay click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('visible')) {
            closeModal();
        }
    });
} else {
    // Modal elements not found
    console.warn('Promotional modal elements not found');
}


// ============================================
// NEWSLETTER SUBMISSION (via Vercel API)
// ============================================
const NEWSLETTER_ENDPOINT = '/api/newsletter';

if (newsletterForm && submitBtn && formSuccess) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = (emailInput?.value || '').trim();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const res = await fetch(NEWSLETTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!res.ok) throw new Error(`Newsletter API error: ${res.status}`);

      const fg = newsletterForm.querySelector('.form-group');
      const privacy = newsletterForm.querySelector('.form-privacy');

      if (fg) fg.style.display = 'none';
      submitBtn.style.display = 'none';
      if (privacy) privacy.style.display = 'none';
      formSuccess.classList.add('visible');

      setTimeout(() => {
        closeModal();

        setTimeout(() => {
          newsletterForm.reset();
          if (fg) fg.style.display = 'flex';
          submitBtn.style.display = 'block';
          if (privacy) privacy.style.display = 'block';
          formSuccess.classList.remove('visible');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Quiero enterarme de las promociones';
        }, 500);
      }, 3000);

    } catch (err) {
      console.error(err);
      alert('Ups! Algo salió mal. Inténtalo de nuevo.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Quiero enterarme de las promociones';
    }
  });
}


// Alternative: Simple form submission without EmailOctopus API
// If you prefer to handle everything through a single webhook (like Zapier or Make.com):
/*
newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
        const response = await fetch('YOUR_WEBHOOK_URL', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                timestamp: new Date().toISOString(),
                source: 'Iconic Duality Popup'
            })
        });

        if (response.ok) {
            // Show success message
            newsletterForm.querySelector('.form-group').style.display = 'none';
            submitBtn.style.display = 'none';
            newsletterForm.querySelector('.form-privacy').style.display = 'none';
            formSuccess.classList.add('visible');

            setTimeout(() => {
                closeModal();
            }, 3000);
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ups! Algo salió mal. Inténtalo de nuevo.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Quiero enterarme de las promociones';
    }
});
*/

const faqQuestions = document.querySelectorAll('.faq-question');

if (faqQuestions.length > 0) {
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const wasActive = item.classList.contains('active');

            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(faqItem => {
                faqItem.classList.remove('active');
                const faqQuestion = faqItem.querySelector('.faq-question');
                if (faqQuestion) {
                    faqQuestion.setAttribute('aria-expanded', 'false');
                }
            });

            // Open clicked item if it wasn't active
            if (!wasActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            } else {
                question.setAttribute('aria-expanded', 'false');
            }
        });

        // Keyboard accessibility for FAQ
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            } else if (e.key === 'Escape') {
                // Close FAQ on Escape
                const item = question.parentElement;
                if (item.classList.contains('active')) {
                    item.classList.remove('active');
                    question.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
}

// ============================================
// FIXED CTA VISIBILITY ON SCROLL
// ============================================
const finalCta = document.querySelector('.final-cta');

if (fixedCta && finalCta) {
    window.addEventListener('scroll', () => {
        const finalCtaPosition = finalCta.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (finalCtaPosition > windowHeight) {
            fixedCta.classList.add('visible');
        } else {
            fixedCta.classList.remove('visible');
        }
    });
}
// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            const navHeight = nav.offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// STAGGER ANIMATION DELAYS FOR SECTIONS
// ============================================
const sections = document.querySelectorAll('section');
sections.forEach((section, index) => {
    section.style.animationDelay = `${index * 0.1}s`;
});

// ============================================
// ACCESSIBILITY: Focus trap in modal
// ============================================
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

if (modalOverlay) {
    modalOverlay.addEventListener('keydown', (e) => {
        if (!modalOverlay.classList.contains('visible')) return;

        const focusableContent = modalOverlay.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
    // Focus first element when modal opens
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (modalOverlay.classList.contains('visible')) {
                    setTimeout(() => {
                        const firstFocusable = modalOverlay.querySelector(focusableElements);
                        if (firstFocusable) {
                            firstFocusable.focus();
                        }
                    }, 100);
                }
            }
        });
    });

    observer.observe(modalOverlay, { attributes: true });
}
// ============================================
// FORM VALIDATION (Enhanced)
// ============================================
const emailInput = document.getElementById('email');

if (emailInput) {
    emailInput.addEventListener('blur', () => {
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailValue && !emailRegex.test(emailValue)) {
            emailInput.style.borderColor = '#e74c3c';
            emailInput.setAttribute('aria-invalid', 'true');
        } else {
            emailInput.style.borderColor = '';
            emailInput.setAttribute('aria-invalid', 'false');
        }
    });

    // Remove error styling on input
    emailInput.addEventListener('input', () => {
        emailInput.style.borderColor = '';
        emailInput.setAttribute('aria-invalid', 'false');
    });
}

// ============================================
// CONSOLE LOG - Development Info
// ============================================
console.log('%c🌸 Mimas Iconic', 'font-size: 20px; color: #E8C4C4; font-weight: bold;');
console.log('%cWebsite loaded successfully', 'color: #9A7F87;');
console.log('%cPopup will appear after 10 seconds', 'color: #9A7F87;');
