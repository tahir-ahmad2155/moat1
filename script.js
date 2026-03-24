// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    lenis.scrollTo(this.getAttribute('href'), { offset: -100 });
  });
});

// GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Initial Load Animation
const tl = gsap.timeline();

tl.to('body', {
  opacity: 1,
  duration: 1.5,
  ease: 'power2.out'
});

// ── New Centered Hero Logo Entrance Animation ──
gsap.from(".hero-center-logo", {
  scale: 0.9,
  y: 30,
  opacity: 0,
  duration: 1.8,
  ease: "power3.out",
  delay: 0.2
});

gsap.to(".ref-card", {
  y: "-15px",
  duration: 2.5,
  yoyo: true,
  repeat: -1,
  ease: "sine.inOut",
  stagger: 0.5
});

// ── Mobile Scroll Scale for Hero Title ──
let mm = gsap.matchMedia();
mm.add("(max-width: 900px)", () => {
  gsap.to(".hero-title", {
    scale: 4.5, // Drastically increased scale factor
    opacity: 0, // Makes it fade out as it zooms toward the screen to look cinematic instead of just stretching infinitely
    transformOrigin: "center center",
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });
});



// ── Hero Scroll Stack Animation ──
(function initScrollStack() {
  const scroller = document.getElementById('heroScrollStack');
  if (!scroller) return;

  const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card'));
  const endElement = scroller.querySelector('.scroll-stack-end');

  // Configuration (matches user's screenshot proportions)
  let itemDistance = 100;
  const itemScale = 0.05;
  let itemStackDistance = 45;
  const baseScale = 0.80;

  let stackPositionPx;
  let scaleEndPositionPx;

  // Track each card's un-transformed layout positions so they don't shift during transform.
  const cardsData = [];

  function updateMetrics() {
    const isMobile = window.innerWidth <= 900;

    itemDistance = isMobile ? 40 : 100;
    itemStackDistance = isMobile ? 25 : 45;

    stackPositionPx = scroller.clientHeight * (isMobile ? 0.10 : 0.35);
    scaleEndPositionPx = scroller.clientHeight * (isMobile ? 0.02 : 0.25);

    // Apply responsive margins before measuring
    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
    });

    // Reset transforms to get true offsets
    cards.forEach(card => { card.style.transform = 'none'; card.style.filter = 'none'; });

    const endTop = endElement.offsetTop;

    for (let i = 0; i < cards.length; i++) {
      cardsData[i] = {
        offsetTop: cards[i].offsetTop,
        triggerStart: cards[i].offsetTop - stackPositionPx - (itemStackDistance * i),
        triggerEnd: cards[i].offsetTop - scaleEndPositionPx,
        pinStart: cards[i].offsetTop - stackPositionPx - (itemStackDistance * i),
        pinEnd: endTop - scroller.clientHeight
      };
    }

    // re-apply
    updateCardTransforms();
  }

  function calculateProgress(scrollTop, start, end) {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }

  function updateCardTransforms() {
    const scrollTop = scroller.scrollTop;

    cards.forEach((card, i) => {
      const data = cardsData[i];
      if (!data) return;

      const scaleProgress = calculateProgress(scrollTop, data.triggerStart, data.triggerEnd);
      const targetScale = baseScale + i * itemScale;
      let scale = 1 - scaleProgress * (1 - targetScale);

      // Make sure the last card stays full size when it comes into the stack
      if (i === cards.length - 1) {
        scale = 1;
      }

      let translateY = 0;
      const isPinned = scrollTop >= data.pinStart && scrollTop <= data.pinEnd;

      if (isPinned) {
        translateY = scrollTop - data.offsetTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > data.pinEnd) {
        translateY = data.pinEnd - data.offsetTop + stackPositionPx + itemStackDistance * i;
      }

      card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
    });
  }

  cards.forEach((card, i) => {
    card.style.willChange = 'transform, filter';
    card.style.transformOrigin = 'top center';
    card.style.backfaceVisibility = 'hidden';
  });

  window.addEventListener('resize', updateMetrics);

  // Local lenis for the scroller
  const scrollerLenis = new Lenis({
    wrapper: scroller,
    content: scroller.querySelector('.scroll-stack-inner'),
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  let scrollThrottle = false;

  scrollerLenis.on('scroll', (e) => {
    updateCardTransforms();

    // Auto-scroll to the next section after completing the card stack
    if (e.progress > 0.98 && e.direction === 1) {
      if (!scrollThrottle) {
        scrollThrottle = true;
        lenis.scrollTo('#offerings', {
          duration: 2.5,
          easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 // easeInOutCubic
        });
        setTimeout(() => { scrollThrottle = false; }, 3000);
      }
    }
  });

  // Fallback: If progress is already at max and user keeps scrolling down
  scroller.addEventListener('wheel', (e) => {
    if (e.deltaY > 0 && scrollerLenis.progress > 0.98) {
      if (!scrollThrottle) {
        scrollThrottle = true;
        lenis.scrollTo('#offerings', {
          duration: 2.5,
          easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 // easeInOutCubic
        });
        setTimeout(() => { scrollThrottle = false; }, 3000);
      }
    }
  });

  function rafScroller(time) {
    scrollerLenis.raf(time);
    requestAnimationFrame(rafScroller);
  }
  requestAnimationFrame(rafScroller);

  // initialization delay to make sure CSS is loaded before calculating offsets
  setTimeout(updateMetrics, 50);

  // Slide in Scroll Stack on load
  const isMobileView = window.innerWidth <= 900;
  gsap.fromTo(scroller,
    { opacity: 0, x: isMobileView ? 0 : 80 },
    { opacity: 1, x: 0, duration: 1.4, ease: 'power3.out', delay: 0.6 }
  );
})();


