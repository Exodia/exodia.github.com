---
layout: post
title:  JavaScript中的面向对象实现
category: 总结
---

#{{page.title}}

## 摘要

在许多面向对象语言中（Java，Python），都在语法层面的基础上提供了面向对象编程的特性支持，包括最基本的继承与多态，以及一些语法糖特性：引用父类，调用父类同名方法。

在JavaScript 中，并没有像 Java,Python 这样在语法层面提供类式继承，而是借鉴了 Self 和 Scheme 的设计原则，提供了原型链的语法特性。在 JavaScript 中，
继承的实现正是基于原型链特性。本文首先介绍了两种基于原型链的继承思想，接着将详细描述 ria 框架体系中 oo 库中面向对象特性的实现方案，
包括基础特性：类创建，继承，语法糖模板：自身类引用，父类引用，父类同名方法调用。

基于原型链的继承思想
基于原型链的继承思想主要有两种：

### 一切都是基于对象的继承，没有类的概念

简单的实现代码如下：

```javascript
function inherit(object) {
    function empty() {}
    empty.prototype = object;
    return new empty();
}
```

优点是方案比较灵活，不用过多的关心对象的构造阶段，需要什么属性成员，直接动态加上即可。而 oo 的实现仅仅需要封装一个简单的函数即可，比较适合于小规模的项目采用。

缺陷也比较明显，当项目规模变得庞大时，对象生命周期的控制，代码的调试，错误的追溯将变得困哪，模块职责的界限也变得难以划分。

### 基于类的继承

在大规模的 JavaScript 项目中，提供类式的继承有助于我们更好的划分层次和模块结构，利于维护和扩展以及模块的复用，
另一方面 JS 引擎也能够针对成员固定的对象进行性能上的优化（如 v8的 hidden class）。

然而在 JavaScript 语法层面没有提供类式继承的机制，我们必须借助原型链的语法特性去实现类式继承。

### JavaScript 中类式继承的实现

在 js 中，类创建和类继承和基于对象的继承方案类似，毕竟一切都是对象，类也是对象，实现如下：

```javascript
/**
 * Class构造函数
 *
 * @class Class
 * @constructor
 * @param {Function | Object} [BaseClass] 基类
 * @param {Object} [overrides] 重写基类属性的对象
 * @return {Function}
 */
 function Class() {
     return Class.create.apply(Class, arguments);
 }

 Class.prototype = {
      constructor: function () {}
 };
 /**
 * 创建基类的继承类
 *
 * 3种重载方式
 *
 * - '.create()'
 * - '.create(overrides)'
 * - '.create(BaseClass, overrides)'
 *
 * @static
 * @param {Function | Object} [BaseClass] 基类
 * @param {Object} [overrides] 重写基类属性的对象
 * @return {Function}
 */
 Class.create = function (BaseClass, overrides) {
     overrides = overrides || {};
     BaseClass = BaseClass || Class;
     if (typeof BaseClass === 'object') {
        overrides = BaseClass;
        BaseClass = Class;
     }

     var kclass = inherit(BaseClass);
     return kclass;
 };

/**
 * 继承一个基类，返回子类
 * @param {Function} BaseClass 基类
 * @return {Function}
 */
function inherit(BaseClass) {
    var kclass = function () {
        // 若未进行 constructor 的重写，则klass.prototype.constructor指向BaseClass.prototype.constructor
        return kclass.prototype.constructor.apply(this, arguments);
    };

    function Empty() {}
    Empty.prototype = BaseClass.prototype;
    kclass.prototype = new Empty();
    return kclass;
}
```

在上述代码中，内部的inherit函数完成了基于原型链的类式继承，这其中会创建一个类函数kclass，并将其原型链实例指向基类原型链以完成继承。
Class 对外提供了 create 的接口，用于创建或者继承一个类：

```javascript
// 创建一个基类
var SuperClass = Class.create({
     superMethod: function () { console.log('super method'); }
});

var SubClass = Class.create(SupperClass, {
    subMethod: function () {
        this.superMethod();
        consoel.log('sub method');
    }
});
```

### 指向自身类引用和父类引用的成员

在上面的实现中，如果类实例需要引用类的静态方法，或者子类需要引用父类，则需要在代码中写死类名称，当类名变更时，这种 hard code 方式会对维护增加困难，
于是我们给类实例增加统一的快捷成员 $self用于指向当前实例的类，给类增加静态成员$superClass指向当前实例的父类，于是继续改造代码：

```javascript
// ...省略的重复代码

Class.prototype = {
    constructor: function () {},
    $self: Class,
    $superClass: Object
};

function inherit(BaseClass) {
    var kclass = function () {
            // 若未进行 constructor 的重写，则klass.prototype.constructor指向BaseClass.prototype.constructor
            return kclass.prototype.constructor.apply(this, arguments);
        };
    function Empty(){}
    Empty.prototype = BaseClass.prototype;
    var proto = kclass.prototype = new Empty();
    // 在原型上将$self指向类
    proto.$self = kclass;
    // 给类增加指向父类的静态成员
    kclass.$superClass = BaseClass;

    return kclass;
}
```

实现很简单，改造 inherit 函数，在每个类的原型链上增加$self成员，指向类自身；而给类增加$superClass成员，指向基类即可。
于是我们可以在成员函数中这样使用：this.$self.staticMethod(); this.$self.$superClass.staticMethod(); 而无需顾虑类名称的变更。

### 调用父类同名方法的成员函数

