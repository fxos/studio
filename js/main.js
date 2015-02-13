/*global
  AutoTheme,
  Defer,
  Details,
  Navigation,
  Storage
*/
(function(exports) {
  'use strict';

  var Main = {
    panel: document.getElementById('main'),
    header: document.querySelector('#main gaia-header'),
    title: document.querySelector('#main gaia-header h1'),
    dialog: document.getElementById('new-theme-dialog'),
    dialogInput: document.querySelector('.new-theme-title-input'),
    autotheme: document.querySelector('#new-theme-dialog .autotheme-palette'),

    prepareForDisplay: function(params) {
      var currentList = this.panel.querySelector('gaia-list');
      if (currentList) {
        this.panel.removeChild(currentList);
      }

      Storage.fetchThemesList().then((themes) => {
        var list = document.createElement('gaia-list');
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
      this.promptNewTheme().then((theme) => {
        if (!theme.title) {
          return;
        }

        theme = ThemeCreator.template(theme);

        Storage.createTheme(theme).then(() => {
          this.prepareForDisplay();
        }).catch(function(error) {
          console.log(error);
        });
      });
    },

    promptNewTheme() {
      AutoTheme.on('palette', this.onPalette);
      this.dialog.open();
      this.createDialogDefer = new Defer();
      return this.createDialogDefer.promise;
    },

    closeDialog() {
      this.dialog.close();
      this.dialogInput.value = '';
      AutoTheme.off('palette', this.onPalette);
      AutoTheme.clean();
      this.onPalette();
      this.createDialogDefer = null;
    },

    onPalette() {
      // no "this" available here
      AutoTheme.showPalette(Main.autotheme);
    },

    onDialogCancelClicked() {
      this.closeDialog();
    },

    onDialogCreateClicked() {
      var result = {
        title: this.dialogInput.value,
        autotheme: AutoTheme.asStorable(),
        palette: AutoTheme.palette
      };
      this.createDialogDefer.resolve(result);
      this.closeDialog();
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

  Main.dialog.querySelector('.cancel').addEventListener(
    'click', () => Main.onDialogCancelClicked()
  );

  Main.dialog.querySelector('.confirm').addEventListener(
    'click', () => Main.onDialogCreateClicked()
  );

  exports.Main = Main;
})(window);
