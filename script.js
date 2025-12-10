const track = document.querySelector('.track');
const carousel = document.querySelector('.carousel');

const speed = 1.2;
const offset = 20;

const cards = [...document.querySelectorAll('.project-card')];
const positions = [];
let paused = false;

let x = 0;
cards.forEach(card => {
  positions.push(x);
  x += card.offsetWidth + offset;
});

cards.forEach(card => {
  const gif = card.dataset.gif;

  card.addEventListener("mouseenter", () => {
    paused = true;
    card.classList.add("hovered");
    card.style.backgroundImage = `url('${gif}')`;
  });

  card.addEventListener("mouseleave", () => {
    paused = false;
    card.classList.remove("hovered");
    card.style.backgroundImage = "";
  });
});

const titulo = document.querySelector('.titulo-container');
const splash = document.querySelector('.splash-line');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    titulo.style.transform = `translateY(${scrollY * 0.3}px)`;
    splash.style.transform = `translateY(${scrollY * 0.1}px)`;
});

// Animación infinita
function update() {
  const carouselRect = carousel.getBoundingClientRect();
  
  cards.forEach((card, i) => {
    const cardWidth = card.offsetWidth;

    // solo mover si no está en hover
    if (!card.classList.contains("hovered")) {
      if(!paused){
        positions[i] -= speed;
      }

      // loop al final
      if (positions[i] + cardWidth < 0) {
        const farRight = Math.max(...positions);
        
        card.classList.add("looping");
        
        positions[i] = farRight + cardWidth + offset;
        card.style.opacity = 0;
        setTimeout(() => {
          card.classList.remove("looping");
        }, 50); 
      }
    }

    const cardRect = card.getBoundingClientRect();
    const visibleWidth = Math.min(cardRect.right, carouselRect.right) - Math.max(cardRect.left, carouselRect.left);
    const ratio = Math.max(0, Math.min(1, visibleWidth / cardWidth));
    const ease = ratio * (2 - ratio);

    const scale = card.classList.contains("hovered") ? 1 : (0.4+0.5 * ease);

    card.style.transform = `translateX(${positions[i]}px) scale(${scale})`;
    card.style.opacity = card.classList.contains("hovered") ? 1 : ease;
    
  });

  requestAnimationFrame(update);
}

update();