在很多 OO 的语言中，都提供了某种便捷的语法糖去调用基类中被子类覆盖的方法，比如在 Java 中：

```java
public class A {
   void method() {
       System.out.println("A");
   }
}

public class B {
   void method() {
       super.method();
       System.out.println("B");
   }
}
```

在 Python 中：

```python
class A
 def method():
 print('A')

class B(A)
 def method():
 super(B, self).method()
 print()
```

这种调用方式的好处在于：基类名称变化后，子类不用多处的修改，同时语义也比直接引用父类方法更加清晰。
而在我们原来的实现中，调用父类方法还必须手动的改变作用域指向子类实例：
this.$self.$superClass.superMethod.apply(this, arguments)，且在三层以上的同名方法调用会出现无限递归的问题。

于是，我们设想了以下调用方式：

```javascript
// 创建一个基类
var SuperClass = Class.create({</code>
     fn: function () { console.log('super method'); }
});

var SubClass = Class.create(SupperClass, {
    fn: function () {
        this.$super(arguments);
        consoel.log('sub method');
    }
});

var instance = new SubClass();
instance.fn(); // 打印 'super method' 'sub method'
```

##### 实现方案(1) – 字符串匹配_super关键字，动态改写

John Resig 在他的[博文](http://ejohn.org/blog/simple-javascript-inheritance/)使用了该方案实现了 super 语法糖。

主要原理为：获取方法的代码字符串，通过正则检测字符串中是否包含 $super,
若包含， 则改写该方法，在改写的方法中动态的改变this.$super，使其指向父类同名方法，以完成调用父类方法的目的。代码可参考上面给出的文章链接。

这种实现方案的问题在于：

1. 改写了原有方法，使得调试起来具有很大迷惑性；

2. 极端的场景可能会出问题，如字符串中出现个 $super。

因此在最终的实现中，我们并未采用这种实现方案。


#### 实现方案(2) – 通过查找调用方法名，再进行父类方法调用

在此方案中，首先我们得获取到当前执行的方法名称，其次得避免由于父类方法的执行作用域指向的是子类实例，在方法中继续调用this.$super导致的无限循环。

我们主要的思路是，通过arguments.callee.caller获得当前调用$super的函数，从该函数中获取相关的信息，因此我们可以在创建类时，
将类成员方法的名称以及所属类的信息保存在该成员函数上，在$super中根据相关信息去调用父类方法，我们继续改造强化原有的实现：

```javascript
Class.create = function (BaseClass, overrides) {
    overrides = overrides || {};
    BaseClass = BaseClass || Class;
    if (typeof BaseClass === 'object') {
        overrides = BaseClass;
        BaseClass = Class;
    }

    var kclass = inherit(BaseClass);
    var proto = kclass.prototype;
    for(var key in overrides) {
        var value = overrides[key];
        // 针对函数成员增加名称和所属类信息
        if (typeof value === 'function') {
            value.__name__ = key;
            value__owner__ = kclass;
        }

        proto[key] = value;
    }

    kclass.toString = toString;

    return kclass;
};

Class.prototype = {
    constructor: function () {},
    $self: Class,
    $superClass: Object,
    $super: function (args) {
        var method = this.$super.caller;
        var name = method.__name__;
        var superClass = method.__owner__.$superClass;
        var superMethod = superClass.prototype[name];
        if (typeof superMethod !== 'function') {
            throw new TypeError('Call the super class\'s ' + name + ', but it is not a function!');
        }

            return superMethod.apply(this, args);
    }
};

function inherit(BaseClass) {
    var kclass = function () {
        return kclass.prototype.constructor.apply(this, arguments);
    };
    funciton Empty (){}
    Empty.prototype = BaseClass.prototype;

    var proto = kclass.prototype = new Empty();
    proto.$self = kclass;
    if (!('$super' in proto)) {
         // 兼容未从 Class.create 创建的类
         proto.$super = Class.prototype.$super;
    }

     kclass.$superClass = BaseClass;

     return kclass;
}
```

在以上实现中，我们给 Class 的原型链上增加了$super方法，负责从获取调用函数的相关信息，并进行父类同名方法的调用。
在 Class.create中， 针对原型链上的成员方法加上成员名称和所属类信息。这样最终就实现了我们的$super语法糖。

$super 的流程如下：

1. 找 caller

2. 获取caller的函数名__name__

3. 获取 caller 的拥有者__owner__

4. 找到__owner__的父类

5. 调用同名函数

该方案的缺点在于：

1. 无法用在严格模式下

2. 会给函数额外增加自定义的属性(__name__与__owner__)

## 综合考虑

在我们的[oo](https://github.com/ecomfe/oo)库中，最后选用的是方案二，主要权衡为：

1. 严格模式带来的缺陷避免收益完全可以由工具(ide, jshint..)取代，我们每次提交代码前都会经过 jshint 的代码检测，因此不使用严格模式对我们来说没有什么影响。

2. 在实际的编码过程中，基本是不会出现和自定义属性出现重名的场景，这也算是一个约定。

## 总结

在大规模项目中，面向对象是一个非常基础的特性，而受限于最初js语言上的设计缺陷，导致最基础的特性需要花费一番精力去封装实现，
而随着 es6 的到来，在语言层面上支持 Class 关键字特性将会极大的完善 JavaScript 语言，虽然在浏览器端尚需时日，
但在服务端的 node环境中，io.js，node-v.0.11已经开始支持 es6的部分特性。

