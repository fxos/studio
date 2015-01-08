(function(exports) {
  'use strict';

  // TODO: make a real IDB backend
  exports.Storage = {
    fetchThemesList: function() {
      return getAllThemes().then(function(themes) {
        return themes.map(function(theme) {
          return {
            id: theme.id,
            title: theme.title
          };
        });
      });
    },

    fetchTheme: function(id) {
      return getTheme(id);
    },

    updateTheme: function(theme) {
      return setTheme(theme);
    }
  };

  // IDB private stuffs
  var defaults = [
    {
      title: 'Solarized Light',
      sections: {
        'Basics': {
          '--background': '#FCF5E4',
          '--text-color': '#6A7A82',
          '--highlight-color': '#3C86CB',
          '--link-color': '#3C86CB',
          '--border-color': '#889426',
          '--button-background': '#F2F0C2',
          '--input-background': '#FCF5E4',
          '--input-color': '#6A7A82',
          '--input-clear-background': '#3C86CB',
        },
        'Header': {
          '--header-background': '#FCF5E4',
          '--header-color': '#6A7A82',
          '--header-icon-color': '#CA9630',
          '--header-button-color': '#CA9630',
          '--header-disabled-button-color': '#BDC3C3',
          '--header-action-button-color': '#CA9630'
        }
      }
    },
    {
      title: 'Solarized Dark',
      sections: {
        'Basics': {
          '--background': '#0E2B35',
          '--text-color': 'white',
          '--highlight-color': '#889426',
          '--link-color': '#889426',
          '--border-color': '#C15082',
          '--button-background': '#3C86CB',
          '--input-background': '#0E2B35',
          '--input-color': '#6F8B94',
          '--input-clear-background': '#3C86CB',
        },
        'Header': {
          '--header-background': '#0E2B35',
          '--header-color': '#6F8B94',
          '--header-icon-color': '#C15082',
          '--header-button-color': '#C15082',
          '--header-disabled-button-color': '#BDC3C3',
          '--header-action-button-color': '#C15082'
        }
      }
    }
  ];

  var database;
  function getDB() {
    return new Promise(function(resolve, reject) {
      if (database) {
        resolve(database);
        return;
      }

      var req = exports.indexedDB.open('Studio', 1);
      req.onerror = function(e) {
        reject(e.target.request.errorCode);
      };
      req.onsuccess = function(e) {
        database = e.target.result;
        resolve(database);
      };
      req.onupgradeneeded = function(e) {
        var db = e.target.result;
        var store = db.createObjectStore('themes', {
          keyPath:  'id',
          autoIncrement : true
        });
        for (var i = 0; i < defaults.length; i++) {
          store.put(defaults[i]);
        }
      };
    });
  }

  function getAllThemes() {
    return getDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var store = db.transaction('themes').objectStore('themes');

        var themes = [];
        var req = store.openCursor()
        req.onsuccess = function(e) {
          var cursor = e.target.result;
          if (cursor) {
            themes.push(cursor.value);
            cursor.continue();
          } else {
            resolve(themes);
          }
        };
        req.onerror = function(e) {
          reject(e.target.errorCode);
        }
      });
    });
  }

  function getTheme(id) {
    return getDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var req = db.transaction('themes').objectStore('themes').get(id);
        req.onsuccess = function(e) {
          resolve(e.target.result);
        };
        req.onerror = function(e) {
          reject(e.target.errorCode);
        };
      });
    });
  }

  function setTheme(theme) {
    return getDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var store = db.transaction('themes', 'readwrite').objectStore('themes');
        var req = store.put(theme);
        req.onsuccess = function(e) {
          resolve(e.target.result);
        };
        req.onerror = function(e) {
          reject(e.target.errorCode);
        };
      });
    });
  }
})(window);
