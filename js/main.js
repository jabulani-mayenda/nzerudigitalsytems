/* ==========================================================================
   NZERU DIGITAL SERVICES — INTERACTIVE JAVASCRIPT (V3)
   GSAP + ScrollTrigger + Lenis Smooth Scroll + Network Canvas + Products Showcase
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. LENIS SMOOTH SCROLLING SETUP (Heavy, Buttery Scroll)
     -------------------------------------------------------------------------- */
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0, 0);
    }
  }

  /* --------------------------------------------------------------------------
     2. STICKY NAV & MOBILE MENU
     -------------------------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileCloseLinks = document.querySelectorAll('[data-close]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  if (navToggle && mobileOverlay) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      mobileOverlay.classList.toggle('active');
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });

    mobileCloseLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* Smooth anchor scroll */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetElem, { offset: -70 });
        } else {
          targetElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     3. HERO SAAS LOAD ANIMATION SEQUENCE (GSAP)
     -------------------------------------------------------------------------- */
  if (typeof gsap !== 'undefined') {
    const heroTl = gsap.timeline({ delay: 0.1 });

    heroTl.fromTo('.nav', 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
    .fromTo('[data-hero-reveal="0"]', 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4'
    )
    .fromTo('.hl-line', 
      { opacity: 0, y: 35, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.12, ease: 'power3.out' }, '-=0.3'
    )
    .fromTo('[data-hero-reveal="2"]', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4'
    )
    .fromTo('[data-hero-reveal="3"] .btn', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.4'
    )
    .fromTo('[data-hero-reveal="4"]', 
      { opacity: 0, scale: 0.92, y: 40, filter: 'blur(10px)' },
      { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out' }, '-=0.6'
    );
  }

  /* --------------------------------------------------------------------------
     4. SIGNATURE PRODUCTS SHOWCASE — GSAP SCROLLTRIGGER PINNED
     -------------------------------------------------------------------------- */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const isDesktop = window.innerWidth > 768;

    if (isDesktop) {
      const section = document.querySelector('.products-section');
      const layers = gsap.utils.toArray('.product-layer');
      const dots = document.querySelectorAll('.p-dot');
      const counterCurrent = document.getElementById('pc-current');

      if (section && layers.length > 0) {

        gsap.set(layers[0], { opacity: 1, visibility: 'visible', scale: 1, y: 0, filter: 'blur(0px)' });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=300%',
            pin: '.products-sticky',
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              let activeIdx = 0;
              if (progress < 0.28) activeIdx = 0;
              else if (progress < 0.58) activeIdx = 1;
              else if (progress < 0.85) activeIdx = 2;
              else activeIdx = 3;

              if (counterCurrent) counterCurrent.textContent = `0${activeIdx + 1}`;

              dots.forEach((dot, idx) => {
                if (idx === activeIdx) {
                  dot.classList.add('active');
                  dot.setAttribute('aria-selected', 'true');
                } else {
                  dot.classList.remove('active');
                  dot.setAttribute('aria-selected', 'false');
                }
              });
            }
          }
        });

        // 01 -> 02
        tl.to(layers[0], { opacity: 0, scale: 0.94, y: -40, filter: 'blur(10px)', duration: 1, ease: 'power2.inOut' }, 0);
        tl.fromTo(layers[1], 
          { opacity: 0, scale: 0.94, y: 40, filter: 'blur(10px)', visibility: 'visible' },
          { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.inOut' }, 0.2
        );

        // 02 -> 03
        tl.to(layers[1], { opacity: 0, scale: 0.94, y: -40, filter: 'blur(10px)', duration: 1, ease: 'power2.inOut' }, 1.2);
        tl.fromTo(layers[2], 
          { opacity: 0, scale: 0.94, y: 40, filter: 'blur(10px)', visibility: 'visible' },
          { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.inOut' }, 1.4
        );

        // 03 -> 04
        tl.to(layers[2], { opacity: 0, scale: 0.94, y: -40, filter: 'blur(10px)', duration: 1, ease: 'power2.inOut' }, 2.4);
        tl.fromTo(layers[3], 
          { opacity: 0, scale: 0.94, y: 40, filter: 'blur(10px)', visibility: 'visible' },
          { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.inOut' }, 2.6
        );

        dots.forEach((dot, idx) => {
          dot.addEventListener('click', () => {
            const st = tl.scrollTrigger;
            if (st) {
              const targetProgress = idx * 0.31;
              const scrollTarget = st.start + (st.end - st.start) * targetProgress;
              if (lenis) {
                lenis.scrollTo(scrollTarget);
              } else {
                window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
              }
            }
          });
        });
      }
    }
  }

  /* --------------------------------------------------------------------------
     5. NETWORK CANVAS VISUALIZATION (Systems → Data → People → Decisions)
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('networkCanvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.clientWidth;
    let height = canvas.height = canvas.parentElement.clientHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initNodes();
    });

    const nodes = [];
    const nodeCount = 28;
    const labels = ["Systems", "Data", "People", "Decisions", "APIs", "Cyber", "Cloud", "AI"];

    function initNodes() {
      nodes.length = 0;
      for (let i = 0; i < nodeCount; i++) {
        const type = i % 5 === 0 ? 'red' : (i % 2 === 0 ? 'teal' : 'white');
        nodes.push({
          x: Math.random() * (width - 60) + 30,
          y: Math.random() * (height - 60) + 30,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: type === 'red' ? 6 : Math.random() * 2.5 + 2.5,
          type: type,
          label: i < labels.length ? labels[i] : null,
          pulse: Math.random() * Math.PI
        });
      }
    }

    initNodes();

    function drawNetwork() {
      ctx.clearRect(0, 0, width, height);

      // Draw background grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            if (nodes[i].type === 'red' || nodes[j].type === 'red') {
              ctx.strokeStyle = `rgba(194, 26, 3, ${alpha * 1.5})`;
            } else {
              ctx.strokeStyle = `rgba(158, 181, 184, ${alpha})`;
            }
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update & draw nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 20 || node.x > width - 20) node.vx *= -1;
        if (node.y < 20 || node.y > height - 20) node.vy *= -1;

        node.pulse += 0.03;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        if (node.type === 'red') {
          ctx.fillStyle = '#C21A03';
          ctx.shadowColor = '#C21A03';
          ctx.shadowBlur = 12 + Math.sin(node.pulse) * 6;
        } else if (node.type === 'teal') {
          ctx.fillStyle = '#00bcd4';
          ctx.shadowColor = '#00bcd4';
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Label for key nodes
        if (node.label) {
          ctx.fillStyle = 'rgba(217, 226, 227, 0.7)';
          ctx.font = '600 10px Inter, sans-serif';
          ctx.fillText(node.label, node.x + 10, node.y + 3);
        }
      });

      requestAnimationFrame(drawNetwork);
    }

    drawNetwork();
  }

  /* --------------------------------------------------------------------------
     6. SERVICES ACCORDION
     -------------------------------------------------------------------------- */
  const serviceRows = document.querySelectorAll('.service-row');
  serviceRows.forEach(row => {
    row.addEventListener('click', () => {
      const isOpen = row.classList.contains('open');
      serviceRows.forEach(r => r.classList.remove('open'));
      if (!isOpen) {
        row.classList.add('open');
      }
    });
  });

  if (serviceRows.length > 0) {
    serviceRows[0].classList.add('open');
  }

  /* --------------------------------------------------------------------------
     7. SCROLL REVEAL OBSERVER
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  console.log('Nzeru Digital Services website loaded successfully.');
});
