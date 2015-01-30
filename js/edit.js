(function(exports) {
  'use strict';

  var currentTheme = null;
  var currentSection = null;
  var currentKey = null;

  var Edit = {
    panel: document.getElementById('edit'),
    header: document.querySelector('#edit gaia-header'),
    title: document.querySelector('#edit gaia-header h1'),
    list: document.querySelector('#edit-list'),
    editColor: document.querySelector('#edit-color'),
    picker: document.querySelector('#edit-color gaia-color-picker'),
    iframe: document.querySelector('#edit iframe'),
    cancel: document.querySelector('#edit-color .cancel'),
    save: document.querySelector('#edit-color .save'),

    prepareForDisplay: function(params) {
      currentTheme = params.theme;

      this.title.textContent = params.section;
      this.header.setAttr('action', 'back');

      this.picker.onchange = () => {
        if (!currentKey) {
          return;
        }
        var value = this.picker.value;
        this.iframe.contentDocument.body.style.setProperty(currentKey, value);
      };

      this.cancel.onclick = () => {
        var value = currentSection[currentKey];
        this.iframe.contentDocument.body.style.setProperty(currentKey, value);
        this.editColor.classList.remove('editing');
      };

      this.save.onclick = () => {
        if (!currentKey) {
          return;
        }

        var value = this.picker.value;
        currentSection[currentKey] = value;

        var elem = this.list.querySelector('[data-id=' + currentKey + ']')
        elem.textContent = value;

        Storage.updateTheme(currentTheme).then(() => {
          this.editColor.classList.remove('editing');
        }).catch(function(error) {
          console.log(error);
        });
      };

      var currentList = this.list.querySelector('gaia-list');
      if (currentList) {
        this.list.removeChild(currentList);
      }

      var list = document.createElement('gaia-list')
      currentSection = currentTheme.sections[params.section];

      this.iframe.src = '/' + params.section + '-preview.html';
      this.iframe.onload = () => {
        Object.keys(currentSection).forEach((key) => {
          this.iframe.contentDocument.body.style.setProperty(key, currentSection[key]);
        });
      }

      Object.keys(currentSection).forEach((key) => {
        var link = document.createElement('a');
        link.classList.add('edit');
        link.dataset.key = key;

        var label = document.createElement('label');
        label.classList.add('l-flex');
        label.classList.add('l-flex-grow');

        var title = document.createElement('h3');
        title.textContent = key;
        label.appendChild(title);

        link.appendChild(label);

        var value = document.createElement('span');
        value.textContent = currentSection[key];
        value.dataset.id = key;
        link.appendChild(value);

        list.appendChild(link);
      });

      this.list.appendChild(list);

      return this.panel;
    },

    pick: function(key) {
      currentKey = key;
      this.picker.value = currentSection[key];
      this.editColor.classList.add('editing');
    }
  };

  Edit.header.addEventListener('action', function(evt) {
    if (evt.detail.type != 'back') {
      return;
    }

    Navigation.pop();
    Edit.iframe.src = '';
  });

  Edit.panel.addEventListener('click', function(evt) {
    var target = evt.target;
    if (!target.classList.contains('edit')) {
      return;
    }

    Edit.pick(target.dataset.key);
  });

  exports.Edit = Edit;
})(window);
