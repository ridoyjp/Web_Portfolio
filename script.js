// ===== Smooth scroll + Active link on scroll + Scroll progress + Extra animations =====

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("navLinks");
  const links = nav ? nav.querySelectorAll('a[href^="#"]') : [];
  const sections = [...links]
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  // Contact button -> contact section
  const contactBtn = document.getElementById("contactBtn");
  if (contactBtn) {
    contactBtn.addEventListener("click", () => {
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Smooth scroll for nav links
  links.forEach(a => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", a.getAttribute("href"));
    });
  });

  // Active link while scrolling
  const setActive = () => {
    const y = window.scrollY + 120; // offset for sticky navbar
    let currentId = sections[0]?.id || "home";
    for (const sec of sections) {
      if (sec.offsetTop <= y) currentId = sec.id;
    }
    links.forEach(a => {
      const isActive = a.getAttribute("href") === `#${currentId}`;
      a.classList.toggle("active", isActive);
    });
  };

  // Scroll progress bar
  const progress = document.getElementById("scrollProgress");
  const setProgress = () => {
    if (!progress) return;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progress.style.width = pct + "%";
  };

  window.addEventListener("scroll", () => {
    setActive();
    setProgress();
  });

  setActive();
  setProgress();

  // ===================== 1) Particles Background =====================
  const canvas = document.getElementById("particlesCanvas");
  const ctx = canvas?.getContext("2d");
  let W = 0, H = 0;

  function resizeCanvas(){
    if (!canvas) return;
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const particles = [];
  const COUNT = 70;

  function rand(min, max){ return Math.random() * (max - min) + min; }

  function initParticles(){
    particles.length = 0;
    for (let i=0; i<COUNT; i++){
      particles.push({
        x: rand(0, W),
        y: rand(0, H),
        r: rand(0.8, 2.2),
        vx: rand(-0.25, 0.25),
        vy: rand(-0.18, 0.18),
      });
    }
  }
  initParticles();

  function drawParticles(){
    if (!canvas || !ctx) return;
    ctx.clearRect(0,0,W,H);

    // dots
    for (const p of particles){
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = "rgba(96,165,250,0.65)";
      ctx.fill();
    }

    // lines (nearby)
    for (let i=0; i<particles.length; i++){
      for (let j=i+1; j<particles.length; j++){
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 140){
          const alpha = (1 - d/140) * 0.35;
          ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  // ===================== 3) Magnetic buttons =====================
  const magnetic = document.querySelectorAll(".btn, .send-btn, .back-top-btn");
  magnetic.forEach(el => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });

  // ===================== 4) Reveal animation for sections =====================
  const revealTargets = document.querySelectorAll(
    ".about-section, .skills-section, .contact-section, .work-section"
  );
  revealTargets.forEach(el => el.classList.add("reveal-up"));

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting){
        entry.target.classList.add("show");
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => revealObs.observe(el));

  // ===================== 5) 3D tilt on work cards =====================
  const workCards = document.querySelectorAll(".work-card");

  workCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      const rx = ((y / r.height) - 0.5) * -10; // rotateX
      const ry = ((x / r.width) - 0.5) * 12;  // rotateY

      card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // ===================== Existing: Work cards reveal (stagger) =====================
  const revealCards = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("show"), i * 120);
        revealCards.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  workCards.forEach(card => revealCards.observe(card));

  // ===================== Existing: Modal (auto create) =====================
  const modalHTML = `
    <div class="work-modal" id="workModal" aria-hidden="true">
      <div class="work-modal-overlay" id="workModalOverlay"></div>
      <div class="work-modal-box" role="dialog" aria-modal="true">
        <button class="work-modal-close" id="workModalClose" aria-label="Close">✕</button>
        <div class="work-modal-media">
          <img id="workModalImg" src="" alt="">
        </div>
        <div class="work-modal-body">
          <h3 id="workModalTitle"></h3>
          <p id="workModalDesc"></p>
          <a class="work-modal-btn" id="workModalLink" target="_blank" rel="noopener">View Project</a>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modalCSS = `
    .work-modal{ position:fixed; inset:0; display:none; z-index:9999; }
    .work-modal.open{ display:grid; place-items:center; }
    .work-modal-overlay{ position:absolute; inset:0; background:rgba(0,0,0,.65); backdrop-filter:blur(6px); }
    .work-modal-box{
      position:relative; width:min(920px,92vw); border-radius:18px; overflow:hidden;
      background:rgba(18,18,34,.92); border:1px solid rgba(255,255,255,.10);
      box-shadow:0 25px 80px rgba(0,0,0,.55);
      display:grid; grid-template-columns:1.2fr 1fr;
      animation:pop .22s ease;
    }
    @keyframes pop{ from{ transform:translateY(10px) scale(.98); opacity:0; } to{ transform:translateY(0) scale(1); opacity:1; } }
    .work-modal-media img{ width:100%; height:100%; object-fit:cover; min-height:360px; display:block; }
    .work-modal-body{ padding:24px; text-align:left; color:#fff; }
    .work-modal-body h3{ margin:0 0 10px; font-size:24px; font-weight:800; }
    .work-modal-body p{ margin:0 0 18px; color:rgba(255,255,255,.75); line-height:1.6; font-size:14px; }
    .work-modal-btn{
      display:inline-block; padding:10px 16px; border-radius:999px; background:#ff4c60;
      color:#fff; text-decoration:none; font-weight:700; font-size:14px;
    }
    .work-modal-close{
      position:absolute; top:12px; right:12px; width:42px; height:42px; border-radius:12px;
      border:1px solid rgba(255,255,255,.14); background:rgba(255,255,255,.06);
      color:#fff; cursor:pointer;
    }
    @media(max-width:820px){
      .work-modal-box{ grid-template-columns:1fr; }
      .work-modal-media img{ min-height:240px; }
    }
  `;
  const styleTag = document.createElement("style");
  styleTag.textContent = modalCSS;
  document.head.appendChild(styleTag);

  const modal = document.getElementById("workModal");
  const overlay = document.getElementById("workModalOverlay");
  const closeBtn = document.getElementById("workModalClose");
  const mImg = document.getElementById("workModalImg");
  const mTitle = document.getElementById("workModalTitle");
  const mDesc = document.getElementById("workModalDesc");
  const mLink = document.getElementById("workModalLink");

  function openModal(card){
    const img = card.querySelector("img");
    mImg.src = img?.src || "";
    mImg.alt = img?.alt || card.dataset.title || "Project";
    mTitle.textContent = card.dataset.title || "Project";
    mDesc.textContent = card.dataset.desc || `Category: ${card.dataset.type || ""}`;
    mLink.href = card.dataset.link || "#";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }
  function closeModal(){
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }

  workCards.forEach(card => card.addEventListener("click", () => openModal(card)));
  overlay.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });


  // ===== Continuous Typing + Changing Text =====
const typingEl = document.getElementById("typingRole");

if (typingEl) {
  const words = typingEl.dataset.roles.split(",");
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentWord = words[wordIndex].trim();

    if (!isDeleting) {
      typingEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentWord.length) {
        setTimeout(() => isDeleting = true, 1000);
      }
    } else {
      typingEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    setTimeout(typeEffect, isDeleting ? 60 : 100);
  }

  typeEffect();
}


// Footer year
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();
});// ================= VIDEO MODAL FIX =================

function openVideo(e){
  e.preventDefault();
  e.stopPropagation(); // parent click বন্ধ করবে

  const modal = document.getElementById("videoModal");
  const video = document.getElementById("projectVideo");

  if(!modal || !video) return;

  modal.classList.add("active");

  video.currentTime = 0;
  video.play();
}

function closeVideo(){
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("projectVideo");

  if(!modal || !video) return;

  modal.classList.remove("active");
  video.pause();
}


// ===== বাইরে ক্লিক করলে বন্ধ হবে =====
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("videoModal");

  if(modal){
    modal.addEventListener("click", function(e){
      if(e.target.id === "videoModal"){
        closeVideo();
      }
    });
  }
});