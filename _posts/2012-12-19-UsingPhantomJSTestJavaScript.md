---
layout: post
title: 【译】使用PhantomJS测试JavaScript
---

#{{page.title}}
我认为我不需要说服你，测试你的JavaScript代码是一个好主意。
但是，测试需要DOM操作的JavaScript代码有时候确是繁琐的。
这意味着你需要在浏览器中测试代码而不能使用终端，对吗？错了，事实是：进入[PhantomJS](http://phantomjs.org/)。

究竟PhantomJS是什么？好吧，这有一个来自PhantomJS网站的简介：
    <em>PhantomJS是一个拥有JavaScript API的无界面WebKit。</em>

如你所知，Webkit是Chrome、Safari和其他一些小众浏览器使用的布局引擎。
因此，PhantomJS是一个浏览器，而且是一个无界面的浏览器。这意味着，渲染后的网页实际上绝不会显示。
这对你来说可能不可思议，所以你可以把它作为一个可编程的浏览器终端。
我们马上将看一个简单的例子，但首先需要安装PhantomJS。
##安装PhantomJS
安装PhantomJS事实上很简单：你下载的仅仅是单独的一个二进制文件，接着将文件路径粘帖到终端。
在PhantomJS下载页面 ，选择您的操作系统并下载正确的软件包。
接着，将二进制文件从下载的程序包中移动到一个在你终端路径的目录中（我喜欢把这类玩意放到~/bin里）。

如果你用的是Mac OS X，有一个更简单的方法安装PhantomJS（这实际上是我所使用的方法）。只需像这样使用Homebrew：

<strong>brew update && brew install phantomjs</strong>

你现在应该已经安装了PhantomJS。你可以运行以下命令仔细检查安装信息：

<strong>phantomjs --version</strong>

我看到1.7.0，你呢？
##一个简单的例子
让我们先从一个简单的例子开始吧<br>

###simple.js
{% highlight javascript linenos=table %}
console.log("we can log stuff out.");

function add(a, b) {
    return a + b;
}

console.log("We can execute regular JS too:", add(1, 2));

phantom.exit();
{% endhighlight %}
继续前进，发出以下命令运行这段代码：

phantomjs simple.js

你应该在终端窗口中看到来自两行console.log的输出。

当然，这很容易，但它证明了一个很不错的点：
PhantomJS可以像一个浏览器那样执行JavaScript。
然而，这个例子并没有任何特定于PhantomJS的代码......好吧，除了最后一行。
那行代码对于每个PhantomJS脚本都很重要，因为它退出脚本执行。
这可能说不通，但要记住，JavaScript并不总是顺序执行。
例如，你可能想要把exit()的调用放在一个回调函数中 。
让我们看一个更复杂的例子。
##加载页面
通过使用PhantomJS API，我们可以加载任何URL，并从两个维度来与页面工作：

作为页面上的JavaScript。<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;作为一个正在浏览页面的用户。

让我们从选择加载页面开始。创建一个新的脚本文件，并添加下面代码：
###script.js
{% highlight javascript linenos=table %}
var page = require('webpage').create();
page.open('http://net.tutsplus.com', function (s) {
    console.log(s);
    phantom.exit();
});
{% endhighlight %}
我们首先加载PhantomJS的webpage模块并创建一个webpage对象。
接着，我们调用open方法，传递给它一个URL和一个回调函数；
正是在这个回调函数内部，我们可以与实际的页面交互。
在上面的例子中，我们只是记录由回调函数的参数提供的请求状态。
如果你运行这个脚本（用phantomjs script.js ），你看到终端打印出“成功”。

但是，让我们加载一个网页并执行一些JavaScript代码，把这变得更加有趣些。我们从上面的代码开始，接着调用<strong>page.evaluate</strong> ：
{% highlight javascript linenos=table %}
page.open('http://net.tutsplus.com', function () {
    var title = page.evaluate(function () {
        var posts = document.getElementsByClassName("post");
        posts[0].style.backgroundColor = "#000000";
        return document.title;
    });
    page.clipRect = { top: 0, left: 0, width: 600, height: 700 };
    page.render(title + ".png");
    phantom.exit();
});
{% endhighlight %}
我们传递给<b>page.evaluate</b>的函数在加载的网页上作为JavaScript执行。
在这个用例中，我们找到的所有元素带post类的元素；接着，我们设置集合中第一个元素的背景为黑色。
最后，我们返回<b>document.title</b> 。
这是一个很好的功能，从<b>evaluate</b>回调函数中返回值，并将其分配给一个变量（在这里是<b> title </b>）。

然后，我们在页面上设置<b>clipRect</b>；
这是给<b>render</b>方法提供的屏幕截图尺寸。正如你所见，我们设置<b>top</b>和<b>left</b>值来设置起点，
并且我们还设置了<b>width</b>和<b>height</b> 。最后，我们调用<b>page.render</b> ，
传给它一个文件名（ <b>title</b>变量）。接着，我们调用<b>phantom.exit()</b>结束脚本。

继续运行这个脚本，你应该拥有一副看起来像这样的图片：

<img src="http://d2o0t5hpnwv4c1.cloudfront.net/2161_phantom/black.png" />

在这里，你可以看到PhantomJS这枚硬币的两面：可以在页面内执行JavaScript，还可以针对页面实例自身从外部执行。

这很有趣，但不是很有用。让我们将目光集中在使用PhantomJS测试DOM相关的JavaScript。
##用PhantomJS测试
对于很多的JavaScript代码，你可以不依赖DOM测试，但也有那么些时候，你的测试用例需要HTML元素一起工作。
如果你像我一样，喜欢在命令行上运行测试用例，这就是PhantomJS的用武之地。

当然，PhantomJS是不是一个测试库，但许多其他流行的测试库可以运行在PhantomJS中。
你可以从[PhantomJS wiki中关于无界面测试页面上](https://github.com/ariya/phantomjs/wiki/Headless-Testing)发现，
PhantomJS的测试驱动可用于几乎每一个你可能想使用的测试库。让我们来看看如何与Jasmine及Mocha一起使用PhantomJS。

首先， Jasmine和一个免责声明：现在并没有一个优秀的用于Jasmine的PhantomJS驱动。
如果你使用Windows和Visual Studio，你应该去check out [Chutzpah](http://chutzpah.codeplex.com/) ，
Rails开发人员应该试试[guard-jasmine](https://github.com/netzpirat/guard-jasmine) 。
但除此之外，对Jasmine+ PhantomJS的支持非常稀疏。

###<em>出于这个原因，我建议你使用Mocha进行D​​OM相关的测试。</em>

尽管如此，很可能你已经有一个项目在使用Jasmine ，并想与PhantomJS一起使用。
有一个叫 [phantom-jasmine](https://github.com/jcarver989/phantom-jasmine)的项目 ，
需要一点点的设置工作，但它应该能够达到目的。

让我们从一组JasmineJS测试用例开始。下载本教程的代码（在顶部的链接），并check out <b>jasmine-starter</b>文件夹。
你会看到，我们有一个单独的<b>tests.js</b>文件，该文件创建一个DOM元素，设置了DOM元素的几个属性，并将其添加到body中。
然后，我们运行一些Jasmine 测试用例，以确保这个过程确实的正常工作。下面是该文件的内容：

###tests.js
{% highlight javascript linenos=table %}
describe("DOM Tests", function () {
    var el = document.createElement("div");
    el.id = "myDiv";
    el.innerHTML = "Hi there!";
    el.style.background = "#ccc";
    document.body.appendChild(el);
    var myEl = document.getElementById('myDiv');
    it("is in the DOM", function () {
        expect(myEl).not.toBeNull();
    });
    it("is a child of the body", function () {
        expect(myEl.parentElement).toBe(document.body);
    });
    it("has the right text", function () {
        expect(myEl.innerHTML).toEqual("Hi there!");
    });
    it("has the right background", function () {
        expect(myEl.style.background).toEqual("rgb(204, 204, 204)");
    });
});
{% endhighlight %}

<b>SpecRunner.html</b>文件相当于树干；唯一的区别是，我将脚本标签移到body中，以确保DOM在运行我们的测试前完全加载。
你可以在浏览器中打开该文件，并看到所有的测试都很好的通过了。

让我们把这个项目过渡到PhantomJS。首先，克隆[phantom-jasmine](https://github.com/jcarver989/phantom-jasmine)项目：

```sh
git clone git://github.com/jcarver989/phantom-jasmine.git
```

该项目并不是那么的有组织，但它有两个重要的组成部分是你所需要的：

PhantomJS驱动（这使得Jasmine 能够使用PhantomJS DOM）。<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Jasmine 控制台报告器（这提供控制台输出）。

这两个文件中都属于<b>lib</b>文件夹，将其复制到<b>jasmine-starter/lib </b>。
现在，我们需要打开<b>SpecRunner.html</b>文件，并调整&lt;script /&gt;元素。它们应该像这样：

```html
<script src="lib/jasmine-1.2.0/jasmine.js"></script>
<script src="lib/jasmine-1.2.0/jasmine-html.js"></script>
<script src="lib/console-runner.js"></script>
<script src="tests.js"></script>
<script>
    var console_reporter = new jasmine.ConsoleReporter()
    jasmine.getEnv().addReporter(new jasmine.HtmlReporter());
    jasmine.getEnv().addReporter(console_reporter);
    jasmine.getEnv().execute();
</script>
```

请注意，我们的测试中有两个报告器：HTML报告器和一个控制台报告器。
这意味着<b>SpecRunner.html</b>.和它的测试可以运行在浏览器和控制台。这非常方便。
不幸的是，我们确实需要有<b>console_reporter</b>变量，因为它在内部被用于我们即将运行的CoffeeScript文件。

那么，如何在控制台上真实的运行这些测试呢？假设你的终端当前目录是<b>jasmine-starter</b>文件夹，以下是这些命令：

```sh
phantomjs lib/run\_jasmine\_test.coffee ./SpecRunner.html
```

我们正在使用PhantomJS运行<b>run\_jasmine\_test.coffee</b>脚本，并将<b>SpecRunner.html</b>文件作为参数传递。
你应该会看到这样的内容：

<img src="http://d2o0t5hpnwv4c1.cloudfront.net/2161_phantom/jasmine-success.png" />

当然，如果一个测试用例失败，你会看到类似以下内容：

<img src="http://d2o0t5hpnwv4c1.cloudfront.net/2161_phantom/jasmine-error.png" />

如果你打算经常使用这货，将 <b>run\_jasmine\_test.coffee</b>移动到另一个位置
（比如<b>~/bin/run\_jasmine\_test.coffee</b> ）也许是一个好主意，并为整个命令创建一个终端别名。
这里告诉了你如何在Bash shell中做到这一点：

```sh
alias phantom-jasmine='phantomjs /path/to/run\_jasmine\_test.coffee
```

只需丢在你的.bashrc或.bash_profile文件里。你只需要运行：

```sh
phantom-jasmine SpecRunner.html
```

现在你的Jasmine测试通过PhantomJS在终端上运行良好。你可以在下载文件夹中的jasmine-total看到最终的代码。
##PhantomJS和Mocha
值得庆幸的是，使用[mocha-phantomjs](http://metaskills.net/mocha-phantomjs/)整合Mocha与PhantomJS更加容易。
如果你已经安装了NPM（你应该要安装），那么安装mocha-phantomjs则是超级容易：

```sh
npm install -g mocha-phantomjs
```

此命令安装一个<b>mocha-phantomjs</b>二进制文件，我们将用它来运行我们的测试。

在前面的教程中 ，我向你展示了如何在终端使用<b>Mocha</b>，但当你用它来​​测试DOM代码时，你会做些不同的事情。
与Jasmine一样，我们将以一个可以运行在浏览器中的HTML测试报告器开始。
美妙的是，对于控制台测试结果，我们可以用PhantomJS在终端上运行同一个文件;正如我们使用Jasmine那样。


那么，让我们创建一个简单的工程。创建一个工程目录，并切换到它的路径。我们以一个<b>package.json</b>文件为开始：

```json
{
    "name": "project",
    "version": "0.0.1",
    "devDependencies": {
        "mocha": "*",
        "chai" : "*"
    }
}
```

Mocha是测试​​框架，我们将使用Chai作为我们的断言库。我们运行NPM安装这些。

我们将测试文件命名为<b>test/tests.js</b> ，这里是它的测试用例：

```javascript
describe("DOM Tests", function () {
    var el = document.createElement("div");
    el.id = "myDiv";
    el.innerHTML = "Hi there!";
    el.style.background = "#ccc";
    document.body.appendChild(el);
    var myEl = document.getElementById('myDiv');
    it("is in the DOM", function () {
        expect(myEl).to.not.equal(null);
    });
    it("is a child of the body", function () {
        expect(myEl.parentElement).to.equal(document.body);
    });
    it("has the right text", function () {
        expect(myEl.innerHTML).to.equal("Hi there!");
    });
    it("has the right background", function () {
        expect(myEl.style.background).to.equal("rgb(204, 204, 204)");
    });
});
```

它们与Jasmine的测试用例非常相似，但是Chai断言语法则是有点不同的（所以，不要只是复制你的Jasmine测试用例）。

最后一道难题是<b>TestRunner.html</b>文件：

```html
<html>
    <head>
        <title> Tests </title>
        <link rel="stylesheet" href="./node_modules/mocha/mocha.css" />
    </head>
    <body>
        <div id="mocha"></div>
        <script src="./node_modules/mocha/mocha.js"></script>
        <script src="./node_modules/chai/chai.js"></script>
        <script>
            mocha.ui('bdd');
            mocha.reporter('html');
            var expect = chai.expect;
        </script>
        <script src="test/test.js"></script>
        <script>
            if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
            else { mocha.run(); }
        </script>
    </body>
</html>
```

这里有几个重要的因素。
首先，请注意这是完全能够运行在浏览器中的，我们拥有从安装的node模块中的CSS和JavaScript。
接着，注意内联的script标签。这将确定PhantomJS是否加载，若加载，则运行PhantomJS的的功能。
否则，它使用原生的Mocha功能。你可以尝试在浏览器中运行，并观察它的工作。

要在控制台运行，只需执行以下命令：

```sh
mocha-phantomjs TestRunner.html
```

瞧！现在你的测试用例在控制台中运行，这一切都归功于PhantomJS。
##PhantomJS和Yeoman
我敢打赌，你肯定不知道流行的[Yeoman](http://yeoman.io/)在其测试过程中使用PhantomJS，并且这几乎是无缝的。
让我们看一个迅速的例子。我将假设你已经将Yeoman的一切设置好了。

创建一个新的工程目录，运行里面的<b>yeoman init</b> ，并对所有选项选择“NO”。
打开<b>test/index.html</b>文件，你会发现接近底部有一个脚本标签，脚本中有一段注释告诉你将其替换成你自己的用例。
完全的忽略那个很好的建议，并把下面这些放到 <b>it</b>块中：

```javascript
var el = document.createElement("div");
expect(el.tagName).to.equal("DIV");
```

现在，运行yeoman test ，你会看到测试运行得相当好。现在，在浏览器中打开test/index.html文件。它运作了！完美!

当然，你还可以用Yeoman做更多的事，所以check out出它的[文档](http://yeoman.io/)做更深一步的了解。
##结论
如果你正在使用PhantomJS，学习PhantomJS是毫无任何理由的，你可以只知道它的存在和使用扩展于PhantomJS的库来使你的测试更加容易。

希望本教程已经激发了你去观察PhantomJS的兴趣。
我建议从PhantomJS提供的[示例文件](https://github.com/ariya/phantomjs/wiki/Examples)
和[文档](https://github.com/ariya/phantomjs/wiki)开始 ;
它们真的会打开你的视野，让你知道你可以用PhantomJS做什么——从页面自动化到网络嗅探的任何事情。

原文链接：[http://net.tutsplus.com/tutorials/javascript-ajax/testing-javascript-with-phantomjs/](http://net.tutsplus.com/tutorials/javascript-ajax/testing-javascript-with-phantomjs/)