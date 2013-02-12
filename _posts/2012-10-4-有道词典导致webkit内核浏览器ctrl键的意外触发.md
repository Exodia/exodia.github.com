---
layout: post
title: 有道词典导致webkit内核浏览器ctrl键的意外触发
---
#{{page.title}}
##重现代码

```javascript
document.body.onkeydown = function(ev) {
    console.log(ev.ctrlKey);
};
```

##重现环境
浏览器：webkit内核的浏览器：chrome、safari

有道词典： 版本5.1
##重现步骤
鼠标双击或者鼠标拖拽释放
##解决方案
将有道词典完全关闭
##总结
真荣幸，第一次碰到了由桌面软件引起的浏览器脚本冲突，有道的相关工作人员已经确认，在随后发布的更新版本中，该问题已经得到解决；
不管怎么样，这个问题其实给前端带来了更进一部的工作量，排查bug时，还要注意桌面软件可能引起的异常行为。