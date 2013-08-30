;
(function () {
    var _config = {
        id: "a9e72dfe4a54a20c3d6e671b3bad01d9",
        siteDomain: ["10010.com"],
        version: "0.0.1",
        elementEventMonitor: [],
        isClickPointMonitor: true,
        interval2NewVisit: 1800, // 30分钟
        interval2expire: 31536000000,
        searchEngine: [
            [1, 'baidu.com', 'word|wd|w', 1, 'news,tieba,zhidao,,image,video,hi,baike,wenku,opendata,jingyan'],
            [2, 'google.com', 'q', 0, 'tbm=isch,tbm=vid,tbm=nws|source=newssearch,tbm=blg,tbm=frm'],
            [4, 'sogou.com', 'query|keyword', 1, 'news,mp3,pic,v,gouwu,zhishi,blogsearch'],
            [6, 'search.yahoo.com', 'p', 1, 'news,images,video'],
            [7, 'yahoo.cn', 'q', 1, 'news,image,music'],
            [8, 'soso.com', 'w|key', 1, 'image,video,music,sobar,wenwen,news,baike'],
            [11, 'youdao.com', 'q', 1, 'image,news,,mp3,video'],
            [12, 'gougou.com', 'search', 1, ',movie,,,,,video'],
            [13, 'bing.com', 'q', 2, 'images,videos,news'],
            [14, 'so.com', 'q', 1, 'video,news'],
            [14, "so.360.cn", "q", 1, ",news"],
            [14, "v.360.cn", "q", 1, "so"],
            [15, 'jike.com', 'q', 1, 'news,image,video'],
            [16, 'qihoo.com', 'kw', 0, ''],
            [17, 'etao.com', 'q', 1, 's,8'],
            [18, 'soku.com', 'keyword', 2, 'a'],
            [19, 'easou.com', 'q', 0, ''],
            [20, 'glb.uc.cn', 'keyword|word|q', 0, '']
        ]
    };

    var isIE = /msie (\d+\.\d+)/i.test(navigator.userAgent),  // ea是否是IE
        isCookieEnabled = navigator.cookieEnabled,//ck:是否支持cookie 1:0
        isJavaEnabled = navigator.javaEnabled(),//ja:java支持 1:0
        localLanguage = navigator.language || navigator.browserLanguage
            || navigator.systemLanguage || navigator.userLanguage || "",//ln:语言 zh-cn
        screenWidthAndHeight = window.screen.width + "x" + window.screen.height,//ds:屏幕尺寸
        screenColorDepth = window.screen.colorDepth,//cl:颜色深度
        pageViewTime = 0,
        entryTime = Math.round(+new Date / 1E3),
        httpProtocol = "https:" == document.location.protocol ? "https:" : "http:",
        sendToServerParamNames = "cc ck cl ds ep et ec fl ja ln lo lt nv rnd sb se si st su sw sse v cv lv u tt".split(" ");

    function getParameterFromUrl(url, parameter) {
        var matchResult = url.match(new RegExp("(^|&|\\?|#)(" + parameter + ")=([^&#]*)(&|$|#)", ""));
        return matchResult ? matchResult[3] : null
    }

    function deleteHttpAndPortForURL(url) {
        return (url = (url = url.match(/^(https?:\/\/)?([^\/\?#]*)/)) ? url[2].replace(/.*@/, "") : null)
            ? url.replace(/:\d+$/, "") : url
    }

    function setSessionStorage(name, value) {
        if (window.sessionStorage)
            try {
                window.sessionStorage.setItem(name, value)
            } catch (exception) {
            }
    }

    function getSessionStorage(name) {
        return window.sessionStorage ? window.sessionStorage.getItem(name) : null
    }

    function setCookie(name, value, option) {
        var expiresDate;
        option.expires && (expiresDate = new Date(), expiresDate.setTime(expiresDate.getTime() + option.expires));
        document.cookie = name + "=" + value + (option.domain ? "; domain=" + option.domain : "")
            + (option.path ? "; path=" + option.path : "")
            + (expiresDate ? "; expires=" + expiresDate.toGMTString() : "")
            + (option.secure ? "; secure" : "")
    }


    var pageLocalStore;

    //兼容控制本地方法（http://www.cnblogs.com/zjcn/archive/2012/07/03/2575026.html）
    function localStoreAdapter() {
        if (!pageLocalStore) {
            try {
                pageLocalStore = document.createElement("input"), pageLocalStore.type = "hidden",
                    pageLocalStore.style.display = "none", pageLocalStore.addBehavior("#default#userData"),
                    document.getElementsByTagName("head")[0].appendChild(pageLocalStore)
            } catch (exception) {
                return false
            }
        }
        return true
    }

    function setLocalStorage(name, value, expireTime) {
        var _expireTime = new Date;
        _expireTime.setTime(_expireTime.getTime() + expireTime || 31536E6);
        try {
            window.localStorage ? (value = _expireTime.getTime() + "|" + value, window.localStorage.setItem(name, value))
                : localStoreAdapter() && (pageLocalStore.expires = _expireTime.toUTCString(),
                pageLocalStore.load(document.location.hostname),
                pageLocalStore.setAttribute(name, value),
                pageLocalStore.save(document.location.hostname))
        } catch (exception) {
        }
    }

    function getLocalStorage(name) {
        if (window.localStorage) {
            if (name = window.localStorage.getItem(name)) {
                var b = name.indexOf("|"), d = name.substring(0, b) - 0;
                if (d && d > (new Date).getTime())return name.substring(b + 1)
            }
        } else if (localStoreAdapter()) {
            try {
                return pageLocalStore.load(document.location.hostname), pageLocalStore.getAttribute(name)
            } catch (exception) {
            }
        }
        return null
    }

    function getData(name) {
        try {
            var cookieValues = new RegExp("(^| )" + name + "=([^;]*)(;|$)").exec(document.cookie);
            return (cookieValues ? cookieValues[2] : null) || getSessionStorage(name) || getLocalStorage(name)
        } catch (exception) {
        }
        return null;
    }

    function setData(name, value, expireTime) {
        try {
            setCookie(name, value, {
                domain: findSecondDomainNameUseHostName(),
                path: findDomainNameUseHref(),
                expires: expireTime
            });
            expireTime ? setLocalStorage(name, value, expireTime) : setSessionStorage(name, value)
        } catch (exception) {
        }
    }

    function addEvent(element, type, eventFunction) {
        element.attachEvent ? element.attachEvent("on" + type, function (b) {
            eventFunction.call(element, b)
        }) : element.addEventListener && element.addEventListener(type, eventFunction, false)
    }

    function generateValueToServer(_fa) {
        for (var valuesToSend = [], i = 0, length = sendToServerParamNames.length; i < length; i++) {
            var parameter = sendToServerParamNames[i], parameterValue = _fa.a[parameter];
            "undefined" != typeof parameterValue && "" !== parameterValue
            && valuesToSend.push(parameter + "=" + encodeURIComponent(parameterValue))
        }
        return valuesToSend.join("&")
    }

    //提交浏览器中存储数据到服务端 a.nv=0时执行，刷新时没有大于半小时
    function postSessionStorageDataToServer() {
        var unsentData = getSessionStorage("_n3fa_unsent_" + _config.id);
        if (unsentData) {
            for (var a = unsentData.split(","), b = 0, d = a.length; b < d; b++) {
                var _url = httpProtocol + "//" + decodeURIComponent(a[b]).replace(/^https?:\/\//, "");
                postDataToServer(_url, function (a) {
                    removeOldValueAndSaveNewValue(a)
                })
            }
        }

    }

    function postDataToServer(url, callback) {
        var img = new Image, e = "_n3fa_image_log" + Math.floor(2147483648 * Math.random()).toString(36);
        window[e] = img;// 全局变量，保证不会被回收
        img.onload = img.onerror = img.onabort = function () {
            img.onload = img.onerror = img.onabort = null;
            img = window[e] = null;
            callback && callback(url)
        };
        img.src = url
    }

    //--
    //处理_n3fa_unsent_中旧值并存储新值，第一次进入a=.*
    //在页面被关闭前会存入url值。然后会发送数据到服务端，成功后会和以前保存的值进行匹配，匹配成功后还有值则存起来，无值时则会清空未发送值。
    //第二次进入该页面不一定有值，当有值时还是需要传到服务端的。
    function removeOldValueAndSaveNewValue(postUrl) {
        var unsentData = getSessionStorage("_n3fa_unsent_" + _config.id) || "";
        unsentData && (
            (unsentData = unsentData.replace(
                    new RegExp(
                        encodeURIComponent(
                            postUrl.replace(/^https?:\/\//, "")     //http议去掉
                        ).replace(
                                /([\*\(\)])/g, "\\$1"  //*()替换为\$1
                            ) + "(%26u%3D[^,]*)?,?", "g"), "") //加上&u=[^,]*   以&u为参数到,结尾，其实就是界限
                .replace(/,$/, "")
                )
                ? setSessionStorage("_n3fa_unsent_" + _config.id, unsentData)
                : window.sessionStorage && window.sessionStorage.removeItem("_n3fa_unsent_" + _config.id)
            )
    }


    //--在指定URL中增加U值，把最新的值插入到_n3fa_unsent_中存储值前面并保存
    function prepareParamUValueAndSave(_fa, postUrl) {
        var href = _fa.a.u ? "" : "&u=" + encodeURIComponent(document.location.href);
        var unsentData = getSessionStorage("_n3fa_unsent_" + _config.id) || "";
        unsentData = encodeURIComponent(postUrl.replace(/^https?:\/\//, "") + href) + (unsentData ? "," + unsentData : "");
        //关闭前可能这些数据发不了，这样留在用户下次登陆相关页面时发送。
        setSessionStorage("_n3fa_unsent_" + _config.id, unsentData)
    }

    function sendDataToServer(_fa) {
        _fa.a.ec = Math.round(new Date().getTime() / 1E3);
        _fa.a.rnd = Math.round(2147483647 * Math.random());
        var postUrl = httpProtocol + "//localhost:18001/1.gif?" + generateValueToServer(_fa);
        prepareParamUValueAndSave(_fa, postUrl);
        postDataToServer(postUrl, function (url) {
            removeOldValueAndSaveNewValue(url)
        })
    }

    function sendDataToServerWhenBeforeUnload(_fa) {
        return function () {
            _fa.a.nv = 0;
            _fa.a.st = 4;
            _fa.a.et = 3;
            _fa.a.ep = (new Date).getTime() - _fa.f.m + "," + ((new Date).getTime() - _fa.f.e + _fa.f.i);
            sendDataToServer(_fa)
        }
    }

    function sendDataToServerWhenTrackStackFull(_fa) {
        if (0 != _fa.trackStack.length)
            _fa.a.et = 2, _fa.a.ep = "[" + _fa.trackStack.join(",") + "]", sendDataToServer(_fa), _fa.trackStack = []
    }

    function findSearchEngineChannel(index) {
        for (var n = _config.searchEngine[index], sse = 0, Ba = 2 == n[3] ? n[1] + "\\/" : "", Ca = 1 == n[3] ? "\\." +
            n[1] : "", V = n[4].split(","), n = 0, Da = V.length; n < Da; n++) {
            if ("" !== V[n] && new RegExp(Ba + V[n] + Ca).test(document.referrer)) {
                sse = n + 1;
                break
            }
        }
        return sse;
    }

    //当前网站是否和指定域名列表中的相同，相同返回域名，不同则返回“/”
    function findDomainNameUseHref() {
        for (var i = 0, length = _config.siteDomain.length; i < length; i++) {
            var _domain = _config.siteDomain[i];
            if (-1 < _domain.indexOf("/") && isSameDomain(document.location.href, _domain))
                return _domain.replace(/^[^\/]+(\/.*)/, "$1") + "/"
        }
        return "/"
    }

    //在指定的查找二级域名，找不到返回window.location.hostname
    function findSecondDomainNameUseHostName() {
        for (var _hostname = document.location.hostname, i = 0, length = _config.siteDomain.length; i < length; i++)
            if (isSecondDomain(_hostname, _config.siteDomain[i]))
                return _config.siteDomain[i].replace(/(:\d+)?[\/\?#].*/, "");
        return _hostname
    }

    //二级域名或者是相同域名
    function isSameDomainOrSecondDomain(referrer) {
        for (var i = 0; i < _config.siteDomain.length; i++) {
            var _domain = _config.siteDomain[i];
            if (-1 < _domain.indexOf("/")) {
                if (isSameDomain(referrer, _domain)) return true
            } else {
                var refererWithoutHttpAndPort = deleteHttpAndPortForURL(referrer);
                if (refererWithoutHttpAndPort && isSecondDomain(refererWithoutHttpAndPort, _domain)) return true
            }
        }
        return false;
    }

    //a和b的域名是否相同
    function isSameDomain(a, b) {
        a = a.replace(/^https?:\/\//, "");
        return 0 == a.indexOf(b)
    }

    //a是否是b的二级域名
    function isSecondDomain(a, b) {
        a = "." + a.replace(/:\d+/, "");
        b = "." + b.replace(/:\d+/, "");
        var d = a.indexOf(b);
        return-1 < d && d + b.length == a.length
    }

    function removeCookieAndLocalValue() {
        var a = "_n3fa_cv_" + _config.id;
        try {
            if (setCookie(a, "", {
                domain: findSecondDomainNameUseHostName(),
                path: findDomainNameUseHref(),
                expires: -1
            }), window.sessionStorage && window.sessionStorage.removeItem(a), window.localStorage) {
                window.localStorage.removeItem(a);
            }
            else if (localStoreAdapter()) {
                try {
                    pageLocalStore.load(document.location.hostname);
                    pageLocalStore.removeAttribute(a);
                    pageLocalStore.save(document.location.hostname);
                } catch (exception) {
                }
            }
        } catch (exception) {
        }
    }

    //2=google 14=so.com 17=etao.com
    function notEmptyKeyWordsOrNotSpecifySearchEngine(keywords, searchEngineId) {
        return keywords || !(2 != searchEngineId && 14 != searchEngineId && 17 != searchEngineId);
    }

    /**
     * 页面进入方式确定
     * 1=第一次进入时没有存储值或者刷新直接进入的页面超过半小时
     * 2=从指定搜索引擎进入的页面
     * 3=从其它模块过来,但不是指定域名
     * 4=域名进入且刷新页面时不超过半小时
     *
     * @param a
     * @param lastVisitTime
     * @returns {number}
     */
    function pageEnterType(a, lastVisitTime) {
        if (!document.referrer) {
            return entryTime - lastVisitTime > _config.interval2NewVisit ? 1 : 4;
        }

        for (var p = 0, za = _config.searchEngine.length; p < za; p++) {
            var referrerRegExp = new RegExp("(^|\\.)" + _config.searchEngine[p][1].replace(/\./g, "\\."));
            if (referrerRegExp.test(deleteHttpAndPortForURL(document.referrer))) {
                var keywords = getParameterFromUrl(document.referrer, _config.searchEngine[p][2]) || "";
                var searchEngineId = _config.searchEngine[p][0];
                if (notEmptyKeyWordsOrNotSpecifySearchEngine(keywords, searchEngineId)) {
                    //cpro.baidu.com是百度网盟的来源，如果是网盟则keywords为空
                    1 == searchEngineId && -1 < document.referrer.indexOf("cpro.baidu.com") && (keywords = "");
                    a.a.se = searchEngineId;//搜索引擎ID
                    a.a.sse = findSearchEngineChannel(p); //搜索引擎的频道
                    a.a.sw = keywords;//搜索关键字
                    return 2;
                }
            }
        }

        var referrerWithoutHttpAndPort = "", _isSameDomainOrSecondDomain = false;
        isSameDomainOrSecondDomain(document.referrer) && isSameDomainOrSecondDomain(document.location.href)
            ? _isSameDomainOrSecondDomain = true
            : (referrerWithoutHttpAndPort = deleteHttpAndPortForURL(document.referrer),
            _isSameDomainOrSecondDomain = isSecondDomain(referrerWithoutHttpAndPort || "", document.location.hostname));

        return _isSameDomainOrSecondDomain ? (entryTime - lastVisitTime > _config.interval2NewVisit ? 1 : 4) : 3;
    }

    function flashVersion() {
        var flashVersion = "";
        if (navigator.plugins && navigator.mimeTypes.length) {
            var X = navigator.plugins["Shockwave Flash"];
            X && X.description && (flashVersion = X.description.replace(/^.*\s+(\S+)\s+\S+$/, "$1"))
        } else if (window.ActiveXObject) {
            try {
                var ia = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                ia && (flashVersion = ia.GetVariable("$version"))
                && (flashVersion = flashVersion.replace(/^.*\s+(\d+),(\d+).*$/, "$1.$2"))
            } catch (exception) {
            }
        }
        return flashVersion;
    }

    function loadN3faConfig() {
        var _n3faObj = window._n3fa;
        if (!(_n3faObj && _n3faObj.length)) return;
        for (var i = 0, length = _n3faObj.length; i < length; i++) {
            var n3faApi = _n3faObj[i];
            switch (n3faApi[0]) {
                case "_setAccount":
                    1 < n3faApi.length && /^[0-9a-z]{32}$/.test(n3faApi[1]) && (window._n3fa_account = n3faApi[1]);
                    break;
                case "_setAutoPageview":
                    if (1 < n3faApi.length) {
                        var isAutoPageView = n3faApi[1];
                        if (false === isAutoPageView || true === isAutoPageView)
                            window._n3fa_autoPageview = isAutoPageView
                    }
            }
        }
    }

    function sendDataToServerWhenPageView(_fa) {
        _fa.a.et = 0, _fa.a.ep = "", sendDataToServer(_fa)
    }

    function start(_fa) {
        try {
            var isNewVisit, enterType, isSavedEntryTime, lastVisitTime, m, visitTimesStored, visitTimesArray;
            pageViewTime = getData("_n3fa_lpvt_" + _config.id) || 0;
            13 == pageViewTime.length && (pageViewTime = Math.round(pageViewTime / 1E3));

            enterType = pageEnterType(_fa, pageViewTime);
            //页面进入类型
            isNewVisit = 4 != enterType ? 1 : 0;
            //localstorage中取
            if (visitTimesStored = getData("_n3fa_lvt_" + _config.id)) {
                visitTimesArray = visitTimesStored.split(",");
                for (var G = visitTimesArray.length - 1; 0 <= G; G--)
                    13 == visitTimesArray[G].length && (visitTimesArray[G] = "" + Math.round(visitTimesArray[G] / 1E3));
                //存储大于30天
                for (; 2592E3 < entryTime - visitTimesArray[0];)
                    visitTimesArray.shift();
                m = 4 > visitTimesArray.length ? 2 : 3;
                for (1 === isNewVisit && visitTimesArray.push(entryTime); 4 < visitTimesArray.length;)
                    visitTimesArray.shift();
                visitTimesStored = visitTimesArray.join(",");
                lastVisitTime = visitTimesArray[visitTimesArray.length - 1]
            } else {
                visitTimesStored = entryTime, lastVisitTime = "", m = 1;
            }

            setData("_n3fa_lvt_" + _config.id, visitTimesStored, _config.interval2expire);   // localstorage中存储
            setData("_n3fa_lpvt_" + _config.id, entryTime); // sessionstorage中存
            isSavedEntryTime = entryTime == getData("_n3fa_lpvt_" + _config.id) ? "1" : "0"; // EntryTime是否存储成功

            _fa.a.nv = isNewVisit;                   // 是否是一个新的VV
            _fa.a.st = enterType;                    // 页面进入类型（1,2,3,4）
            _fa.a.cc = isSavedEntryTime;             // EntryTime是否存储成功
            _fa.a.lt = lastVisitTime;                // VV进入时间，半小时内不变
            _fa.a.lv = m;                            // 1：第一次进入，2：30天内少于4次，3：30天内不小于4次
            _fa.a.si = _config.id;                   // 统计网站的ID
            _fa.a.su = document.referrer;            // http header referer
            _fa.a.ds = screenWidthAndHeight;         // 屏幕尺寸,如 ’1024×768′
            _fa.a.cl = screenColorDepth + "-bit";    // 颜色深度,如 “32-bit”
            _fa.a.ln = localLanguage;                // 语言,zh-cn
            _fa.a.ja = isJavaEnabled ? 1 : 0;        // java支持,1:0
            _fa.a.ck = isCookieEnabled ? 1 : 0;      // cookie支持,1:0
            _fa.a.fl = flashVersion();               // flash版本
            _fa.a.v = _config.version;               // 版本号
            _fa.a.cv = decodeURIComponent(getData("_n3fa_cv_" + _config.id) || ""); // _setCustomVar 的值
            1 == _fa.a.nv && (_fa.a.tt = document.title || ""); // 页面的title 只有是新的VV时才统计

            //进入类型不一样，调用方法不一样。第一次输入域名进入为1,第二次未超过半小时nv=0
            //只有页面进入方式为4时,才需要处理历史数据
            //a.RemoveOldValueAndSaveNewValue_l(".*");
            0 == _fa.a.nv ? postSessionStorageDataToServer() : removeOldValueAndSaveNewValue(".*");

            _fa.addEventForDocumentObject && _fa.addEventForDocumentObject();
            _fa.addMouseupAndBeforeUnloadEventForDocument && _fa.addMouseupAndBeforeUnloadEventForDocument();
            _fa.f = new AddFocusAndBlurEventForWindow;

            addEvent(window, "beforeunload", sendDataToServerWhenBeforeUnload(_fa)); // 页面离开事件
            loadN3faConfig(); // 处理存储在window._n3fa中的值


            if ("undefined" === typeof window._n3fa_account || window._n3fa_account === _config.id) {
                window._n3fa_account = _config.id;
                if (window._n3fa && window._n3fa.length)
                    for (var i = 0, length = window._n3fa.length; i < length; i++)
                        _fa.prepareObjectArray(window._n3fa[i]);
                window._n3fa = _fa.apiInterface
            }

            //未定义时则提交数据到服务端，或者_n3fa_autoPageview = true时，则提交数据到服务端
            if ("undefined" === typeof window._n3fa_autoPageview || window._n3fa_autoPageview === true)
                sendDataToServerWhenPageView(_fa);

        } catch (exception) {
            _fa = [],
                _fa.push("si=" + _config.id),
                _fa.push("n=" + encodeURIComponent(exception.name)),
                _fa.push("m=" + encodeURIComponent(exception.message)),
                _fa.push("r=" + encodeURIComponent(document.referrer)),
                postDataToServer(httpProtocol + "//localhost:18001/1.gif?" + _fa.join("&"))
        }
    }


    function Fa() {
        if ("undefined" == typeof window["_n3fa_loaded_" + _config.id]) {
            window["_n3fa_loaded_" + _config.id] = true;
            var _fa = this;
            _fa.a = {};
            _fa.trackStack = [];
            _fa.apiInterface = {
                push: function () {
                    _fa.prepareObjectArray.apply(_fa, arguments)
                }
            };
            start(_fa)
        }
    }

    //处理对象数组，首先参数是对象数组，然后根据第一个参数决定如何处理参数值
    Fa.prototype.prepareObjectArray = function (a) {

        var func = function (a) {
            if ("[object Array]" !== Object.prototype.toString.call(a))
                return false;
            for (var b = a.length - 1; 0 <= b; b--) {
                var d = a[b];
                if (("[object Number]" !== {}.toString.call(d) || !isFinite(d))
                    && "[object String]" !== {}.toString.call(d) && d !== true && d !== false)
                    return false
            }
            return true
        };

        if (func(a)) {

            var escapeSpecialChar = function (str) {
                return str.replace ? str.replace(/'/g, "'0").replace(/\*/g, "'1").replace(/!/g, "'2") : str
            };

            switch (a[0]) {
                // 支持_n3fa.push(['_trackPageview', pageURL]);  http://tongji.baidu.com/open/api/more?p=ref_trackPageview
                case "_trackPageview":
                    if (1 < a.length && a[1].charAt && "/" == a[1].charAt(0)) {
                        this.a.et = 0;
                        this.a.ep = "";
                        this.h ? (this.a.nv = 0, this.a.st = 4) : this.h = true;
                        var b = this.a.u, d = this.a.su;
                        this.a.u = httpProtocol + "//" + document.location.host + a[1];
                        this.a.su = document.location.href;
                        sendDataToServer(this);
                        this.a.u = b;
                        this.a.su = d
                    }
                    break;

                // http://tongji.baidu.com/open/api/more?p=ref_trackEvent
                case "_trackEvent":
                    2 < a.length && (this.a.nv = 0, this.a.st = 4, this.a.et = 4, this.a.ep = (a[1]) + "*" +
                        escapeSpecialChar(a[2]) + (a[3] ? "*" + escapeSpecialChar(a[3]) : "")
                        + (a[4] ? "*" + escapeSpecialChar(a[4]) : ""), sendDataToServer(this));
                    break;
                case "_setCustomVar":
                    if (4 > a.length)break;
                    var d = a[1], e = a[4] || 3;
                    if (0 < d && 6 > d && 0 < e && 4 > e) {
                        this.d++;
                        for (var f = (this.a.cv || "*").split("!"), m = f.length; m < d - 1; m++)f.push("*");
                        f[d - 1] = e + "*" + escapeSpecialChar(a[2]) + "*" + escapeSpecialChar(a[3]);
                        this.a.cv = f.join("!");
                        a = this.a.cv.replace(/[^1](\*[^!]*){2}/g, "*").replace(/((^|!)\*)+$/g, "");
                        "" !== a ? this.setData("_n3fa_cv_" + _config.id, encodeURIComponent(a), _config.interval2expire)
                            : removeCookieAndLocalValue()
                    }
            }
        }
    };

    //为指定页面对象增加事件
    Fa.prototype.addEventForDocumentObject = function () {
        addEvent(document, "click", documentClickEventCallBack(this));
        for (var length = _config.elementEventMonitor.length, i = 0; i < length; i++) {
            var item = _config.elementEventMonitor[i], _element = document.getElementById(item.id);
            _element && addEvent(_element, item.eventType, addAttributeForEventObjectAndSendData(this))
        }
    };


    function sendDataToServerWhenEvenTrigger(_fa, eventId, eventType) {
        _fa.a.et = 1;
        _fa.a.ep = "{id:" + eventId + ",eventType:" + eventType + "}";
        sendDataToServer(_fa)
    }

    //为事件对象增加座标属性且给参数赋值,然后把数据发到服务端,转化项目使用
    function addAttributeForEventObjectAndSendData(_fa) {
        return function (event) {
            (event.target || event.srcElement).setAttribute("FA_fix", event.clientX + ":" + event.clientY);
            sendDataToServerWhenEvenTrigger(_fa, this.id, event.type);
        }
    }

    function documentClickEventCallBack(_fa) {
        return function (event) {
            var eventElement = event.target || event.srcElement,
                eventCoordinateSaved = eventElement.getAttribute("FA_fix"),
                eventCoordinate = event.clientX + ":" + event.clientY;
            if (eventCoordinateSaved && eventCoordinateSaved == eventCoordinate)
                eventElement.removeAttribute("FA_fix");
            else if (_config.elementEventMonitor.length > 0) {
                var eventElementsHasId = {};
                for (; eventElement && eventElement != document.body;)
                    eventElement.id && (eventElementsHasId[eventElement.id] = ""), eventElement = eventElement.parentNode;
                for (var i = 0; i < _config.elementEventMonitor.length; i++) {
                    var eid = _config.elementEventMonitor[i].id;
                    eventElementsHasId.hasOwnProperty(eid) && sendDataToServerWhenEvenTrigger(_fa, eid, event.type);
                }
            }
        }
    }


    //为文档对象增加mouseup和beforeunload事件
    Fa.prototype.addMouseupAndBeforeUnloadEventForDocument = function () {
        var _fa = this;
        if (!_config.isClickPointMonitor) return;
        addEvent(document, "mouseup", documentMouseupEventCallback(this));
        addEvent(window, "beforeunload", function () {
            sendDataToServerWhenTrackStackFull(_fa)
        });
        setInterval(function () {
            sendDataToServerWhenTrackStackFull(_fa)
        }, 6E5);//600000,10分钟
    };

    function findAnchorObject(eventElement) {
        if ("a" == eventElement.tagName.toLowerCase()) return eventElement;
        for (var tagName = "A"; (eventElement = eventElement.parentNode) && 1 == eventElement.nodeType;)
            if (eventElement.tagName == tagName)
                return eventElement;
        return null;
    }

    //需要跟踪转化时，处理F对象中的b值，该值存储的是事件发生的座标及发生的链接地址。如果大于10个元素或者长度大于1024，则发送数据到服务端
    function documentMouseupEventCallback(_fa) {
        return function (_event) {
            var epInfo, ieScrollTop, ieScrollLeft, pointX, pointY;
            //是IE需要加上滚动高度

            isIE ? (ieScrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
                ieScrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft),
                pointX = _event.clientX + ieScrollLeft, pointY = _event.clientY + ieScrollTop)
                : (pointX = _event.pageX, pointY = _event.pageY);

            var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.offsetWidth;
            var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.offsetHeight;

            epInfo = "{x:" + pointX + ",y:" + pointY + ",s:" + windowWidth + "x" + windowHeight
                + ",d:" + Math.round(new Date().getTime() / 1E3) + ",";

            var anchor = findAnchorObject(_event.target || _event.srcElement);
            epInfo = anchor ? epInfo + ("t:a,u:" + encodeURIComponent(anchor.href) + "}")
                : epInfo + "t:b}";

            //长度大于1024时直接推送b值，然后如果发现大于10个元素，推送到服务端。如果不大于1024，那么如果b中的值处理完后大于1024，则会发到服务端。
            if ("" != epInfo) {
                var args = generateValueToServer(_fa).replace(/ep=[^&]*/, "ep=" + encodeURIComponent("[" + epInfo + "]"));
                var url = httpProtocol + "//localhost:18001/1.gif?" + args;
                if (1024 < url.length + 10) {
                    _fa.a.et = 2, _fa.a.ep = "[" + epInfo + "]", sendDataToServer(_fa);
                    return;
                }
                var trackStackParam = encodeURIComponent(_fa.trackStack.join(",") + (_fa.trackStack.length ? "," : ""));
                (1024 < url.length + trackStackParam.length + 10) && sendDataToServerWhenTrackStackFull(_fa);
                _fa.trackStack.push(epInfo);
                (10 <= _fa.trackStack.length || /t:a/.test(epInfo)) && sendDataToServerWhenTrackStackFull(_fa);

            }
        }
    }

    //为window对象增加焦点事件和失去焦点事件，作用就是可以触发切换时间再计算，可以记录用户回来几次和累计的时间
    function AddFocusAndBlurEventForWindow() {
        this.e = this.m = (new Date).getTime();
        this.i = 0;
        "object" == typeof document.onfocusin
            ? (addEvent(document, "focusin", calculateOnlineTimeAndRefreshStartTime(this)),
            addEvent(document, "focusout", calculateOnlineTimeAndRefreshStartTime(this)))
            : (addEvent(window, "focus", calculateOnlineTimeAndRefreshStartTime(this)),
            addEvent(window, "blur", calculateOnlineTimeAndRefreshStartTime(this)))
    }

    //用户重新进入时刷新开始时间并累积用户在线时间
    function calculateOnlineTimeAndRefreshStartTime(_fa) {
        return function (_event) {
            if (!(_event.target && _event.target != window)) {
                if ("blur" == _event.type || "focusout" == _event.type)
                    _fa.i += (new Date).getTime() - _fa.e;
                _fa.e = (new Date).getTime()
            }
        }
    }

    new Fa;

})();