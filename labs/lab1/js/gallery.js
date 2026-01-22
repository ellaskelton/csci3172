
(function() {
  'use strict';

  //init gallery funct
  function initGallery() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      const thumbnails = card.querySelectorAll('.thumbnail');
      const stackImages = card.querySelectorAll('.stack-image');
      
      thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
          const targetIndex = parseInt(this.dataset.index);
          
          thumbnails.forEach(t => t.classList.remove('active'));

          //mark image as active image
          this.classList.add('active');
          
          //hide other images
          stackImages.forEach((img, index) => {
            if (index === targetIndex) {
              img.classList.add('active');
            } else {
              img.classList.remove('active');
            }
          });
        });
      });
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }
})();
