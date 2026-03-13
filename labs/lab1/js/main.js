
(function() {
  'use strict';

  //navigation menu
  function toggleMenu() {
    var navLinks = document.querySelector('.nav-links');
    var menuToggle = document.querySelector('.menu-toggle');
    
    navLinks.classList.toggle('active');
  }

  function closeMenuOnClick() {
    var navLinks = document.querySelector('.nav-links');
    
    navLinks.classList.remove('active');
  }


  function init() {
    var menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', toggleMenu);
    }

    var navLinkItems = document.querySelectorAll('.nav-links a');
    navLinkItems.forEach(function(link) {
      link.addEventListener('click', closeMenuOnClick);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
