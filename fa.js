(function () {
    var c = {
        id: "9208c8c641bfb0560ce7884c36938d9d",
        dm: ["10010.com"],
        v: "0.0.1",
        etrk: [
            {id: "button", eventType: "onclick"}
        ],
        icon: '',
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

    var true_g = true, null_h = null, false_k = false,
        ea = /msie (\d+\.\d+)/i.test(navigator.userAgent),  // ea是否是IE
        ce = navigator.cookieEnabled,//ck:是否支持cookie 1:0
        je = navigator.javaEnabled(),//ja:java支持 1:0
        nl = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || "",//ln:语言 zh-cn
        swh = window.screen.width + "x" + window.screen.height,//ds:屏幕尺寸
        scd = window.screen.colorDepth,//cl:颜色深度
        PageViewTime = 0,
        EntryTime = Math.round(+new Date / 1E3),
        HttpProtocol = "https:" == document.location.protocol ? "https:" : "http:",
        SendToServerValue = "cc ck cl ds ep et fl ja ln lo lt nv rnd sb se si st su sw sse v cv lv u api tt".split(" ");


    //在a指定的url中取指定变量的值
    function getKeyWordFromURL(a, b) {
        var d = a.match(RegExp("(^|&|\\?|#)(" + b + ")=([^&#]*)(&|$|#)", ""));
        return d ? d[3] : null_h
    }

    //删除url中的http协议和端口号
    function deleteHttpAndPortForURL(a) {
        return(a = (a = a.match(/^(https?:\/\/)?([^\/\?#]*)/)) ? a[2].replace(/.*@/, "") : null_h) ? a.replace(/:\d+$/, "") : a
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
        return window.sessionStorage ? window.sessionStorage.getItem(name) : null_h
    }

    //设置cookie
    function setCookie(name, value, option) {
        var e;
        option.g && (e = new Date, e.setTime(e.getTime() + option.g));
        document.cookie = name + "=" + value + (option.domain ? "; domain=" + option.domain : "") + (option.path ? "; path=" + option.path : "") + (e ? "; expires=" + e.toGMTString() : "") + (option.p ? "; secure" : "")
    }


    var z;

    //兼容控制本地方法（http://www.cnblogs.com/zjcn/archive/2012/07/03/2575026.html）
    function localStoreAdapter() {
        if (!z)try {
            z = document.createElement("input"), z.type = "hidden", z.style.display = "none", z.addBehavior("#default#userData"), document.getElementsByTagName("head")[0].appendChild(z)
        } catch (a) {
            return false_k
        }
        return true_g
    }

    //LocalStorage存储
    function setLocalStorage(a, b, d) {
        var e = new Date;
        e.setTime(e.getTime() + d || 31536E6);
        try {
            window.localStorage ? (b = e.getTime() + "|" + b, window.localStorage.setItem(a, b)) : localStoreAdapter() && (z.expires = e.toUTCString(), z.load(document.location.hostname), z.setAttribute(a, b), z.save(document.location.hostname))
        } catch (f) {
        }
    }

    //LocalStorage取值
    function getLocalStorage(a) {
        if (window.localStorage) {
            if (a = window.localStorage.getItem(a)) {
                var b = a.indexOf("|"), d = a.substring(0, b) - 0;
                if (d && d > (new Date).getTime())return a.substring(b + 1)
            }
        } else if (localStoreAdapter())try {
            return z.load(document.location.hostname), z.getAttribute(a)
        } catch (e) {
        }
        return null_h
    }

    //cookie中取值，否则去浏览器存储中取值，无值时返回空
    function getData(name) {
        try {
            var b = RegExp("(^| )" + name + "=([^;]*)(;|$)").exec(document.cookie);
            return (b ? b[2] : null_h) || getSessionStorage(name) || getLocalStorage(name)
        } catch (d) {
        }
    }

    //存储值，cookie必存，本地和session选择存储。 本地格式： 一年后的时间|当前时间
    function setData(name, value, expireTime) {
        try {
            setCookie(name, value, {domain: findSeconDomainNameUseHostName(), path: findDomainNameUseHref(), g: expireTime}), expireTime
                ? setLocalStorage(name, value, expireTime)
                : setSessionStorage(name, value)
        } catch (e) {
        }
    }

    //增加对象事件
    function addEvent(a, b, d) {
        a.attachEvent ? a.attachEvent("on" + b, function (b) {
            d.call(a, b)
        }) : a.addEventListener && a.addEventListener(b, d, false_k)
    };


    // 生成发送到服务端的数据
    function generateValueToServer(a) {
        for (var b = [], d = 0, e = SendToServerValue.length; d < e; d++) {
            var f = SendToServerValue[d], m = a.a[f];
            "undefined" != typeof m && "" !== m && b.push(f + "=" + encodeURIComponent(m))
        }
        return b.join("&")
    }

    //提交浏览器中存储数据到服务端 a.nv=0时执行，刷新时没有大于半小时
    function postSessionStorageDataToServer() {
        var a = getSessionStorage("n3fa_unsent_" + c.id);
        if (a)
            for (var a = a.split(","), b = 0, d = a.length; b < d; b++)
                postDataToServer(HttpProtocol + "//" + decodeURIComponent(a[b]).replace(/^https?:\/\//, ""), function (a) {
                    removeOldValueAndSaveNewValue(a)
                })
    }

    //图片请求向服务器提交数据
    function postDataToServer(url, callback) {
        var d = new Image, e = "mini_tangram_log_" + Math.floor(2147483648 * Math.random()).toString(36);
        window[e] = d;// 全局变量，保证不会被回收
        d.onload = d.onerror = d.onabort = function () {
            d.onload = d.onerror = d.onabort = null_h;
            d = window[e] = null_h;
            callback && callback(url)
        };
        d.src = url
    };

    //--
    //处理Hm_unsent_中旧值并存储新值，第一次进入a=.*
    //在页面被关闭前会存入url值。然后会发送数据到服务端，成功后会和以前保存的值进行匹配，匹配成功后还有值则存起来，无值时则会清空未发送值。
    //第二次进入该页面不一定有值，当有值时还是需要传到服务端的。
    function removeOldValueAndSaveNewValue(a) {
        //未发送值
        var b = getSessionStorage("n3fa_unsent_" + c.id) || "";
        b && (
            (
                b = b.replace(
                        RegExp(
                            encodeURIComponent(
                                a.replace(/^https?:\/\//, "")     //http议去掉
                            ).replace(
                                    /([\*\(\)])/g, "\\$1"  //*()替换为\$1
                                ) + "(%26u%3D[^,]*)?,?", "g"), "")
                    .replace(/,$/, ""))  //加上&u=[^,]*   以&u为参数到,结尾，其实就是界限
                ? setSessionStorage("n3fa_unsent_" + c.id, b)
                : window.sessionStorage && window.sessionStorage.removeItem("n3fa_unsent_" + c.id)
            )
    }


    //--在指定URL中增加U值，把最新的值插入到Hm_unsent_中存储值前面并保存
    function proParamUValueAndSave(a, b) {
        var d = getSessionStorage("n3fa_unsent_" + c.id) || "",
            e = a.a.u ? "" : "&u=" + encodeURIComponent(document.location.href),
            d = encodeURIComponent(b.replace(/^https?:\/\//, "") + e) + (d ? "," + d : "");
        //关闭前可能这些数据发不了，这样留在用户下次登陆相关页面时发送。
        setSessionStorage("n3fa_unsent_" + c.id, d)
    }


    //发送数据到服务端
    function sendDataToServer(a) {
        a.a.rnd = Math.round(2147483647 * Math.random());
        a.a.api = a.a.api || a.d ? a.a.api + "_" + a.d : "";
        var b = HttpProtocol + "//localhost:18001/1.gif?" + generateValueToServer(a);
        a.a.api = 0;
        a.d = 0;
        proParamUValueAndSave(a, b);
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

    function findSearchEngineChannel(p) {
        //所在搜索引擎的频道
        for (var n = c.se[p], sse = 0, Ba = 2 == n[3] ? n[1] + "\\/" : "", Ca = 1 == n[3] ? "\\." +
            n[1] : "", V = n[4].split(","), n = 0, Da = V.length; n < Da; n++) {

            if ("" !== V[n] && RegExp(Ba + V[n] + Ca).test(document.referrer)) {
                sse = n + 1;
                break
            }
        }
        return sse;
    }

    //当前网站是否和指定域名列表中的相同，相同返回域名，不同则返回“/”
    function findDomainNameUseHref() {
        for (var a = 0, b = c.dm.length; a < b; a++) {
            var d = c.dm[a];
            if (-1 < d.indexOf("/") && isSameDomain(document.location.href, d))
                return d.replace(/^[^\/]+(\/.*)/, "$1") + "/"
        }
        return"/"
    }

    //在指定的查找二级域名，找不到返回window.location.hostname
    function findSeconDomainNameUseHostName() {
        for (var a = document.location.hostname, b = 0, d = c.dm.length; b < d; b++)
            if (isSecondDomain(a, c.dm[b]))
                return c.dm[b].replace(/(:\d+)?[\/\?#].*/, "");
        return a
    }

    //二级域名或者是相同域名
    function isSameDomainOrSecondDomain(referrer) {
        for (var b = 0; b < c.dm.length; b++) {
            if (-1 < c.dm[b].indexOf("/")) {
                if (isSameDomain(referrer, c.dm[b])) return true
            } else {
                var d = deleteHttpAndPortForURL(referrer);
                if (d && isSecondDomain(d, c.dm[b])) return true
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
        var a = "_n3fa_cv_" + c.id;
        try {
            if (setCookie(a, "", {domain: findSeconDomainNameUseHostName(), path: findDomainNameUseHref(), g: -1}), window.sessionStorage && window.sessionStorage.removeItem(a), window.localStorage)
                window.localStorage.removeItem(a);
            else if (localStoreAdapter())
                try {
                    z.load(document.location.hostname), z.removeAttribute(a), z.save(document.location.hostname)
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
        if (document.referrer) {
            for (var p = 0, za = c.se.length; p < za; p++) {
                if (RegExp("(^|\\.)" + c.se[p][1].replace(/\./g, "\\.")).test(deleteHttpAndPortForURL(document.referrer))) {
                    var keywords = getKeyWordFromURL(document.referrer, c.se[p][2]) || "";
                    //2=google 14=so.com 17=etao.com
                    if (keywords || !(2 != c.se[p][0] && 14 != c.se[p][0] && 17 != c.se[p][0])) {
                        //cpro.baidu.com是百度网盟的来源，如果是网盟则keywords为空
                        1 == c.se[p][0] && -1 < document.referrer.indexOf("cpro.baidu.com") && (keywords = "");
                        a.a.se = c.se[p][0];//搜索引擎ID
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

            return _isSameDomainOrSecondDomain ? (EntryTime - lastVisitTime > c.vdur ? 1 : 4) : 3;
        } else {
            return EntryTime - lastVisitTime > c.vdur ? 1 : 4;
        }
    }

    function flashVersion() {
        var b = "";
        if (navigator.plugins && navigator.mimeTypes.length) {
            var X = navigator.plugins["Shockwave Flash"];
            X && X.description && (b = X.description.replace(/^.*\s+(\S+)\s+\S+$/, "$1"))
        } else if (window.ActiveXObject) {
            try {
                var ia = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                ia && (b = ia.GetVariable("$version")) && (b = b.replace(/^.*\s+(\d+),(\d+).*$/, "$1.$2"))
            } catch (La) {
            }
        }
        return b;
    }

    function start(a) {
        try {
            var b, d, isSavedEntryTime, f, m, B, l;
            PageViewTime = getData("_n3fa_lpvt_" + c.id) || 0;
            13 == PageViewTime.length && (PageViewTime = Math.round(PageViewTime / 1E3));

            d = pageEnterType(a, PageViewTime);
            //页面进入类型
            b = 4 != d ? 1 : 0;
            //localstorage中取
            if (B = getData("_n3fa_lvt_" + c.id)) {
                l = B.split(",");
                for (var G = l.length - 1; 0 <= G; G--)
                    13 == l[G].length && (l[G] = "" + Math.round(l[G] / 1E3));
                //存储大于30天
                for (; 2592E3 < EntryTime - l[0];)
                    l.shift();
                m = 4 > l.length ? 2 : 3;
                for (1 === b && l.push(EntryTime); 4 < l.length;)l.shift();
                B = l.join(",");
                f = l[l.length - 1]
            } else {
                B = EntryTime, f = "", m = 1;
            }

            setData("_n3fa_lvt_" + c.id, B, c.age);   // localstorage中存储
            setData("_n3fa_lpvt_" + c.id, EntryTime); // sessionstorage中存
            isSavedEntryTime = EntryTime == getData("_n3fa_lpvt_" + c.id) ? "1" : "0"; // EntryTime是否存储成功

            if (0 == c.nv && isSameDomainOrSecondDomain(document.location.href) && ("" == document.referrer || isSameDomainOrSecondDomain(document.referrer)))
                b = 0, d = 4;

            a.a.nv = b;                 // 是否是一个新的VV
            a.a.st = d;                 // 页面进入类型（1,2,3,4）
            a.a.cc = isSavedEntryTime;  // EntryTime是否存储成功
            a.a.lt = f;                 // VV进入时间，半小时内不变
            a.a.lv = m;                 // 1：第一次进入，2：30天内少于4次，3：30天内不小于4次
            a.a.si = c.id;              // 统计代码id
            a.a.su = document.referrer; // referrer
            a.a.ds = swh;               // 屏幕尺寸,如 ’1024×768′
            a.a.cl = scd + "-bit";      // 颜色深度,如 “32-bit”
            a.a.ln = nl;                // 语言,zh-cn
            a.a.ja = je ? 1 : 0;        // java支持,1:0
            a.a.ck = ce ? 1 : 0;        // cookie支持,1:0
            a.a.fl = flashVersion();    // flash版本
            a.a.v = c.v;                // 版本号
            a.a.cv = decodeURIComponent(getData("_n3fa_cv_" + c.id) || ""); // _setCustomVar 的值
            1 == a.a.nv && (a.a.tt = document.title || ""); // 页面的title 只有是新的VV时才统计
            a.a.api = 0;

            //进入类型不一样，调用方法不一样。第一次输入域名进入为1,第二次未超过半小时nv=0
            //只有页面进入方式为4时,才需要处理历史数据
            //a.RemoveOldValueAndSaveNewValue_l(".*");
            0 == a.a.nv ? postSessionStorageDataToServer() : removeOldValueAndSaveNewValue(".*");

            a.addEventForDocumentObject && a.addEventForDocumentObject();
            a.addMouseupAndBeforeUnloadEventForDocument && a.addMouseupAndBeforeUnloadEventForDocument();
            a.f = new addFoucsAndBlureEventForWindow;

            addEvent(window, "beforeunload", beforeUnload(a)); // 页面离开事件

            //处理存储在window._hmt中的值
            var x = window._n3fa;
            if (x && x.length)
                for (v = 0; v < x.length; v++) {
                    var D = x[v];
                    switch (D[0]) {
                        case "_setAccount":
                            1 < D.length && /^[0-9a-z]{32}$/.test(D[1]) && (a.a.api |= 1, window._n3fa_account = D[1]);
                            break;
                        case "_setAutoPageview":
                            if (1 < D.length) {
                                var $ = D[1];
                                if (false_k === $ || true_g === $)a.a.api |= 2, window._bdhm_autoPageview = $
                            }
                    }
                }

            if ("undefined" === typeof window._n3fa_account || window._n3fa_account === c.id) {
                window._n3fa_account = c.id;
                var O = window._n3fa;
                if (O && O.length)
                    for (var x = 0, Ha = O.length; x < Ha; x++)
                        a.proObjectArray(O[x]);
                window._n3fa = a.o
            }

            //未定义时则提交数据到服务端，或者_n3sa_autoPageview = true时，则提交数据到服务端
            if ("undefined" === typeof window._n3sa_autoPageview || window._n3sa_autoPageview === true_g)
                a.h = true_g, a.a.et = 0, a.a.ep = "", sendDataToServer(a)

        } catch (ma) {
            a = [], a.push("si=" + c.id), a.push("n=" + encodeURIComponent(ma.name)), a.push("m=" + encodeURIComponent(ma.message)), a.push("r=" + encodeURIComponent(document.referrer)), postDataToServer(HttpProtocol + "//localhost:18001/1.gif?" + a.join("&"))
        }
    }


    function P() {
        if ("undefined" == typeof window["_n3fa_loaded_" + c.id]) {
            window["_n3fa_loaded_" + c.id] = true;
            var a = this;
            a.a = {};
            a.b = [];
            a.o = {
                push: function () {
                    a.proObjectArray.apply(a, arguments)
                }
            };
            a.d = 0;
            a.h = false;
            start(a)
        }
    }

    //处理对象数组，首先参数是对象数组，然后根据第一个参数决定如何处理参数值
    P.prototype.proObjectArray = function (a) {
        if (function (a) {
            if ("[object Array]" !== Object.prototype.toString.call(a))return false_k;
            for (var b = a.length - 1; 0 <= b; b--) {
                var d = a[b];
                if (("[object Number]" !== {}.toString.call(d) || !isFinite(d)) && "[object String]" !== {}.toString.call(d) && d !== true_g && d !== false_k)return false_k
            }
            return true_g
        }(a)) {
            var b =
                function (a) {
                    return a.replace ? a.replace(/'/g, "'0").replace(/\*/g, "'1").replace(/!/g, "'2") : a
                };
            switch (a[0]) {
                // 支持_hmt.push(['_trackPageview', pageURL]);  http://tongji.baidu.com/open/api/more?p=ref_trackPageview
                case "_trackPageview":
                    if (1 < a.length && a[1].charAt && "/" == a[1].charAt(0)) {
                        this.a.api |= 4;
                        this.a.et = 0;
                        this.a.ep = "";
                        this.h ? (this.a.nv = 0, this.a.st = 4) : this.h = true_g;
                        var b = this.a.u, d = this.a.su;
                        this.a.u = HttpProtocol + "//" + document.location.host + a[1];
                        this.a.su = document.location.href;
                        sendDataToServer(this);
                        this.a.u = b;
                        this.a.su = d
                    }
                    break;

                // http://tongji.baidu.com/open/api/more?p=ref_trackEvent
                case "_trackEvent":
                    2 < a.length && (this.a.api |= 8, this.a.nv = 0, this.a.st = 4, this.a.et = 4, this.a.ep = b(a[1]) + "*" +
                        b(a[2]) + (a[3] ? "*" + b(a[3]) : "") + (a[4] ? "*" + b(a[4]) : ""), sendDataToServer(this));
                    break;
                case "_setCustomVar":
                    if (4 > a.length)break;
                    var d = a[1], e = a[4] || 3;
                    if (0 < d && 6 > d && 0 < e && 4 > e) {
                        this.d++;
                        for (var f = (this.a.cv || "*").split("!"), m = f.length; m < d - 1; m++)f.push("*");
                        f[d - 1] = e + "*" + b(a[2]) + "*" + b(a[3]);
                        this.a.cv = f.join("!");
                        a = this.a.cv.replace(/[^1](\*[^!]*){2}/g, "*").replace(/((^|!)\*)+$/g, "");
                        "" !== a ? this.setData("_n3fa_cv_" + c.id, encodeURIComponent(a), c.age) : removeCookieAndLocalValue()
                    }
            }
        }
    }

    //为指定页面对象增加事件
    P.prototype.addEventForDocumentObject = function () {
        addEvent(document, "click", eventCallBack(this));
        for (var a = c.etrk.length, b = 0; b < a; b++) {
            var d = c.etrk[b], e = document.getElementById(d.id);
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
            else if (e = c.etrk.length, 0 < e) {
                for (f = {}; d && d != document.body;)
                    d.id && (f[d.id] = ""), d = d.parentNode;
                for (d = 0; d < e; d++) {
                    var m = c.etrk[d];
                    f.hasOwnProperty(m.id) && (a.a.et = 1, a.a.ep = "{id:" + m.id + ",eventType:" + b.type + "}", sendDataToServer(a))
                }
            }
        }
    }

    //为文档对象增加mouseup和beforeunload事件
    P.prototype.addMouseupAndBeforeUnloadEventForDocument = function () {
        var a = this;
        c.ctrk && (addEvent(document, "mouseup", documentMouseupEventCallback(this)), addEvent(window, "beforeunload", function () {
            proParamBAndSendDataToServer(a)
        }), setInterval(function () {
            proParamBAndSendDataToServer(a)
        }, 6E5)) //600000,10分钟
    };

    //需要跟踪转化时，处理F对象中的b值，该值存储的是事件发生的座标及发生的链接地址。如果大于10个元素或者长度大于1024，则发送数据到服务端
    function documentMouseupEventCallback(a) {
        return function (b) {
            var d, e;
            //是IE需要加上滚动高度
            ea ? (
                e = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
                    d = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft),
                    d = b.clientX + d, e = b.clientY + e)
                : (d = b.pageX, e = b.pageY);
            var f = window.innerWidth || document.documentElement.clientWidth || document.body.offsetWidth;
            switch (c.align) {
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
                b = null_h
            }
            b = d = b ? d + ("t:a,u:" + encodeURIComponent(b.href) + "}") : d + "t:b}";
            //长度大于1024时直接推送b值，然后如果发现大于10个元素，推送到服务端。如果不大于1024，那么如果b中的值处理完后大于1024，则会发到服务端。
            "" != b && (d = (HttpProtocol + "//localhost:18001/1.gif?" + generateValueToServer(a).replace(/ep=[^&]*/, "ep=" + encodeURIComponent("[" + b + "]"))).length, 1024 < d + 10 || (1024 < d + encodeURIComponent(a.b.join(",") + (a.b.length ? "," : "")).length + 10 && proParamBAndSendDataToServer(a), a.b.push(b), (10 <= a.b.length || /t:a/.test(b)) && proParamBAndSendDataToServer(a)))
        }
    }

    //处理参数中B值，并把数据发到服务端，然后清空b值。
    function proParamBAndSendDataToServer(a) {
        0 != a.b.length && (a.a.et = 2, a.a.ep = "[" + a.b.join(",") + "]", sendDataToServer(a), a.b = [])
    }

    //为window对象增加焦点事件和失去焦点事件，作用就是可以触发切换时间再计算，可以记录用户回来几次和累计的时间
    function addFoucsAndBlureEventForWindow() {
        this.e = this.m = (new Date).getTime();
        this.i = 0;
        "object" == typeof document.onfocusin
            ? (addEvent(document, "focusin", caculateOnlineTimeAndRefreshStartTime(this)), addEvent(document, "focusout", caculateOnlineTimeAndRefreshStartTime(this)))
            : (addEvent(window, "focus", caculateOnlineTimeAndRefreshStartTime(this)), addEvent(window, "blur", caculateOnlineTimeAndRefreshStartTime(this)))
    }

    //用户重新进入时刷新开始时间并累积用户在线时间
    function caculateOnlineTimeAndRefreshStartTime(a) {
        return function (b) {
            if (!(b.target && b.target != window)) {
                if ("blur" == b.type || "focusout" == b.type)a.i += (new Date).getTime() - a.e;
                a.e = (new Date).getTime()
            }
        }
    }

    new P;

})();