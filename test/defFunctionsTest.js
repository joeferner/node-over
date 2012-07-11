'use strict';

var overload = require('../');

module.exports = {
  'func, good': function (test) {
    test.equals(overload.func(function () {}), true);
    test.done();
  },

  'func, bad': function (test) {
    test.equals(overload.func(5), false);
    test.done();
  },

  'funcOptional, good': function (test) {
    test.equals(overload.funcOptional(function () {}), true);
    test.done();
  },

  'funcOptional, bad': function (test) {
    test.equals(overload.funcOptional(5), false);
    test.done();
  },

  'string, good': function (test) {
    test.equals(overload.string('test'), true);
    test.done();
  },

  'string, bad': function (test) {
    test.equals(overload.string(5), false);
    test.done();
  },

  'stringOptional, good': function (test) {
    test.equals(overload.stringOptional('test'), true);
    test.done();
  },

  'stringOptional, bad': function (test) {
    test.equals(overload.stringOptional(5), false);
    test.done();
  },

  'number, good': function (test) {
    test.equals(overload.number(5), true);
    test.done();
  },

  'number, bad': function (test) {
    test.equals(overload.number('test'), false);
    test.done();
  },

  'numberOptional, good': function (test) {
    test.equals(overload.numberOptional(5), true);
    test.done();
  },

  'numberOptional, bad': function (test) {
    test.equals(overload.numberOptional('test'), false);
    test.done();
  }
};
