var async = require('async');

var AndThen = function(obj, ev) {
    var args,
        triggerCallbacks,
        callbacks = [];

    triggerCallbacks = function() {
        for(var i = 0; i < callbacks.length; ++i) {
            var callback = callbacks.splice(i)[0];
        
            async.nextTick(function() {
                callback.apply(callback, args);
            });
        }
    };

    obj.on(ev, function() {
        args = arguments;
        triggerCallbacks();
    });

    this.do = function(callback) {
        callbacks.push(callback);

        if (typeof(args) != 'undefined') {
            triggerCallbacks();
        }
    }
};

module.exports = AndThen;
