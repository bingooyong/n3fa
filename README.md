# Name
***
n3fa is a Web Analytics


# Tools
***

* redis的jui操作界面 [redis-commander](https://github.com/nearinfinity/redis-commander)

* Lua redis client driver for the ngx_lua [lua-resty-redis](https://github.com/agentzh/lua-resty-redis)

# _trackEvent
***

将RequestUrl和自定义javascript配置放在redis中

URL匹配规则 格式 HMSET n3fa:url_configs url_regex javascript_key

	HMSET n3fa:url_configs http://ly.10010.com:19001/SearchApp/chseSearchList/init*  28673FF3-0ABF-353B-A35F-759DAFD20073

自定义js代码 格式 HMSET n3fa:javascripts javascript_key javascript_value

	HMSET n3fa:javascripts 28673FF3-0ABF-353B-A35F-759DAFD20073 "$(function(){ _n3fa.push(['_trackEvent', 'search', 'result',$('.searchResultInfor .cBlue').text(),$('.searchResultInfor .cOrange').text()]);})"
	
	
in nginx web proxy server config add sub_filter to load ga.js such as mall.conf

    sub_filter "</head>" "<script language='javascript'>var _n3fa = _n3fa || []; (function () {    var fa = document.createElement('script');    fa.type = 'text/javascript';    fa.async = true;    fa.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://') + 'ly.10010.com:18001/Study/ga/fa.js';    var s = document.getElementsByTagName('script')[0];    s.parentNode.insertBefore(fa, s); })();</script></head>";

    sub_filter_once on;
    

in nginx resources server config add lua redis such as local.conf lua_fa.lua

