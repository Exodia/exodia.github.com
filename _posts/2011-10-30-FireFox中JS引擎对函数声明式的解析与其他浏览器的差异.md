---
layout: post
title: FireFox中JS引擎对函数声明式的解析与其他浏览器的差异
category: 前端 JavaScript 兼容性
---
#{{page.title}}
在FireFox和FireBug中的一个Bug这篇文章中，偶然发现了FireFox下的函数声明问题，一直没有得到权威的资料来解决。
11月26日面试新浪微博的时候，面试官也问到了这个问题，当然他没看我的BLOG，并从他口中得知，这个不是BUG，而是FF的Monkey引擎就是这样解析的，
当然我的回答是：“个人推测，在FF下对语句快内的函数声明转化为函数表达式”。
面试官说不是，当然也没给出具体答案，提示我说MDN有这方面的资料。

如果懒得看前面的文章的话，可以看看下面一个简单的例子，在FF/IE/Chrome都跑一遍，看看FF和其他二者之间的差异:(FF会报错，其他的会弹出函数代码)

```javascript
if(0){
    function a(){}
}
alert(a);
```
####[惨无人道的点我进入DEMO](/demo/firefox-function)
当天晚上，我去找了找MDN，还真被我找到了，从资料上看，和我的推测是一致的，就是例子也和我前面提到的文章也类似。
[点此进入具体链接](https://developer.mozilla.org/en/JavaScript/Reference/Functions_and_function_scope#Function_constructor_vs._function_declaration_vs._function_expression)
英文水平不是特别好，这里贴下重点部分和例子，并稍微翻译下（强烈建议看原文，我的翻译太蹩脚了）：

函数声明式非常容易（并且常常出乎意料）转化为函数表达式。一个函数声明要么转化为一个表达式的部分，
要么不再是一个函数或脚本本身的"source element"。 "source element" 是脚本中或一个函数体内的非嵌套语句。

给出的例子如下：

```javascript
var x = 0;               // source element
if (x == 0) {            // source element
   x = 10;               // not a source element
   function boo() {}     // not a source element
}
function foo() {         // source element
   var y = 20;           // source element
   function bar() {}     // source element
   while (y == 10) {     // source element
      function blah() {} // not a source element
      y++;               // not a source element
   }
}
```

Examples:

```javascript
// function declaration
function foo() {}

// function expression
(function bar() {})

// function expression
x = function hello() {}

if (x) {
   // function expression
   function world() {}
}

// function declaration
function a() {
   // function declaration
   function b() {}
   if (0) {
      // function expression
      function c() {}
   }
}
```

##条件定义一个函数
函数可以用//函数语句//（一个ECMA-262 第3版允许的扩展）或者Function构造函数条件的定义。

在下面的脚本中， zero函数绝不会被定义并且不能够被触发，因为'if (0)'将它的条件判断为false：

```javascript
if (0) {
   function zero() {
      document.writeln("This is zero.");
   }
}
```

如果脚本改变条件为**‘if (1)’**,那么函数**zero**就被定义了。

注意：虽然这类函数看起来像函数声明，它实质上是一个语句，因为它被嵌套在另一个语句中。见函数声明和函数表达式的不同之处。

注意：一些JavaScript引擎，不包括SpiderMonkey(FF的JS引擎)，不正确的将任何函数具名表达式当作函数声明。
这将导致zero被定义，甚至条件总是假的时候。
条件的定义函数的一个安全做法是定义匿名函数并将其分配给一个变量（译者注：其实就是用函数表达式）：

```javascript
if (0) {
   var zero = function() {
      document.writeln("This is zero.");
   }
}
```

##总结
ECMA标准中，对于语句块内的函数声明是不符合语法的，但是各个浏览器对此做了自己的实现。
另，MDN是很有价值的资料，有时间的话还真是需要去看看。