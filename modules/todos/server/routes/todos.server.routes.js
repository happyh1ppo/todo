'use strict';

/**
 * Module dependencies.
 */
var todosPolicy = require('../policies/todos.server.policy'),
  todos = require('../controllers/todos.server.controller'),
  users = require('../../../users/server/controllers/users.server.controller');

module.exports = function (app) {
  // Todos collection routes
  app.route('/api/todos').all(todosPolicy.isAllowed)
    .get(todos.list);
  app.route('/api/todos/page/:pageId').all(todosPolicy.isAllowed)
    .get(todos.list);

  app.route('/api/todos').all(todosPolicy.isAllowed)
    .post(todos.create);

  app.route('/api/todos/count').all(todosPolicy.isAllowed)
      .get(todos.count);

  // Single todo routes
  app.route('/api/todos/:todoId').all(todosPolicy.isAllowed)
    .get(todos.read)
    .put(todos.update)
    .delete(todos.delete);

  // Finish by binding the todo middleware
  app.param('todoId', todos.todoByID);
  app.param('pageId', todos.pageId);
  //app.param('userId', users.userByID);
};
