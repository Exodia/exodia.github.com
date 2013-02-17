---
layout: post
title: 《Javascript:权威指南（影印版）》中的一个错误
---
#{{page.title}}
<em>P401,Line8-9：Like the onsubmit handler, onreset is triggered only by a genuine Reset button.
Calling the reset() moethod of a form does not trigger onreset.</em>

事实是，直接调用form的reset方法会触发对应的reset事件，但直接调用submit方法则不会触发submit事件。
