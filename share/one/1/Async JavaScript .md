#Async Javascript
异步编程的三种模式
##Callback
asyncFunction(cb);
##优点
简单，好实现，回调函数对闭包的引用直接，相当于一次性事件绑定
##缺点
模块依赖严重
<pre><code>asyncFunction(function(){
   moduleA.method();
   moduleB.method();
   moduleC.method();
   moduleD.method();
   ....
});
</pre></code>
##现实场景
<pre><code>
S.ajax({
    success:success
});
S.ready(function(){

});
</pre></code>
##Events
<pre><code>Event.on('change', handler);
Event.fire('change');
</pre></code>
##优点
解耦方便，模块依赖降低
<pre><code>Event.on('change', moduleA.method);
Event.on('change', moduleB.method);
Event.on('change', moduleC.method);
Event.on('change', moduleD.method);
...
</pre></code>
##缺点
1.对闭包的引用不够直接，可以通过增加once接口解决
2.事件无状态，绑定发生在触发事件之后，而函数不会被调用
<pre><code>$el.on('click', function(ev) {
   var $target = $(ev.currentTarget);
   App.subscribe($target.attr('data-id'), function(){
            $target.addClass('.s-subscribed');
   });
});
Event.on('subscribe', function(){
    ..............
});
$el.on('click', function(ev) {
   var $target = $(ev.currentTarget);
   Event.once('subscribe', function(){
         $target.addClass('.s-subscribed');
   });
   App.subscribe($target.attr('data-id');
});
</pre></code>
##现实场景
古老版本的jQuery的ready;
<pre><code>
$.ready(cb1);
//页面DOM加载完毕
//不会执行
$.ready(cb2);
</pre></code>
##Promise
带状态的Event
##优点
同步编程，异步执行
<pre><code>//KISSY 1.3
S.ajax(..).fin(cb1).fin(cb2);
</pre></code>
##《Async JavaScript》
###1.Events
###2.Promise
###3.Flow Control
###4.Multithreading with Workers
###5.Async Script Loading
