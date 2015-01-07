(function(exports) {
  'use strict';

  var currentTheme = null;

  exports.Details = {
    panel: document.getElementById('details'),
    header: document.querySelector('#details gaia-header'),
    title: document.querySelector('#details gaia-header h1'),

    prepareForDisplay: function(params) {
      var currentList = this.panel.querySelector('gaia-list');
      if (currentList) {
        this.panel.removeChild(currentList);
      }

      Storage.fetchTheme(params.key).then((theme) => {
        currentTheme = theme;
        this.title.textContent = theme.title;
        this.header.setAttr('action', 'back');

        var list = document.createElement('gaia-list')
        Object.keys(theme.sections).forEach(function(key) {
          var link = document.createElement('a');
          link.classList.add('navigation');
          link.dataset.section = key;

          var title = document.createElement('h3');
          title.textContent = key;
          link.appendChild(title);

          var forward = document.createElement('i');
          forward.dataset.icon = 'forward-light';
          link.appendChild(forward);

          list.appendChild(link);
        });

        ['Install this theme', 'Fork this theme'].forEach(function(action) {
          var link = document.createElement('a');
          link.classList.add('action');
          var title = document.createElement('h3');
          title.textContent = action;
          link.appendChild(title);
          list.appendChild(link);
        });

        this.panel.appendChild(list);
      }).catch(function(error) {
        console.log(error);
      });

      return this.panel;
    }
  };

  exports.Details.panel.addEventListener('click', function(evt) {
    var target = evt.target;
    if (!target.classList.contains('navigation')) {
      return;
    }

    var targetSection = target.dataset.section;
    Navigation.push(Edit.prepareForDisplay({
      theme: currentTheme,
      section: targetSection
    }));
  });

  exports.Details.header.addEventListener('action', function(evt) {
    if (evt.detail.type != 'back') {
      return;
    }

    Navigation.pop();
  });
})(window);
