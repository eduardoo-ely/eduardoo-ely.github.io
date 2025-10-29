// Hamburger toggle para mobile
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Efeito do nome subindo pro topo sem sobrepor o conteúdo
const heroName = document.getElementById('hero-name');
const hero = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        heroName.classList.add('hero-name-top');
        hero.classList.add('shrink');
    } else {
        heroName.classList.remove('hero-name-top');
        hero.classList.remove('shrink');
    }
});

// Scroll suave para as seções
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
        if(navLinks.classList.contains('open')){
            navLinks.classList.remove('open'); // Fecha menu mobile
        }
    });
});

// Fade-in das seções
const sections = document.querySelectorAll('.section');
const observerOptions = { threshold: 0.3 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);
sections.forEach(section => observer.observe(section));

// Animação de digitação no hero
const typingText = "Sou Suporte Técnico 1 na IXC Soft e futuro Analista de Infra e Dados, apaixonado por Cloud e desenvolvimento.";
let i = 0;
function type() {
    if(i < typingText.length){
        document.getElementById('typing').innerHTML += typingText.charAt(i);
        i++;
        setTimeout(type, 50); // velocidade da digitação
    }
}
type();

// Progress bars animando ao entrar na seção
const skillsSection = document.getElementById('habilidades');
const progressBars = document.querySelectorAll('.progress');
const skillsObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            progressBars.forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
skillsObserver.observe(skillsSection);

// Navbar muda cor ao rolar
const nav = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if(window.scrollY > 50){
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});