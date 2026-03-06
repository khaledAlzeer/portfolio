/**
 * ════════════════════════════════════════════════════════════
 * KHALED ALZEER PORTFOLIO — Main JavaScript
 * ────────────────────────────────────────────────────────────
 * Sections:
 *   1.  Custom Cursor          — dot + ring with lerp smoothing
 *   2.  Typewriter Effect      — hero role text animation
 *   3.  Scroll Reveal          — IntersectionObserver fade-up
 *   4.  Skills Tab Switching   — languages / frameworks / tools
 *   5.  Active Nav Link        — highlight on scroll
 *   6.  Navbar Scroll Shadow   — opacity change on scroll
 *   7.  Smooth Scroll          — offset scroll for fixed navbar
 *   8.  Sidebar Drawer         — mobile navigation panel
 *   9.  Project Card Glow      — dynamic color on hover
 *   10. Image Fallback         — show initials if image fails
 *   11. Page Load Animation    — reveal above-fold elements
 * ════════════════════════════════════════════════════════════
 */


/* ════════════════════════════════════════════
   1. CUSTOM CURSOR
   ────────────────────────────────────────────
   Two-element cursor:
   • Dot  — follows mouse instantly (CSS transition)
   • Ring — follows mouse with smooth lag (lerp 12%)

   On hover over interactive elements:
   • Dot  scales up × 2
   • Ring expands and turns cyan

   Hides both elements when mouse leaves the window.
   ════════════════════════════════════════════ */

// Grab the two cursor elements from the DOM
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

// Real mouse position (updated instantly on every mousemove)
let mouseX = 0, mouseY = 0;

// Ring's current interpolated position (updated via lerp in rAF loop)
let ringX  = 0, ringY  = 0;

/**
 * Track mouse position and move the dot instantly.
 * The ring lags behind — handled separately in animateCursor().
 */
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Dot follows the mouse with no delay
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

/**
 * Lerp (linear interpolation) animation loop for the ring.
 * Moves 12% of the remaining distance each frame → smooth lag effect.
 * Runs continuously via requestAnimationFrame.
 */
function animateCursor() {
  // Lerp: currentPos += (targetPos - currentPos) * factor
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;

  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';

  // Keep looping every frame
  requestAnimationFrame(animateCursor);
}

// Start the ring animation loop immediately
animateCursor();

/**
 * Add hover effect when cursor enters interactive elements.
 * CSS classes .hovered scale the dot and expand the ring.
 */
const hoverTargets = document.querySelectorAll(
  'a, button, .proj-card, .cert-card, .contact-card, .skill-chip, .tab-btn, .icon-btn'
);

hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.classList.add('hovered');
    cursorRing.classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('hovered');
    cursorRing.classList.remove('hovered');
  });
});

// Hide cursor when mouse leaves the browser window
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity  = '0';
  cursorRing.style.opacity = '0';
});

// Show cursor again when mouse re-enters the window
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity  = '1';
  cursorRing.style.opacity = '1';
});


/* ════════════════════════════════════════════
   2. TYPEWRITER EFFECT — Hero Role Text
   ────────────────────────────────────────────
   Cycles through an array of role titles,
   typing one character at a time, pausing,
   then deleting before moving to the next role.

   Speeds:
   • Typing:   80ms per character
   • Deleting: 45ms per character
   • Pause after full word: 2000ms
   • Pause before next word: 400ms
   ════════════════════════════════════════════ */

// The roles to cycle through in the hero section
const roles = [
  'Python Developer',
  'Data Analyst',
  'Full-Stack Developer',
  'ML Engineer'
];

// The <span> element that displays the current role text
const roleTextEl = document.getElementById('roleText');

let roleIndex  = 0;     // Which role is currently being typed
let charIndex  = 0;     // Which character position we're at
let isDeleting = false; // Whether we're currently deleting or typing

/**
 * Core typewriter function.
 * Called recursively via setTimeout with variable delay.
 * Handles both typing forward and deleting backward.
 */
function typeWriter() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    // Remove one character from the right
    roleTextEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // Add one character from the left
    roleTextEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  // Base speed: typing = 80ms, deleting = 45ms (faster delete)
  let speed = isDeleting ? 45 : 80;

  if (!isDeleting && charIndex === currentRole.length) {
    // Finished typing the full word → pause 2s before deleting
    speed = 2000;
    isDeleting = true;

  } else if (isDeleting && charIndex === 0) {
    // Finished deleting → move to next role and pause briefly
    isDeleting = false;
    roleIndex  = (roleIndex + 1) % roles.length; // Loop back to start
    speed = 400;
  }

  // Schedule the next character update
  setTimeout(typeWriter, speed);
}

