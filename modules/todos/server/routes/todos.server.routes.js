'use strict';

/**
 * Module dependencies.
 */
var todosPolicy = require('../policies/todos.server.policy'),
  todos = require('../controllers/todos.server.controller');

module.exports = function (app) {
  // Todos collection routes
  app.route('/api/todos').all(todosPolicy.isAllowed)
    .get(todos.list)
    .post(todos.create);

  // Single todo routes
  app.route('/api/todos/:todoId').all(todosPolicy.isAllowed)
    .get(todos.read)
    .put(todos.update)
    .delete(todos.delete);

  // Finish by binding the todo middleware
  app.param('todoId', todos.todoByID);
};
