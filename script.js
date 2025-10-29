// ===============================
// MENU MOBILE (Hamburger Toggle)
// ===============================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});


// ===============================
// EFEITO DE DIGITAÇÃO
// ===============================
const typingText = "Sou Suporte Técnico I na IXC Soft e futuro Analista de Infra e Dados, apaixonado por Cloud e desenvolvimento.";
let i = 0;

function type() {
    if (i < typingText.length) {
        document.getElementById('typing').innerHTML += typingText.charAt(i);
        i++;
        setTimeout(type, 45);
    }
}
window.addEventListener("load", type);


// ===============================
// EFEITO: NOME SOBE PARA O TOPO
// ===============================
const heroName = document.getElementById('hero-name');
const hero = document.querySelector('.hero');
let nameMoved = false;

window.addEventListener('scroll', () => {
    if (window.scrollY > 120 && !nameMoved) {
        heroName.classList.add('hero-name-top');
        hero.classList.add('shrink');
        nameMoved = true;
    } else if (window.scrollY <= 120 && nameMoved) {
        heroName.classList.remove('hero-name-top');
        hero.classList.remove('shrink');
        nameMoved = false;
    }
});


// ===============================
// SCROLL SUAVE ENTRE SEÇÕES
// ===============================
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });

        // Fecha menu mobile após clicar
        if (navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
        }
    });
});


// ===============================
// FADE-IN DAS SEÇÕES
// ===============================
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


// ===============================
// ANIMAÇÃO DAS SKILLS
// ===============================
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

if (skillsSection) skillsObserver.observe(skillsSection);


// ===============================
// NAVBAR MUDA COR AO ROLAR
// ===============================
const nav = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});