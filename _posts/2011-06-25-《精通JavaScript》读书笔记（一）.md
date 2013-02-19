---
layout: post
title: 《精通JavaScript》读书笔记(一)
category: 前端 JavaScript 读书笔记
---
#{{page.title}}
##各浏览器的空白节点问题
有以下代码：

```html
<html>
    <script>
    window.onload = function() {
    	var childNodes = document.body.childNodes,
    		str = '';
    	alert(childNodes.length);//在IE下输出2，在Chrome下输出5，在FF下输出6

    	//遍历子节点数组，按顺序输出对应的节点类型，若为元素节点，则同时输出相应的标签名
    	for(var i = 0, len = childNodes.length; i < len; ++i){
    		var nodeType = childNodes[i].nodeType;
    		str += 'nodeType=' + nodeType;
    		if(nodeType == 1){
    			str += '&&nodeName=' + childNodes[i].nodeName;
    		}
    		str += '/n';
    	}
    	alert(str);
    };
    </script>
	<body>
		<div></div>
		<p>something here!</p>
	</body>
</html>
```
按我们的想法，body直接子节点的个数应该为2，很遗憾，只有IE才符合我们的想法，FF和chrome则不是这样！

原因是FF和chrome把标签之间的换行也算作一个文本节点了，所以他们的子节点数都会比我们预想的要多；
在FF下测试的情况更悬乎，最后一个节点居然是<div>节点，即使Body之间不加任何空白和节点，最后一个节点也是div，
我也搞不懂是什么状况。 不过我们不必深究这个，毕竟这个目前来说无伤大雅。

真正需要引起注意的地方是，当我们使用DOM的标准属性时，
如：previousSibling, nextSibling, firstChild, lastChild，会得到我们不想要的结果，
因此，我们有必要建立几个函数来帮助我们实现相关的遍历功能。

我们在第一次的HTML代码中增加了4个函数来实现我们期望的功能：

```html
<html>
    <script>
    var prev = function(elem){
        do {
            elem = elem.previousSibling;
        }
        while (elem && elem.nodeType != 1)

        return elem;
    };
    var next = function(elem){
        do {
            elem = elem.nextSibling;
        }
        while (elem && elem.nodeType != 1)

        return elem;
    };
    var first = function(elem){
        elem = elem.firstChild;
        return elem && elem.nodeType != 1 ? next(elem) : elem;
    };
    var last = function(elem){
        elem = elem.lastChild;
        return elem && elem.nodeType != 1 ? prev(elem) : elem;
    };
    window.onload = function() {
    	var div = first(document.body);
    	var p = last(document.body);

    	alert(div.nodeName); //div
    	alert(p.nodeName); //p
    	alert(next(div).nodeName) //p
    	alert(prev(p).nodeName); //div
    };
    </script>
    <script>
	<body>
		<div></div>
		<p>something here!</p>
	</body>
</html>
```
注意上面的代码带FF下会有些问题，我发现FF的控制台会隐藏的在body最后添加一个div节点，所以大家要注意一下FF的特例，在IE8和Chrome下测试均正常。
####**注：此文写得比较早，浏览器发展迅速，HTML5增加了firstElementChild等DOM属性来直接获得元素节点，可以在代码中增加判断优化。**
好了，到现在我们已经模拟了DOM内置的相关属性行为，但是每次调用均需要这样调用： next(elem)，
有没有类似于DOM那样的直接通过成员操作符访问相关属性的方式呢？ 在FF和chrome下有，在IE下目前正常的方法还没发现。

下面这个模拟DOM的'.'操作符函数是通过给原生HTMLElement对象增加原型方法来实现的，
因为IE下关闭了直接访问HTMLElement的方式，所以下面的方法无法在IE下工作，
书中有提供介绍相关的在IE下获得HTMLElement的方式的链接，不过我无法访问这个链接，希望有能够知晓在IE下获得HTMLElement的朋友不吝告知。

每一个HTML标签都是从HTMLElement继承下来的，所以自然继承了原型链中的方法。我们在上面代码的基础上给HTMLElement增加了一个原型方法next：

```javascript
HTMLElement.prototype.next = function() {
	var elem = this.nextSibling;

    while (elem && elem.nodeType != 1) {
        elem = elem.nextSibling;
    }

    return elem;
};
window.onload = function() {
	var div = first(document.body);

	alert(div.next().nodeName); //在FF和chrome下输出p,在IE下出错,提示HTMLElement未定义
};
```
经过在IE、FF、Chrome下的测试，符合我们的预期结果：）
##通过类的值查找元素
DOM提供了诸如getElementById,getElementsByTagName等获得相关DOM节点的操作，
不过没有提供getElementsClassByName这样的通过类的值来查找节点，
而我们经常需要这种函数来实现我们的操作，因此，作者介绍了该函数的简单实现，代码如下：

```javascript
document.getElementsByClassName = function(name, type){
	var ret = [],
		elems = document.getElementsByTagName(type || '*'),
		reg = new RegExp("(^|//s)" + name + "($|//s)");

	for(var i = 0, len = elems.length; i < len; ++i){
		if(reg.test(elems[i].className)) {
			ret.push(elems[i]);
		}
	}

	return ret;
};
```
我在上面代码中先判断document是否存在原生的getElementsByClassName方法，
高级浏览器已经存在这个原生方法，经过测试，在IE、FF、Chrome下均达到了预期要求。


