---
layout: post
title: 《精通JavaScript》读书笔记(五)—鼠标位置与视口
category: 前端 JavaScript 读书笔记
---
#{{page.title}}
##鼠标位置
###光标相对于整个页面的x和y位置
代码如下：

```javascript
/*
 * 获取鼠标相对于整个页面的偏移量
 * @param {Object} e
 */
var getX = function(evt){
	evt = evt || window.event;
	return evt.pageX || evt.clientX + document.body.scrollLeft;
};

var getY = function(evt){
	evt = evt || window.event;
	return evt.pageY || evt.clientY + document.body.scrollTop;
};
```
上面的代码中pageX只存在于非IE的浏览器中，代表着鼠标事件相对于整个页面（包括滚动条位置）的坐标，
而clientY在IE和其他浏览器下均存在，代表着鼠标事件相对于整个页面（不包括滚动条位置）的坐标，所以需要加上滚动条的偏移量。

###光标相对于正在交互元素的x和y的位置
代码如下：

```javascript
/*
 *获取光标相对于当前正在交互的元素的x和y位置
 *layerX的作用：网上很多解释说layerX与offsetX的作用相同．可以返回鼠标指针在触发事件元素内的x坐标
 *也有解释说相对于父元素的x坐标．经过我的测试得出以下结论：
 *layerX可以返回两种结果．第一：layerX属性可以返回鼠标指针相对于父元素的x坐标水平位置．
 *第二：layerX属性可以返回鼠标指针相对于元素本身的x坐标水平位置．
 *比如说我需要在某个div内获取鼠标指针的x水平位置．
 *如果你没有使用css中的position属性来对该div进行任何设置．那么这时layerX返回的是相对于div父元素的x坐标．
 *也就是包含该div的那个元素．
 *如果将div的position属性设置为absolute或relative时．layerX则返回元素本身的x水平位置．
 *这时返回的值与clientX的值相同．另外提醒的是layerX支持FF和Safari浏览器，在IE和Opear中无法使用．
 */
var getElementX = function(evt){
	evt = evt || window.event;
	return evt.offsetX || evt.layerX;
};

var getElementY = function(evt){
	evt = evt || window.event;
	return evt.offsetX || evt.layerX;
};
```
上述代码事实上不太准确，主要是layerX这个属性的问题，详细见注释，offsetX则是准确的，目前测试，在IE和Chrome下支持offsetX，在FF下不支持。
因此要想在FF下获得准确的相对于事件元素的光标位置，则需要将元素的position设置为absolute或relative.
##视口
###页面尺寸
以下函数返回了页面的完整高度和宽度（即包括滚动条外的内容）:

```javascript
/*
 * 返回页面的潜在完整宽度和高度（包括滚动条之外的内容）
 */
var getPageHeight = function(){
	return document.body.scrollHeight;
};

var getPageWidth = function(){
	return document.body.scrollWidth;
};
```
###滚动条位置
以下函数返回了滚动条的位置:

```javascript
/*
 * 确定浏览器滚动条位置的函数
 * pageXOffset:经测试，chrome和FF下存在，IE下无效
 */
var getScrollX = function(){
	//用于IE6/7的严格模式中
	var de = document.documentElement;

	return self.pageXOffset || (de && de.scrollLeft) || document.body.scrollLeft;
};

var getScrollY = function(){
	//用于IE6/7的严格模式中
	var de = document.documentElement;

	return self.pageYOffset || (de && de.scrollTop) || document.body.scrollTop;
};
```
###视口尺寸
以下函数能够获得页面的视口尺寸（即不包含滚动条之外的内容）：

```javascript
/*
 *获得页面的视口尺寸（不包括滚动条之外的内容）
 *innerHeight: FF和Chrome支持，IE不支持
 */
var getWindowHeight = function(){
	//用于IE6/7的严格模式中
	var de = document.documentElement;

	return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
};

var getWindowWidth = function(){
	//用于IE6/7的严格模式中
	var de = document.documentElement;

	return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
};
```