const floatElements = document.querySelectorAll('.float-card, .feature-panel, .floating-mockup');

floatElements.forEach((el, index) => {
  gsap.to(el, {
    y: '-15px',
    duration: 2 + index * 0.5, // Randomize duration slightly
    yoyo: true,
    repeat: (el.classList.contains('floating-mockup')) ? 0 : -1, // Stop floating if it's the hero mockup
    ease: 'sine.inOut',
    delay: index * 0.2
  });
});

// Scroll Triggers for Sections
const sections = document.querySelectorAll('section:not(.hero)');

sections.forEach(section => {
  // Existing animation for h2, p, stat-card (bottom to top)
  gsap.fromTo(section.querySelectorAll('h2, p, .stat-card'),
    {
      y: 50,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse'
      }
    }
  );

  // New animation for bubbled text (left to right)
  gsap.fromTo(section.querySelectorAll('.perf-list-item, .bubbly-point'),
    {
      x: -100,
      opacity: 0
    },
    {
      x: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse'
      }
    }
  );
});

// ── Cinematic Laptop Animation ──
const laptopLid = document.getElementById('laptopLid');
const laptopScene = document.getElementById('laptopScene');
const laptop = document.getElementById('laptop');

// Open lid when services section scrolls into view
if (laptopLid) {
  ScrollTrigger.create({
    trigger: laptopScene,
    start: 'top 80%',
    onEnter: () => {
      setTimeout(() => laptopLid.classList.add('open'), 400);
    },
    onLeaveBack: () => laptopLid.classList.remove('open'),
  });
}

// Spawn ambient particles
const perfParticles = document.getElementById('perfParticles');
if (perfParticles) {
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'perf-particle';
    const size = Math.random() * 80 + 20;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      top:  ${Math.random() * 100}%;
      --dur: ${Math.random() * 6 + 5}s;
      --tx:  ${(Math.random() - 0.5) * 80}px;
      --ty:  ${(Math.random() - 0.5) * 80}px;
      animation-delay: ${Math.random() * -8}s;
    `;
    perfParticles.appendChild(p);
  }
}

// Mouse tilt on laptop scene
if (laptopScene && laptop) {
  laptopScene.addEventListener('mousemove', (e) => {
    const rect = laptopScene.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / rect.height) * 12;
    const ry = ((e.clientX - cx) / rect.width) * -18;
    gsap.to(laptop, {
      rotateX: 10 + rx,
      rotateY: -20 + ry,
      duration: 1.2,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  });
  laptopScene.addEventListener('mouseleave', () => {
    gsap.to(laptop, {
      rotateX: 10,
      rotateY: -20,
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto'
    });
  });
}


const bgTexts = document.querySelectorAll('.bg-text');
bgTexts.forEach(bg => {
  // Inform GSAP to treat this element's centering strictly as percentages 
  // to avoid pixel conversion bugs on responsive resize
  gsap.set(bg, { yPercent: -50 });

  // Parallax shift crossing exactly through 0 for perfect centering
  gsap.fromTo(bg,
    { y: -150 },
    {
      y: 150,
      ease: 'none',
      scrollTrigger: {
        trigger: bg.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    }
  );
});

// Horizontal Scroll Section
const horizontalSection = document.querySelector('.horizontal-scroll');
const track = document.querySelector('.scroll-track');

if (horizontalSection && track) {
  // Calculate total scroll distance
  const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

  const tween = gsap.to(track, {
    x: getScrollAmount,
    ease: 'none',
    scrollTrigger: {
      trigger: horizontalSection,
      pin: true,
      scrub: 1,
      end: () => `+=${track.scrollWidth - window.innerWidth}`,
      invalidateOnRefresh: true
    }
  });
}

// Subtle Mouse Tilt for Hero Mockup (optional refinement)
const hero = document.querySelector('.hero');
const mockup = document.querySelector('.floating-mockup');

if (hero && mockup) {
  hero.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    gsap.to(mockup, {
      rotateY: x,
      rotateX: -y,
      duration: 1,
      ease: 'power2.out'
    });
  });
}

// Nav glassmorphism on scroll
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  });
}
// Case Study Flip Logic
document.querySelectorAll('.scroll-panel').forEach(panel => {
  panel.addEventListener('click', (e) => {
    // Only toggle if the click isn't on a standard link (if any were present)
    panel.classList.toggle('flipped');
});
});

// Mobile Hamburger Menu Logic
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksAnchors = document.querySelectorAll('.nav-links a');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Change icon to 'X' when open
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    } else {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  });

  // Close menu when clicking any link
  navLinksAnchors.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = hamburger.querySelector('i');
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    });
  });
}
