(function(exports) {
  'use strict';

  function userStyle(theme) {
    var str = ':root {\n';
    Object.keys(theme.sections).forEach(function(sectionKey) {
      var section = theme.sections[sectionKey];
      Object.keys(section).forEach(function(key) {
        str += key + ': ' + section[key] + ';\n';
      });
    });
    str += '}'
    return str;
  }

  function fakeInstall(css) {
    var override = document.createElement('style');
    override.innerHTML = css;
    document.body.appendChild(override);
  }

  exports.Generation = {
    installTheme: function(id) {
      return Storage.fetchTheme(id).then(function(theme) {
        // TODO: put the add-on generation / installation / enabling here
        console.log("| do some magic app generation |", theme.title);
        console.log("| do some magic app installation |", theme.title);
        console.log("| do some magic add-on enabling |", theme.title);

        fakeInstall(userStyle(theme));

        return Promise.resolve();
      }).catch(function(error) {
        console.log(error);
      });
    }
  };
})(window);
