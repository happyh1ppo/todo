'use strict';

(function () {
  // Todos Controller Spec
  describe('Todos Controller Tests', function () {
    // Initialize global variables
    var TodosController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Todos,
      mockTodo;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Todos_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Todos = _Todos_;

      // create mock todo
      mockTodo = new Todos({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Todo about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Todos controller.
      TodosController = $controller('TodosController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one todo object fetched from XHR', inject(function (Todos) {
      // Create a sample todos array that includes the new todo
      var sampleTodos = [mockTodo];

      // Set GET response
      $httpBackend.expectGET('api/todos').respond(sampleTodos);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.todos).toEqualData(sampleTodos);
    }));

    it('$scope.findOne() should create an array with one todo object fetched from XHR using a todoId URL parameter', inject(function (Todos) {
      // Set the URL parameter
      $stateParams.todoId = mockTodo._id;

      // Set GET response
      $httpBackend.expectGET(/api\/todos\/([0-9a-fA-F]{24})$/).respond(mockTodo);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.todo).toEqualData(mockTodo);
    }));

    describe('$scope.create()', function () {
      var sampleTodoPostData;

      beforeEach(function () {
        // Create a sample todo object
        sampleTodoPostData = new Todos({
          title: 'An Todo about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Todo about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Todos) {
        // Set POST response
        $httpBackend.expectPOST('api/todos', sampleTodoPostData).respond(mockTodo);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the todo was created
        expect($location.path.calls.mostRecent().args[0]).toBe('todos/' + mockTodo._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/todos', sampleTodoPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock todo in scope
        scope.todo = mockTodo;
      });

      it('should update a valid todo', inject(function (Todos) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/todos\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/todos/' + mockTodo._id);
      }));

      it('should set scope.error to error response message', inject(function (Todos) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/todos\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(todo)', function () {
      beforeEach(function () {
        // Create new todos array and include the todo
        scope.todos = [mockTodo, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/todos\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockTodo);
      });

      it('should send a DELETE request with a valid todoId and remove the todo from the scope', inject(function (Todos) {
        expect(scope.todos.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.todo = mockTodo;

        $httpBackend.expectDELETE(/api\/todos\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to todos', function () {
        expect($location.path).toHaveBeenCalledWith('todos');
      });
    });
  });
}());