// Initial delay before typewriter starts (lets page settle first)
setTimeout(typeWriter, 800);


/* ════════════════════════════════════════════
   3. SCROLL REVEAL — IntersectionObserver
   ────────────────────────────────────────────
   All elements with class .reveal start hidden
   (opacity:0, translateY:40px in CSS).

   When they enter the viewport at 10% threshold,
   the .visible class is added → CSS animates them in.

   After revealing, the element is unobserved to
   prevent re-triggering on scroll back up.
   ════════════════════════════════════════════ */

/**
 * Observer that watches .reveal elements and
 * adds .visible when they enter the viewport.
 */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add class → triggers CSS fade-up animation
      entry.target.classList.add('visible');

      // Stop watching — animation only plays once
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.10 // Trigger when 10% of element is visible
});

// Attach observer to every element with .reveal class
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ════════════════════════════════════════════
   4. SKILLS TAB SWITCHING
   ────────────────────────────────────────────
   Three tabs: // languages | // frameworks | // tools
   Each button has data-tab="languages" etc.
   Clicking a tab:
   1. Removes .active from all buttons
   2. Hides all skill grids
   3. Activates clicked button
   4. Shows matching grid by ID: "tab-{name}"
   ════════════════════════════════════════════ */

// All three tab buttons
const tabButtons = document.querySelectorAll('.tab-btn');

// All three skill grids
const skillGrids = document.querySelectorAll('.skill-grid');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {

    // Read which tab this button controls
    const target = btn.dataset.tab; // e.g. "languages", "frameworks", "tools"

    // Step 1 & 2: Deactivate all tabs and hide all grids
    tabButtons.forEach(b => b.classList.remove('active'));
    skillGrids.forEach(g => g.classList.remove('active'));

    // Step 3: Activate the clicked tab button
    btn.classList.add('active');

    // Step 4: Show the matching skill grid
    const targetGrid = document.getElementById('tab-' + target);
    if (targetGrid) targetGrid.classList.add('active');
  });
});


/* ════════════════════════════════════════════
   5. ACTIVE NAV LINK — Highlight on scroll
   ────────────────────────────────────────────
   Watches all <section id="..."> elements.
   When a section is 40% visible:
   • Removes .active from all nav links
   • Adds .active to the matching link
   • Syncs drawer links too (mobile)
   ════════════════════════════════════════════ */

// All page sections with an ID
const sections = document.querySelectorAll('section[id]');

// Desktop nav links
const navLinks = document.querySelectorAll('.nav-links a');

/**
 * Observer that tracks which section is currently
 * most visible and highlights the corresponding nav link.
 */
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');

      // Update desktop nav links
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });

      // Sync mobile drawer links to match active section
      document.querySelectorAll('.drawer-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}, {
  threshold: 0.40 // Section must be 40% visible to become "active"
});

// Observe all sections
sections.forEach(sec => navObserver.observe(sec));


/* ════════════════════════════════════════════
   6. NAVBAR SCROLL SHADOW
   ────────────────────────────────────────────
   When user scrolls more than 60px:
   • Navbar background becomes more opaque (0.92)
   • Box shadow becomes stronger

   When back at top:
   • Background returns to semi-transparent (0.70)
   • Lighter shadow
   ════════════════════════════════════════════ */

// The fixed navbar element
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    // Scrolled down — more opaque + stronger shadow
    navbar.style.background = 'rgba(6, 8, 16, 0.92)';
    navbar.style.boxShadow  = '0 4px 40px rgba(0, 0, 0, 0.60)';
  } else {
    // At the top — original semi-transparent style
    navbar.style.background = 'rgba(6, 8, 16, 0.70)';
    navbar.style.boxShadow  = '0 4px 32px rgba(0, 0, 0, 0.40)';
  }
});


