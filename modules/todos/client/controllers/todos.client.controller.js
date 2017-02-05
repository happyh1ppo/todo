'use strict';

// Todos controller
angular.module('todos').controller('TodosController', ['$scope', '$rootScope', '$stateParams', '$location', '$http', 'Authentication', 'Todos',
  function ($scope, $rootScope, $stateParams, $location, $http, Authentication, Todos) {
    var config = $rootScope.config;
    $scope.authentication = Authentication;
    $scope.user = $scope.authentication.user;
    $scope.todoList = [];

    // Create new Todo
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'todoForm');

        return false;
      }

      // Create new Todo object
      var todo = new Todos({
        title: this.title,
        description: this.description,
        list: $scope.todoList
      });

      // Redirect after save
      todo.$save(function (response) {
        $location.path('todos/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.description = '';
        $scope.todoList = [];
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Todo
    $scope.remove = function (todo) {
      if (todo) {
        todo.$remove();

        for (var i in $scope.todos) {
          if ($scope.todos[i] === todo) {
            $scope.todos.splice(i, 1);
          }
        }
      } else {
        $scope.todo.$remove(function () {
          $location.path('todos');
        });
      }
    };

    // Update existing Todo
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'todoForm');

        return false;
      }

      var todo = $scope.todo;
      todo.list = $scope.todoList;

      todo.$update(function () {
        $location.path('todos/' + todo._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Todos
    $scope.find = function () {
      console.log('api/todos/count');
      //$http.get("api/todos/count")
      //    .then(function(response) {
      //      $scope.test = response;
      //      console.log('data :', response.data);
      //      console.log('status :', response.status);
      //      console.log('headers :', response.headers());
      //    },function(err) {
      //      console.log('error! :', err);
      //    });
      //$scope.count = response;

      $scope.todos = Todos.query({
        //pageId: $stateParams.pageId
      });
    };

    // Decide either to show pagination block or not
    $scope.showPagination = function() {
      return $scope.todos.$resolved && $scope.todos.length > config.PAGE_SIZE;
    };

    // Find existing Todo
    $scope.findOne = function () {
      Todos.get({
        todoId: $stateParams.todoId
      })
      .$promise.then(function (todo) {
        $scope.todo = todo;
        $scope.todoList = todo.list;
      });
    };

    // Init function
    $scope.init = function () {
      //test
    };

    // Handle keyboard events
    $scope.keyPressed = function (event) {
      if (event.which === 13) {
        alert('keyboard event works!');
      }
    };

    // Handle mouse events
    $scope.doubleClicked = function (id) {
      $location.path('todos/' + id + '/edit');
    };

    $scope.clicked = function (e) {
      var i,
        found = false,
        length = e.target.classList.length;
      if (length) {
        for (i = 0; i < length; i++) {
          if (e.target.classList[i] === 'todo-input') {
            found = true;
            break;
          }
        }
        if (found) {
          return;
        }
      }
      // if clicked non-input element - hide editing
      $scope.editing = -1;
    };

    // Add new todo list item
    $scope.addNewListElement = function () {
      // if the last item is empty then do nothing
      var length = $scope.todoList.length;
      if (length && $scope.todoList[length - 1].text === '') {
        return;
      }

      var newElement = {
        text: '',
        done: false
      };

      $scope.todoList.push(newElement);
      $scope.editing = $scope.todoList.length - 1;
    };

    // Mark todo list item as Done/Undone
    $scope.checkDone = function (index) {
      if ($scope.todoList[index]) {
        var element = $scope.todoList[index];
        element.done = !element.done;
      }
    };

    // Edit todo list item
    $scope.startEdit = function (index) {
      if ($scope.todoList[index]) {
        $scope.editing = index;
      }
    };

    // Delete todo list item
    $scope.deleteListItem = function (index) {
      if ($scope.todoList[index]) {
        $scope.todoList.splice(index, 1);
      }
    };

    // Check all list items
    $scope.checkAllItems = function () {
      var i,
        length = $scope.todoList.length;

      if (length) {
        for (i = 0; i < length; i++) {
          $scope.todoList[i].done = true;
        }
      }
    };

    // Uncheck all list items
    $scope.uncheckAllItems = function () {
      var i,
        length = $scope.todoList.length;

      if (length) {
        for (i = 0; i < length; i++) {
          $scope.todoList[i].done = false;
        }
      }
    };
  }
]);
