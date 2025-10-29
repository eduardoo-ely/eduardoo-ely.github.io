// ===============================
// DOM helpers
// ===============================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// ===============================
// Hamburguer (mobile)
// ===============================
const hamburger = $('.hamburger');
const navLinks = $('.nav-links');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ===============================
// Typing effect (starts on load)
// ===============================
const typingEl = $('#typing');
const typingText = "Sou Suporte Técnico 1 na IXC Soft e futuro Analista de Infra e Dados, apaixonado por Cloud e desenvolvimento.";
let ti = 0;
function resetTyping() { typingEl.innerHTML = ''; ti = 0; }
function typeTick() {
    if (!typingEl) return;
    if (ti < typingText.length) {
        typingEl.innerHTML += typingText.charAt(ti);
        ti++;
        setTimeout(typeTick, 45);
    }
}
window.addEventListener('load', () => {
    resetTyping();
    setTimeout(typeTick, 200); // pequeno delay pra hero aparecer
});

// ===============================
// Nome sobe ao topo (vertical) — behavior robusto
// ===============================
const heroName = $('#hero-name');
const hero = document.querySelector('.hero');
let nameIsMoved = false;

function updateHeroNameOnScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const threshold = 120; // quando rolar além disso, o nome sobe
    if (scrollY > threshold && !nameIsMoved) {
        heroName.classList.add('hero-name-top');
        if (hero) hero.classList.add('shrink');
        nameIsMoved = true;
    } else if (scrollY <= threshold && nameIsMoved) {
        heroName.classList.remove('hero-name-top');
        if (hero) hero.classList.remove('shrink');
        nameIsMoved = false;
    }
}
window.addEventListener('scroll', updateHeroNameOnScroll);
window.addEventListener('resize', updateHeroNameOnScroll); // recalcula comportamento se mudar tamanho

// ===============================
// Smooth scroll with header offset
// ===============================
function scrollToWithOffset(targetEl) {
    if (!targetEl) return;
    // calcula offset dinâmico baseado no nome fixo (quando estiver fixo) ou num valor padrão
    const nameFixed = heroName && heroName.classList.contains('hero-name-top');
    const headerHeight = nameFixed ? (heroName.getBoundingClientRect().height + 28) : 24;
    const targetRect = targetEl.getBoundingClientRect();
    const absoluteElementTop = window.pageYOffset + targetRect.top;
    const scrollTo = absoluteElementTop - headerHeight;
    window.scrollTo({ top: scrollTo, behavior: 'smooth' });
}

// intercepta os links do menu (se existirem)
$$('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
            scrollToWithOffset(target);
        }
        // fecha menu mobile se aberto
        if (navLinks && navLinks.classList.contains('open')) navLinks.classList.remove('open');
    });
});

// também, se houver links internos fora do nav, aplica o mesmo comportamento:
$$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            scrollToWithOffset(target);
        }
    });
});

// ===============================
// Fade-in das seções (IntersectionObserver)
// ===============================
const sections = document.querySelectorAll('.section');
if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.28 });
    sections.forEach(s => obs.observe(s));
} else {
    // fallback
    sections.forEach(s => s.classList.add('visible'));
}

// ===============================
// Skills progress animation
// ===============================
const skillsSection = $('#habilidades');
const progressBars = $$('.progress');
if (skillsSection && 'IntersectionObserver' in window) {
    const skillObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressBars.forEach(bar => {
                    const w = bar.getAttribute('data-width') || bar.dataset.width || '60%';
                    bar.style.width = w;
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.45 });
    skillObs.observe(skillsSection);
} else {
    // se não houver seção, apenas preenche nothing
    progressBars.forEach(bar => {
        const w = bar.getAttribute('data-width') || bar.dataset.width || '60%';
        bar.style.width = w;
    });
}

// ===============================
// Navbar color
// ===============================
const nav = document.querySelector('.navbar');
if (nav) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });
}