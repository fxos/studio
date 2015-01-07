(function(exports) {
  'use strict';

  // TODO: make a real IDB backend
  exports.Storage = {
    fetchThemesList: function() {
      return new Promise(function(resolve, reject) {
        resolve(["Solarized Dark", "Solarized Light"]);
      });
    },

    fetchTheme: function(key) {
      return new Promise(function(resolve, reject) {
        if (key == 'Solarized Light') {
          resolve({
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
            },
          });
        } else {
          resolve({
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
          });
        }
      });
    }
  };
})(window);
