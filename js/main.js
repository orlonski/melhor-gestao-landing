// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Form submission with API integration
const contactForm = document.querySelector('.contact-form');
const submitButton = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    // Get form data
    const formData = {
        name: contactForm.querySelector('input[name="name"]').value,
        email: contactForm.querySelector('input[name="email"]').value,
        message: contactForm.querySelector('textarea[name="message"]').value
    };
    
    try {
        const response = await fetch('/api/contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            contactForm.reset();
        } else {
            throw new Error(data.error || 'Erro ao enviar mensagem');
        }
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        // Reset submit button
        submitButton.disabled = false;
        submitButton.innerHTML = 'Enviar Mensagem';
    }
});

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Animation on scroll with Intersection Observer
const animateOnScroll = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.feature-card, .benefit-item, .pricing-card').forEach(element => {
        observer.observe(element);
    });
};

// Initialize animations
animateOnScroll();

// Mobile menu
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuButton.classList.toggle('active');
    });
}

// Download buttons tracking
document.querySelectorAll('.hero-buttons a').forEach(button => {
    button.addEventListener('click', (e) => {
        const store = e.currentTarget.textContent.includes('Google Play') ? 'Google Play' : 'App Store';
        
        // Google Analytics event
        gtag('event', 'app_download', {
            'event_category': 'engagement',
            'event_label': store
        });
    });
});
