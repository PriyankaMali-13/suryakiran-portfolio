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
      setTimeout(() => { msgDiv.classList.add('d-none'); }, 3000);
    } catch {
      msgDiv.className = 'mt-3 alert alert-danger py-2 px-3';
      msgDiv.textContent = 'Something went wrong. Please try again.';
    } finally {
      btnText.classList.remove('d-none');
      btnLoading.classList.add('d-none');
    }
  });
}

// ---- Lightbox with prev/next navigation ----
var _lbNavList = [];   // indices into window.allMedia for current context
var _lbNavPos  = 0;    // current position in _lbNavList
var _lbReturnFolder = null;

function openByPid(pid) {
  const idx = (window.allMedia || []).findIndex(i => i.public_id === pid);
  _lbNavList = [];
  _lbNavPos  = 0;
  _renderLightbox(idx >= 0 ? idx : 0);
}

function openLightboxFromFolder(index, catName) {
  _lbReturnFolder = catName;
  document.getElementById('folderModal').classList.remove('active'); // close folder so lightbox is visible
  const catItems = (window.allMedia || [])
    .map((item, i) => ({ item, i }))
    .filter(o => o.item.type === catName)
    .map(o => o.i);
  _lbNavList = catItems;
  _lbNavPos  = catItems.indexOf(index);
  _renderLightbox(index);
}

function _renderLightbox(index) {
  const item = (window.allMedia || [])[index];
  if (!item) return;

  const mediaEl = document.getElementById('lightboxMedia');
  const fullSrc = item.fullUrl || item.url;
  const thumbSrc = item.thumb || item.url;

  if (item.isVideo) {
    mediaEl.innerHTML = `<video controls autoplay playsinline><source src="${fullSrc}" type="video/mp4"></video>`;
  } else {
    // Show thumb immediately, swap to full resolution when ready
    const img = new Image();
    img.alt = item.brand || '';
    img.src = thumbSrc;
    img.style.filter = 'blur(6px)';
    img.style.transition = 'filter 0.4s ease';
    mediaEl.innerHTML = '';
    mediaEl.appendChild(img);
    const full = new Image();
    full.onload = () => {
      img.src = fullSrc;
      img.style.filter = 'none';
    };
    full.src = fullSrc;
  }

  const caption = document.getElementById('lb-caption');
  const typeEl  = document.getElementById('lb-type');
  const brandEl = document.getElementById('lb-brand');
  const briefEl = document.getElementById('lb-brief');
  if (item.brand || item.brief || item.type) {
    caption.style.display = '';
    typeEl.textContent  = item.type  || '';
    brandEl.textContent = item.brand || '';
    briefEl.textContent = item.brief || '';
  } else {
    caption.style.display = 'none';
  }

  const prev = document.getElementById('lb-prev');
  const next = document.getElementById('lb-next');
  if (_lbNavList.length > 1) {
    prev.classList.toggle('hidden', _lbNavPos <= 0);
    next.classList.toggle('hidden', _lbNavPos >= _lbNavList.length - 1);
  } else {
    prev.classList.add('hidden');
    next.classList.add('hidden');
  }

  document.getElementById('lightbox').classList.add('active');
}

function lbNavigate(dir) {
  const newPos = _lbNavPos + dir;
  if (newPos < 0 || newPos >= _lbNavList.length) return;
  _lbNavPos = newPos;
  _renderLightbox(_lbNavList[_lbNavPos]);
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.getElementById('lightboxMedia').innerHTML = '';
  if (_lbReturnFolder) {
    const cat = _lbReturnFolder;
    _lbReturnFolder = null;
    openFolder(cat);
  }
}

// ---- Folder / Category Modal ----
function openFolder(catName) {
  const items = (window.allMedia || [])
    .map((item, i) => ({ item, i }))
    .filter(o => o.item.type === catName);

  document.getElementById('folderModalTitle').textContent = catName;
  const grid = document.getElementById('folderModalGrid');

  if (items.length === 0) {
    grid.innerHTML = '<p style="color:#999;grid-column:span 3;text-align:center;padding:40px">No items in this category yet.</p>';
  } else {
    grid.innerHTML = items.map(({ item, i }) => {
      const thumb = item.thumb || item.url;
      return `<div class="cat-modal-item" onclick="openLightboxFromFolder(${i}, '${catName}')">
        <img src="${thumb}" alt="${item.brand}" loading="lazy" />
        ${item.isVideo ? '<div class="play-icon"><i class="bi bi-play-fill"></i></div>' : ''}
        <div class="cat-modal-caption">${item.brand}${item.brief ? ' — ' + item.brief : ''}</div>
      </div>`;
    }).join('');
  }

  document.getElementById('folderModal').classList.add('active');
}

function closeFolder() {
  document.getElementById('folderModal').classList.remove('active');
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
  if (document.getElementById('lightbox').classList.contains('active')) {
    if (e.key === 'Escape') { closeLightbox(); return; }
    if (e.key === 'ArrowLeft')  lbNavigate(-1);
    if (e.key === 'ArrowRight') lbNavigate(1);
  } else if (document.getElementById('folderModal').classList.contains('active')) {
    if (e.key === 'Escape') closeFolder();
  }
});

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
