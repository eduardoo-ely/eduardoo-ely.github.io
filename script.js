// Hamburger toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Smooth section reveal on scroll (IntersectionObserver)
const sections = document.querySelectorAll('.section');
const options = {
    threshold: 0.3
};
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, options);
sections.forEach(section => {
    observer.observe(section);
});

// Typing effect in hero
const text = "Sou Suporte Técnico & Desenvolvedor Front‑End focado em soluções práticas.";
let index = 0;
function type(){
    if(index < text.length){
        document.getElementById('typing').innerHTML += text.charAt(index);
        index++;
        setTimeout(type, 100);
    }
}
type();

// Progress bars animation when skills section visible
const skillsSection = document.getElementById('habilidades');
const progressBars = document.querySelectorAll('.progress');
const skillObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            progressBars.forEach(bar => {
                bar.style.width = bar.getAttribute('data‑width');
            });
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
skillObserver.observe(skillsSection);

// Change navbar background on scroll
const nav = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if(window.scrollY > 50){
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});
