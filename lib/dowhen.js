var async = require('async');

var AndThen = function(obj, ev) {
    var args,
        triggerCallbacks,
        objCallback,
        callbacks = [];

    triggerCallbacks = function() {
        for(var i = 0; i < callbacks.length; ++i) {
            var callback = callbacks.splice(i)[0];
        
            async.nextTick(function() {
                callback.apply(callback, args);
            });
        }
    };

    this.on = function(obj, ev) {
        objCallback = function() {
            args = arguments;
            triggerCallbacks();
        };
        obj.on(ev, objCallback);
    };
    this.on(obj, ev);

    this.off = function() {
        obj.removeCallback(objCallback);
    };

    this.addCallback = function(callback) {
        callbacks.push(callback);

        if (typeof(args) != 'undefined') {
            triggerCallbacks();
        }
    };

    this.do = this.addCallback;

    this.removeCallback = function(callback) {
        var i = callbacks.indexOf(callback);

        if (i != -1) {
            callbacks.splice(i);
            return true;
        } else {
            return false;
        }
    };
};

module.exports = AndThen;
