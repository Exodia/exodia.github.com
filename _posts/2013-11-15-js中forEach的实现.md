---
layout: post
title: js forEach 的实现
category: javascript
---
#{{page.title}}

## 简单版v0
forEach功能就是调用相关的函数遍历一遍数组，高级点的，类数组对象，对象也可以遍历，听起来很简单吧？
博主迅速的实现了遍历数组的代码：

```javascript
var forEach = function(arr, fn, context) {
    if(arr.forEach === Array.prototype.forEach) {
        return arr.forEach(fn, context)
    }

    for(var i = 0; i < arr.length; ++i) {
        fn.call(context, arr[i], i, arr)
    }
}
```

嗯，上面代码中，如果支持原生的 forEach 就调用原生的 forEach 函数，没有的话就很自然的遍历。
好像确实很简单？上一段代码来打击打击简单版的实现：

```javascript
    forEach([0,1,2,3,4], function(v, i, arr){
        arr.push(v)
    })
```

好像无限循环了？那就修复一下这个问题吧- -！

## 加强版v0.1
翻了翻标准，说遍历次数为数组的初始长度，当在遍历过程中，数组尺寸增加时，遍历次数不变化。
修改后的代码：

```javascript
var forEach = function(arr, fn, context) {
    if(arr.forEach === Array.prototype.forEach) {
        return arr.forEach(fn, context)
    }

    for(var i = 0, len = arr.length; i < len; ++i) {
        fn.call(context, arr[i], i, arr)
    }
}
```
仅仅对数组长度做了个缓存，不仅修复了无限循环的问题，还避免了 length 的重复读取。
好像很不错？ 再来一段调用代码吧：

```javacript
var count = 0
forEach([0,1,2,3,4], function(v, i, arr) {
    ++count
    arr.splice(i+1, 1)
})
alert(count)
```
啊，这会怎么样? count应该是怎么样？ 在原生支持 forEach 的浏览器下，输出的是3，
在原生不支持 forEach 的浏览器下， 输出的是5耶0 0！ 不一致了哈~
继续求助标准，标准说啦，如果数组元素被删除，那么将不会被访问到~。

## 加强版 v0.2
根据标准，我们继续改：

```javascript
var forEach = function(arr, fn, context) {
    if(arr.forEach === Array.prototype.forEach) {
        return arr.forEach(fn, context)
    }

    for(var i = 0, len = arr.length; i < len; ++i) {
        arr.hasOwnProperty(i) && fn.call(context, arr[i], i, arr)
    }
}
```

嗯，简单的加了个 hasOwnProperty 判断下对应的索引是否还存在，存在才遍历。

## 总结
看似简单的任务，也只有真正自己去实践的时候，才会发现坑还是蛮多的。forEach 这个函数，
就连underscore的实现同样也是有问题的，问题和上述加强版v0.1的实现一样，数组元素的动态删除表现出不一致性。

当然，如果要支持对象遍历，包括兼容ie8以下的浏览器，还有不少坑呢：）

[点击进入完整的实现](https://github.com/Exodia/x/blob/master/src/enumerable.js)