/* ════════════════════════════════════════════
   7. SMOOTH SCROLL — Nav & internal links
   ────────────────────────────────────────────
   Intercepts clicks on all internal anchor links
   (href starts with "#") and scrolls smoothly
   to the target section.

   Applies an offset equal to navbar height + 24px
   so the section title isn't hidden behind the
   fixed navbar.
   ════════════════════════════════════════════ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');

    // Skip placeholder links like href="#"
    if (href === '#') return;

    // Find the target section element
    const target = document.querySelector(href);
    if (!target) return;

    // Prevent default instant jump behavior
    e.preventDefault();

    // Calculate scroll position with navbar offset
    const navHeight = navbar.offsetHeight + 24; // 24px extra breathing room
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    // Smooth scroll to calculated position
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});


/* ════════════════════════════════════════════
   8. SIDEBAR DRAWER — Mobile Navigation
   ────────────────────────────────────────────
   Controls the mobile sidebar drawer panel.

   Open triggers:
   • Hamburger button click

   Close triggers:
   • ✕ close button
   • Dark overlay click
   • Any drawer nav link click
   • Escape key press

   When open:
   • .open added to drawer, overlay, hamburger
   • Body scroll is locked (overflow: hidden)
   • Hamburger animates to ✕ (CSS)

   When closed:
   • All .open classes removed
   • Body scroll restored
   ════════════════════════════════════════════ */

// Drawer-related DOM elements
const hamburger     = document.getElementById('hamburger');
const drawer        = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerClose   = document.getElementById('drawerClose');
const drawerLinks   = document.querySelectorAll('.drawer-link');

/**
 * Opens the sidebar drawer.
 * Adds .open to all relevant elements and locks page scroll.
 */
function openDrawer() {
  drawer.classList.add('open');
  drawerOverlay.classList.add('open');
  hamburger.classList.add('open');            // Triggers ✕ animation in CSS
  document.body.style.overflow = 'hidden';   // Prevent background scrolling
}

/**
 * Closes the sidebar drawer.
 * Removes .open from all elements and restores page scroll.
 */
function closeDrawer() {
  drawer.classList.remove('open');
  drawerOverlay.classList.remove('open');
  hamburger.classList.remove('open');  // Reverts ✕ back to ☰
  document.body.style.overflow = '';   // Restore normal scrolling
}

// Toggle drawer on hamburger click
hamburger.addEventListener('click', () => {
  // If already open → close, otherwise → open
  drawer.classList.contains('open') ? closeDrawer() : openDrawer();
});

// Close when ✕ button is clicked
drawerClose.addEventListener('click', closeDrawer);

// Close when dark overlay behind drawer is clicked
drawerOverlay.addEventListener('click', closeDrawer);

// Close when any nav link inside drawer is clicked
// (smooth scroll takes over after this)
drawerLinks.forEach(link => {
  link.addEventListener('click', closeDrawer);
});

// Close on Escape key — accessibility support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDrawer();
});


/* ════════════════════════════════════════════
   9. PROJECT CARD — Dynamic Glow on Hover
   ────────────────────────────────────────────
   Each project card has a data-color attribute:
   "blue" | "cyan" | "violet"

   On mouseenter, the matching glow color is set
   as a CSS custom property --card-glow on the card.
   This enables the colored box-shadow in CSS.
   ════════════════════════════════════════════ */

// Map of data-color values to their RGBA glow colors
const glowMap = {
  blue:   'rgba(37, 99, 235, 0.35)',
  cyan:   'rgba(6, 182, 212, 0.30)',
  violet: 'rgba(139, 92, 246, 0.30)'
};

document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const color = card.dataset.color; // Read "blue", "cyan", or "violet"

    // Set the CSS variable on this specific card
    if (glowMap[color]) {
      card.style.setProperty('--card-glow', glowMap[color]);
    }
  });
});


/* ════════════════════════════════════════════
   10. IMAGE FALLBACK — Avatar & Certificates
   ────────────────────────────────────────────
   If the profile photo fails to load (404 or
   missing file), the image is hidden and the
   fallback element (showing "KA" initials) is
   displayed instead.

   Applies to:
   • Nav avatar image
   • About section avatar image
   ════════════════════════════════════════════ */

document.querySelectorAll('.nav-avatar img, .about-avatar').forEach(img => {
  img.addEventListener('error', function () {
    // Hide the broken image
    this.style.display = 'none';

    // Show the next sibling — the fallback initials element
    const fallback = this.nextElementSibling;
    if (fallback) fallback.style.display = 'flex';
  });
});


/* ════════════════════════════════════════════
   11. INITIAL PAGE LOAD ANIMATION
   ────────────────────────────────────────────
   The IntersectionObserver (Section 3) only
   triggers when elements scroll INTO view.

   Elements already visible on page load (above
   the fold) won't be caught by the observer,
   so we manually check them here after load.

   100ms delay lets fonts and layout settle first
   before we check element positions.
   ════════════════════════════════════════════ */

window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();

      // If element is already in the viewport → reveal it now
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  }, 100); // Small delay for layout to fully settle
});