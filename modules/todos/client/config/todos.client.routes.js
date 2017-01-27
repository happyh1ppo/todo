'use strict';

// Setting up route
angular.module('todos').config(['$stateProvider',
  function ($stateProvider) {
    // Todos state routing
    $stateProvider
      .state('todos', {
        abstract: true,
        url: '/todos',
        template: '<ui-view/>'
      })
      .state('todos.list', {
        url: '',
        templateUrl: 'modules/todos/client/views/list-todos.client.view.html'
      })
      .state('todos.create', {
        url: '/create',
        templateUrl: 'modules/todos/client/views/create-todo.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('todos.view', {
        url: '/:todoId',
        templateUrl: 'modules/todos/client/views/view-todo.client.view.html'
      })
      .state('todos.edit', {
        url: '/:todoId/edit',
        templateUrl: 'modules/todos/client/views/edit-todo.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
