(function(exports) {
  'use strict';

  exports.Main = {
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
        var title = document.createElement('h3');
        title.textContent = 'Make your own theme';
        link.appendChild(title);
        list.appendChild(link);

        this.panel.appendChild(list);
      }).catch(function(error) {
        console.log(error);
      });

      return this.panel;
    }
  };

  exports.Main.panel.addEventListener('click', function(evt) {
    var target = evt.target;
    if (!target.classList.contains('navigation')) {
      return;
    }

    var themeId = parseInt(target.dataset.themeId);
    Navigation.push(Details.prepareForDisplay({
      id: themeId
    }));
  });

})(window);
