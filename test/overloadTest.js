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
  },

  'optional parameter, valid args': function (test) {
    var called = 0;
    var argFnCalled = 0;
    var fn = overload([
      [overload.funcOptional, function (fn) {
        called++;
        fn();
      }]
    ]);
    fn(function () { argFnCalled++; });
    test.equals(called, 1, 'overload not called');
    test.equals(argFnCalled, 1, 'arg function not called');
    test.done();
  },

  'optional parameter, valid args not given': function (test) {
    var called = 0;
    var fn = overload([
      [overload.funcOptional, function (fn) {
        called++;
        if (fn) {
          test.fail('no function should be passed');
        }
      }]
    ]);
    fn();
    test.equals(called, 1, 'overload not called');
    test.done();
  },

  'optional parameter, invalid args': function (test) {
    var called = 0;
    var fn = overload([
      [overload.funcOptional, function () { called++; }]
    ]);
    try {
      fn(1);
      test.fail('should throw exception');
    } catch (ex) {

    }
    test.done();
  },

  'multiple overloads, valid args': function (test) {
    var called = 0;
    var val = null;
    var fn = overload([
      [overload.number, function (n) { test.fail('this function should not be called'); }],
      [overload.string, function (s) {
        val = s;
        called++;
      }]
    ]);
    fn('test');
    test.equals(called, 1, 'overload not called');
    test.equals(val, 'test', 'overload called with wrong value');
    test.done();
  },

  'multiple overloads, invalid args': function (test) {
    var called = 0;
    var fn = overload([
      [overload.number, function (n) { test.fail('this function should not be called'); }],
      [overload.string, function (s) { called++; }]
    ]);
    try {
      fn(function () {});
      test.fail('should throw exception');
    } catch (ex) {

    }
    test.done();
  },

  'optional parameter, with default value': function (test) {
    var called = 0;
    var val = null;
    var fn = overload([
      [overload.numberOptionalWithDefault(5), function (n) {
        called++;
        val = n;
      }]
    ]);
    fn();
    test.equals(called, 1, 'overload not called');
    test.equals(val, 5);
    test.done();
  },

  'callback, with default value': function (test) {
    var called = 0;
    var fn = overload([
      [overload.callbackOptional, function (callback) {
        callback();
      }]
    ]);
    fn(function () { called++; });
    test.equals(called, 1, 'overload not called');
    test.done();
  },

  'complex': function (test) {
    var called = 0;
    var args = null;
    var fn = overload([
      [overload.string, function () { test.fail('this function should not be called'); }],
      [overload.string, overload.number, overload.funcOptional, function () {
        args = Array.prototype.slice.call(arguments, 0);
        called++;
      }]
    ]);
    var argFn = function () {};
    fn('test', 5, argFn);
    test.equals(called, 1, 'overload not called');
    test.deepEqual(args, ['test', 5, argFn], 'overload called with wrong args');
    test.done();
  }
};
