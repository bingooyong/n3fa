;
(function () {
    var _config = {
        id: "a9e72dfe4a54a20c3d6e671b3bad01d9",
        dm: ["10010.com"],
        v: "0.0.1",
        etrk: [],
        ctrk: true,
        align: 1,
        nv: -1,
        vdur: 1800, // 30分钟
        age: 31536000000,
        se: [
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
        localLanguage = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || "",//ln:语言 zh-cn
        screenWidthAndHeight = window.screen.width + "x" + window.screen.height,//ds:屏幕尺寸
        screenColorDepth = window.screen.colorDepth,//cl:颜色深度
        pageViewTime = 0,
        entryTime = Math.round(+new Date / 1E3),
        httpProtocol = "https:" == document.location.protocol ? "https:" : "http:",
        sendToServerParamNames = "cc ck cl ds ep et fl ja ln lo lt nv rnd sb se si st su sw sse v cv lv u tt".split(" ");


    //在a指定的url中取指定变量的值
    function getKeyWordFromURL(url, parameter) {
        var matchResult = url.match(new RegExp("(^|&|\\?|#)(" + parameter + ")=([^&#]*)(&|$|#)", ""));
        return matchResult ? matchResult[3] : null
    }

    //删除url中的http协议和端口号
    function deleteHttpAndPortForURL(url) {
        return (url = (url = url.match(/^(https?:\/\/)?([^\/\?#]*)/)) ? url[2].replace(/.*@/, "") : null)
            ? url.replace(/:\d+$/, "") : url
    }

    //SessionStorage存储
    function setSessionStorage(name, value) {
        if (window.sessionStorage)
            try {
                window.sessionStorage.setItem(name, value)
            } catch (d) {
            }
    }

    //SessionStorage取值
    function getSessionStorage(name) {
        return window.sessionStorage ? window.sessionStorage.getItem(name) : null
    }

    //设置cookie
    function setCookie(name, value, option) {
        var expiresDate;
        option.g && (expiresDate = new Date(), expiresDate.setTime(expiresDate.getTime() + option.g));
        document.cookie = name + "=" + value + (option.domain ? "; domain=" + option.domain : "")
            + (option.path ? "; path=" + option.path : "")
            + (expiresDate ? "; expires=" + expiresDate.toGMTString() : "")
            + (option.p ? "; secure" : "")
    }


    var pageLocalStore;

    //兼容控制本地方法（http://www.cnblogs.com/zjcn/archive/2012/07/03/2575026.html）
    function localStoreAdapter() {
        if (!pageLocalStore) {
            try {
                pageLocalStore = document.createElement("input"), pageLocalStore.type = "hidden",
                    pageLocalStore.style.display = "none", pageLocalStore.addBehavior("#default#userData"),
                    document.getElementsByTagName("head")[0].appendChild(pageLocalStore)
            } catch (a) {
                return false
            }
        }
        return true
    }

    //LocalStorage存储
    function setLocalStorage(name, value, expireTime) {
        var _expireTime = new Date;
        _expireTime.setTime(_expireTime.getTime() + expireTime || 31536E6);
        try {
            window.localStorage ? (value = _expireTime.getTime() + "|" + value, window.localStorage.setItem(name, value))
                : localStoreAdapter() && (pageLocalStore.expires = _expireTime.toUTCString(),
                pageLocalStore.load(document.location.hostname),
                pageLocalStore.setAttribute(name, value),
                pageLocalStore.save(document.location.hostname))
        } catch (f) {
        }
    }

    //LocalStorage取值
    function getLocalStorage(name) {
        if (window.localStorage) {
            if (name = window.localStorage.getItem(name)) {
                var b = name.indexOf("|"), d = name.substring(0, b) - 0;
                if (d && d > (new Date).getTime())return name.substring(b + 1)
            }
        } else if (localStoreAdapter()) {
            try {
                return pageLocalStore.load(document.location.hostname), pageLocalStore.getAttribute(name)
            } catch (e) {
            }
        }
        return null
    }

    //cookie中取值，否则去浏览器存储中取值，无值时返回空
    function getData(name) {
        try {
            var b = new RegExp("(^| )" + name + "=([^;]*)(;|$)").exec(document.cookie);
            return (b ? b[2] : null) || getSessionStorage(name) || getLocalStorage(name)
        } catch (d) {
        }
        return null;
    }

    //存储值，cookie必存，本地和session选择存储。 本地格式： 一年后的时间|当前时间
    function setData(name, value, expireTime) {
        try {
            setCookie(name, value, {domain: findSecondDomainNameUseHostName(), path: findDomainNameUseHref(), g: expireTime}), expireTime
                ? setLocalStorage(name, value, expireTime)
                : setSessionStorage(name, value)
        } catch (e) {
        }
    }

    //增加对象事件
    function addEvent(a, b, d) {
        a.attachEvent ? a.attachEvent("on" + b, function (b) {
            d.call(a, b)
        }) : a.addEventListener && a.addEventListener(b, d, false)
    }


    // 生成发送到服务端的数据
    function generateValueToServer(a) {
        for (var b = [], d = 0, e = sendToServerParamNames.length; d < e; d++) {
            var f = sendToServerParamNames[d], m = a.a[f];
            "undefined" != typeof m && "" !== m && b.push(f + "=" + encodeURIComponent(m))
        }
        return b.join("&")
    }

    //提交浏览器中存储数据到服务端 a.nv=0时执行，刷新时没有大于半小时
    function postSessionStorageDataToServer() {
        var unsentData = getSessionStorage("_n3fa_unsent_" + _config.id);
        if (unsentData) {
            for (var a = unsentData.split(","), b = 0, d = a.length; b < d; b++) {
                postDataToServer(httpProtocol + "//" + decodeURIComponent(a[b]).replace(/^https?:\/\//, ""), function (a) {
                    removeOldValueAndSaveNewValue(a)
                })
            }
        }

    }

    //图片请求向服务器提交数据
    function postDataToServer(url, callback) {
        var img = new Image, e = "n3fa_image_log" + Math.floor(2147483648 * Math.random()).toString(36);
        window[e] = img;// 全局变量，保证不会被回收
        img.onload = img.onerror = img.onabort = function () {
            img.onload = img.onerror = img.onabort = null;
            img = window[e] = null;
            callback && callback(url)
        };
        img.src = url
    }

    //--
    //处理Hm_unsent_中旧值并存储新值，第一次进入a=.*
    //在页面被关闭前会存入url值。然后会发送数据到服务端，成功后会和以前保存的值进行匹配，匹配成功后还有值则存起来，无值时则会清空未发送值。
    //第二次进入该页面不一定有值，当有值时还是需要传到服务端的。
    function removeOldValueAndSaveNewValue(a) {
        var unsentData = getSessionStorage("_n3fa_unsent_" + _config.id) || "";
        unsentData && (
            (unsentData = unsentData.replace(
                    new RegExp(
                        encodeURIComponent(
                            a.replace(/^https?:\/\//, "")     //http议去掉
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
    function prepareParamUValueAndSave(a, b) {
        var unsentData = getSessionStorage("_n3fa_unsent_" + _config.id) || "";
        var e = a.a.u ? "" : "&u=" + encodeURIComponent(document.location.href);
        unsentData = encodeURIComponent(b.replace(/^https?:\/\//, "") + e) + (unsentData ? "," + unsentData : "");
        //关闭前可能这些数据发不了，这样留在用户下次登陆相关页面时发送。
        setSessionStorage("_n3fa_unsent_" + _config.id, unsentData)
    }


    //发送数据到服务端
    function sendDataToServer(a) {
        a.a.rnd = Math.round(2147483647 * Math.random());
        var b = httpProtocol + "//localhost:18001/1.gif?" + generateValueToServer(a);
        prepareParamUValueAndSave(a, b);
        postDataToServer(b, function (a) {
            removeOldValueAndSaveNewValue(a)
        })
    }


    //计算时间并发送数据到服务端
    function beforeUnload(a) {
        return function () {
            a.a.nv = 0;
            a.a.st = 4;
            a.a.et = 3;
            a.a.ep = (new Date).getTime() - a.f.m + "," + ((new Date).getTime() - a.f.e + a.f.i);
            sendDataToServer(a)
        }
    }

    //所在搜索引擎的频道
    function findSearchEngineChannel(index) {
        for (var n = _config.se[index], sse = 0, Ba = 2 == n[3] ? n[1] + "\\/" : "", Ca = 1 == n[3] ? "\\." +
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
        for (var a = 0, b = _config.dm.length; a < b; a++) {
            var d = _config.dm[a];
            if (-1 < d.indexOf("/") && isSameDomain(document.location.href, d))
                return d.replace(/^[^\/]+(\/.*)/, "$1") + "/"
        }
        return "/"
    }

    //在指定的查找二级域名，找不到返回window.location.hostname
    function findSecondDomainNameUseHostName() {
        for (var a = document.location.hostname, b = 0, d = _config.dm.length; b < d; b++)
            if (isSecondDomain(a, _config.dm[b]))
                return _config.dm[b].replace(/(:\d+)?[\/\?#].*/, "");
        return a
    }

    //二级域名或者是相同域名
    function isSameDomainOrSecondDomain(referrer) {
        for (var b = 0; b < _config.dm.length; b++) {
            if (-1 < _config.dm[b].indexOf("/")) {
                if (isSameDomain(referrer, _config.dm[b])) return true
            } else {
                var d = deleteHttpAndPortForURL(referrer);
                if (d && isSecondDomain(d, _config.dm[b])) return true
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
            if (setCookie(a, "", {domain: findSecondDomainNameUseHostName(), path: findDomainNameUseHref(), g: -1}), window.sessionStorage && window.sessionStorage.removeItem(a), window.localStorage)
                window.localStorage.removeItem(a);
            else if (localStoreAdapter())
                try {
                    pageLocalStore.load(document.location.hostname), pageLocalStore.removeAttribute(a), pageLocalStore.save(document.location.hostname)
                } catch (b) {
                }
        } catch (d) {
        }
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
            return entryTime - lastVisitTime > _config.vdur ? 1 : 4;
        }

        for (var p = 0, za = _config.se.length; p < za; p++) {
            if (new RegExp("(^|\\.)" + _config.se[p][1].replace(/\./g, "\\.")).test(deleteHttpAndPortForURL(document.referrer))) {
                var keywords = getKeyWordFromURL(document.referrer, _config.se[p][2]) || "";
                //2=google 14=so.com 17=etao.com
                if (keywords || !(2 != _config.se[p][0] && 14 != _config.se[p][0] && 17 != _config.se[p][0])) {
                    //cpro.baidu.com是百度网盟的来源，如果是网盟则keywords为空
                    1 == _config.se[p][0] && -1 < document.referrer.indexOf("cpro.baidu.com") && (keywords = "");
                    a.a.se = _config.se[p][0];//搜索引擎ID
                    a.a.sse = findSearchEngineChannel(p); //搜索引擎的频道
                    a.a.sw = keywords;//搜索关键字
                    return 2;
                }
            }
        }

        var referrerWithoutHttpAndPort = "", _isSameDomainOrSecondDomain = false;
        isSameDomainOrSecondDomain(document.referrer) && isSameDomainOrSecondDomain(document.location.href)
            ? _isSameDomainOrSecondDomain = true
            : (referrerWithoutHttpAndPort = deleteHttpAndPortForURL(document.referrer), _isSameDomainOrSecondDomain = isSecondDomain(referrerWithoutHttpAndPort || "", document.location.hostname));

        return _isSameDomainOrSecondDomain ? (entryTime - lastVisitTime > _config.vdur ? 1 : 4) : 3;
    }

    function flashVersion() {
        var flashVersion = "";
        if (navigator.plugins && navigator.mimeTypes.length) {
            var X = navigator.plugins["Shockwave Flash"];
            X && X.description && (flashVersion = X.description.replace(/^.*\s+(\S+)\s+\S+$/, "$1"))
        } else if (window.ActiveXObject) {
            try {
                var ia = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                ia && (flashVersion = ia.GetVariable("$version")) && (flashVersion = flashVersion.replace(/^.*\s+(\d+),(\d+).*$/, "$1.$2"))
            } catch (La) {
            }
        }
        return flashVersion;
    }

    function start(a) {
        try {
            var isNewVisit, enterType, isSavedEntryTime, lastVisitTime, m, visitTimesStored, visitTimesArray;
            pageViewTime = getData("_n3fa_lpvt_" + _config.id) || 0;
            13 == pageViewTime.length && (pageViewTime = Math.round(pageViewTime / 1E3));

            enterType = pageEnterType(a, pageViewTime);
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
                for (1 === isNewVisit && visitTimesArray.push(entryTime); 4 < visitTimesArray.length;)visitTimesArray.shift();
                visitTimesStored = visitTimesArray.join(",");
                lastVisitTime = visitTimesArray[visitTimesArray.length - 1]
            } else {
                visitTimesStored = entryTime, lastVisitTime = "", m = 1;
            }

            setData("_n3fa_lvt_" + _config.id, visitTimesStored, _config.age);   // localstorage中存储
            setData("_n3fa_lpvt_" + _config.id, entryTime); // sessionstorage中存
            isSavedEntryTime = entryTime == getData("_n3fa_lpvt_" + _config.id) ? "1" : "0"; // EntryTime是否存储成功

            if (0 == _config.nv && isSameDomainOrSecondDomain(document.location.href)
                && ("" == document.referrer || isSameDomainOrSecondDomain(document.referrer)))
                isNewVisit = 0, enterType = 4;

            a.a.nv = isNewVisit;                   // 是否是一个新的VV
            a.a.st = enterType;                    // 页面进入类型（1,2,3,4）
            a.a.cc = isSavedEntryTime;             // EntryTime是否存储成功
            a.a.lt = lastVisitTime;                // VV进入时间，半小时内不变
            a.a.lv = m;                            // 1：第一次进入，2：30天内少于4次，3：30天内不小于4次
            a.a.si = _config.id;                   // 统计网站的ID
            a.a.su = document.referrer;            // http header referer
            a.a.ds = screenWidthAndHeight;         // 屏幕尺寸,如 ’1024×768′
            a.a.cl = screenColorDepth + "-bit";    // 颜色深度,如 “32-bit”
            a.a.ln = localLanguage;                // 语言,zh-cn
            a.a.ja = isJavaEnabled ? 1 : 0;        // java支持,1:0
            a.a.ck = isCookieEnabled ? 1 : 0;      // cookie支持,1:0
            a.a.fl = flashVersion();               // flash版本
            a.a.v = _config.v;                     // 版本号
            a.a.cv = decodeURIComponent(getData("_n3fa_cv_" + _config.id) || ""); // _setCustomVar 的值
            1 == a.a.nv && (a.a.tt = document.title || ""); // 页面的title 只有是新的VV时才统计

            //进入类型不一样，调用方法不一样。第一次输入域名进入为1,第二次未超过半小时nv=0
            //只有页面进入方式为4时,才需要处理历史数据
            //a.RemoveOldValueAndSaveNewValue_l(".*");
            0 == a.a.nv ? postSessionStorageDataToServer() : removeOldValueAndSaveNewValue(".*");

            a.addEventForDocumentObject && a.addEventForDocumentObject();
            a.addMouseupAndBeforeUnloadEventForDocument && a.addMouseupAndBeforeUnloadEventForDocument();
            a.f = new AddFocusAndBlurEventForWindow;

            addEvent(window, "beforeunload", beforeUnload(a)); // 页面离开事件

            //处理存储在window._n3fa中的值
            var faConfig = window._n3fa;
            if (faConfig && faConfig.length)
                for (var v = 0; v < faConfig.length; v++) {
                    var faConfigApiItem = faConfig[v];
                    switch (faConfigApiItem[0]) {
                        case "_setAccount":
                            1 < faConfigApiItem.length && /^[0-9a-z]{32}$/.test(faConfigApiItem[1]) && (window._n3fa_account = faConfigApiItem[1]);
                            break;
                        case "_setAutoPageview":
                            if (1 < faConfigApiItem.length) {
                                var isAutoPageView = faConfigApiItem[1];
                                if (false === isAutoPageView || true === isAutoPageView) window._n3fa_autoPageview = isAutoPageView
                            }
                    }
                }

            if ("undefined" === typeof window._n3fa_account || window._n3fa_account === _config.id) {
                window._n3fa_account = _config.id;
                var O = window._n3fa;
                if (O && O.length)
                    for (var x = 0, Ha = O.length; x < Ha; x++)
                        a.prepareObjectArray(O[x]);
                window._n3fa = a.o
            }

            //未定义时则提交数据到服务端，或者_n3fa_autoPageview = true时，则提交数据到服务端
            if ("undefined" === typeof window._n3fa_autoPageview || window._n3fa_autoPageview === true)
                a.h = true, a.a.et = 0, a.a.ep = "", sendDataToServer(a)

        } catch (ma) {
            a = [], a.push("si=" + _config.id), a.push("n=" + encodeURIComponent(ma.name)), a.push("m=" + encodeURIComponent(ma.message)), a.push("r=" + encodeURIComponent(document.referrer)), postDataToServer(httpProtocol + "//localhost:18001/1.gif?" + a.join("&"))
        }
    }


    function P() {
        if ("undefined" == typeof window["_n3fa_loaded_" + _config.id]) {
            window["_n3fa_loaded_" + _config.id] = true;
            var a = this;
            a.a = {};
            a.b = [];
            a.o = {
                push: function () {
                    a.prepareObjectArray.apply(a, arguments)
                }
            };
            a.h = false;
            start(a)
        }
    }

    //处理对象数组，首先参数是对象数组，然后根据第一个参数决定如何处理参数值
    P.prototype.prepareObjectArray = function (a) {

        var func = function (a) {
            if ("[object Array]" !== Object.prototype.toString.call(a))
                return false;
            for (var b = a.length - 1; 0 <= b; b--) {
                var d = a[b];
                if (("[object Number]" !== {}.toString.call(d) || !isFinite(d)) && "[object String]" !== {}.toString.call(d) && d !== true && d !== false)
                    return false
            }
            return true
        };

        if (func(a)) {

            var escapeSpecialChar = function (str) {
                return str.replace ? str.replace(/'/g, "'0").replace(/\*/g, "'1").replace(/!/g, "'2") : str
            };

            switch (a[0]) {
                // 支持_hmt.push(['_trackPageview', pageURL]);  http://tongji.baidu.com/open/api/more?p=ref_trackPageview
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
                        escapeSpecialChar(a[2]) + (a[3] ? "*" + escapeSpecialChar(a[3]) : "") + (a[4] ? "*" + escapeSpecialChar(a[4]) : ""), sendDataToServer(this));
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
                        "" !== a ? this.setData("_n3fa_cv_" + _config.id, encodeURIComponent(a), _config.age) : removeCookieAndLocalValue()
                    }
            }
        }
    };

    //为指定页面对象增加事件
    P.prototype.addEventForDocumentObject = function () {
        addEvent(document, "click", eventCallBack(this));
        for (var a = _config.etrk.length, b = 0; b < a; b++) {
            var d = _config.etrk[b], e = document.getElementById(d.id);
            e && addEvent(e, d.eventType, addAttributeForEventObjectAndSendData(this))
        }
    };

    //为事件对象增加座标属性且给参数赋值,然后把数据发到服务端,转化项目使用
    function addAttributeForEventObjectAndSendData(a) {
        return function (b) {
            (b.target || b.srcElement).setAttribute("HM_fix", b.clientX + ":" + b.clientY);
            a.a.et = 1;
            a.a.ep = "{id:" + this.id + ",eventType:" + b.type + "}";
            sendDataToServer(a)
        }
    }

    //事件委托,事件对象是指定特定事件对象时，则发送数据到服务端
    function eventCallBack(a) {
        return function (b) {
            var d = b.target || b.srcElement, e = d.getAttribute("HM_fix"), f = b.clientX + ":" + b.clientY;
            if (e && e == f)
                d.removeAttribute("HM_fix");
            else if (e = _config.etrk.length, 0 < e) {
                for (f = {}; d && d != document.body;)
                    d.id && (f[d.id] = ""), d = d.parentNode;
                for (d = 0; d < e; d++) {
                    var m = _config.etrk[d];
                    f.hasOwnProperty(m.id) && (a.a.et = 1, a.a.ep = "{id:" + m.id + ",eventType:" + b.type + "}", sendDataToServer(a))
                }
            }
        }
    }

    //为文档对象增加mouseup和beforeunload事件
    P.prototype.addMouseupAndBeforeUnloadEventForDocument = function () {
        var a = this;
        _config.ctrk && (addEvent(document, "mouseup", documentMouseupEventCallback(this)), addEvent(window, "beforeunload", function () {
            prepareParamBAndSendDataToServer(a)
        }), setInterval(function () {
            prepareParamBAndSendDataToServer(a)
        }, 6E5)); //600000,10分钟
    };

    //需要跟踪转化时，处理F对象中的b值，该值存储的是事件发生的座标及发生的链接地址。如果大于10个元素或者长度大于1024，则发送数据到服务端
    function documentMouseupEventCallback(a) {
        return function (b) {
            var d, e;
            //是IE需要加上滚动高度
            isIE ? (
                e = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
                    d = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft),
                    d = b.clientX + d, e = b.clientY + e)
                : (d = b.pageX, e = b.pageY);
            var f = window.innerWidth || document.documentElement.clientWidth || document.body.offsetWidth;
            switch (_config.align) {
                case 1:
                    d -= f / 2;
                    break;
                case 2:
                    d -= f
            }
            d = "{x:" + d + ",y:" + e + ",";
            b = b.target || b.srcElement;
            //不是a标签触发的事件，向上找到a为止。
            if ("a" != b.tagName.toLowerCase())a:{
                for (e = "A"; (b = b.parentNode) && 1 == b.nodeType;)if (b.tagName ==
                    e)break a;
                //一直没有找到a标签，置空
                b = null
            }
            b = d = b ? d + ("t:a,u:" + encodeURIComponent(b.href) + "}") : d + "t:b}";
            //长度大于1024时直接推送b值，然后如果发现大于10个元素，推送到服务端。如果不大于1024，那么如果b中的值处理完后大于1024，则会发到服务端。
            "" != b && (d = (httpProtocol + "//localhost:18001/1.gif?" + generateValueToServer(a).replace(/ep=[^&]*/, "ep=" + encodeURIComponent("[" + b + "]"))).length, 1024 < d + 10 || (1024 < d + encodeURIComponent(a.b.join(",") + (a.b.length ? "," : "")).length + 10 && prepareParamBAndSendDataToServer(a), a.b.push(b), (10 <= a.b.length || /t:a/.test(b)) && prepareParamBAndSendDataToServer(a)))
        }
    }

    //处理参数中B值，并把数据发到服务端，然后清空b值。
    function prepareParamBAndSendDataToServer(a) {
        0 != a.b.length && (a.a.et = 2, a.a.ep = "[" + a.b.join(",") + "]", sendDataToServer(a), a.b = [])
    }

    //为window对象增加焦点事件和失去焦点事件，作用就是可以触发切换时间再计算，可以记录用户回来几次和累计的时间
    function AddFocusAndBlurEventForWindow() {
        this.e = this.m = (new Date).getTime();
        this.i = 0;
        "object" == typeof document.onfocusin
            ? (addEvent(document, "focusin", calculateOnlineTimeAndRefreshStartTime(this)), addEvent(document, "focusout", calculateOnlineTimeAndRefreshStartTime(this)))
            : (addEvent(window, "focus", calculateOnlineTimeAndRefreshStartTime(this)), addEvent(window, "blur", calculateOnlineTimeAndRefreshStartTime(this)))
    }

    //用户重新进入时刷新开始时间并累积用户在线时间
    function calculateOnlineTimeAndRefreshStartTime(a) {
        return function (_event) {
            if (!(_event.target && _event.target != window)) {
                if ("blur" == _event.type || "focusout" == _event.type)
                    a.i += (new Date).getTime() - a.e;
                a.e = (new Date).getTime()
            }
        }
    }

    new P;

})();