#Web Font
能够让网页展示用户机器上不存在的字体

对我们而言最直接的优势在于字体图标

##历史
CSS2.1就已经引入, 且IE4就已经支持

##@font-face Rule
通过@font-face引入web字体

```css
@font-face {
    font-family: name;
    src: local('fontname'), url('/path/filename.otf') format(''opentype)
}

```

##使用

```css
E {
    font-family: name;
}

```

##font-weight与font-style
未提供相关的itaic和bold形式字体, 浏览器会对部分元素的显示做机器转换

```css
em {
    font-style: normal;
}

strong {
    font-weight: normal;
}
```

##兼容性
IE8以下不支持local(), 字体格式仅支持eot;

IE8以下会对url字符后的串解析成url, 发起字体请求, 自然是一个无用的404

MAC Safari5.03, 使用了local,字体管理器会弹出对话框向用户请求权限

解决方案:

```css
@font-face {
 font-family: name;
 src: url('filename.eot');
 src: local('?'), url('/path/filename.otf') format('opentype')
}
```

##font format

EOT: IE

WOFF: IE9+, FF20+, Chrome26+, Safari: 5.1+, Opera: 12.1+, IOS Safari: 5.0+;

SVG: Chrome26+, Safari5.1+, Opera: 12.1+, IOS Safari: 3.2+, Android 3.0+;

TTF/OTF: IE9.0+, FF20+, Chrome26+,  Safari5.1+, Opera: 12.1+, IOS Safari: 4.2+, Android 2.2+;

##字体格式兼容解决方案:

```css
@font-face {
  font-family: name;
  src: url('filename.eot');
  src: local('?'),
    url("filename.woff") format("woff"),
    url("filename.otf") format("opentype"),
    url("filename.svg#svgFontName") format("svg");
}
```

##跨域问题

FF与IE不允许跨域web fonts

解决方案:

1. 服务端设置允许跨域访问资源

2. data-url形式引入

##在项目中使用web font

1. 让设计师去[一淘字体库](http://ux.etao.com/fonts)选择字体

2. 下载相关字体压缩包, 发布cdn

3. 通过@font-face引入

4. 跨域问题可通过引用t.tbcdn.cn或转化为base64解决








