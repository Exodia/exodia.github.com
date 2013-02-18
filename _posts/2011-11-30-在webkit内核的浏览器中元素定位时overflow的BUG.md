---
layout: post
title: 在chrome浏览器中，元素absolute/relative定位的一个BUG
---
##{{page.title}}
前几日，用EXT的一个组件的API（setAutoScroll）设置容器滚动条属性（overflow）发现的这个问题，记录下。

##问题描述
在chrme下，如果一个设置了position（fixed/absolute/relative）的父容器包含一个子元素，
而这个子元素也设置了position(absolute/relative)， 通过JS动态改变子元素的大小以超过父容器的可见尺寸，
同时设置父元素的overflow属性为auto或scroll，这个时候出现滚动条，可以用鼠标滚动查看滚动条的部分。

接着，用JS设置父容器的overflow为""/"visible"/，这个时候，滚动条消失了，但是你滚动鼠标滚轮，会发现依然可以滚动子元素。
 
设置为“hidden”的话是不会出现这个问题的，或者用JS设置为""，而在样式表中设置为hidden也可以。

##重现代码

```html
<!DOCTYPE html>  
<head>  
<script>  
window.onload = function(){  
  document.getElementById("t1").onclick = function(){  
    var ctn = document.getElementById("ctn");  
    var c = document.getElementById("ctnChild");  
    ctn.style.overflow = "auto";  
    c.style.height = "600px";  
  };  
  document.getElementById("t2").onclick = function(){  
        var c = document.getElementById("ctnChild");  
        var ctn = document.getElementById("ctn");  
    //  c.style.height = "700px";  //可以对比下，当子元素比容器大的时候出现的情况，会发现依然可以滚动元素  
        c.style.height = "200px";  
        ctn.style.overflow = ""; //delete ctn.style.overflow; 用这句代替ctn.style.overflow = ""不会出现问题  
  };  
};  
</script>  
<style>  
#ctn{  
border:2px solid red;  
 width:500px;   
 height:400px;  
 position:relative;  
}  
 
#ctnChild{  
background-color:blue;  
width:200px;  
height:200px;  
position:relative;  
}  
</style>  
</head>  
<body>  
<div id="ctn">  
<div id="ctnChild"></div>  
</div>  
<input type="button" id="t1"  value="放大尺寸" />  
<input type="button" id="t2"  value="还原" />  
</body>  
</html>  
```
##重现环境
safari5,chrome18
##**注:chrome23+，以及最新版本的safari已无此bug，推测是webkit的版本更新修复了该bug**
##操作步骤
点击放大尺寸按钮，再点击还原，再前后滚动滚轮。
###[惨无人道的点此进入DEMO](/demo/webkit-overflow-bug/)
##期望结果
子元素位置不滚动
##产生结果
子元素位置滚动
