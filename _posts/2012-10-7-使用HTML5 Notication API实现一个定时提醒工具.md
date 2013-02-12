---
layout: post
title: 使用HTML5 Notication API实现一个定时提醒工具
---
#{{page.title}}
在初识Chrome Notification API 这篇博文介绍了Notification API以及chrome的实现，
同时也对相关的API做了一个简单的封装，在本文中将利用封装过的API实现一个定时提醒工具。

工具的主要目的是：自己经常坐在电脑前，一坐就是好几个小时，希望有工具能够每小时提醒自己起来活动休息一会。

主要功能有：用户可以设置周期性的提醒时间，比如设置每1小时提醒一次，1小时后将弹出通知框提醒用户时间到。

其他包括：用户能够设置对话框的持续时间，比如持续15秒，15秒后对话框消失，以及提醒内容等。
##HTML&CSS
首先先创建基本的HTML结构如下：

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>时间提醒</title>
		<style>
			div {
				margin:40px 15px;
			}

			#main {
				margin:0 auto;
				width:360px;
				border: 2px solid green;
			}

			.operation {
				text-align:center;
			}

		</style>
	</head>
	<body>
		<div id="main">
		<div><label for="interval">设置时间间隔（分）：<input id="interval" type="number" value="60" /></label></div>
		<div><label for="duration">弹窗持续时间（分）：<input id="duration" type="number"  value="1" /></label></div>
		<div><label for="content">设置提醒消息：<textarea id="content" >你已经做了很久啦，让眼睛放松放松吧~~！</textarea></label></div>
		<div class="operation">
			<input type="button" value="开始" id="start" />
			<input type="button" value="停止" id="stop" />
		</div>
		</div>
		<script src="desktopNotify.js"></script>
		<script src="desktop-notification.js"></script>
	</body>
