---
layout: post
title: 《精通JavaScript》读书笔记(四)—元素尺寸与可见性
category: 前端 JavaScript 读书笔记
---
#{{page.title}}
##元素的尺寸
找出 元素的的高度和宽度可以很容易，也可以很困难，取决于它所处的不同场合，
在大多数情况下，我们只需要利用前面自己封装的getStyle函数即可，如下所示：

```javascript
var getHeight = function(elem){
	return parseInt(getStyle(elem, 'height'));
};
var getWidth = function(elem){
	return parseInt(getStyle(elem, 'height'));
};
```
但是这样做会遇到2个问题：其一，需要获取有预定义高度元素的完整高度。
比如，以0像素开始的动画，但你需要事先知道元素究竟能有多高或多宽。
其二，当元素的display为none的时候，你会得不到这个数值（当display属性为none时，若未设置height，则通过getStyle函数获得的height属性为auto）。
在需要执行动画时这两个问题就会发生。

经过个人的测试，元素display为none时，clientHeight、clientWidth、offsetWidth、offsetHeight、offsetTop为0, offsetWidth在IE8下是-1,
在FF和Chrome下是0。

在设计获得元素的潜在完整尺寸的函数时，我们有必要先弄清楚clientHeight、cilentWidth、offsetHeight、offsetWidth这几个属性的概念：

offsetHeight : 元素在垂直方向上占用的空间大小，以像素记。
包括元素的高度、（可见的）垂直滚动条的高度、上内边距和下内边距、上边框高度和下边框的高度。

clientHeight: 元素内容及区高度加上上下内边距所占据的大小。

下面的代码展示了如何找到元素的潜在的完整高度和宽度。
这需要通过访问clientWidth和clientHeight属性来实现，它们提供了元素可能到达的总尺寸。

```javascript
/*
 *在元素原有的CSS属性上修改或添加CSS属性
 *参数css_obj：要添加或修改的CSS属性
 *返回值：元素最初的被修改或添加的CSS属性值
 */
var resetCSS = function(elem, css_obj){
	var old = {};
	for (var k in css_obj) {
		old[k] = elem.style[k];
		elem.style[k] = css_obj[k];
	}

	return old;
};
/*
 *设置元素的相关CSS属性，参数与xx.resetCSS函数一样，返回undefined
 */
var setCSS = function(elem, css_obj){
	for(var k in css_obj){
		elem[k] = css_obj[k];
	}
};

/*
 * 获取元素潜在的完整宽度和高度
 */
var getFullHeight = function(elem){
	//若元素display不为none，那么使用offsetHeight获得完整高度，若没有offsetHeight，则使用getHeight
	if(getStyle(elem, 'display') != 'none'){
		return elem.offsetHeight || getHeight(elem);
	}

	//否则，我们重置它的CSS属性以获得更精确的数据
	var old = resetCSS(elem, {
		display:'block',
		visibility:'hidden',
		position:'absolute'
	});

	//使用clientHeight找出元素的完整高度，如果不生效，使用getHeight函数
	var h = elem.clientHeight || getHeight(elem);

	//恢复元素的CSS属性
	setCSS(elem, old);

	return h;
};

var getFullWidth = function(elem){
	if(getStyle(elem, 'display') != 'none'){
        return elem.offsetWidth || getWidth(elem);
}

var old = xx.resetCSS(elem, {
    display:'block',
    visibility:'hidden',
    position:'absolute'
});

var w = elem.clientWidth || getWdith(elem);

setCSS(elem, old);

return w;
```
##元素的可见性
下面代码展示了使用CSS的display属性来切换元素可见性的一组函数：

```javascript
/*
 * 使用display属性来切换元素可见性的一组函数
 */
//隐藏元素函数
var hide = function(elem){
	var cur_display = getStyle(elem, 'display');

	if(cur_display != 'none'){
		elem.$oldDisplay = cur_display;
	}

	elem.style.display = 'none';
};
/*显示元素函数
 * 参数type: 要显示的格式（'block'、'inline'等），
 * 若不输入，则先查找元素是否有保存的display属性，若有，则更改为保存的display属性，
 * 否则默认为'，此时会清除元素的display属性，从而继承样式表的display属性，
 * 若样式表display为none，此时元素则不会显示出来
 */
var show = function(elem, type){
	elem.style.display = elem.$oldDisplay || type || ';
```
调节元素透明度函数：

