(function(exports) {
  'use strict';

  function importBlob(blob) {
    console.log('importBlob');
    // Save the blob to a file because we don't support importing memory blobs.
    var sdcard = navigator.getDeviceStorage('sdcard');
    return new Promise((resolve, reject) => {
      function sendError(msg) {
        console.log(msg);
        reject(msg);
      }

      if (!sdcard) {
        sendError('No SDCard!');
        return;
      }

      var fileName = 'temp-app.zip';

      var delReq = sdcard.delete(fileName);
      delReq.onsuccess = delReq.onerror = function() {
        var req = sdcard.addNamed(blob, fileName);
        req.onsuccess = function(e) {
          var getReq = sdcard.get(fileName);
          getReq.onsuccess = function() {
            var file = this.result;
            navigator.mozApps.mgmt.import(file).then(
              function(app) {
                var setting = { "theme.selected" : app.manifestURL };
                var req = navigator.mozSettings.createLock().set(setting);
                req.onsuccess = resolve;
                req.onerror = sendError;
              },
              function(error) { sendError('Error importing: ' + error.name); }
            );
          }
          getReq.onerror = function() {
            sendError('Error getting file: ' + this.error.name);
          }
        }
        req.onerror = function(e) {
          sendError('Error saving blob: ' + this.error.name);
        }
      };
    });
  }

  function exportTheme(theme) {
    // Worker path configuration.
    zip.workerScriptsPath = './js/libs/';

    console.log('exportTheme ' + theme.title);

    // TODO: use a stable appId.
    var appId = 'app' + Math.round(Math.random() * 100000000);
    var app = new AppZip();
    app.metaData = {
      installOrigin: 'http://gaiamobile.org',
      manifestURL: 'app://theme' + appId + '.gaiamobile.org/update.webapp',
      version: 1
    };

    app.manifest = {
      name: theme.title,
      package_path: '/application.zip',
    };

    // Build a simple package with a manifest and index.html
    var inner = new PackageHelper();

    var manifest = {
      name: theme.title,
      role: "theme",
      type: "certified",
      origin: 'app://theme' + appId + '.gaiamobile.org'
    };

    return new Promise((resolve, reject) => {
      inner.init().then(() => {
        function addManifest() {
          return inner.addResource('manifest.webapp', JSON.stringify(manifest));
        }

        function addCSS() {
          return inner.addResource('shared/elements/gaia-theme/gaia-theme.css', userStyle(theme));
        }

        addManifest().then(addCSS)
                     .then(inner.asBlob.bind(inner))
                     .then((blob) => {
                        app.packageblob = blob;
                        return app.asBlob().then(importBlob).then(resolve);
                      })
                     .catch(reject);
      });
   });
  }

  function userStyle(theme) {
    var roots = [':root', '.theme-productivity', '.theme-communications',
                 '.theme-settings', '.theme-media'];

    var str = '';
    roots.forEach(function(root) {
      str += root + ' {\n';
      var group;
      if (root === ':root') {
        group = 'default';
      } else {
        group = root.split('-')[1];
      }
      Object.keys(theme.groups[group]).forEach(function(sectionKey) {
        var section = theme.groups[group][sectionKey];
        Object.keys(section).forEach(function(key) {
          str += key + ': ' + section[key] + ';\n';
        });
      });
      str += '}\n';
    });
    return str;
  }

  function fakeInstall(css) {
    var override = document.createElement('style');
    override.innerHTML = css;
    document.body.appendChild(override);
  }

  exports.Generation = {
    installTheme: function(id) {
      return Storage.fetchTheme(id).then(exportTheme);
    }
  };
})(window);
