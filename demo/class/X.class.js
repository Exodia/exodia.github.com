;
/**
 * @class Class
 * A simple implement of OO Class System
 *
 * See the example:
 *      @example
 *      //create a simple Super class
 *      var Super = X.Class.create({
 *          constructor: function(prop1, prop2){
 *            this.prop1 = prop1
 *            this.prop2 = prop2
 *          },
 *          method1: function () {
 *               alert('Super method1')
 *          }
 *      })
 *
 *      //create a Sub class which inherits the Super class
 *      var Sub = X.Class.create(Super, {
 *          constructor: function(prop1, prop2, prop3){
 *             //call the Super Class's "constructor" method,
 *             //and pass the prop1, prop2 as the arguments
 *             this.$super('constructor', prop1, prop2)
 *             this.prop3 = prop3
 *          }
 *      })
 *
 *      //if your code is not in strict mode, using this.$$super() method,
 *      //you can call the parent's method of the same name so simply!
 *
 *      var Sub2 = X.Class.create(Sub, {
 *          constructor: function(prop1, prop2, prop3){
 *             //call the Sub Class's "constructor" method,
 *             //and pass the prop1, prop2, prop3 as the arguments
 *             this.$$super(prop1, prop2, prop3)
 *          },
 *          method1: function(){
 *              //call the Sub's "method1" method
 *              this.$$super()
 *              alert('Sub2 method1')
 *          }
 *      })
 */
define('X.class', ['X.core'], function (X) {
    var slice = [].slice,
        apply = function (obj, props) {
            for (var k in props) {
                obj[k] = props[k]
            }
        }

    /**
     * Create an anonymous class
     * usage: new X.Class(config)  or  X.Class.create(config)
     * @constructor
     * @return {X.Class}
     */
    var Class = function () {
        return Class.create(slice.call(arguments))
    }

    apply(Class, {
        /**
         * Return a X.Class instance function, equal new Class(Super, overrides)
         * @method X.Class
         * @static
         *
         * @param {X.Class/Function} Super
         * Optional, the parent class that this class extends, can be ignored.
         *
         * @param {Object} overrides
         * A Class config, which will be added to the prototype of the Class,
         * and shared by the Class instances!
         * However, there are some special important config properties as follows:
         *
         * @param {Function} overrides.constructor A initialize method.
         * When creating a instance from a Class,
         * this method will always be called just acts as the constructor
         *
         * @param {Object} overrides.__statics
         * Every key and value in overrides.__statics will be added to the Class Object,
         * just as the static properties.
         * You can use the Class.prop to retrieve the static property.
         *
         * @returns {X.Class}
         */
        create: function (Super, overrides) {

            var kclass = Class._extend(Class)

            if (typeof Super === 'function') {
                kclass = Class._extend(Super)
                overrides = overrides || {}
            } else if (typeof Super === 'object') {
                overrides = Super
            } else {
                throw new Error("Class create error: The first arguments should be an function or Object")
            }

            var proto = kclass.prototype,
                protoStatics = proto.__statics,
                overStatics = overrides.__statics,
                k


            //覆盖其余属性
            for (k in overrides) {
                if (typeof overrides[k] === 'function') {
                    overrides[k].__name__ = k
                    overrides[k].__owner__ = kclass
                }
                k !== 'statics' && (proto[k] = overrides[k])
            }


            //覆盖静态属性
            for (k in overStatics) {
                kclass[k] = protoStatics[k] = overStatics[k]
            }

            return kclass
        },

        /**
         * used for X.Class.create method
         * @private
         * @param superCls
         * @returns {X.Class}
         * @private
         */
        _extend: function (superCls) {
            var kclass = function () {
                this.constructor.apply(this, arguments)
            }

            if (typeof superCls !== 'function') {
                return kclass
            }

            var fn = function () {

            }

            fn.prototype = superCls.prototype
            kclass.prototype = new fn
            kclass.__super = superCls

            apply(kclass.prototype, {
                $self: kclass,
                __statics: {}
            })

            var statics = superCls.prototype.__statics

            for (var k  in statics) {
                kclass[k] = kclass.prototype.__statics[k] = statics[k]
            }

            return kclass
        }
    })

    apply(Class.prototype, {
        /**
         * @property {X.Class} $self
         *
         * Get the reference to the current class from which this object was instantiated.
         * `this.self` is scope-dependent and it's meant to be used for dynamic inheritance.
         *
         *      var Frog = X.Class({
         *          __statics: {
         *              name: 'Frog'         //Super.name = 'Frog'
         *          },
         *          getName: function(){
         *              alert(this.$self.name)  //dependent on 'this'
         *          }
         *      })
         *
         *      var Dog = X.Class({
         *          __statics: {
         *              name: 'Dog'         //Super.name = 'Dog'
         *          },
         *          getName: function(){
         *              alert(this.$self.name)  //dependent on 'this'
         *          }
         *      })
         *
         *      var frog = new Frog,
         *          dog = new Dog
         *
         *      frog.getName()  //alerts 'Frog'
         *      dog.getName()  //alerts 'Dog'
         */
        $self: Class,

        __super: null,

        __statics: {},

        constructor: function () {
        },

        $super: function (method) {
            var fn = this.$self.__super.prototype[method]
            if (typeof fn === 'function') {
                return fn.apply(this, slice.call(arguments, 1))
            }
        },

        //非严格模式下使用
        $$super: function () {
            var callFn = function (fn, scope, args) {
                return fn.apply(scope, args)
            }

            var method = this.$$super.caller,
                name = method.__name__,
                superCls = method.__owner__ ? method.__owner__.__super : this.$self.__super,
                superMethod = superCls.prototype[name]


            if (typeof superMethod === 'function') {
                callFn.__owner__ = this.$self
                callFn.__name__ = name
                return callFn(superMethod, this, arguments)
            }
        }

    })

    X.Class = Class

    return Class
})