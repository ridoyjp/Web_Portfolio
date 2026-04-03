// ================== Typing Effect ==================
const text = "ようこそ、バングラデシュへ";
let i = 0;

function typing() {
  const el = document.getElementById("typing");
  if (!el) return;

  if (i < text.length) {
    el.innerHTML += text.charAt(i);
    i++;
    setTimeout(typing, 80);
  }
}

window.addEventListener("load", typing);

// ================== Scroll Animation ==================
const reveals = document.querySelectorAll(".section, .card");

function revealOnScroll() {
  const height = window.innerHeight;

  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;

    if (top < height - 100) {
      el.classList.add("reveal", "active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// ================== Menu Active ==================
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".menu a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const top = section.offsetTop - 120;

    if (scrollY >= top) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// ================== Button Ripple ==================
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", function(e) {
    const circle = document.createElement("span");
    const rect = this.getBoundingClientRect();

    circle.style.left = e.clientX - rect.left + "px";
    circle.style.top = e.clientY - rect.top + "px";

    this.appendChild(circle);

    setTimeout(() => circle.remove(), 600);
  });
});