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
  var i;
  for (i = 0; i < overloadDef.length - 1 && i < args.length; i++) {
    if (!overloadDef[i](args[i])) {
      return false;
    }
  }
  if (i === overloadDef.length - 1 && i === args.length) {
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
