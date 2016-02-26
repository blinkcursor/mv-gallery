  /*
    MINIMUM VIABLE GALLERY

  */
;(function() {

  this.mvGallery = {

    init: function(selector) {

      this.cacheDOM(selector);

      if (this.gallery) {
        // attach event handler to launch modal
        this.gallery.addEventListener('click', this.launchModal.bind(this), false);
      }
    },

    cacheDOM: function(selector) {
      this.gallery = document.querySelector(selector);
    },

    launchModal: function(e) {
      e.preventDefault();

      // create the modal
      this.modal = document.createElement('div');
      this.modal.classList.add('gallery__modal');

      // add navigation elements
      this.arrowLeft = document.createElement('div');
      this.arrowLeft.classList.add('gallery__left');

      this.arrowRight = document.createElement('div');
      this.arrowRight.classList.add('gallery__right');

      this.close = document.createElement('div');
      this.close.classList.add('gallery__close');

      this.modal.appendChild(this.arrowLeft);
      this.modal.appendChild(this.arrowRight);
      this.modal.appendChild(this.close);

      // insert modal into DOM
      insertAfter(this.gallery, this.modal);

      // grab and keep a list of all the images in the gallery
      this.images = Array.prototype.slice.call(this.gallery.querySelectorAll('img')); // return as array

      // keep a pointer to the current image
      this.currentImage = e.target;

      // return a clone of the current img
      var clonedImage = this.cloneImage(this.currentImage);

      // add cloned img to the modal
      this.modal.appendChild(clonedImage);

      // attach event listeners
      this.bindModalEvents();
    },

    cloneImage: function(srcNode) {

      var clonedImage = srcNode.cloneNode(true);

      // Update 'sizes' to 100vw for the modal
      // Except, we can probably be smarter than that
      var modalWidth = this.modal.clientWidth,
        modalHeight = this.modal.clientHeight,
        modalRatio = modalWidth / modalHeight,
        imgWidth = srcNode.naturalWidth || clonedImage.width,
        imgHeight = srcNode.naturalHeight || clonedImage.height,
        imgRatio = imgWidth / imgHeight,
        smartSizes = (modalRatio > imgRatio) ? Math.round(modalWidth * imgRatio / modalRatio) + "px" : "100vw";

      if (clonedImage.sizes) { // Safari will fail
        clonedImage.sizes = smartSizes;
      } else {
        // Workaround for Safari bug where it is missing 'sizes' property
        // even though it has 'sizes' attribute which it ignores
        // We need to parse srcset ourselves and create a new img element
        // where we set the src property accordingly
        var safariImg = document.createElement('img'),
          oSrcset = parseSrcset(clonedImage.srcset),
          targetWidth = (smartSizes === "100vw") ? modalWidth : parseInt(smartSizes, 10),
          i = 0;

        while (oSrcset[i].w < targetWidth) {
          i++;
        }
        safariImg.src = oSrcset[i].url;
        clonedImage = safariImg;
      }

      return clonedImage;
    },

    bindModalEvents: function() {
      touchy.init();

      this.thisHandleModalEvents = this.handleModalEvents.bind(this); // (to be able to later remove event listeners)

      window.addEventListener('keyup', this.thisHandleModalEvents, false);
      this.modal.addEventListener('click', this.thisHandleModalEvents, false);
      window.addEventListener('touchend', this.thisHandleModalEvents, false);
    },

    handleModalEvents: function(e) {
      // key presses
      if (e.type === 'keyup') {
        var key = e.keyCode || e.which;
        switch (key) {
          case 27:
            // esc key closes modal
            this.killModal();
            break;
          case 37: // left key
            this.updateModal(-1);
            break;
          case 39: // right key
            this.updateModal(1);
        }
      }
      // click events
      if (e.type === 'click') {
        // close via X or clicking away from img
        if (e.target === this.modal || e.target === this.close) {
          this.killModal();
        }
        // click left or right
        if (e.target === this.arrowLeft) {
          this.updateModal(-1);
        } else if (e.target === this.arrowRight) {
          this.updateModal(1);
        }
      }
      if (e.type === 'touchend') {
        // get results of touch event from touchy
        var touchEvent = touchy.touchEnd(e);
        switch (touchEvent.gesture) {
          case "swipeleft":
            this.updateModal(-1);
            break;
          case "swiperight":
            this.updateModal(1);
            // otherwise do nothing
        }
      }
    },

    updateModal: function(direction) {

      var index = this.images.indexOf(this.currentImage),
        nextIndex = index + direction;

      // wraparound at first and last images
      nextIndex = (nextIndex === this.images.length) ? 0 : nextIndex;
      nextIndex = (nextIndex < 0) ? this.images.length - 1 : nextIndex;

      var nextImage = this.images[nextIndex];

      // remove old image
      this.modal.removeChild(this.modal.querySelector('img'));

      // update pointer to current image
      this.currentImage = nextImage;

      // return a clone of the img
      var clonedImage = this.cloneImage(this.currentImage);
      // add to the DOM as first child of modal
      this.modal.insertBefore(clonedImage, this.modal.firstChild);
    },

    killModal: function() {
      // tidy up event handlers
      this.modal.removeEventListener('click', this.thisHandleModalEvents, false);
      window.removeEventListener('keyup', this.thisHandleModalEvents, false);
      window.removeEventListener('touchend', this.thisHandleModalEvents, false);

      this.modal.parentNode.removeChild(this.modal);

      // tell touchy to stop listening to touch events
      touchy.quietTouchy();
    }

  }

  // HELPER function to insert a new node after a reference node
  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

})();
