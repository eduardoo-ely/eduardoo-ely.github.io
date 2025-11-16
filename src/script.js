// ========================================
// SMOOTH SCROLL - Scroll suave para âncoras
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// INTERSECTION OBSERVER - Animações ao rolar
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Anima as barras de progresso quando a seção skills fica visível
            if (entry.target.id === 'skills') {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, 100);
                });
            }
        }
    });
}, observerOptions);

// Observa todos os elementos com animação fade-in-up
document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
});

// ========================================
// NAVBAR - Background ao rolar
// ========================================
const navbar = document.querySelector('.navbar');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            } else {
                navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            }
            ticking = false;
        });
        ticking = true;
    }
});

// ========================================
// MOBILE MENU - Hamburger menu
// ========================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// Fecha o menu mobile ao clicar em um link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('show');
        }
    });
});

// Ajusta o menu em resize da janela
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.classList.remove('show');
    }
});