/*
  Basic swipe left/right detector

  Monitor touch events, return an object describing the event
*/

(function() {

  this.touchy = {

    init: function() {
      this.oTouch = {};
      this.bindEvents();
    },

    bindEvents: function() {
      window.addEventListener('touchstart', this.touchStart.bind(this), false);
      // window.addEventListener('touchend', this.touchEnd.bind(this), false);
    },

    touchStart: function(e) {
      // keep track of some of our touch event info
      this.oTouch.startTime = Date.now();
      this.oTouch.startX = e.touches[0].clientX;
      this.oTouch.startY = e.touches[0].clientY;
      this.oTouch.target = e.touches[0].target;
    },

    touchMove: function(e) {
      // TODO: track gesture and return details via oTouch
    },

    touchEnd: function(e) {
      console.log(e);
      touchy.oTouch.duration = Date.now() - touchy.oTouch.startTime;
      touchy.oTouch.endX = e.touches[0].clientX;
      touchy.oTouch.endY = e.touches[0].clientY;

      // only label as a gesture other than tap if moved by 10%+
      // biggest relative move decides what gesture is

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
    }
  };
//  touchy.init();

})();
