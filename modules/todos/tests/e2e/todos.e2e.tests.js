'use strict';

describe('Todos E2E Tests:', function () {
  describe('Test todos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/todos');
      expect(element.all(by.repeater('todo in todos')).count()).toEqual(0);
    });
  });
});
