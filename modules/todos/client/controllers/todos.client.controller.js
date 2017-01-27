'use strict';

// Todos controller
angular.module('todos').controller('TodosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Todos',
  function ($scope, $stateParams, $location, Authentication, Todos) {
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
        content: this.content,
        list: this.list
      });

      // Redirect after save
      todo.$save(function (response) {
        $location.path('todos/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
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
      $scope.todos = Todos.query({} , { user: $scope.user.id });
    };

    // Find existing Todo
    $scope.findOne = function () {
      //Todos.get({
      //  todoId: $stateParams.todoId
      //}).exec(function (err, todo) {
      //  if (err)
      //    $scope.error = err.data.message;
      //  $scope.todo = todo;
      //});
      console.log(Todos.get);
      $scope.todo = Todos.get({
        todoId: $stateParams.todoId
      });
    };

    // Init function
    $scope.init = function () {
      //console.log("Test");
    };

    // Handle keyboard events
    $scope.keyPressed = function (event) {
      if (event.which === 13) {
        alert('works!');
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
