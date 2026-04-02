// NiMSA SE — Main JS

document.addEventListener('DOMContentLoaded', () => {

  // ── HAMBURGER MENU ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ── NAVBAR SCROLL EFFECT ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 4px 30px rgba(0,0,0,0.4)'
        : '0 2px 20px rgba(0,0,0,0.3)';
    });
  }

  // ── SCROLL FADE ANIMATION ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // ── TABS ──
  document.querySelectorAll('[data-tabs]').forEach(container => {
    const tabs = container.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('[data-tab-panel]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        panels.forEach(p => {
          p.style.display = p.dataset.tabPanel === target ? 'block' : 'none';
        });
      });
    });
  });

  // ── AUTO-DISMISS FLASH MESSAGES ──
  document.querySelectorAll('.alert').forEach(alert => {
    setTimeout(() => {
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-8px)';
      alert.style.transition = 'all 0.4s ease';
      setTimeout(() => alert.remove(), 400);
    }, 4000);
  });

  // ── HERO BANNER SLIDER ──
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1) {
    let current = 0;
    const dots = document.querySelectorAll('.hero-dot');
    const advance = () => {
      slides[current].classList.remove('active');
      dots[current]?.classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
      dots[current]?.classList.add('active');
    };
    let timer = setInterval(advance, 4500);
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(timer);
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = i;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
        timer = setInterval(advance, 4500);
      });
    });
  }

  // ── EXEC FILTER TABS ──
  const execFilter = document.getElementById('exec-filter');
  if (execFilter) {
    // Apply default filter on page load (first tab = REC)
    const defaultBtn = execFilter.querySelector('.tab-btn.active');
    if (defaultBtn) applyExecFilter(defaultBtn.dataset.cat);

    execFilter.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        execFilter.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyExecFilter(btn.dataset.cat);
      });
    });
  }

  function applyExecFilter(cat) {
    document.querySelectorAll('.exec-card-wrap').forEach(card => {
      const cardCat = card.dataset.category;
      const show = cat === 'all'
        || cardCat === cat
        || (cat === 'rec' && (cardCat === 'rec' || cardCat === 'coordinator'));
      card.style.display = show ? 'block' : 'none';
    });
    // Update section header
    const headers = {
      'rec': 'Regional Executive Council',
      'school-president': 'MSA Presidents',
      'standing-committee': 'Standing Committee Representatives',
      'past-coordinator': 'Past Regional Coordinators'
    };
    const headerEl = document.getElementById('exec-section-title');
    if (headerEl && headers[cat]) headerEl.textContent = headers[cat];
  }

  // ── EVENT FILTER TABS ──
  const eventFilter = document.getElementById('event-filter');
  if (eventFilter) {
    eventFilter.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        eventFilter.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const type = btn.dataset.type;
        document.querySelectorAll('.event-item').forEach(item => {
          item.style.display = (type === 'all' || item.dataset.type === type) ? 'block' : 'none';
        });
      });
    });
  }

  // ── BULLETIN SEARCH ──
  const bulletinSearch = document.getElementById('bulletin-search');
  if (bulletinSearch) {
    bulletinSearch.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.bulletin-archive-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? 'block' : 'none';
      });
    });
  }

  // ── CONFIRM DELETES ──
  document.querySelectorAll('[data-confirm]').forEach(btn => {
    btn.addEventListener('click', e => {
      if (!confirm(btn.dataset.confirm || 'Are you sure?')) {
        e.preventDefault();
      }
    });
  });

  // ── ADMIN SIDEBAR ACTIVE ──
  const adminLinks = document.querySelectorAll('.admin-nav-item');
  adminLinks.forEach(link => {
    if (link.href && window.location.pathname.startsWith(new URL(link.href, window.location).pathname)) {
      link.classList.add('active');
    }
  });

  // ── FORM VALIDATION FEEDBACK ──
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', e => {
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#e74c3c';
          valid = false;
        } else {
          input.style.borderColor = '';
        }
      });
      if (!valid) {
        e.preventDefault();
        const err = form.querySelector('.form-error');
        if (err) err.style.display = 'block';
      }
    });
  });

});

// ── DRAG & DROP UPLOAD ZONES ──
document.querySelectorAll('.drop-zone').forEach(zone => {
  const input    = zone.querySelector('input[type="file"]');
  const textEl   = zone.querySelector('.drop-zone-text');
  const previewGrid = zone.querySelector('.preview-grid');

  zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (input) {
      input.files = e.dataTransfer.files;
      handleFiles(input.files, zone, textEl, previewGrid);
    }
  });

  if (input) {
    input.addEventListener('change', () => {
      handleFiles(input.files, zone, textEl, previewGrid);
    });
  }
});

function handleFiles(files, zone, textEl, previewGrid) {
  if (!files || files.length === 0) return;
  zone.classList.add('has-file');
  if (textEl) {
    textEl.textContent = files.length === 1
      ? files[0].name
      : `${files.length} files selected`;
  }
  if (previewGrid) {
    previewGrid.innerHTML = '';
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = e => {
        const item = document.createElement('div');
        item.className = 'preview-item';
        item.innerHTML = `<img src="${e.target.result}" alt="${file.name}">`;
        previewGrid.appendChild(item);
      };
      reader.readAsDataURL(file);
    });
  }
}

// ── PASSWORD REVEAL TOGGLE ──
document.querySelectorAll('.password-wrap').forEach(wrap => {
  const input  = wrap.querySelector('input[type="password"], input.password-field');
  const toggle = wrap.querySelector('.password-toggle');
  if (!input || !toggle) return;

  toggle.addEventListener('click', () => {
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    toggle.innerHTML = isHidden ? eyeOffIcon() : eyeIcon();
    toggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  });
});

function eyeIcon() {
  return `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>`;
}
function eyeOffIcon() {
  return `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>`;
}
