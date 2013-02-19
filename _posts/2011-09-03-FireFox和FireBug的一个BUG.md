---
layout: post
title: FireFox和FireBug的一个BUG
category: 前端 JavaScript 兼容性
---
#{{page.title}}
前几日，和朋友解说javascript预解析机制的时候，给了下面的示例代码：

```javascript
var a = 1;
function a(){
  alert(1111);
};

alert(a);
```
毫无疑问，结果应该是弹出1，简单的说，浏览器在执行JS代码时，第一步先扫描代码块，
遇到var关键字，则提前至当前作用域的代码行的开头，接着扫描function声明，接在var之后，然后执行代码，于是上述代码真正执行时应是这样的：

```javascript
var a ;
function a(){
  alert(1111);
};
a = 1;
alert(a);
```
如果有疑问的同学可以参考ECMA文档，下面这个链接我网上搜的，不想去求证，
只想理解机制的同学可以参考下：<http://www.zhufengpeixun.com/jishujiangtang/javascriptjiangtang/2011-01-16/512.html>

第一部分的代码，在FF、chrome、IE下运行都是显示1，没啥疑问，而我朋友在FireBug console下运行的时候，确弹出函数代码，也就是:

```javascript
function a(){
  alert(1111);
};
```
<del>隐约记得半年前在网上看到一个老外的帖子说FireBug console是用eval执行输入的代码的，不过具体忘记了，最近去搜也没搜到。
在这里个人推测下，FireBug是按语句一条一条eval的， 也就是上面代码变为：

```javascript
eval('var a = 1');
eval('function a(){alert(1111);}');
eval('alert(a)');
```
<del>而eval是将执行的语句加入到最近作用域中，按上述的方式，每条语句都是立即执行，自然就是弹出函数代码了。
自此，FireBug的解析问题也许有一个推测的答案，希望有更权威的文献论证。</del>

###**在查阅相关文档后，得到的结论如下：**
FireFox的控制台将语句解析为如下形式：

```javascript
var _FirebugCommandLine = {};

with(_FirebugCommandLine){
   var a = 1;
   function a(){
     alert(1111);
   };
   alert(a);
};
```
此时， function a(){``}就被包含在语句块内，根据firefox的JS引擎解析规则，
将会把语句块内的函数声明式转化为函数表达式，因此上述代码真正在执行时等价于如下形式：

```javascript
var _FirebugCommandLine = {};

with(_FirebugCommandLine){
   var a = 1;
   var a = function(){
     alert(1111);
   };
   alert(a);
};
```
关于不同JS引擎的语句块内函数声明的解析差异可见我的另一篇博文
[FireFox中JS引擎对函数声明式的解析与其他浏览器的差异]
(/前端 JavaScript 兼容性/2011/10/30/FireFox中JS引擎对函数声明式的解析与其他浏览器的差异.html)
