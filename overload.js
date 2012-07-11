'use strict';

// overloadDefs
// self, overloadDefs
var overload = module.exports = function () {
  var self, selfSet = false, overloadDefs;
  if (arguments.length === 1) {
    overloadDefs = arguments[0];
  } else {
    selfSet = true;
    self = arguments[0];
    overloadDefs = arguments[1];
  }
  return function () {
    if (!selfSet) {
      self = this;
    }
    var args = Array.prototype.slice.call(arguments);
    var overloadMatchData = findOverload(overloadDefs, args);
    if (!overloadMatchData) {
      throw new Error(createErrorMessage('No match found.', overloadDefs));
    }
    var overloadFn = overloadMatchData.def[overloadMatchData.def.length - 1];
    overloadFn.apply(self, overloadMatchData.args);
  };
};

var findOverload = overload.findOverload = function (overloadDefs, args) {
  for (var i = 0; i < overloadDefs.length; i++) {
    if (i === overloadDefs.length - 1 && typeof(overloadDefs[i]) === 'function') {
      return { args: args, def: [overloadDefs[i]] };
    }
    var newArgs;
    if (newArgs = isMatch(overloadDefs[i], args)) {
      return { args: newArgs, def: overloadDefs[i] };
    }
  }
  return null;
};

function isMatch(overloadDef, args) {
  var overloadDefIdx;
  var argIdx;
  var newArgs = [];
  for (overloadDefIdx = 0, argIdx = 0; overloadDefIdx < overloadDef.length - 1; overloadDefIdx++) {
    if (typeof(overloadDef[overloadDefIdx]) !== 'function') {
      throw new Error("Invalid overload definition. Array should only contain functions.");
    }
    var result = overloadDef[overloadDefIdx](args[argIdx]);
    if (result) {
      if (result.hasOwnProperty('defaultValue')) {
        newArgs.push(result.defaultValue);
      } else {
        newArgs.push(args[argIdx]);
        argIdx++;
      }
    } else {
      if (overloadDef[overloadDefIdx].optional) {
        newArgs.push(undefined);
        continue;
      }
      return false;
    }
  }
  //console.log(overloadDefIdx, overloadDef.length - 1, argIdx, args.length, newArgs.length);
  if (overloadDefIdx === overloadDef.length - 1 && argIdx === args.length) {
    return newArgs;
  }
  return false;
}

function createErrorMessage(message, overloadDefs) {
  message += '\n';
  message += '  Possible matches:\n';
  for (var i = 0; i < overloadDefs.length; i++) {
    var overloadDef = overloadDefs[i];
    if (typeof(overloadDef) === 'function') {
      message += '   [default]\n';
    } else {
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
  }
  return message;
}

// --- func
overload.func = function func(arg) {
  return typeof(arg) === 'function';
};

overload.funcOptional = function funcOptional(arg) {
  return overload.func(arg);
};
overload.funcOptional.optional = true;

overload.funcOptionalWithDefault = function (def) {
  return function funcOptionalWithDefault(arg) {
    if (arg === undefined) {
      return { defaultValue: def };
    }
    return overload.func(arg);
  }
};
overload.funcOptionalWithDefault.optional = true;

// --- callback
overload.callbackOptional = function callbackOptional(arg) {
  if (arg === undefined) {
    return { defaultValue: function defaultCallback() {} };
  }
  return overload.func(arg);
};
overload.callbackOptional.optional = true;

// --- string
overload.string = function string(arg) {
  return typeof(arg) === 'string';
};

overload.stringOptional = function stringOptional(arg) {
  return overload.string(arg);
};
overload.stringOptional.optional = true;

overload.stringOptionalWithDefault = function (def) {
  return function stringOptionalWithDefault(arg) {
    if (arg === undefined) {
      return { defaultValue: def };
    }
    return overload.string(arg);
  }
};
overload.stringOptionalWithDefault.optional = true;

// --- number
overload.number = function number(arg) {
  return typeof(arg) === 'number';
};

overload.numberOptional = function numberOptional(arg) {
  return overload.number(arg);
};
overload.numberOptional.optional = true;

overload.numberOptionalWithDefault = function (def) {
  return function numberOptionalWithDefault(arg) {
    if (arg === undefined) {
      return { defaultValue: def };
    }
    return overload.number(arg);
  }
};
overload.numberOptionalWithDefault.optional = true;

// --- array
overload.array = function array(arg) {
  return arg instanceof Array;
};

overload.arrayOptional = function arrayOptional(arg) {
  return overload.array(arg);
};
overload.arrayOptional.optional = true;

overload.arrayOptionalWithDefault = function (def) {
  return function arrayOptionalWithDefault(arg) {
    if (arg === undefined) {
      return { defaultValue: def };
    }
    return overload.array(arg);
  }
};
overload.arrayOptionalWithDefault.optional = true;

// --- object
overload.object = function object(arg) {
  return typeof(arg) === 'object';
};

overload.objectOptional = function objectOptional(arg) {
  return overload.object(arg);
};
overload.objectOptional.optional = true;

overload.objectOptionalWithDefault = function (def) {
  return function objectOptionalWithDefault(arg) {
    if (arg === undefined) {
      return { defaultValue: def };
    }
    return overload.object(arg);
  }
};
overload.objectOptionalWithDefault.optional = true;
