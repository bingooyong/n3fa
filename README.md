Name
====

n3fa is a Web Analytics


Tools
=====	

* redis的jui操作界面 [redis-commander](https://github.com/nearinfinity/redis-commander)

* Lua redis client driver for the ngx_lua [lua-resty-redis](https://github.com/agentzh/lua-resty-redis)

_n3fa_img
=========
名称|途径|参数|备注
--|--|--|--
IP|web server||Nginx $http_x_forwarded_for
浏览客户端|web server||Nginx $http_user_agent
访客标识|web server|cid|由Nginx解析_n3fa_cid中内容，记录日志或传到后端统计服务器
请求时间|javascript|ec|请求时间
网站标识|javascript|si|统计代码ID
版本号|javascript|v|0.0.1 统计代码的版本号
请求随机数||rnd|防止请求被缓存，标记每次统计请求唯一
Referrer|javascript|su|document.referrer
页面标题|javascript|tt|document.title  （只有nv=1时才有）
分辨率|javascript|ds|window.screen.height & width  屏幕尺寸,如 ’1024×768′ 
颜色深度|javascript|cl|window.screen.colorDepth
客户端语言|javascript|ln|navigator.language
Java支持|javascript|ja|0,1
Cookie支持|javascript|ck|0,1
Flash版本|javascript|fl|
VV进入开始时间|javascript|lt|如“1327847756”， 在首次请求没有 （上次浏览时间，VV进入时间，半个小时之内都是唯一的） 
是否一次VV|javascript|nv|st != 4 时 nv = 1 其他时候都是 0
来源类型|javascript|st|st = 1 第一次进入时没有存储值或者刷新直接进入的页面超过半小时;st = 2 从指定搜索引擎进入的页面;st = 3 从其它模块过来,但不是指定域名;st = 4 域名进入且刷新页面时不超过半小时
搜索引擎来源|javascript|se|1：baidu，2：google等
搜索引擎来源关键字|javascript|sw|例如：中国联通
搜索引擎来源频道|javascript|see|例如：百度新闻
事件类型|javascript|et|et = 1 //etrk绑定事件类型;<br>et = 2 //鼠标点击事件;<br>et = 3 //页面离开时发送请求类型 E(window, "beforeunload", StartToServer_xa(a));<br>et = 4 //事件触发
事件的值|javascript|ep|et = 1，ep = {id:button,eventType:click}   //etrk绑定事件类型;<br>et = 2，ep = [{x:-569,y:360,t:b}] 点击事件的坐标，当事件超过10个或者长度超过1024时发送统计请求;<br>et = 3，ep = 126704,126704，页面停留时间;<br>et = 4，ep =  music\*play\*Hey Jude，由\_n3fa.push(['_trackEvent', 'music', 'play', 'Hey Jude'“”]) 触发
访客标识|cookie|_n3fa_cid|由Nginx在第一次访问时生成
访问时间|cookie|_n3fa_lpvt\_$si|当前会话有效
VV访问轨迹|cookie|_n3fa_lvt\_$si|标记用户30天内的进入时间（超过30分钟新增一个）[1377159824,1377163563,1377167168]



_trackEvent
===========

将RequestUrl和自定义javascript配置放在redis中

URL匹配规则 格式 HMSET n3fa:url_configs url_regex javascript_key

	HMSET n3fa:url_configs http://ly.10010.com:19001/SearchApp/chseSearchList/init*  28673FF3-0ABF-353B-A35F-759DAFD20073

自定义js代码 格式 HMSET n3fa:javascripts javascript_key javascript_value

	HMSET n3fa:javascripts 28673FF3-0ABF-353B-A35F-759DAFD20073 "$(function(){ _n3fa.push(['_trackEvent', 'search', 'result',$('.searchResultInfor .cBlue').text(),$('.searchResultInfor .cOrange').text()]);})"
	
	
in nginx web proxy server config add sub_filter to load ga.js such as mall.conf

    sub_filter "</head>" "<script language='javascript'>var _n3fa = _n3fa || []; (function () {    var fa = document.createElement('script');    fa.type = 'text/javascript';    fa.async = true;    fa.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://') + 'ly.10010.com:18001/Study/ga/fa.js';    var s = document.getElementsByTagName('script')[0];    s.parentNode.insertBefore(fa, s); })();</script></head>";

    sub_filter_once on;
    

in nginx resources server config add lua redis such as local.conf lua_fa.lua

