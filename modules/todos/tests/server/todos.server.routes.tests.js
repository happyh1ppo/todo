'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Todo = mongoose.model('Todo'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, todo;

/**
 * Todo routes tests
 */
describe('Todo CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new todo
    user.save(function () {
      todo = {
        title: 'Todo Title',
        content: 'Todo Content'
      };

      done();
    });
  });

  it('should be able to save an todo if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new todo
        agent.post('/api/todos')
          .send(todo)
          .expect(200)
          .end(function (todoSaveErr, todoSaveRes) {
            // Handle todo save error
            if (todoSaveErr) {
              return done(todoSaveErr);
            }

            // Get a list of todos
            agent.get('/api/todos')
              .end(function (todosGetErr, todosGetRes) {
                // Handle todo save error
                if (todosGetErr) {
                  return done(todosGetErr);
                }

                // Get todos list
                var todos = todosGetRes.body;

                // Set assertions
                (todos[0].user._id).should.equal(userId);
                (todos[0].title).should.match('Todo Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an todo if not logged in', function (done) {
    agent.post('/api/todos')
      .send(todo)
      .expect(403)
      .end(function (todoSaveErr, todoSaveRes) {
        // Call the assertion callback
        done(todoSaveErr);
      });
  });

  it('should not be able to save an todo if no title is provided', function (done) {
    // Invalidate title field
    todo.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new todo
        agent.post('/api/todos')
          .send(todo)
          .expect(400)
          .end(function (todoSaveErr, todoSaveRes) {
            // Set message assertion
            (todoSaveRes.body.message).should.match('Title cannot be blank');

            // Handle todo save error
            done(todoSaveErr);
          });
      });
  });

  it('should be able to update an todo if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new todo
        agent.post('/api/todos')
          .send(todo)
          .expect(200)
          .end(function (todoSaveErr, todoSaveRes) {
            // Handle todo save error
            if (todoSaveErr) {
              return done(todoSaveErr);
            }

            // Update todo title
            todo.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing todo
            agent.put('/api/todos/' + todoSaveRes.body._id)
              .send(todo)
              .expect(200)
              .end(function (todoUpdateErr, todoUpdateRes) {
                // Handle todo update error
                if (todoUpdateErr) {
                  return done(todoUpdateErr);
                }

                // Set assertions
                (todoUpdateRes.body._id).should.equal(todoSaveRes.body._id);
                (todoUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of todos if not signed in', function (done) {
    // Create new todo model instance
    var todoObj = new Todo(todo);

    // Save the todo
    todoObj.save(function () {
      // Request todos
      request(app).get('/api/todos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single todo if not signed in', function (done) {
    // Create new todo model instance
    var todoObj = new Todo(todo);

    // Save the todo
    todoObj.save(function () {
      request(app).get('/api/todos/' + todoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', todo.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single todo with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/todos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Todo is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single todo which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent todo
    request(app).get('/api/todos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No todo with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an todo if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new todo
        agent.post('/api/todos')
          .send(todo)
          .expect(200)
          .end(function (todoSaveErr, todoSaveRes) {
            // Handle todo save error
            if (todoSaveErr) {
              return done(todoSaveErr);
            }

            // Delete an existing todo
            agent.delete('/api/todos/' + todoSaveRes.body._id)
              .send(todo)
              .expect(200)
              .end(function (todoDeleteErr, todoDeleteRes) {
                // Handle todo error error
                if (todoDeleteErr) {
                  return done(todoDeleteErr);
                }

                // Set assertions
                (todoDeleteRes.body._id).should.equal(todoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an todo if not signed in', function (done) {
    // Set todo user
    todo.user = user;

    // Create new todo model instance
    var todoObj = new Todo(todo);

    // Save the todo
    todoObj.save(function () {
      // Try deleting todo
      request(app).delete('/api/todos/' + todoObj._id)
        .expect(403)
        .end(function (todoDeleteErr, todoDeleteRes) {
          // Set message assertion
          (todoDeleteRes.body.message).should.match('User is not authorized');

          // Handle todo error error
          done(todoDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Todo.remove().exec(done);
    });
  });
});
