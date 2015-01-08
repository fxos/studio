(function(exports) {
  'use strict';

  var Main = {
    panel: document.getElementById('main'),
    header: document.querySelector('#main gaia-header'),
    title: document.querySelector('#main gaia-header h1'),

    prepareForDisplay: function(params) {
      var currentList = this.panel.querySelector('gaia-list');
      if (currentList) {
        this.panel.removeChild(currentList);
      }

      Storage.fetchThemesList().then((themes) => {
        var list = document.createElement('gaia-list')
        themes.forEach(function(theme) {
          var link = document.createElement('a');
          link.classList.add('navigation');
          link.dataset.themeId = theme.id;

          var title = document.createElement('h3');
          title.textContent = theme.title;
          link.appendChild(title);

          var forward = document.createElement('i');
          forward.dataset.icon = 'forward-light';
          link.appendChild(forward);

          list.appendChild(link);
        });

        var link = document.createElement('a');
        link.classList.add('action');
        link.dataset.action = 'create';
        var title = document.createElement('h3');
        title.textContent = 'Make your own theme';
        link.appendChild(title);
        list.appendChild(link);

        this.panel.appendChild(list);
      }).catch(function(error) {
        console.log(error);
      });

      return this.panel;
    },

    createTheme: function() {
      var title = prompt('Title');
      if (!title) {
        return;
      }
      Storage.createTheme(title).then(() => {
        this.prepareForDisplay();
      }).catch(function(error) {
        console.log(error);
      });
    }
  };

  Main.panel.addEventListener('click', function(evt) {
    var target = evt.target;
    if (target.dataset.action == 'create') {
      Main.createTheme();
      return;
    }

    if (!target.classList.contains('navigation')) {
      return;
    }

    var themeId = parseInt(target.dataset.themeId);
    Navigation.push(Details.prepareForDisplay({
      id: themeId
    }));
  });

  exports.Main = Main;
})(window);
