'use strict';

// Todos controller
angular.module('todos').controller('TodosController', ['$scope', '$rootScope', '$stateParams', '$location', '$http', 'Authentication', 'Todos',
  function ($scope, $rootScope, $stateParams, $location, $http, Authentication, Todos) {
    var config = $rootScope.config;
    $scope.authentication = Authentication;
    $scope.user = $scope.authentication.user;
    $scope.list = [];

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
        list: this.list
      });

      // Redirect after save
      todo.$save(function (response) {
        $location.path('todos/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.description = '';
        $scope.list = [];
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
      $scope.todo = Todos.get({
        todoId: $stateParams.todoId
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
    $scope.doubleClicked = function (event) {
      //alert('works!');
      $scope.addNewListElement();
    };

    $scope.addNewListElement = function () {
      var newElement = {
        text: '',
        done: false
      };

      if ($scope.todo && $scope.todo.list) {
        $scope.todo.list.push(newElement);
      }
      else {
        $scope.list.push(newElement);
      }
    };
  }
]);
