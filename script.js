/* =============================================
   SCRIPT.JS — Toda a interatividade e animações do portfólio
   Autor: Hugo Dias
   ============================================= */

// Aguarda o carregamento completo do DOM antes de executar qualquer função
document.addEventListener('DOMContentLoaded', () => {

  /* =============================================
     EFEITO TYPEWRITER — Digita e apaga títulos automaticamente
     Alterna entre diferentes títulos/funções com efeito de digitação
     ============================================= */
  const typewriterElement = document.getElementById('typewriter');
  // Lista de títulos que serão alternados no efeito de digitação
  const titles = [
    'Desenvolvedor Full Stack',
    'Criador de Soluções',
    'Entusiasta de Tecnologia',
  ];
  let titleIndex = 0; // Índice do título atual na lista
  let charIndex = 0;  // Índice do caractere sendo digitado/apagado
  let isDeleting = false; // Controle: true = apagando, false = digitando
  let typingSpeed = 100; // Velocidade base de digitação em milissegundos

  /**
   * Função que controla o efeito de digitação (typewriter)
   * Digita o título caractere por caractere, pausa, depois apaga
   * e passa para o próximo título da lista
   */
  function typeWriter() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      // Modo apagar: remove um caractere por vez
      typewriterElement.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Apagar é mais rápido que digitar
    } else {
      // Modo digitar: adiciona um caractere por vez
      typewriterElement.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    // Quando terminou de digitar o título completo
    if (!isDeleting && charIndex === currentTitle.length) {
      typingSpeed = 2000; // Pausa de 2 segundos antes de apagar
      isDeleting = true;
    }
    // Quando terminou de apagar todo o título
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length; // Avança para o próximo título
      typingSpeed = 400; // Pequena pausa antes de começar o próximo
    }

    setTimeout(typeWriter, typingSpeed);
  }

  // Inicia o efeito typewriter
  typeWriter();

  /* =============================================
     MENU HAMBÚRGUER — Abre/fecha o menu mobile
     ============================================= */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  /**
   * Alterna a classe 'active' no botão hambúrguer e no menu
   * Isso dispara as animações CSS de abertura/fechamento
   */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Fecha o menu mobile ao clicar em qualquer link de navegação
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  /* =============================================
     NAVBAR — Efeito de fundo ao rolar e destaque da aba ativa
     ============================================= */
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('backToTop');

  /**
   * Listener de scroll que controla:
   * 1. Fundo da navbar (adiciona sombra ao rolar)
   * 2. Destaque da aba ativa conforme a seção visível
   * 3. Visibilidade do botão "voltar ao topo"
   */
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Adiciona classe 'scrolled' na navbar após rolar 50px
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Destaque da aba ativa: verifica qual seção está visível na viewport
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    // Atualiza a classe 'active' nos links de navegação
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      }
    });

    // Mostra/esconde o botão "voltar ao topo" após 300px de scroll
    if (scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  /* =============================================
     BOTÃO VOLTAR AO TOPO — Scroll suave para o início
     ============================================= */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =============================================
     ANIMAÇÕES DE ENTRADA — IntersectionObserver
     Elementos com classe 'animate-on-scroll' aparecem ao entrar na viewport
     ============================================= */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  /**
   * Observer que detecta quando elementos entram na viewport
   * e adiciona a classe 'visible' para disparar a animação CSS
   * threshold: 0.1 = dispara quando 10% do elemento está visível
   */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Adiciona um atraso escalonado para criar efeito cascata
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target); // Para de observar após animar
      }
    });
  }, { threshold: 0.1 });

  // Registra todos os elementos que devem ser animados
  animatedElements.forEach(el => observer.observe(el));

  /* =============================================
     BARRAS DE PROGRESSO — Animação ao entrar na viewport
     ============================================= */
  const progressBars = document.querySelectorAll('.progress');

  /**
   * Observer específico para barras de progresso
   * Define a largura da barra com base no atributo data-width
   */
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => progressObserver.observe(bar));

  /* =============================================
     CARROSSEL DE IMAGENS DOS PROJETOS
     Inicializa cada carrossel com navegação por setas, dots e clique na imagem
     ============================================= */
  const carousels = document.querySelectorAll('.project-carousel');

  /**
   * Inicializa um carrossel individual
   * Cria os dots de navegação, configura setas e clique nas imagens
   * @param {HTMLElement} carousel - O elemento .project-carousel
   */
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const expandBtn = carousel.querySelector('.carousel-expand');
    let currentIndex = 0;

    // Gera os indicadores (dots) automaticamente com base no número de imagens
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Imagem ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    /**
     * Move o carrossel para o slide especificado
     * Atualiza a posição do track e o dot ativo
     * @param {number} index - Índice do slide desejado
     */
    function goToSlide(index) {
      currentIndex = index;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    // Seta anterior: volta um slide, ou vai para o último se estiver no primeiro
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const newIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
      goToSlide(newIndex);
    });

    // Seta próximo: avança um slide, ou volta ao primeiro se estiver no último
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const newIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
      goToSlide(newIndex);
    });

    // Clicar na imagem abre o lightbox
    slides.forEach((slide, i) => {
      slide.addEventListener('click', () => {
        openLightbox(carousel, i);
      });
    });

    // Botão de expandir abre o lightbox na imagem atual
    expandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(carousel, currentIndex);
    });
  });

  /* =============================================
     LIGHTBOX — Modal de visualização em tela cheia
     Permite navegar entre imagens do projeto e fechar com X ou Escape
     ============================================= */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');
  const lightboxBackdrop = lightbox.querySelector('.lightbox-backdrop');

  let lightboxSlides = []; // Array de src das imagens do projeto atual
  let lightboxIndex = 0;   // Índice da imagem atualmente exibida

  /**
   * Abre o lightbox com as imagens de um carrossel específico
   * @param {HTMLElement} carousel - O carrossel de origem
   * @param {number} startIndex - Índice da imagem para exibir primeiro
   */
  function openLightbox(carousel, startIndex) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    lightboxSlides = Array.from(slides).map(s => s.src);
    lightboxIndex = startIndex;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Impede scroll do body
  }

  /** Fecha o lightbox e restaura o scroll do body */
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  /** Atualiza a imagem exibida e o contador (ex: "2 / 3") */
  function updateLightboxImage() {
    lightboxImg.src = lightboxSlides[lightboxIndex];
    lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxSlides.length}`;
  }

  // Fechar o lightbox ao clicar no X ou no fundo
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);

  // Navegação no lightbox: anterior e próximo
  lightboxPrev.addEventListener('click', () => {
    lightboxIndex = lightboxIndex > 0 ? lightboxIndex - 1 : lightboxSlides.length - 1;
    updateLightboxImage();
  });

  lightboxNext.addEventListener('click', () => {
    lightboxIndex = lightboxIndex < lightboxSlides.length - 1 ? lightboxIndex + 1 : 0;
    updateLightboxImage();
  });

  // Navegação por teclado: setas esquerda/direita e Escape para fechar
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      lightboxIndex = lightboxIndex > 0 ? lightboxIndex - 1 : lightboxSlides.length - 1;
      updateLightboxImage();
    }
    if (e.key === 'ArrowRight') {
      lightboxIndex = lightboxIndex < lightboxSlides.length - 1 ? lightboxIndex + 1 : 0;
      updateLightboxImage();
    }
  });


  /* =============================================
     PARTÍCULAS ANIMADAS — Canvas no fundo da seção Hero
     Cria pontos flutuantes com linhas de conexão entre eles
     ============================================= */
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 60; // Número de partículas (reduzido no mobile)
  let mouse = { x: null, y: null }; // Posição do mouse para interação

  /**
   * Ajusta o tamanho do canvas para preencher a seção Hero
   * Chamado no load e no resize da janela
   */
  function resizeCanvas() {
    const heroSection = document.querySelector('.hero-section');
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Rastreia posição do mouse para efeito de interação com partículas
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  /**
   * Classe Particle — Representa uma partícula individual
   * Cada partícula tem posição, velocidade, tamanho e opacidade
   */
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    /**
     * Atualiza a posição da partícula a cada frame
     * Rebate nas bordas do canvas para manter as partículas visíveis
     */
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Rebater nas bordas
      if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
      if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }

    /** Desenha a partícula como um círculo no canvas */
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  /** Inicializa o array de partículas */
  function initParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? 30 : particleCount;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  /**
   * Desenha linhas de conexão entre partículas próximas
   * A opacidade da linha diminui com a distância (efeito sutil)
   */
  function connectParticles() {
    const maxDist = 120;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = 1 - dist / maxDist;
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  /**
   * Loop de animação principal das partículas
   * Limpa o canvas, atualiza e redesenha todas as partículas a cada frame
   */
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  // Inicializa e anima as partículas
  initParticles();
  animateParticles();

  // Recria partículas ao redimensionar a janela
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

});
