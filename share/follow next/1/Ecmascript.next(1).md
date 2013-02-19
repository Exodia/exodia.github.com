#精通one, 了解more, 关注next
#关注next —— EcmaScript.next(1)

##Support Tools
[Chrome Canary](https://www.google.com/intl/en/chrome/browser/canary.html)

[Firefox Aurora](http://www.mozilla.org/en-US/firefox/aurora/)

NodeJs --harmony

chrome://flags

##Default parameter values
```
function addTodo(caption = 'Do something') {
    alert(caption);
}
addTodo(); // Do something
```

##默认参数限制

默认参数只能放在最右边
```
//Wrong!!
function f(arg1 = 'xx', arg2) {

}
```

##Default Parmeter DEMO

[Click Me](http://runjs.cn/detail/wffrd74a)

##Rest Arguments
```
function f(arg1, arg2, ...rest) {
    alert("你传入了" + rest.length + "个额外的参数.");
}

f();
f(1,2,3,4,5,6,7);
```

##Rest Arguments Demo

[Click Me](http://runjs.cn/detail/js4wwlif)

##优势

嵌套函数可以直接通过闭包引用剩余参数数组
```
function f1(...rest) {
    function nest() {
        alert(arguments.length)
        alert(rest.length);
    }
    nest();
}
f1()
```

##bind的简单实现—未使用剩余参数：
```
function bind(fn, scope) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function() {
        fn.apply(scope, args.push.apply(args, arguments));
    }
}
```

##bind的简单实现—使用剩余参数：
```
function bind(fn, scope, ...args) {
    return function(...rest) {
        fn.apply(scope, args.concat(rest));
    }
}
```

##剩余参数限制

1.剩余参数只能放在最右边
2.在使用了剩余参数的函数中不能使用arguments对象
```
//Wrong!!
function f2(arg1, ...rest, arg2) {

}

//Wrong!!
function f2(...rest) {
    arguments;
}
```