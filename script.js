/* Ridoy Portfolio - Pro Animated JavaScript */

// Preloader
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    if (preloader) preloader.classList.add("hide");
  }, 650);
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}

// Typing role animation
const typingEl = document.getElementById("typingRole");

if (typingEl) {
  const roles = typingEl.dataset.roles.split(",");
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeRole() {
    const current = roles[roleIndex];

    if (!deleting) {
      typingEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeRole, 1200);
        return;
      }
    } else {
      typingEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(typeRole, deleting ? 58 : 95);
  }

  typeRole();
}

// Open project
function openProject(element) {
  const link = element.getAttribute("data-link");
  if (link) window.location.href = link;
}

// Video modal
function openVideo(event) {
  if (event) event.preventDefault();

  const modal = document.getElementById("videoModal");
  const video = document.getElementById("projectVideo");

  if (modal) {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  }

  if (video) video.play();
}

function closeVideo() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("projectVideo");

  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  if (video) {
    video.pause();
    video.currentTime = 0;
  }
}

window.openProject = openProject;
window.openVideo = openVideo;
window.closeVideo = closeVideo;

const videoModal = document.getElementById("videoModal");
if (videoModal) {
  videoModal.addEventListener("click", (e) => {
    if (e.target === videoModal) closeVideo();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeVideo();
});

// Scroll progress
const scrollProgress = document.getElementById("scrollProgress");

function updateScrollProgress() {
  if (!scrollProgress) return;

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  scrollProgress.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateScrollProgress);
updateScrollProgress();

// Active nav link on scroll
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll("#navLinks a");

function updateActiveNav() {
  let currentId = "home";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 130;
    if (window.scrollY >= sectionTop) currentId = section.id;
  });

  navItems.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
}

window.addEventListener("scroll", updateActiveNav);
updateActiveNav();

// Reveal animation
const revealItems = document.querySelectorAll(".reveal-up, .reveal-zoom");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.15 });

revealItems.forEach(item => revealObserver.observe(item));

// Contact form mailto

document.getElementById("contactForm").addEventListener("submit", function(e){
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const formMsg = document.getElementById("formMsg");

if(!name || !email || !message){
  formMsg.textContent = "すべての項目を入力してください。";
  formMsg.className = "form-msg error";
  return;
}

  const subject = encodeURIComponent("ポートフォリオからのお問い合わせ");
  const body = encodeURIComponent(
`お名前: ${name}
メールアドレス: ${email}

メッセージ:
${message}`
  );

  // 🔥 Instant open mail app
  window.location.href = `mailto:freelancerridoy001@gmail.com?subject=${subject}&body=${body}`;

  // optional reset
  this.reset();
});


// Magnetic hover
document.querySelectorAll(".magnet").forEach(el => {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  });

  el.addEventListener("mouseleave", () => {
    el.style.transform = "";
  });
});

// 3D tilt cards
document.querySelectorAll(".tilt-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((y / rect.height) - 0.5) * -10;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// Particle background with lines
const canvas = document.getElementById("particlesCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
let particles = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  if (!canvas) return;

  const amount = window.innerWidth < 700 ? 45 : 85;

  particles = Array.from({ length: amount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.7,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45
  }));
}

function drawParticles() {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(96,165,250,0.70)";
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(96,165,250,${0.12 * (1 - dist / 120)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawParticles);
}

if (canvas && ctx) {
  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });
}


// Contact button smooth jump
const contactBtn = document.getElementById("contactBtn");
if (contactBtn) {
  contactBtn.addEventListener("click", () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  });
}

// Premium navbar shadow/background on scroll
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if (!nav) return;

  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
}, { passive: true });
