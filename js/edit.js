(function(exports) {
  'use strict';

  var currentSection = null;

  var Edit = {
    panel: document.getElementById('edit'),
    header: document.querySelector('#edit gaia-header'),
    title: document.querySelector('#edit gaia-header h1'),
    list: document.querySelector('#edit-list'),
    iframe: document.querySelector('#edit iframe'),

    prepareForDisplay: function(params) {
      this.title.textContent = params.section;
      this.header.setAttr('action', 'back');

      var currentList = this.list.querySelector('gaia-list');
      if (currentList) {
        this.list.removeChild(currentList);
      }

      var list = document.createElement('gaia-list')
      currentSection = params.theme.sections[params.section];

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

    change: function(key) {
      // TODO: put a real color picker
      var value = prompt(key, currentSection[key]);
      this.iframe.contentDocument.body.style.setProperty(key, value);

      var elem = this.list.querySelector('[data-id=' + key + ']')
      elem.textContent = value;

      // TODO: make the change persistent
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

    Edit.change(target.dataset.key);
  });

  exports.Edit = Edit;
})(window);
