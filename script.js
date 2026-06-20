document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector('[data-header]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // 1. Morphing Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Intersection Observer for Active Link Highlighting
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.4 // Triggers when 40% of the section is visible
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to the currently visible section
        const activeLink = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }, observerOptions);

  // Grab all sections that have an ID and observe them
  document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
  });
});