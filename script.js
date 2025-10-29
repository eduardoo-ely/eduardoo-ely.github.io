// === SCROLL SUAVE COM AJUSTE DO OFFSET ===
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        const yOffset = -80; // faz parar um pouco antes do título
        const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        if (navLinks.classList.contains('open')) navLinks.classList.remove('open');
    });
});

// === FADE-IN DAS SEÇÕES ===
const sections = document.querySelectorAll('.section');
const observerOptions = { threshold: 0.3 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);
sections.forEach(section => observer.observe(section));

// === ANIMAÇÃO DAS BARRAS DE HABILIDADE ===
const skillsSection = document.getElementById('habilidades');
const progressBars = document.querySelectorAll('.progress');
const skillsObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            progressBars.forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
skillsObserver.observe(skillsSection);

// === NAVBAR MUDA COR AO ROLAR ===
const nav = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});