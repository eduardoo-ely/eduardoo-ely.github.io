// ========================================
// CONFIG GERAL
// ========================================
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ========================================
// LENIS - Smooth Scroll (estilo Lando Norris)
// ========================================
let lenis = null;

if (!prefersReduced && window.Lenis) {
    lenis = new Lenis({
        lerp: 0.09,          // suavidade (quanto menor, mais "deslizante")
        wheelMultiplier: 1,
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ({ scroll }) => applyScrollEffects(scroll));
}

// ========================================
// SMOOTH SCROLL - Âncoras (usa Lenis quando disponível)
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;

        if (lenis) {
            lenis.scrollTo(target, { offset: -70, duration: 1.4 });
        } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========================================
// EFEITOS DE SCROLL - Parallax + barra de progresso
// ========================================
const progressBar = document.getElementById('scroll-progress');
const heroContent = document.querySelector('.hero-content');
const codeRain = document.querySelector('.code-rain');

function applyScrollEffects(scrollY) {
    const y = scrollY ?? window.scrollY;

    // Barra de progresso
    if (progressBar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (y / max) * 100 : 0;
        progressBar.style.width = pct + '%';
    }

    // Parallax do hero (some/desce em ritmos diferentes ao rolar)
    if (!prefersReduced) {
        const vh = window.innerHeight;
        if (heroContent && y < vh) {
            heroContent.style.transform = `translateY(${y * 0.4}px)`;
            heroContent.style.opacity = `${Math.max(0, 1 - y / (vh * 0.85))}`;
        }
        if (codeRain && y < vh) {
            codeRain.style.transform = `translateY(${y * 0.18}px)`;
        }
    }
}

// Fallback para navegador sem Lenis (ou reduced-motion)
if (!lenis) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                applyScrollEffects(window.scrollY);
                ticking = false;
            });
            ticking = true;
        }
    });
}
applyScrollEffects(window.scrollY);

// ========================================
// TIPOGRAFIA ANIMADA - letras reagem ao mouse
// ========================================
function splitIntoChars(el, gradient = false) {
    const text = el.textContent.trim();
    el.textContent = '';
    el.classList.add('split-text');
    if (gradient) el.classList.add('title-gradient');

    [...text].forEach((ch, i) => {
        if (ch === ' ') {
            el.appendChild(document.createTextNode(' '));
            return;
        }
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch;
        // atraso escalonado cria o efeito de "onda"
        span.style.transitionDelay = `${i * 0.025}s`;
        el.appendChild(span);
    });
}

document.querySelectorAll('.hero-title, .section-title').forEach(el => splitIntoChars(el, true));
document.querySelectorAll('.hero-subtitle, .project-title, .nav-links a').forEach(el => splitIntoChars(el, false));

// ========================================
// REVEAL AO ROLAR - seções + cards com stagger
// ========================================
const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible', 'in');

        // Limpa o delay do stagger pra não atrasar o hover do card depois
        if (entry.target.classList.contains('reveal-item')) {
            setTimeout(() => { entry.target.style.transitionDelay = ''; }, 1600);
        }

        // Anima as barras de progresso da seção de skills
        if (entry.target.id === 'skills') {
            entry.target.querySelectorAll('.skill-progress').forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                setTimeout(() => { bar.style.width = progress + '%'; }, 100);
            });
        }
        observer.unobserve(entry.target);
    });
}, observerOptions);

// Seções (fade-in-up existente)
document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

// Cards dentro dos grids ganham reveal escalonado
const grids = ['.projects-grid', '.skills-grid', '.experience-grid', '.learning-grid', '.about-grid'];
grids.forEach(sel => {
    const grid = document.querySelector(sel);
    if (!grid) return;
    [...grid.children].forEach((card, i) => {
        card.classList.add('reveal-item');
        card.style.transitionDelay = `${i * 0.08}s`;
        observer.observe(card);
    });
});

// ========================================
// NAVBAR - Background ao rolar
// ========================================
const navbar = document.querySelector('.navbar');
let navTicking = false;

window.addEventListener('scroll', () => {
    if (!navTicking) {
        window.requestAnimationFrame(() => {
            navbar.style.background = window.scrollY > 100
                ? 'rgba(15, 23, 42, 0.95)'
                : 'rgba(15, 23, 42, 0.8)';
            navTicking = false;
        });
        navTicking = true;
    }
});

// ========================================
// MOBILE MENU - Hamburger
// ========================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) navLinks.classList.remove('show');
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) navLinks.classList.remove('show');
});
