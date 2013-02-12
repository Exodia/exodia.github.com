---
layout: post
title: 【译】使用PhantomJS测试JavaScript
---

##{{page.title}}
我认为我不需要说服你，测试你的JavaScript代码是一个好主意。
但是，测试需要DOM操作的JavaScript代码有时候确是繁琐的。
这意味着你需要在浏览器中测试代码而不能使用终端，对吗？错了，事实是：进入[PhantomJS](http://phantomjs.org/)。

究竟PhantomJS是什么？好吧，这有一个来自PhantomJS网站的简介：
    <em>PhantomJS是一个拥有JavaScript API的无界面WebKit。</em>

如你所知，Webkit是Chrome、Safari和其他一些小众浏览器使用的布局引擎。
因此，PhantomJS是一个浏览器，而且是一个无界面的浏览器。这意味着，渲染后的网页实际上绝不会显示。
这对你来说可能不可思议，所以你可以把它作为一个可编程的浏览器终端。
我们马上将看一个简单的例子，但首先需要安装PhantomJS。
###安装PhantomJS
安装PhantomJS事实上很简单：你下载的仅仅是单独的一个二进制文件，接着将文件路径粘帖到终端。
在PhantomJS下载页面 ，选择您的操作系统并下载正确的软件包。
接着，将二进制文件从下载的程序包中移动到一个在你终端路径的目录中（我喜欢把这类玩意放到~/bin里）。

如果你用的是Mac OS X，有一个更简单的方法安装PhantomJS（这实际上是我所使用的方法）。只需像这样使用Homebrew：

<strong>brew update && brew install phantomjs</strong>

你现在应该已经安装了PhantomJS。你可以运行以下命令仔细检查安装信息：

<strong>phantomjs --version</strong>

我看到1.7.0，你呢？
###一个简单的例子
让我们先从一个简单的例子开始吧<br>

####simple.js
{% highlight javascript linenos=table %}
console.log("we can log stuff out.");

function add(a, b) {
    return a + b;
}

console.log("We can execute regular JS too:", add(1, 2));

phantom.exit();
{% endhighlight %}