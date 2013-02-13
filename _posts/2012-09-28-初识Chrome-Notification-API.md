---
layout: post
title: 初识Chrome-Notification-API
---
#{{page.title}}
chrome在很早之前就推出了桌面通知API，
chrome自己的API标准可以参考这个链接：
[http://dev.chromium.org/developers/design-documents/desktop-notifications/api-specification](http://dev.chromium.org/developers/design-documents/desktop-notifications/api-specification)
，同时notification也纳入了W3C的标准，
目前还是草案，两者差别在于：W3C仅定义了Notification，chrome标准中则还有NotificationCenter，
同时chrome标准中Notification的API没有W3C的完整，但是chrome本身又基本实现了W3C标准的Notification，
所以有很多chrome已实现的Notification的API在chrome标准中并未提及，只能通过试探性的尝试摸索。

下面将介绍chrome标准中相关的桌面通知API。

涉及到桌面通知的有两个类：NotificationCenter与Notification。 前者是一个工厂类，作用是检查、申请用户授权以及创建Notification实例；
后者的功能包括弹出/隐藏桌面通知，以及相关的事件接口。 两者的API如图：

<img src="https://lh4.googleusercontent.com/g9yDWx_XEBnmR4iBtxtEU_tKzTQvcSESGpG-JsBhndK7mshZ7kqQk1KRg8dubH7OJ63toM-rAFbBGWkPJ0OjggMVD43EWhLChVXmv5nT_LdcTv-X3aA" />

##NotificationCenter
在chrome中，NotificationCenter实现为window对象下的webkitNotifications属性。API详细介绍如下：

<b>checkPermission</b>: 该函数用于检查权限，返回值有0，1，2， 分别对应允许，不允许，拒绝状态。
与HTML5中的geolocation API一样， 桌面通知的启用需要得到用户授权。
不允许是在chrome浏览器的设置中，勾选了“网站尝试显示桌面通知时询问我（推荐）”产生的。
而拒绝则是在弹出请求授权的对话框时，用户点击拒绝产生的。

<b>requestPermission</b>: 该函数用于请求用户授权使用桌面通知功能，接受一个回调函数作为参数，
当用户授权时，该回调函数会被调用，相当于一个入口函数。
</b>注意：该函数只能在处理用户行为的函数中来调用，比如click事件监听函数。</b>

<b>createNotification</b>: 创建一个文本性质的Notification实例，接受的参数为：<b>iconURL, title, content</b>;
<b>iconURL</b>是一个url字符串，定义了通知对话框的图标，<b>title</b>则是通知对话框标题，
<b>content</b>是通知对话框的内容。在chrome22下，文本性质的桌面对话框的模样如图：

<img src="https://lh5.googleusercontent.com/-NKZVKEL8dDJS3K0uqWdGqH6ZiHdGKnMjGS8sNtonqdK5s_mkegl-MeIIWIE6R4yzQ71lBO4Y8KPjYVmoU70J-V4zXSzGQzFoyzd04rH5WP5N34NHgg" >

<b>createHTMLNotification</b>: 用于创建一个HTML性质的Notification实例，
接受一个url作为参数，该url指向的html页面将被展示在对话框中。大概的模样如下图，我这里链接是指向了”http://www.163.com”

<img src="https://lh3.googleusercontent.com/YViwwEzip3z9HYVuUQs0cz15RT5mnR1-8zodEnm5AL1spFYB8wbWiP2EaAMpcUpMk16w5Lx_XfVfge-qFnb-dZ8n_I0WQRAhP30isPyPxa29BoQESQY" >

<b>注意：createNotification与createHTMLNotification都是需要得到用户的允许或者授权才可以使用，
在未授权或者允许的情况下调用，则会抛出一个权限错误。</b>
##Notification
通过NotificationCenter的create*函数创建了Notification实例后，
需要调用通过Notification的show函数才能将对话框展示出来，以下介绍了Notification提供的API：

###<em>Methods：</em>
<b>show</b>:用于显示通知对话框，对话框不一定会立刻就展示，
取决于浏览器的实现（如浏览器对通知对话框显示的数量有限制，会做一个队列保存等待展示的通知）。调用时将会触发display事件

<b>cancel</b>:该函数使通知不会被展示，若通知已经显示了，则会关闭通知对话框。若通知还处于展示队列中，则会从队列中移除该通知。

###<em>Events:</em>
<b>error</b>: 错误事件，目前来看一般只会接触到权限错误
<b>display</b>: 对话框展示时触发
<b>close</b>: 当用户关闭对话框，或脚本调用close方法时，触发
<b>click</b>: 当用户点击通知对话框时，触发

以下是我封装的一个桌面通知对象：[https://github.com/Exodia/chrome-ext/blob/master/desktopNotify.js](https://github.com/Exodia/chrome-ext/blob/master/desktopNotify.js)
##总结
桌面通知API给WEB带来了更多的新鲜元素，让浏览器看起来更像是一个OS。
另在chrome，基本已经实现了W3C标准的Notification，而chrome的标准草案确迟迟未更新- -！
本文旨在初识桌面通知，因此介绍的桌面通知API都是按照chrome的标准介绍，难免不够完善，详细的API应参考[W3C的标准](http://dvcs.w3.org/hg/notifications/raw-file/tip/Overview.html/)。