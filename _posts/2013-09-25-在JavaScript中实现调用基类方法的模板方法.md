---
layout: post
title:  在JavaScript中实现调用基类同名方法的模板方法
category: JavaScript
---

#{{page.title}}

在很多 OO 的语言中，都提供了某种便捷的方式去调用基类中被子类覆盖的方法，比如在 Java 中：

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

这种调用方式的好处在于，基类名称变化后，子类不用多处的修改，便于维护。

为了在 JS 中模拟类似 **super** 这种统一方式的调用，我设想了以下方式的语法调用：

```javascript
var A  = function() {
    console.log('---A init---')
}

A.prototype.method = function(){
   console.log('---A method---')
}


var B = function() {
   this.$super(arguments)
   console.log('---B init---')
}

B.prototype.method = function() {
   this.$super(arguments)
   console.log('---B method---')
}

inherits(A, B)
```

本质就是inherits的实现，因为 super 为关键字，所以使用了$super 代替，
主要思路是：在$super方法内，通过arguments.callee.caller获取调用$super的函数名，再调用基类的函数。

简单的实现如下：

```javascript
var mix = function (des, src) {
    for (var k in src) {
        src.hasOwnProperty(k) && (des[k] = src[k])
    }
}

var each = function (obj, fn) {
    if (obj instanceof  Array) {
        for (var i = 0, len = obj.length; i < len; ++i) {
            fn(obj[i], i, obj)
        }

        return
    }

    for (var k in obj) {
        obj.hasOwnProperty(k) && fn(obj[k], k, obj)
    }
}

var $super = function (args) {
    var method = this.$super.caller

    if (!method) {
        throw "Cannot call $super outside!"
    }


    var name = method.__name__
    var superCls = method.__owner__.$superClass
    var superMethod = superCls[name]


    if (typeof superMethod !== 'function') {
        throw "Call the super class's " + name + ", but it is not a function!"
    }

    return superMethod.apply(this, args)
}

var enumProperties = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toString',
    'toLocaleString',
    'valueOf'
]

var inherits = function (SubCls, SuperCls) {
    var overrides = SubCls.prototype
    var superPro = SuperCls.prototype

    var fn = function () {}
    fn.prototype = superPro

    var subPro = SubCls.prototype = new fn

    for (var k in overrides) {
        var v = overrides[k]
        if (typeof v === 'function') {
            v.__name__ = k
            v.__owner__ = subPro
        }

        if (superPro.hasOwnProperty(k)) {
            var sv = superPro[k]
            if (typeof sv.__name__ !== 'string') {
                sv.__name__ = k
                sv.__owner__ = superPro
            }
        }

        subPro[k] = v
    }

    subPro.constructor = SubCls

    //对不可枚举的属性做一次检测
    each(enumProperties, function (prop) {
        if (subPro.hasOwnProperty(prop)) {
            subPro[prop].__name__ = prop
            subPro[prop].__owner__ = subPro
        }
    })

    subPro.$superClass = superPro
    subPro.$super = $super
}
```

上述代码主要通过 $super 函数和 inherits 函数实现了调用基类方法的模板功能。

$super 流程如下：

1. 找 caller
2. 获取caller的函数名**__name__**
3. 获取 caller 的拥有者**__owner__**
4. 找到**__owner__**的父类
5. 调用同名函数

inherits 函数主要的功能有两个，一个是实现了比较经典的原型链继承，
一个是对原型函数附加了 **__name__** 和 **__owner__** 属性。
前者是为了方便的找到函数名，后者是为了在多级继承的时候，跳出作用域的死循环。

查看源码和 demo，[点此进入](http://exodia.net/demo/class/)

另外一种类工厂模式的实现可以参见：[https://github.com/Exodia/x/blob/master/src/class.js]



