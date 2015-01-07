(function(exports) {
  'use strict';

  var stack = [Main.prepareForDisplay()];

  exports.Navigation = {
    push: function(panel) {
      stack[stack.length - 1].classList.add('back');
      panel.classList.remove('next');
      stack.push(panel);
    },

    pop: function() {
      var toPop = stack.pop();
      toPop.classList.add('next');
      stack[stack.length - 1].classList.remove('back');
    }
  };
})(window);
