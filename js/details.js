(function(exports) {
  'use strict';

  var currentTheme = null;

  var Details = {
    panel: document.getElementById('details'),
    header: document.querySelector('#details gaia-header'),
    title: document.querySelector('#details gaia-header h1'),

    prepareForDisplay: function(params) {
      var currentList = this.panel.querySelector('gaia-list');
      if (currentList) {
        this.panel.removeChild(currentList);
      }

      Storage.fetchTheme(params.id).then((theme) => {
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

        var actions = [
          {
            title: 'Install this theme',
            action: 'install'
          },
          {
            title: 'Fork this theme',
            action: 'fork'
          },
          {
            title: 'Remove this theme',
            action: 'remove',
            css: 'destructive'
          }
        ];
        actions.forEach(function(params) {
          var link = document.createElement('a');
          link.classList.add('action');
          link.dataset.action = params.action;
          if (params.css) {
            link.classList.add(params.css);
          }
          var title = document.createElement('h3');
          title.textContent = params.title;
          link.appendChild(title);
          list.appendChild(link);
        });

        this.panel.appendChild(list);
      }).catch(function(error) {
        console.log(error);
      });

      return this.panel;
    },

    installTheme: function() {
      return Generation.installTheme(currentTheme.id);
    },

    forkTheme: function() {
      var title = prompt('Title');
      if (!title) {
        return Promise.resolve();
      }

      return Storage.forkTheme(currentTheme, title);
    },

    removeTheme: function() {
      return Storage.removeTheme(currentTheme.id);
    }
  };

  Details.panel.addEventListener('click', function(evt) {
    var target = evt.target;

    if (target.dataset.action == 'install') {
      Details.installTheme().then(function() {
        alert('great success!');
      }).catch(function(error) {
        console.log(error);
      });
      return;
    }

    if (target.dataset.action == 'fork') {
      Details.forkTheme().then(function() {
        Main.prepareForDisplay();
        Navigation.pop();
      }).catch(function(error) {
        console.log(error);
      });
      return;
    }

    if (target.dataset.action == 'remove') {
      Details.removeTheme().then(function() {
        Main.prepareForDisplay();
        Navigation.pop();
      }).catch(function(error) {
        console.log(error);
      });
      return;
    }

    if (!target.classList.contains('navigation')) {
      return;
    }

    var targetSection = target.dataset.section;
    Navigation.push(Edit.prepareForDisplay({
      theme: currentTheme,
      section: targetSection
    }));
  });

  Details.header.addEventListener('action', function(evt) {
    if (evt.detail.type != 'back') {
      return;
    }

    Navigation.pop();
  });

  exports.Details = Details;
})(window);
