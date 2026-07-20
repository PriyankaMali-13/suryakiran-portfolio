/* =============================================
   SURYAKIRAN MALI — PORTFOLIO SCRIPTS
   ============================================= */

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach((s) => observer.observe(s));

// Typewriter for hero role
const roles = ['Founder & AI Creative Director', 'Visual Storyteller', 'AI Creative Strategist'];
let roleIdx = 0, charIdx = 0, deleting = false;
const roleEl = document.getElementById('heroRole');

function typeRole() {
  if (!roleEl) return;
  const current = roles[roleIdx];
  if (!deleting) {
    roleEl.innerHTML = current.substring(0, charIdx + 1) + '<span class="cursor-blink"></span>';
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeRole, 2000);
      return;
    }
  } else {
    roleEl.innerHTML = current.substring(0, charIdx - 1) + '<span class="cursor-blink"></span>';
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 50 : 80);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(typeRole, 600);

  // About section side panel: hide when a non-whoiam tab is active
  const expSidePanel = document.getElementById('expSidePanel');
  if (expSidePanel) {
    document.querySelectorAll('#aboutTabs .nav-link').forEach((tab) => {
      tab.addEventListener('shown.bs.tab', (e) => {
        const target = e.target.getAttribute('data-bs-target');
        expSidePanel.style.display = target === '#tab-whoiam' ? '' : 'none';
      });
    });
  }
});

// Contact form AJAX
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnText = form.querySelector('.btn-text');
    const btnLoading = form.querySelector('.btn-loading');
    const msgDiv = document.getElementById('formMsg');

    btnText.classList.add('d-none');
    btnLoading.classList.remove('d-none');
    msgDiv.classList.add('d-none');

    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.value,
          email: form.email.value,
          message: form.message.value,
        }),
      });
      const data = await res.json();
      msgDiv.className = 'mt-3 alert alert-success py-2 px-3';
      msgDiv.textContent = data.message || 'Message sent!';
      form.reset();
    } catch {
      msgDiv.className = 'mt-3 alert alert-danger py-2 px-3';
      msgDiv.textContent = 'Something went wrong. Please try again.';
    } finally {
      btnText.classList.remove('d-none');
      btnLoading.classList.add('d-none');
    }
  });
}

// ---- Lightbox ----
function openLightbox(url, type) {
  const lb = document.getElementById('lightbox');
  const mediaEl = document.getElementById('lightboxMedia');
  mediaEl.innerHTML = type === 'video'
    ? `<video controls autoplay playsinline style="width:100%;max-height:80vh"><source src="${url}" type="video/mp4"></video>`
    : `<img src="${url}" alt="" style="width:100%;max-height:80vh;object-fit:contain" />`;
  lb.classList.add('active');
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('active');
  document.getElementById('lightboxMedia').innerHTML = '';
}

// ---- Category Modal ----
const catData = {};
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('click', () => {
    const catName = card.dataset.cat;
    openCatModal(catName);
  });
});

function openCatModal(catName) {
  const modal = document.getElementById('catModal');
  const grid = document.getElementById('catModalGrid');
  const title = document.getElementById('catModalTitle');
  title.textContent = catName;

  // Pull items from inline data set on the page
  const items = window.__catItems?.[catName] || [];
  grid.innerHTML = items.map(item => {
    const thumb = item.type === 'video' ? item.thumb : item.url;
    const src = item.type === 'video' ? item.videoUrl : item.url;
    return `<div class="cat-modal-item" onclick="openLightbox('${src}','${item.type}')">
      <img src="${thumb}" alt="${item.brief}" loading="lazy" />
      ${item.type === 'video' ? '<div class="play-icon"><i class="bi bi-play-fill"></i></div>' : ''}
      <div class="cat-modal-caption">${item.brand} — ${item.brief}</div>
    </div>`;
  }).join('');
  modal.classList.add('active');
}

function closeCatModal() {
  document.getElementById('catModal').classList.remove('active');
}

// Scroll reveal
document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.project-card, .timeline-item, .exp-card, .edu-card, .contact-info-card, .contact-form-wrap, .skill-box');
  const ro = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          ro.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealEls.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    ro.observe(el);
  });
});
