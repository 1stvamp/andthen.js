var async = require('async');

var DoWhen = function(obj, ev) {
    var objCallback,
        triggerCallbacks,
        args = null,
        callbacks = [];

    if (typeof(obj) == 'undefined') {
        // error
    }
    if (typeof(ev) == 'undefined') {
        //error
    }

    triggerCallbacks = function() {
        if (args !== null && callbacks.length > 0) {
            for(var i = 0; i < callbacks.length; ++i) {
                var callback = callbacks[i];

                async.nextTick(function() {
                    callback.apply(callback, args);
                });
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
    this.on = function(obj, ev) {
        obj.on(ev, objCallback);
    };
    this.on(obj, ev);

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

module.exports = DoWhen;
