// Modal functionality
const aboutBtn = document.querySelector('.about-btn');
const contactBtn = document.querySelector('.contact-btn');
const aboutModal = document.getElementById('about-modal');
const contactModal = document.getElementById('contact-modal');
const closeBtns = document.querySelectorAll('.close-btn');

// Open About Us modal
aboutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    aboutModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
});

// Open Contact Us modal
contactBtn.addEventListener('click', (e) => {
    e.preventDefault();
    contactModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
});

// Close modals when clicking X
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        aboutModal.style.display = 'none';
        contactModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
        aboutModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (e.target === contactModal) {
        contactModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Smooth scrolling for menu link
document.querySelector('a[href="#menu"]').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#menu').scrollIntoView({
        behavior: 'smooth'
    });
});

// Animation for the CTA button
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('mouseenter', () => {
        ctaButton.style.transform = 'translateY(-3px)';
        ctaButton.style.boxShadow = '0 10px 20px rgba(7, 190, 184, 0.2)';
    });

    ctaButton.addEventListener('mouseleave', () => {
        ctaButton.style.transform = 'translateY(0)';
        ctaButton.style.boxShadow = 'none';
    });
}

// Change header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.backgroundColor = '#ffffff';
    }
});
