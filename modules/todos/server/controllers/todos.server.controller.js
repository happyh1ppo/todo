'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Todo = mongoose.model('Todo'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a todo
 */
exports.create = function (req, res) {
  var todo = new Todo(req.body);
  todo.user = req.user;

  todo.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(todo);
    }
  });
};

/**
 * Show the current todo
 */
exports.read = function (req, res) {
  res.json(req.todo);
};

/**
 * Update a todo
 */
exports.update = function (req, res) {
  var todo = req.todo;

  todo.title = req.body.title;
  todo.description = req.body.description;

  todo.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(todo);
    }
  });
};

/**
 * Delete an todo
 */
exports.delete = function (req, res) {
  var todo = req.todo;

  todo.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(todo);
    }
  });
};

/**
 * List of Todos
 */

exports.count = function(req, res) {
  var user = _.get(req, 'user._id') || _.get(req, 'profile._id');
  Todo.count({ user: user }).exec(function (err, count) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(count);
    }
  });
};

exports.list = function (req, res) {
  var page = req.query.pageId || 0,
      user = _.get(req, 'user._id') || _.get(req, 'profile._id');
  console.log(user);

  new Promise(function(resolve, reject) {

  });

  Promise.resolve()
      .then(function() {
        return new Promise(function(resolve, reject) {
          Todo.count({ user: user }).exec(function (err, count) {
            if (err) {
              //return res.status(400).send({
              //  message: errorHandler.getErrorMessage(err)
              //});
              reject(err);
            } else {
              //res.json(count);
              resolve(count);
            }
          });
        });
      })
      .then(function(count) {
        Todo.find({ user: user })
            .skip(config.PAGE_SIZE * page)
            .limit(config.PAGE_SIZE)
            .sort('-created')
            .populate('user', 'displayName')
            .exec(function (err, todos) {
              if (err) {
                //return res.status(400).send({
                //  message: errorHandler.getErrorMessage(err)
                //});
                return Promise.reject(err);
              } else {
                res.json(todos);
              }
            });
      })
      .catch(function(err) {
        res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      })
};

/**
 * Todo middleware
 */
exports.todoByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Todo is invalid'
    });
  }

  Todo.findById(id).populate('user', 'displayName').exec(function (err, todo) {
    if (err) {
      return next(err);
    } else if (!todo) {
      return res.status(404).send({
        message: 'No todo with that identifier has been found'
      });
    }
    req.todo = todo;
    next();
  });
};

exports.pageId = function (req, res, next, page) {
    req.pageId = page;
    next();
};
