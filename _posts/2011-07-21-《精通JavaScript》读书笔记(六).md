---
layout: post
title: 《精通JavaScript》读书笔记(六)—使用Ajax
category: 前端 JavaScript 读书笔记
---
#{{page.title}}
使用Ajax的步骤主要有：创建Ajax对象，Ajax对象打开连接，Ajax对象发送数据，Ajax获得响应。
##1.创建Ajax对象
不同的浏览器有着不同的创建方法，因此我们需要封装一个创建Ajax对象的方法，大部分标准浏览器都支持原生的XMLHttpRequest对象，
因此我们首先检测是否存在XHR对象方法，存在则直接调用，否则我们定义一个XMLHttpRequest方法。

```javascript
//自运行函数，用于创建XMLHttpRequest方法
(function() {
	//存在原生的XHR，直接返回
	if( typeof XMLHttpRequst !== 'undefined') {
		return;
	} else if( typeof ActiveXObject !== 'undefined') {//否则判断ActiveXObject
		XMLHttpRequest = function() {
			if( typeof arguments.callee.activeXString !== 'string') {
				var versions = ['MSXML2.XMLHTTP.6.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'];
				for(var i = 0, len = versions.length; i < len; ++i) {
					try {
						var xhr = new ActiveXObject(versions[i]);
						arguments.callee.activeXString = versions[i];
						return xhr;
					} catch(ex) {

					}
				}
			}

			return new ActiveXObject(arguments.callee.activeXString);
		};
	} else{
		XMLHttpRequest = function(){
			throw new Error('No XHR object available');
		};
	}
})();
```
##2.打开连接
通过第1步的代码，我们可以首先创建一个AJAX对象：
var xhr = new XMLHttpRequest(); 接着打开连接xhr.open("GET", "/some/url.cgi", true);

当然，我们通过后台异步的发送请求，自然先要对请求参数进行序列化，以下是一个序列化函数：

```javascript
//表单数据序列化，支持两种不同的对象：
//-表单输入元素的数组
//-键/值对的散列表
//返回串行化后的字符串
var serialize = function(a){
	var s = [];
	if(a instanceof Array){
		for (var i=0, len = a.length; i<len; ++i) {
			s.push(a[i].name + '=' + encodeURIComponent(a[i].value));
		};
	} else{
		for(var k in a){
			s.push(k + '=' + encodeURIComponent(a[k]));
		}
	}

	return s.join('&');
};
```
##3.发送请求
发送GET请求则可以按如下步骤：

```javascript
xhr.open('GET', "/some/url.cgi?"+serialize(data), true);
xhr.send(null); //参数null对某些浏览器来说是必须的
```
发送POST的请求则需要先设置请求头的MIME类型，通常是application/x-www-form-urlencoded, 一个简单的示例如下：

```javascript
xhr.open('POST', "/some/url.cgi?", true);
xhr.setRequestHeader("Content-Type","application/x-www-urlencoded");
xhr.send(serialize(data));
```
##4.处理HTTP响应
在收到响应后，响应的数据会自动填充XHR对象的属性：

responseText:作为响应主体被返回的文本
respinseXML: 如果响应的内容类型是"text/xml"或"application/xml",这个属性将保存包含着响应数据的XML DOM文档
status: 响应的HTTP状态
statusText:HTTP状态的说明

在接到响应后，第一步是检查status属性，以确定响应已经成功返回。
一般来说，可以将HTTP状态代码为200作为成功标志，
此外状态码304表示请求的资源没有被修改，可以直接使用浏览器中缓存的版本，因此应该检测这两种属性。

当收到响应时，可以检测XHR对象的readyState属性，该属性表示请求/响应过程中的当前活动状态，
且当readyState属性的值由一个变成另一个时，会触发一次readyStatechange事件，
可以利用这个事件来检测每次状态变化后的readyState的值。 readyState的值有以下几种：

* 0：未初始化。尚未调用open()方法。
* 1：启动。已经调用open()方法，但尚未调用send()方法。
* 2：发送。已经调用send()方法，但尚未收到响应。
* 3：接收。已经接收到部分响应数据。
* 4：完成。已经接收到全部响应数据，而且已经可以在客户端使用了。

另外，在IE8中，还为XHR对象添加了一个timeout属性，表示请求在等待响应多少毫秒后就终止，在给timeout设置一个数值后，
如果在规定时间内浏览器还未收到响应，那么会触发一个timeout事件，
进而会调用ontimeout事件处理程序。当然为了保持跨浏览器的运行，我们可以自行模拟一个超时响应。

有了以上的介绍，我们则可以开发出一个完整的ajax包，包括了错误处理，超时处理等功能。代码如下：

```javascript
//一个封装好的ajax对象
var ajax = {};
//检查服务器HTTP响应的成功状态
ajax.httpSuccess = function(xhr){
	return xhr.status >= 200 && xhr.status < 300 || xhr.status == 304;
};
//发起一个ajax请求，opt为传入的设置参数对象
ajax.request = function(opt){
	//如果没有提供某个选项的值，就用默认值代替
	opt = {
		//请求方法
		method: opt.method || "POST",
		//请求的URL
		url:opt.url || "",
		//请求超时的时间
		timeout: opt.timeout || 5000,
		//请求失败、成功或完成（不管成功还是失败都会调用）时执行的函数
		complete: opt.complete || function(){},
		error: opt.error || function(){},
		success: opt.success || function(){},
		//发送的请求参数
		params: opt.params || ""
	};

	var xhr 	= new XMLHttpRequest(), //创建xhr对象
		timeout = opt.timeout,//保存超时时间，默认5秒
		requestDone = false,//标志请求是否完成
		params = XX.serialize(opt.params); //GET请求的话则将参数序列化接到url后面

	if(params !== '' && opt.method === 'GET'){
		params = '?' + params;
		opt.url  += params;
	}
	//初始化xhr
	xhr.open(opt.method, opt.url, true);

	//初始化一个5秒的回调函数，用于取消请求（如果尚未完成的话）
	setTimeout(function(){
		requestDone = true;
	}, timeout);

	//监听文档状态的更新
	xhr.onreadystatechange = function(){
		//保持等待，直到数据完全加载，并保证请求未超时
		if(xhr.readyState == 4 && !requestDone){
			if(XX.ajax.httpSuccess(xhr)){
				//成功则调用回调函数，并传入xhr对象
				opt.success(xhr, xhr.responseText)
			} else {
				//发生错误
				opt.error();
			}

			//调用完成回调函数
			opt.complete();

			//避免内存泄漏，清理文档
			xhr = null;
		}
	};

	if(opt.method === 'POST'){
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(params); //若为POST请求，则需序列化数据
	} else{
		xhr.send(null);
	}
};
```