</html>
```

desktopNotify.js是前面提到的封装过的Notification API，
desktop-notification.js则是相关的业务逻辑JS，后面会说到。
基本的效果如下，虽然是丑陋了点- -！！

<img src="https://lh3.googleusercontent.com/ePJ8OYGBH1myRB27ghrpuNK2rHBQM3MH6CXpP5om1HXkJSWRkOqinnKrlUqSh2eSeFEcnoEBCOGrlNfjhOr1ESTBYgyQNdHZ6hq5LteL0kz9Ku6YmZE" />

程序的逻辑比较简单，设置各个字段，点击"开始"按钮，程序开始计时，到指定时间，弹出通知框。
##JavaScript
desktopNotify.js的功能主要是对原生Notification API做一些基本封装，代码如下：

```javascript
//desktopNotify.js
void function() {
	var _instance = null,
		_permissionStatus = -1,
		_eventTable = {
			"show": 1,
			"error": 1,
			"close": 1,
			"click": 1
		};


	/**
	 *调用例子：
	 * var DN = window.XX.DesktopNotify;
	 * DN.requestPermission(function(){
	 * 	  DN.show("http://xxx", "hello", "world");
	 * });
	 */
	var DesktopNotify = {

		/**
		 *检测是否支持Notification，支持返回true
		 */
		isSupport : function() {
			return 'Notification' in window || 'webkitNotifications' in window;
		},

		/**
		 *弹出一个文本桌面通知
		 *
		 * @param {String} iconURL:图标资源
		 * @param {String} title: 标题
		 * @param {String} content: 内容
		 */
		show : function(iconURL, title, content) {
			_instance = this.create(iconURL, title, content);
			_instance.show();
		},


		/**
		 *弹出一个 HTML桌面通知
		 *
		 * @param {String} url:html链接资源
		 */
		showHTML : function(url) {
			_instance = this.createHTML(url);
			_instance.show();
		},

		/***
		 * 关闭一个桌面通知
		 *
 		 * @param {Object} cb： 隐藏后的回调函数
 		 *
		 */
		hide : function(cb) {
			_instance && _instance.close();
			cb && cb();
		},

		/**
		 * 释放通知对话框引用
		 */
		destroy: function() {
			_instance = null,
			_permissionStatus = -1;
		},

		/**
		 * 检查权限状态
		 * @return {Number}: 0为允许，1为不允许， 2为禁止
		 */
		checkPermission : function() {
			return _permissionStatus = webkitNotifications.checkPermission();
		},

		/**
		 * 检查是否得到授权
		 * @return {Boolean}： true表示得到授权
		 */
		isPermitted: function() {
			return this.checkPermission() === 0;
		},


		/**
		 * 请求授权
 		 * @param {Object} cb：得到授权后的回调函数
		 */
		requestPermission: function(cb) {
			if(this.isPermitted()) {
				cb && cb();
			} else {
				webkitNotifications.requestPermission(cb);
			}
		},

		/**
		 * 创建一个文本性质的通知对话框，但不展示
 		 * @param {Object} iconURL
		 * @param {Object} title
 		 * @param {Object} content
 		 * @return {Object} Notification实例
		 */
		create: function(iconURL, title, content) {
			return webkitNotifications.createNotification(iconURL, title, content);
		},

		/**
		 * 创建一个HTML性质的通知对话框，但不展示
 		 * @param {Object} url: 指向html页面的链接
 		 * @return {Object} Notification实例
		 */
		createHTML: function(url) {
			return webkitNotifications.createHTMLNotification(url);
		},

		/**
		 * 添加事件监听函数
 		 * @param {Object} type: 事件类型
 		 * @param {Object} fn: 监听函数
		 */
		on: function(type, fn) {
			_eventTable[type] && _instance && _instance.addEventListener(type, fn, false);
		},

		/**
		 * 移除事件监听函数
 		 * @param {Object} type: 事件类型
 		 * @param {Object} fn: 监听函数
		 */
		un: function(type, fn) {
				_eventTable[type] && _instance && _instance.removeEventListener(type, fn, false);
		}
	};

	window.XX || (window.XX = {});
	window.XX.DesktopNotify = DesktopNotify;
}();
```

desktop-notification.js则是业务代码，如下：

```javascript
//desktop-notification.js
void function() {
    var TITLE = '时间到啦~~！亲！！',
            //图标路径
        ICONURL = 'icon.png';

    var DN = window.XX.DesktopNotify;

   /**
    * 通知函数，根据设置的时间间隔，周期的弹出通知框
    */
    function notify(content, duration) {
        DN.show(ICONURL, TITLE, content);
        setTimeout(function() {
            DN.hide();
        }, duration);
    }

    if (!DN.isSupport()) {
        alert('浏览器不支持桌面通知！');
        return;
    }

    var startEl = document.getElementById('start'),//开始按钮
        stopEl = document.getElementById('stop'),//停止按钮
        intervalEl = document.getElementById('interval'),//提醒时间间隔输入框
        contentEl = document.getElementById('content'),//提醒内容输入框
        durEl = document.getElementById('duration'),//通知框持续时间输入框
        timer = null;

    startEl.addEventListener('click', function(evt) {
        /**
         * 点击“开始”，先申请用户授权，经过授权后，获取相关的提醒时间间隔，以及内容，周期的调用notify函数弹出通知框
         */
        DN.requestPermission(function() {
            timer = setInterval(notify, intervalEl.value * 60 * 1000, contentEl.value, durEl.value * 60 * 1000);
            startEl.disabled = true;
        });
    }, false);

    stopEl.addEventListener('click', function(evt) {
        /**
         * 点击“停止”，清除周期调用
         */
        clearInterval(timer);
        startEl.disabled = false;
    }, false);
}();
```

##运行效果

注意，网页必须在HTTP或HTTPS协议下打开，而不能直接用File协议打开，
否则无法运行（若用户设置了浏览器接收任何通知，倒是可以直接打开运行）。运行的效果如下：

<img src="https://lh4.googleusercontent.com/QiopE9Yh--cbqAGvzDy3eYiaW_T9bxImxKeLYPNjDxFZt4GWreBfUzDXO3KIMHjMLbTJqonWjyK7lMuGrGwZ_YvhTMyIcrReuiF3NWIsFwm7nki3s4k" />

即便当浏览器最小化，或者未在高亮状态，通知框一样会定时弹出。
##总结
在本文中，利用了HTML5 Notification做了一个简单的小工具，用于提醒自己不要久坐，按时休息= =！
虽然界面是丑陋了点~~~ 不过效果还可以··。。

完整的源码请访问：[https://github.com/Exodia/jsdemo/tree/master/desktop-notifications](https://github.com/Exodia/jsdemo/tree/master/desktop-notifications)
