/* global
  Defer,
  EventDispatcher,
  Main
 */
(function(exports) {
  'use strict';

  var stack = [Main.prepareForDisplay()];

  var Navigation = {
    waitForTransition() {
      var defer = new Defer();

      var count = 2;
      document.body.addEventListener('transitionend', function onTransition(e) {
        if (!e.target.classList.contains('panel')) {
          return;
        }

        if (--count) {
          return;
        }

        document.body.removeEventListener('transitionend', onTransition);
        defer.resolve();
      });

      return defer.promise;
    },

    push: function(panel) {
      stack[stack.length - 1].classList.add('back');
      panel.classList.remove('next');
      stack.push(panel);

      this.waitForTransition().then(() => this.emit('post-navigate'));
    },

    pop: function() {
      var toPop = stack.pop();
      toPop.classList.add('next');
      stack[stack.length - 1].classList.remove('back');

      this.waitForTransition().then(() => this.emit('post-navigate'));
    }
  };

  exports.Navigation = EventDispatcher.mixin(Navigation, ['post-navigate']);
})(window);
