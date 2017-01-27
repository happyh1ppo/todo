'use strict';

// Configuring the Todos module
angular.module('todos').run(['Menus',
  function (Menus) {
    // Add the todos dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Todos',
      state: 'todos',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'todos', {
      title: 'List Todos',
      state: 'todos.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'todos', {
      title: 'Create Todo',
      state: 'todos.create',
      roles: ['user']
    });
  }
]);
