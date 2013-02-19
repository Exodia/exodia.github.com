---
layout: post
title: 《精通JavaScript》读书笔记(二)—元素内容
category: 前端 JavaScript 读书笔记
---
#{{page.title}}
##操作元素内的文本
假如有HTML代码：<p>some content text</p>，有以下几种方法可以操作元素P内的文本：

一种方式是通过DOM的方式： domElem.firstChild.nodeValue,该方式只能操作第一段文本。

另一种则是通过innerText属性获得，通过innerText属性可以操作元素中包含的所有文本内容，无论文本位于文档树中的什么位置。
在通过innerText读取值时，它会按照由浅入深的顺序，将子文档树的所有文本拼接起来。

如果我们想要设置innerText,则简单的通过elem.innerText = xxx;即可； 但是要注意2点：

1. 设置innerText会改变元素的DOM结构，元素的所有子节点完全被替换为设置的文本节点。
2.若设置的文本内容含有HTML标签，则会被相应的转义。
如果我们想要去掉节点内的所有HTML标签，则可以简单的设置 elem.innerText = elem.innerText;

在FF下DOM节点是没有innerText属性的，FF下则是用textContent作为innerText的等价物，
textContent是DOM3级规定的一个属性，得到了Safari、Opera、Chrome、FF的支持，
同时Safari、Opera、Chrome也支持innerText，IE仅支持innerText。
因此，我们可以封装一对getInnerText/setInnerText函数作为统一接口获得我们想要的节点下的文本。

我们以下面代码为例总结下innerText的特性：

```javascript
/*
 * @param {Object} elem
 * 获取参数elem元素内的文本内容
 */
var getInnerText = function(elem) {
	return typeof elem.textContent == "string" ? elem.textContent : elem.innerText ;
};
/*
 * 设置elem元素内的文本节点为contentStr
 */
var setInnerText = function(elem, text) {
	if(typeof elem.textContent == "string") {
		elem.textContent = text;
	} else {
		elem.innerText = text;
	}
};
```
##操作元素内的HTML
与innerText对应的，通过innerHTML可以快速的操作元素的所有子节点，这个属性在所有现在浏览器中都实现了。
与innerText的主要区别就是：获取innerText时，是把所有子节点下的文本节点连接起来返回，而innerHTML则是返回完整的HTML结构；
设置时，innerText会转义HTML标签，而innerHTML则不会。因此通过设置innerHTML可以快速的操作元素结构。