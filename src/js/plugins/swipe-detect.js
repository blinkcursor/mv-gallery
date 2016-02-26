/*
  Basic swipe left/right detector

  Monitor touch events, return an object oTouch describing the event
  when touchEnd(e) passed touchevent.
*/

;(function() {

  this.touchy = {

    init: function() {
      this.bindEvents();
    },

    bindEvents: function() {
      this.thisTouchStart = this.touchStart.bind(this);
      window.addEventListener('touchstart', this.thisTouchStart, false);
    },

    touchStart: function(e) {
      // clean slate
      this.oTouch = {};

      // for now we are only tracking single touches not multi-gestures
      if (e.touches.length !== 1) return;

      // stash touch event info in oTouch
      this.oTouch.startTime = Date.now();
      this.oTouch.startX = e.touches[0].clientX;
      this.oTouch.startY = e.touches[0].clientY;
      this.oTouch.target = e.touches[0].target;
    },

    touchMove: function(e) {
      // TODO: track gesture and return details via oTouch
    },

    touchEnd: function(e) {

      if ( !this.oTouch.startTime ) return; // are we tracking this touch?

      touchy.oTouch.duration = Date.now() - touchy.oTouch.startTime;
      touchy.oTouch.endX = e.changedTouches[0].clientX;
      touchy.oTouch.endY = e.changedTouches[0].clientY;

      // only label as a gesture other than tap if moved by 10%+
      // direction determined by biggest relative move
      var directionX = touchy.oTouch.endX - touchy.oTouch.startX,
        scaleX = Math.abs(directionX / document.documentElement.clientWidth),
        directionY = touchy.oTouch.endY - touchy.oTouch.startY,
        scaleY = Math.abs(directionY / document.documentElement.clientHeight);

      if (Math.max(scaleX, scaleY) > 0.1) {
        if (scaleX > scaleY) {
          touchy.oTouch.gesture = (directionX > 0) ? "swiperight" : "swipeleft";
        } else {
          touchy.oTouch.gesture = (directionY > 0) ? "swipedown" : "swipeup";
        }
      } else {
        touchy.oTouch.gesture = "tap";
      }

      return touchy.oTouch;
    },

    quietTouchy: function(){
      window.removeEventListener('touchstart', this.thisTouchStart, false);
    }
  };

})();