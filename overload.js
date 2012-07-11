'use strict';

var overload = module.exports = function (overloadDefs) {
  var self = this;
  return function () {
    var overloadMatch = findOverload(overloadDefs, arguments);
    if (!overloadMatch) {
      throw new Error(createErrorMessage('No match found.', overloadDefs));
    }
    var overloadFn = overloadMatch[overloadMatch.length - 1];
    overloadFn.apply(self, arguments);
  };
};

var findOverload = overload.findOverload = function (overloadDefs, args) {
  for (var i = 0; i < overloadDefs.length; i++) {
    if (isMatch(overloadDefs[i], args)) {
      return overloadDefs[i];
    }
  }
  return null;
};

function isMatch(overloadDef, args) {
  var overloadDefIdx;
  var argIdx;
  for (overloadDefIdx = 0, argIdx = 0; overloadDefIdx < overloadDef.length - 1; overloadDefIdx++) {
    if (typeof(overloadDef[overloadDefIdx]) !== 'function') {
      throw new Error("Invalid overload definition. Array should only contain functions.");
    }
    if (!overloadDef[overloadDefIdx](args[argIdx])) {
      if (overloadDef[overloadDefIdx].optional) {
        continue;
      }
      return false;
    }
    argIdx++;
  }
  if (overloadDefIdx === overloadDef.length - 1 && argIdx === args.length) {
    return true;
  }
  return false;
}

function createErrorMessage(message, overloadDefs) {
  message += '\n';
  message += '  Possible matches:\n';
  for (var i = 0; i < overloadDefs.length; i++) {
    var overloadDef = overloadDefs[i];
    var matchers = overloadDef.slice(0, overloadDef.length - 1);
    matchers = matchers.map(function (m) {
      if (!m) {
        return '[invalid argument definition]';
      }
      return m.name || m;
    });
    if (matchers.length === 0) {
      message += '   ()\n';
    } else {
      message += '   (' + matchers.join(', ') + ')\n';
    }
  }
  return message;
}

overload.func = function func(arg) {
  return typeof(arg) === 'function';
};

overload.funcOptional = function funcOptional(arg) {
  return typeof(arg) === 'function';
};
overload.funcOptional.optional = true;

overload.string = function string(arg) {
  return typeof(arg) === 'string';
};

overload.stringOptional = function stringOptional(arg) {
  return typeof(arg) === 'string';
};
overload.stringOptional.optional = true;

overload.number = function number(arg) {
  return typeof(arg) === 'number';
};

overload.numberOptional = function numberOptional(arg) {
  return typeof(arg) === 'number';
};
overload.numberOptional.optional = true;
