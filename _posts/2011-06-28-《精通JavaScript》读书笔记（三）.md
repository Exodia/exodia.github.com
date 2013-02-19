---
layout: post
title: 《精通JavaScript》读书笔记(三)—样式信息与元素位置
category: 前端 JavaScript 读书笔记
---
#{{page.title}}
##访问样式信息
访问和设置CSS属性的主要工具是元素自身的样式属性。假设需要获取元素的高度，则可以编写类似这样的代码：
 elem.style.height。设置元素的高度则可以执行这样的代码：elem.style.height = '100px'。

使用CSS属性时应注意两点：

首先，JavaScript要求你在设置任何几何属性时必须明确尺寸单位（如上面的设置高度例子中，单位必须使用px）。
同时，任何几何属性都会返回表示元素样式的字符串而非数值（比如，是100px而非100）。

其次，如果一个元素是100像素高，想获取它的当前高度，你可能希望只从样式属性中就能得到100px这样的精确结果。
但是并不能时时如愿。这是因为你使用样式表或者行内CSS所预设的样式信息并不能精确可靠的反映到当前的样式属性中。

这迫使我们编写一个用于处理JavaScript中的CSS的重要函数：一种获取元素的真实、最终样式的方法，它可以给你精确、预期的值。
同时需要注意的是，获取元素的最终样式，不同浏览器之间存在大量的不同。
比如，获取元素的当前样式，IE有自己独特的方式，而其他浏览器使用W3C定义的方式。
下面的代码展示了获取元素的最终样式值的函数。

```javascript
var getStyle = function(elem, name) {
	if(elem.style[name]){
		return elem.style[name];
	}
	/*针对IE*/
	if(elem.currentStyle){
		return elem.currentStyle[name];
	}
	/*W3C标准*/
	if(document.defaultView&& document.defaultView.getComputedStyle){
		var s = document.defaultView.getComputedStyle(elem, null);
		return s && s[name];
	}

	return null;
};
```
##元素的位置
所有现代浏览器都支持以下3个属性：

offsetParent： 理论上，这是元素的父亲，元素相对于它定位。但是，在实际中，这取决于浏览器。offsetParent不一定与parentNode相等。

offsetLeft和offsetTop: 这两个属性是元素在offsetParent上下文中的水平和垂直偏移量。

注意上面3个属性都是只读属性。

若想知道某个元素在页面上的偏移量，则将这个元素的offsetLeft和offsetTop与其offsetParent的相同属性相加，
如此循环至根元素，就可以得到一个基本准确的值，
于是我们可以封装两个函数getElemLef和getElemTop获得元素相对页面的偏移量。

如果我们想知道元素相对于其父元素的偏移量，则需要判断parentNode是否与其offsetParent相等，
若相等则直接返回offsetLeft或者offsetTop，若不相等，则需用节点相对于页面的偏移量减去父节点相对于页面的偏移量获得。
同样，我们封装一对函数：getParentLeft和getParentTop。

关于元素位置的最后一个难题是，获取元素相对于它的CSS容器的位置。
即使元素包含在一个元素内，但可以用相对于其他的父亲元素而定位（使用相对定位和绝对定位）。
则我们可以利用以前封装好的getStyle函数来获得。我们同样封装一对函数：getPositionLeft/Top和setPositionLeft/Top。

以如下代码作为示例：

```javascript
var getElemLeft = function(elem){
	var left   	   = elem.offsetLeft,
		cur_parent = elem.offsetParent;

	while(null !== cur_parent){
		left += cur_parent.offsetLeft;
		cur_parent = cur_parent.offsetParent;
	}

	return left;
};
var getElemTop = function(elem){
	var top   	   = elem.offsetTop,
		cur_parent = elem.offsetParent;

	while(null !== cur_parent){
		top += cur_parent.offsetTop;
		cur_parent = cur_parent.offsetParent;
	}

	return top;
};
var getStyle = function(elem, name) {
	if(elem.style[name]){
		return elem.style[name];
	}
	/*针对IE*/
	if(elem.currentStyle){
		return elem.currentStyle[name];
	}
	/*W3C标准*/
	if(document.defaultView&& document.defaultView.getComputedStyle){
		name = name.replace(/([A-Z])/g, '-$1');
		name = name.toLowerCase();
		var s = document.defaultView.getComputedStyle(elem, null);
		return s && s.getPropertyValue(name);
	}

	return null;
};
/*
 * 获得元素相对于其父元素的偏移量
 */
var getParentLeft = function(elem){
	return elem.parentNode === elem.offsetParent ?
		elem.offsetLeft : getElemLeft(elem) - getElemLeft(elem.parentNode);
};
var getParentTop = function(elem){
	return elem.parentNode === elem.offsetParent ?
		elem.offseTop : getElemTop(elem) - getElemTop(elem.parentNode);
};
/*
 * 获得元素相对于其定位容器的偏移量
 */
var getPositionLeft = function(elem){
	return parseInt(getStyle(elem, 'left'));
};
var getPositionTop = function(elem){
	return parseInt(getStyle(elem, 'top'));
};
/*
 * 设置元素相对于其定位容器的偏移量
 */
var setPositionLeft = function(elem, value){
	elem.style.left = value + 'px';
};
var setPositionTop = function(elem, value){
	elem.style.top = value + 'px';
};
```
