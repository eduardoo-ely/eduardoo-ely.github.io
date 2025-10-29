// Scroll suave e highlight (opcional)
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Digitação hero
const text = "Sou Suporte Técnico & Desenvolvedor";
let index = 0;
function type() {
    if(index < text.length){
        document.getElementById('typing').innerHTML += text.charAt(index);
        index++;
        setTimeout(type, 100);
    }
}
type();

// Habilidades animação
window.addEventListener('scroll', () => {
    const skills = document.querySelectorAll('.progress');
    const triggerBottom = window.innerHeight - 50;
    skills.forEach(skill => {
        const skillTop = skill.getBoundingClientRect().top;
        if(skillTop < triggerBottom){
            skill.style.width = skill.style.width || skill.getAttribute('style').split(':')[1];
        }
    });
});
