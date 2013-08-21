;
(function (global, alias) {
    if (typeof global[alias] === 'function') {
        return
    }

    var X = function () {

    }

    X.version = '0.0.0'
    X.__modules = {}

    X.define = typeof define === 'function' && define.amd && define ||
        function (module, deps, factory) {
            if (deps && deps.length) {
                for (var i = 0; i < deps.length; ++i) {
                    deps[i] = X.__modules[deps[i]]
                }
            }

            X.__modules[module] = factory.apply(this, deps || [])
        }

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = X
    } else if (typeof define !== 'function' || !define.amd) {
        //no amd and no cmd, exposure alias to the global
        global[alias] = X
        global.define = X.define
    }

    X.define('X.core', [], function () {
        return X
    })

}(typeof global !== 'undefined' ? global : this, 'X'))