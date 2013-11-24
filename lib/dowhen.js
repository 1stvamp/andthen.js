var async = require('async');

var DoWhen = function(obj, ev) {
    var objCallback,
        triggerCallbacks,
        args = null,
        callbacks = [];

    if (typeof(obj) == 'undefined') {
        throw new TypeError('obj argument must either be a function or an EventEmitter-like object');
    }
    if (typeof(ev) == 'undefined') {
        throw new TypeError('ev argument must be an event string or argument');
    }

    triggerCallbacks = function() {
        if (args !== null && callbacks.length > 0) {
            for(var i = 0; i < callbacks.length; i++) {
                var callback = callbacks[i];

                async.nextTick(function() {
                    this.apply(this, args);
                }.bind(callback));
            }
            callbacks = [];
            return true;
        } else {
            return false;
        }
    };

    objCallback = function() {
        args = arguments;
        triggerCallbacks();
    };

    this.on = function(_obj, _ev) {
        if (typeof(_obj) == 'undefined') {
            obj.on(ev, objCallback);
        } else {
            _obj.on(_ev, objCallback);
        }
    };

    this.call = function(_obj, _ev) {
        if (typeof(_obj) == 'undefined') {
            obj(ev, objCallback);
        } else {
            _obj(_ev, objCallback);
        }
    };

    this.off = function() {
        obj.removeCallback(objCallback);
    };

    this.addCallback = function(callback) {
        callbacks.push(callback);

        if (args !== null) {
            triggerCallbacks();
        }
    };

    this.do = this.addCallback;

    this.removeCallback = function(callback) {
        var i = callbacks.indexOf(callback);

        if (i != -1) {
            callbacks.splice(i, 1);
            return true;
        } else {
            return false;
        }
    };
};

module.exports = {'DoWhen': DoWhen};
