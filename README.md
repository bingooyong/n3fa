Name
====

n3fa is a Web Analytics


Tools
=====   

* redis的jui操作界面 [redis-commander](https://github.com/nearinfinity/redis-commander)

* Lua redis client driver for the ngx_lua [lua-resty-redis](https://github.com/agentzh/lua-resty-redis)


#嵌码安装

使用NGINX的[HttpSubModule](http://wiki.nginx.org/HttpSubModule)模块,在nginx.conf中加入如下代码


    sub_filter "</head>" "<script language='javascript'>var _n3fa = _n3fa || []; (function () {    var fa = document.createElement('script');    fa.type = 'text/javascript';    fa.async = true;    fa.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://') + '/path/fa.js?referer=$uri';    var s = document.getElementsByTagName('script')[0];    s.parentNode.insertBefore(fa, s); })();</script></head>";
    
    sub_filter_once on; 


#数据收集API
| 参 数|     途 径   |   名 称    | 备注 |
| :-- | :---------  | :-------   | :--- |
| cid | javascript  | 访客标示   | 由Nginx解析_n3fa_cid中内容，记录日志或传到后端统计服务器 |
| si  | javascript  | 系统标示   | 用于区分统计的系统32位token, eg:a9e72dfe4a54a20c3d6e671b3bad01d9|
| v   | javascript  | 版本号     | js的版本号，用于自动更新版本，强制更新缓存（未完成）eg:0.0.1 |
| rnd | javascript  | 随机数     | 防止请求被缓存，标记每次统计请求唯一 eg:1000677131 |
| ds  | javascript  | 分辨率     | window.screen.height & width eg:1920x1200 |
| cl  | javascript  | 颜色深度   | window.screen.colorDepth eg:24-bit |
| ln  | javascript  | 语 言      | navigator.language eg:zh-CN |
| ja  | javascript  | Java支持   | [0,1] eg:1 |
| ck  | javascript  | Cookie支持 | [0,1] eg:1 |
| fl  | javascript  | Flash版本  | eg:11.9 |
| lt  | javascript  | vv时间     | 在首次请求没有 （上次浏览时间，VV进入时间，半个小时之内都是唯一的） （单位：秒）eg:1327847756|
| nv  | javascript  | 新VV标示   | 是否一次新的VV 默认是 0, st != 4 时 nv = 1 eg:0 |
| cc  | javascript  | VV存储标示 | [0,1] 本地存储_n3fa_lpvt_$si是否成功 |
| ct  | javascript  | 客户端时间 | Math.round(new Date().getTime() / 1E3) (单位:秒) eg:1384930987 |
| st  | javascript  | 来源类型   | [1,2,3,4] 详见ST说明 |
| se  | javascript  | 搜索引擎   | 搜索引擎来源编码，详见源码.  eg: 1 = baidu |
| sw  | javascript  | 搜索子域名 | 详见源码.  eg: news = 新闻 |
| see | javascript  | 搜索关键字 | eg:中国联通 |
| et  | javascript  | 事件类型   | [0,1,2,3,4] 详见[事件支持](#事件支持) |
| ep  | javascript  | 事件信息   | 详见[事件支持](#事件支持) |
| ec  | nginx       | 请求时间   | ngx.time() eg:1384930987 |
| url | nginx       | 访问url   | 请求URL
| n   | javascript  | 异常名称   | exception.name 异常名称
| m   | javascript  | 异常信息   | exception.message 异常信息

#Cookie信息

| CookieName       |  名 称             | 备注 |
| :---             |  :--------         | :--- |
|  \_n3fa\_cid     |  客户标示          | eg:863515009a92416db45f0644c910ad15 |
|  \_n3fa\_ext     |  扩展信息          | 用于存储统计的扩展信息，格式: name=value^name1=value1, 参数详见[扩展信息](#扩展信息)|
|  \_n3fa\_lpvt\_$si  |  PV访问时间        | eg:1377159824 |
|  \_n3fa\_lvt\_$si   |  访客访问时间轨迹  | 标记用户30天内的进入时间（超过30分钟新增一个）eg:[1377159824,1377163563,1377167168] |


#JS-API

* _setReceiveUrl

    设置接收请求的地址,用于不同环境或系统统计数据要求
    
        _n3fa.push(['_setReceiveUrl', 'yoururl']);

* _setId

    设置SID
    
        _n3fa.push(['_setId', 'sid']);

* _trackPageview

    触发统计URL的PV，多用于ajax请求
    
        _n3fa.push(['_trackPageview', 'yoururl']);

* _setCustomVar

    指定一个自定义变量，用于追踪用户使用行为等
    
        _n3fa.push(['_setCustomVar', index, name, value, opt_scope]);

* _trackEvent

    事件触发

         _n3fa.push(['_trackEvent', category, action, opt_label, opt_value]);
        
1. category：要监控的目标的类型名称，通常是同一组目标的名字，比如"视频"、"音乐"、"软件"、"游戏"等等。该项必选。
2. action：用户跟目标交互的行为，如"播放"、"暂停"、"下载"等等。该项必选。
3. opt_label：事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项可选。
4. opt_value：事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。

#事件支持 

* 页面加载事件

        et = 0 //默认值, 页面加载事件 一次PV
        
* 绑定事件类型

        et = 1，ep = {id:testbutton,eventType:click}   // 对ID为testbutton的按钮绑定click事件，当按钮点击时发送次事件
    
* 鼠标单击时间

        et = 2，ep = [{x:166,y:175,s:1505x321,d:1378954061,t:b}] // 鼠标点击事件
        et = 2，ep = [{x:1306,y:906,s:2100x1025,d:1383722924,t:a,u:http%3A%2F%2Fwww.10010.com}] // 链接点击事件
        
* 页面离开事件

        et = 3，ep = 126704,126704 // 页面停留时间,页面离开时发送事件,如未能发送，下次访问页面是再次发送

* 触发事件

        et = 4，ep =  music*play*Hey Jude，由扩展API _n3fa.push(['_trackEvent', 'music', 'play', 'Hey Jude']) 触发

* PV事件

        et = 0  // 由扩展API _n3fa.push(['_trackPageview', 'url']) 触发


#扩展信息

扩展信息使用 name=value^name1=value1^name2=value2的形式存储在名为\_n3fa\_ext的cookie中
    
| Name   |  Value         | 备注 |
| :---   |  :--------         | :--- |
| ft     |  第一次访问时间         | eg:1383722924 单位：秒，新访客第一次访问时间 |

#动态嵌入统计代码
将RequestUrl和自定义javascript配置放在redis中

URL匹配规则 格式 HMSET n3fa:url_configs url_regex javascript_key

    HMSET n3fa:url_configs http://ly.10010.com:19001/SearchApp/chseSearchList/init*  28673FF3-0ABF-353B-A35F-759DAFD20073

自定义js代码 格式 HMSET n3fa:javascripts javascript_key javascript_value

    HMSET n3fa:javascripts 28673FF3-0ABF-353B-A35F-759DAFD20073 "$(function(){ _n3fa.push(['_trackEvent', 'search', 'result',$('.searchResultInfor .cBlue').text(),$('.searchResultInfor .cOrange').text()]);})"
    

in nginx resources server config add lua redis such as local.conf lua_fa.lua





