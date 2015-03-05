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

    prepareForDisplay: function(params) {
      currentTheme = params.theme;

      this.title.textContent = params.group + ' / ' + params.section;
      this.header.setAttr('action', 'back');

      this.picker.onchange = () => {
        if (!currentKey) {
          return;
        }
        var value = this.picker.value;
        this.iframe.contentDocument.body.style.setProperty(currentKey, value);
      };

      var currentList = this.list.querySelector('gaia-list');
      if (currentList) {
        this.list.removeChild(currentList);
      }

      var list = document.createElement('gaia-list')
      currentSection = currentTheme.groups[params.group][params.section];

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

  Edit.editColor.addEventListener('click', function(evt) {
    var target = evt.target;

    if (target.classList.contains('save')) {
      if (!currentKey) {
        return;
      }

      var value = Edit.picker.value;
      currentSection[currentKey] = value;

      var elem = Edit.list.querySelector('[data-id=' + currentKey + ']')
      elem.textContent = value;

      Storage.updateTheme(currentTheme).then(() => {
        Edit.editColor.classList.remove('editing');
        currentKey = null;
      }).catch(function(error) {
        console.log(error);
      });
      return;
    }

    if (!target.classList.contains('cancel')) {
      return;
    }

    if (currentKey) {
      var value = currentSection[currentKey];
      Edit.iframe.contentDocument.body.style.setProperty(currentKey, value);
    }

    Edit.editColor.classList.remove('editing');
    currentKey = null;
  });

  exports.Edit = Edit;
})(window);