```javascript
/*
 *调节元素透明度函数(level从0-100)
 */
var setOpacity = function(elem, level){
	//如果存在filters这个属性，则它是IE，所以设置元素的Alpha滤镜
	if(elem.filters){
		elem.style.filter = 'alpha(opacity=' + level + ')';
		//必须设置zoom,要不然透明度在IE下不生效
		elem.style.zoom = 1;
	} else{
		//否则使用W3C的opacity属性
		elem.style.opacity = level/100;
	}
};
```
##动画
以下代码通过在短时间内增加高度或宽度滑动展开元素：

```javascript
/*
 *滑动展开函数：在短时间内增加高度或宽度逐步显示隐藏元素
 *type: 按何种类型展开（宽度或高度），应输入'width'或'height'或'both'，默认为'both'
 *wvalue:要展开的最终宽度值，默认为元素的潜在完整宽度,若hvalue未输入，则默认为宽度和高度的值
 *hvalue:要展开的最终高度值，默认为元素的潜在完整高度
 */
XX.slideOpen = function(elem, type, wvalue, hvalue){
	type = type || 'both';
	var h,w,
		len = arguments.length;

	if (4 === len) { //4个参数均指明
		w = wvalue;
		h = hvalue;
		if('both' !== type){
			elem.style[type] = '0px'; //从0px开始展开
		} else{
			elem.style.height = '0px'; //从0px开始展开
		}
	}
	else if (3 === len) { //只指明了3个参数
		w = h = wvalue;
		if('both' !== type){
			elem.style[type] = '0px'; //从0px开始展开
		} else {
				elem.style.height = '0px'; //从0px开始展开
		}
	}
	else {
		if ('height' === type) {
			h = XX.getFullHeight(elem);
			elem.style.height = '0px';
		}
		if('width' === type){
			w = XX.getFullWidth(elem);
			elem.style.width = '0px';
		}
		if('both' === type){
			h = XX.getFullHeight(elem);
			w = XX.getFullWidth(elem);
			elem.style.height = '0px';
		}
	}

	XX.show(elem, 'block');//先显示元素，但是看不到它，因为元素宽或高为0

	for(var i = 0; i <= 100; i += 5){
		(function(){
			var pos = i;
			setTimeout(function(){
				switch(type){
					case 'height':
						elem.style.height = (pos/100)*h + 'px';
						break;
					case 'width':
						elem.style.width = (pos/100)*w + 'px';
						break;
					default:
						elem.style.height = (pos/100)*h + 'px';
						elem.style.width  = (pos/100)*w + 'px';
				}
			}, (pos + 1) * 10 );
		})();
	}
};
```
以下代码在短时间内增加透明度逐步显示隐藏元素的函数：

```javascript
/*
 *调节元素透明度函数(level从0-100)
 */
XX.setOpacity = function(elem, level){
	//如果存在filters这个属性，则它是IE，所以设置元素的Alpha滤镜
	if(elem.filters){
		elem.style.filter = 'alpha(opacity=' + level + ')';
		//必须设置zoom,要不然透明度在IE下不生效
		elem.style.zoom = 1;
	} else{
		//否则使用W3C的opacity属性
		elem.style.opacity = level/100;
	}
};
/*
 *让一个元素渐显（通过短时间内逐步增加透明度显示）
 */
XX.fadeIn = function(elem){
	XX.setOpacity(elem, 0);

	XX.show(elem);

	for(var i = 0; i <= 100; i+=5){
		//闭包函数
		(function(){
			var pos = i;
			setTimeout(function(){
				XX.setOpacity(elem, pos);
			}, (pos + 1) * 10);
		})();
	}
};
```

