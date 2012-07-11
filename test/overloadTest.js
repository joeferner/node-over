'use strict';

var overload = require('../');

module.exports = {
  'no parameters, valid args': function (test) {
    var called = 0;
    var fn = overload([
      [function () { called++; }]
    ]);
    fn();
    test.equals(called, 1);
    test.done();
  },

  'no parameters, invalid args': function (test) {
    var called = 0;
    var fn = overload([
      [function () { called++; }]
    ]);
    try {
      fn(1);
      test.fail('should throw exception');
    } catch (ex) {

    }
    test.done();
  },

  'one parameter, valid args': function (test) {
    var called = 0;
    var argFnCalled = 0;
    var fn = overload([
      [overload.func, function (fn) {
        called++;
        fn();
      }]
    ]);
    fn(function () { argFnCalled++; });
    test.equals(called, 1, 'overload not called');
    test.equals(argFnCalled, 1, 'arg function not called');
    test.done();
  },

  'one parameter, invalid args': function (test) {
    var called = 0;
    var fn = overload([
      [overload.func, function () { called++; }]
    ]);
    try {
      fn(1);
      test.fail('should throw exception');
    } catch (ex) {

    }
    test.done();
  }
};
