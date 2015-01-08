(function(exports) {
  'use strict';

  exports.Generation = {
    installTheme: function(id) {
      return Storage.fetchTheme(id).then(function(theme) {
        // TODO: put the add-on generation / installation / enabling here
        console.log("| do some magic app generation |", theme.title);
        console.log("| do some magic app installation |", theme.title);
        console.log("| do some magic add-on enabling |", theme.title);
        return Promise.resolve();
      }).catch(function(error) {
        console.log(error);
      });
    }
  };
})(window);
