/*
 * APICloud JavaScript Library
 * Copyright (c) 2014 apicloud.com
 */
(function(window) {
    var u = {};
    var isAndroid = (/android/gi).test(navigator.appVersion);
    var uzStorage = function() {
        var ls = window.localStorage;
        return ls;
    };

    function parseArguments(url, data, fnSuc, dataType) {
        if (typeof(data) == 'function') {
            dataType = fnSuc;
            fnSuc = data;
            data = undefined;
        }
        if (typeof(fnSuc) != 'function') {
            dataType = fnSuc;
            fnSuc = undefined;
        }
        return {
            url: url,
            data: data,
            fnSuc: fnSuc,
            dataType: dataType
        };
    }
    u.trim = function(str) {
        if (String.prototype.trim) {
            return str == null ? "" : String.prototype.trim.call(str);
        } else {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
    };
    u.trimAll = function(str) {
        return str.replace(/\s*/g, '');
    };
    u.isElement = function(obj) {
        return !!(obj && obj.nodeType == 1);
    };
    u.isArray = function(obj) {
        if (Array.isArray) {
            return Array.isArray(obj);
        } else {
            return obj instanceof Array;
        }
    };
    u.isEmptyObject = function(obj) {
        if (JSON.stringify(obj) === '{}') {
            return true;
        }
        return false;
    };
    u.addEvt = function(el, name, fn, useCapture) {
        if (!u.isElement(el)) {
            console.warn('$api.addEvt Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        if (el.addEventListener) {
            el.addEventListener(name, fn, useCapture);
        }
    };
    u.rmEvt = function(el, name, fn, useCapture) {
        if (!u.isElement(el)) {
            console.warn('$api.rmEvt Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        if (el.removeEventListener) {
            el.removeEventListener(name, fn, useCapture);
        }
    };
    u.one = function(el, name, fn, useCapture) {
        if (!u.isElement(el)) {
            console.warn('$api.one Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        var that = this;
        var cb = function() {
            fn && fn();
            that.rmEvt(el, name, cb, useCapture);
        };
        that.addEvt(el, name, cb, useCapture);
    };
    u.dom = function(el, selector) {
        if (arguments.length === 1 && typeof arguments[0] == 'string') {
            if (document.querySelector) {
                return document.querySelector(arguments[0]);
            }
        } else if (arguments.length === 2) {
            if (el.querySelector) {
                return el.querySelector(selector);
            }
        }
    };
    u.domAll = function(el, selector) {
        if (arguments.length === 1 && typeof arguments[0] == 'string') {
            if (document.querySelectorAll) {
                return document.querySelectorAll(arguments[0]);
            }
        } else if (arguments.length === 2) {
            if (el.querySelectorAll) {
                return el.querySelectorAll(selector);
            }
        }
    };
    u.byId = function(id) {
        return document.getElementById(id);
    };
    u.first = function(el, selector) {
        if (arguments.length === 1) {
            if (!u.isElement(el)) {
                console.warn('$api.first Function need el param, el param must be DOM Element');
                return;
            }
            return el.children[0];
        }
        if (arguments.length === 2) {
            return this.dom(el, selector + ':first-child');
        }
    };
    u.last = function(el, selector) {
        if (arguments.length === 1) {
            if (!u.isElement(el)) {
                console.warn('$api.last Function need el param, el param must be DOM Element');
                return;
            }
            var children = el.children;
            return children[children.length - 1];
        }
        if (arguments.length === 2) {
            return this.dom(el, selector + ':last-child');
        }
    };
    u.eq = function(el, index) {
        return this.dom(el, ':nth-child(' + index + ')');
    };
    u.not = function(el, selector) {
        return this.domAll(el, ':not(' + selector + ')');
    };
    u.prev = function(el) {
        if (!u.isElement(el)) {
            console.warn('$api.prev Function need el param, el param must be DOM Element');
            return;
        }
        var node = el.previousSibling;
        if (node.nodeType && node.nodeType === 3) {
            node = node.previousSibling;
            return node;
        }
    };
    u.next = function(el) {
        if (!u.isElement(el)) {
            console.warn('$api.next Function need el param, el param must be DOM Element');
            return;
        }
        var node = el.nextSibling;
        if (node.nodeType && node.nodeType === 3) {
            node = node.nextSibling;
            return node;
        }
    };
    u.closest = function(el, selector) {
        if (!u.isElement(el)) {
            console.warn('$api.closest Function need el param, el param must be DOM Element');
            return;
        }
        var doms, targetDom;
        var isSame = function(doms, el) {
            var i = 0,
                len = doms.length;
            for (i; i < len; i++) {
                if (doms[i].isSameNode(el)) {
                    return doms[i];
                }
            }
            return false;
        };
        var traversal = function(el, selector) {
            doms = u.domAll(el.parentNode, selector);
            targetDom = isSame(doms, el);
            while (!targetDom) {
                el = el.parentNode;
                if (el != null && el.nodeType == el.DOCUMENT_NODE) {
                    return false;
                }
                traversal(el, selector);
            }

            return targetDom;
        };

        return traversal(el, selector);
    };
    u.contains = function(parent, el) {
        var mark = false;
        if (el === parent) {
            mark = true;
            return mark;
        } else {
            do {
                el = el.parentNode;
                if (el === parent) {
                    mark = true;
                    return mark;
                }
            } while (el === document.body || el === document.documentElement);

            return mark;
        }

    };
    u.remove = function(el) {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    };
    u.attr = function(el, name, value) {
        if (!u.isElement(el)) {
            console.warn('$api.attr Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length == 2) {
            return el.getAttribute(name);
        } else if (arguments.length == 3) {
            el.setAttribute(name, value);
            return el;
        }
    };
    u.removeAttr = function(el, name) {
        if (!u.isElement(el)) {
            console.warn('$api.removeAttr Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length === 2) {
            el.removeAttribute(name);
        }
    };
    u.hasCls = function(el, cls) {
        if (!u.isElement(el)) {
            console.warn('$api.hasCls Function need el param, el param must be DOM Element');
            return;
        }
        if (el.className.indexOf(cls) > -1) {
            return true;
        } else {
            return false;
        }
    };
    u.addCls = function(el, cls) {
        if (!u.isElement(el)) {
            console.warn('$api.addCls Function need el param, el param must be DOM Element');
            return;
        }
        if ('classList' in el) {
            el.classList.add(cls);
        } else {
            var preCls = el.className;
            var newCls = preCls + ' ' + cls;
            el.className = newCls;
        }
        return el;
    };
    u.removeCls = function(el, cls) {
        if (!u.isElement(el)) {
            console.warn('$api.removeCls Function need el param, el param must be DOM Element');
            return;
        }
        if ('classList' in el) {
            el.classList.remove(cls);
        } else {
            var preCls = el.className;
            var newCls = preCls.replace(cls, '');
            el.className = newCls;
        }
        return el;
    };
    u.toggleCls = function(el, cls) {
        if (!u.isElement(el)) {
            console.warn('$api.toggleCls Function need el param, el param must be DOM Element');
            return;
        }
        if ('classList' in el) {
            el.classList.toggle(cls);
        } else {
            if (u.hasCls(el, cls)) {
                u.removeCls(el, cls);
            } else {
                u.addCls(el, cls);
            }
        }
        return el;
    };
    u.val = function(el, val) {
        if (!u.isElement(el)) {
            console.warn('$api.val Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length === 1) {
            switch (el.tagName) {
                case 'SELECT':
                    var value = el.options[el.selectedIndex].value;
                    return value;
                    break;
                case 'INPUT':
                    return el.value;
                    break;
                case 'TEXTAREA':
                    return el.value;
                    break;
            }
        }
        if (arguments.length === 2) {
            switch (el.tagName) {
                case 'SELECT':
                    el.options[el.selectedIndex].value = val;
                    return el;
                    break;
                case 'INPUT':
                    el.value = val;
                    return el;
                    break;
                case 'TEXTAREA':
                    el.value = val;
                    return el;
                    break;
            }
        }

    };
    u.prepend = function(el, html) {
        if (!u.isElement(el)) {
            console.warn('$api.prepend Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('afterbegin', html);
        return el;
    };
    u.append = function(el, html) {
        if (!u.isElement(el)) {
            console.warn('$api.append Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('beforeend', html);
        return el;
    };
    u.before = function(el, html) {
        if (!u.isElement(el)) {
            console.warn('$api.before Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('beforebegin', html);
        return el;
    };
    u.after = function(el, html) {
        if (!u.isElement(el)) {
            console.warn('$api.after Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('afterend', html);
        return el;
    };
    u.html = function(el, html) {
        if (!u.isElement(el)) {
            console.warn('$api.html Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length === 1) {
            return el.innerHTML;
        } else if (arguments.length === 2) {
            el.innerHTML = html;
            return el;
        }
    };
    u.text = function(el, txt) {
        if (!u.isElement(el)) {
            console.warn('$api.text Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length === 1) {
            return el.textContent;
        } else if (arguments.length === 2) {
            el.textContent = txt;
            return el;
        }
    };
    u.offset = function(el) {
        if (!u.isElement(el)) {
            console.warn('$api.offset Function need el param, el param must be DOM Element');
            return;
        }
        var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

        var rect = el.getBoundingClientRect();
        return {
            l: rect.left + sl,
            t: rect.top + st,
            w: el.offsetWidth,
            h: el.offsetHeight
        };
    };
    u.css = function(el, css) {
        if (!u.isElement(el)) {
            console.warn('$api.css Function need el param, el param must be DOM Element');
            return;
        }
        if (typeof css == 'string' && css.indexOf(':') > 0) {
            el.style && (el.style.cssText += ';' + css);
        }
    };
    u.cssVal = function(el, prop) {
        if (!u.isElement(el)) {
            console.warn('$api.cssVal Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length === 2) {
            var computedStyle = window.getComputedStyle(el, null);
            return computedStyle.getPropertyValue(prop);
        }
    };
    u.jsonToStr = function(json) {
        if (typeof json === 'object') {
            return JSON && JSON.stringify(json);
        }
    };
    u.strToJson = function(str) {
        if (typeof str === 'string') {
            return JSON && JSON.parse(str);
        }
    };
    u.setStorage = function(key, value) {
        if (arguments.length === 2) {
            var v = value;
            if (typeof v == 'object') {
                v = JSON.stringify(v);
                v = 'obj-' + v;
            } else {
                v = 'str-' + v;
            }
            var ls = uzStorage();
            if (ls) {
                ls.setItem(key, v);
            }
        }
    };
    u.getStorage = function(key) {
        var ls = uzStorage();
        if (ls) {
            var v = ls.getItem(key);
            if (!v) {
                return;
            }
            if (v.indexOf('obj-') === 0) {
                v = v.slice(4);
                return JSON.parse(v);
            } else if (v.indexOf('str-') === 0) {
                return v.slice(4);
            }
        }
    };
    u.rmStorage = function(key) {
        var ls = uzStorage();
        if (ls && key) {
            ls.removeItem(key);
        }
    };
    u.clearStorage = function() {
        var ls = uzStorage();
        if (ls) {
            ls.clear();
        }
    };
    u.uzStorage=function(){
        return uzStorage();
    };
    u.fixIos7Bar = function(el) {
        return u.fixStatusBar(el);
    };
    u.fixStatusBar = function(el) {
        if (!u.isElement(el)) {
            console.warn('$api.fixStatusBar Function need el param, el param must be DOM Element');
            return 0;
        }
        el.style.paddingTop = api.safeArea.top + 'px';
        return el.offsetHeight;
    };
    u.fixTabBar = function(el) {
        if (!u.isElement(el)) {
            console.warn('$api.fixTabBar Function need el param, el param must be DOM Element');
            return 0;
        }
        el.style.paddingBottom = api.safeArea.bottom + 'px';
        return el.offsetHeight;
    };
    u.toast = function(title, text, time) {
        var opts = {};
        var show = function(opts, time) {
            api.showProgress(opts);
            setTimeout(function() {
                api.hideProgress();
            }, time);
        };
        if (arguments.length === 1) {
            var time = time || 500;
            if (typeof title === 'number') {
                time = title;
            } else {
                opts.title = title + '';
            }
            show(opts, time);
        } else if (arguments.length === 2) {
            var time = time || 500;
            var text = text;
            if (typeof text === "number") {
                var tmp = text;
                time = tmp;
                text = null;
            }
            if (title) {
                opts.title = title;
            }
            if (text) {
                opts.text = text;
            }
            show(opts, time);
        }
        if (title) {
            opts.title = title;
        }
        if (text) {
            opts.text = text;
        }
        time = time || 500;
        show(opts, time);
    };
    u.post = function( /*url,data,fnSuc,dataType*/ ) {
        var argsToJson = parseArguments.apply(null, arguments);
        var json = {};
        var fnSuc = argsToJson.fnSuc;
        argsToJson.url && (json.url = argsToJson.url);
        argsToJson.data && (json.data = argsToJson.data);
        if (argsToJson.dataType) {
            var type = argsToJson.dataType.toLowerCase();
            if (type == 'text' || type == 'json') {
                json.dataType = type;
            }
        } else {
            json.dataType = 'json';
        }
        json.method = 'post';
        json.encode = false;
        api.ajax(json,
            function(ret, err) {
                if (ret) {
                    fnSuc && fnSuc(ret);
                }
            }
        );
    };
    u.get = function( /*url,fnSuc,dataType*/ ) {
        var argsToJson = parseArguments.apply(null, arguments);
        var json = {};
        var fnSuc = argsToJson.fnSuc;
        argsToJson.url && (json.url = argsToJson.url);
        if (argsToJson.dataType) {
            var type = argsToJson.dataType.toLowerCase();
            if (type == 'text' || type == 'json') {
                json.dataType = type;
            }
        } else {
            json.dataType = 'text';
        }
        json.encode = false;
        json.method = 'get';
        api.ajax(json,
            function(ret, err) {
                if (ret) {
                    fnSuc && fnSuc(ret);
                }
            }
        );
    };
    /*end*/
    window.$api = u;
})(window);

/*自定义函数*/
/*提示错误*/
function error() {
    window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
        alert("错误信息：" + errorMessage + "出错行号：" + lineNumber + "出错文件：" + scriptURI + "错误详情：" + errorObj);
    };
}

function urlencode(str) {
    return encodeURIComponent(str);
}

function urldecode(str){
    return decodeURIComponent(str);
}

function ddSerialize(obj) {
    var s = '';
    for (var i in obj) {
        s += '&' + i + '=' + urlencode(obj[i]);
    }
    return s;
}

function getJson(url,tip,callback,cachetime){
    getAjax(url, callback, tip, cachetime);
}

/*get请求，30秒超时后有回调*/
function getAjax(url, callback, tip, cachetime, type) {
    if(url.indexOf(URL1)==0 && ((typeof URL2URL!='undefined' && URL2URL==1) || (typeof appInfo.url2url!='undefined' && appInfo.url2url==1))){
        url=URL+'plugin.php?mod='+APP_FRAME+'&act=api&fun=url2url&url='+urlencode(url);
    }
    if (typeof tip == 'undefined') {
        tip = '努力加载中...';
    }
    type = type || 'json';
    cachetime = cachetime || 0;
    if (cachetime > 0) {
        var signature = api.require('signature');
        var md5Key = signature.md5Sync({
            'data': url,
            'uppercase': false
        });
        window.cacheKeyArr.push(md5Key);

        var ret = get(md5Key);
        if (ret) {
            if (type == 'json') {
                ret = JSON.parse(ret);
            }
            callback(ret,1);
            return true;
        }
    }
    if (tip != '') {
        toastOpen(tip,30000);
    }
    url=addUrlParam(url);
    var pid=setTimeout(function(){
        callback({'s':0,'r':'','error':2});
    },30000);
    console.log(url);
    $api.get(url, function(ret) {
        if (tip != '') {
            toastClose();
        }
        if (type == "json") {
            try {
                var _ret=ret;
                ret = JSON.parse(ret);
                if (cachetime > 0) {
                    set(md5Key, _ret, cachetime);
                }
            } catch (e) {
                //alerta(e);
                //alerta(ret);
                ret = {
                    's': 0,
                    'r': '',
                    'error': 1
                };
            }
            clearTimeout(pid);
            callback(ret,0);
        } else {
            if (cachetime > 0) {
                set(md5Key, ret, cachetime);
            }
            clearTimeout(pid);
            callback(ret,0);
        }
    }, 'text');
}

/*post请求*/
function postAjax(url, data, callback,tip, type, files) {
    files = files || {};
    type = type || 'json';
    if(tip!=''){
        toastOpen(tip);
    }
    url=addUrlParam(url);
    $api.post(url, {
        values: data,
        files: files
    }, function(ret) {
        if(tip!=''){
            toastClose();
        }
        callback(ret);
    }, type);
}

/*提示框，duration(单位毫秒)必须规定时间，否则是一直存在*/
function toastOpen(title, duration, callback) {
    if(typeof duration=='undefined'){
        duration=2000;
    }
    api.showProgress({
        title: title,
        text: '',
        modal: false
    });
    if (duration > 0) {
        setTimeout(function() {
            if (typeof callback == 'function') {
                callback();
            }
            api.hideProgress();
        }, duration);
    }
}

function toast(title,time,callback){
    time=time||1000;
    api.toast({
        msg: title,
        duration: time,
        location: 'middle'
    });
    if(typeof callback=='function'){
        setTimeout(function(){
            callback();
        },time);
    }
}

function toastClose() {
    api.hideProgress();
}

/*加载js代码*/
function loadJsCode(code, callback) {
    code = code.replace('<script>', '').replace(/<\/script>$/, '');
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.appendChild(document.createTextNode(code));
    document.body.appendChild(script);
}

/*加载css代码*/
function loadCssCode(code) {
    code = code.replace('<style>', '').replace(/<\/style>$/, '');
    var style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.appendChild(document.createTextNode(code));
    document.head.appendChild(style);
}

/*
整数格式化
*/
function ddInt(s, type) {
    if (s == null || s == 'null' || s == '' || isNaN(s)) {
        return 0;
    } else {
        type = type || 0;
        var a = parseFloat(s);
        if (type == 1) {
            a = Math.round(a);
        } else {
            a = parseInt(s, 10);
        }
        return a;
    }
}

/*
浮点数格式化
*/
function ddFloat(s) {
    if (s == null || s == 'null' || s == '') {
        return 0;
    } else {
        return parseFloat(s, 10);
    }
}

/*
求对象长度
*/
function size(obj) {
    var size = 0;
    for (var i in obj) {
        size++;
    }
    return size;
}

/*
计数器，最大值65536
*/
var getPID = function() {
    var maxId = 65536;
    var uid = 0;
    return function() {
        uid = (uid + 1) % maxId;
        return uid;
    };
}();

/*
求时间戳
type：1精确到秒时间戳，2精确到毫秒的时间戳
proof：是否需要和服务器校对时间
*/
function time(type,proof) {
    proof=proof||0;
    type = type || 1;
    if (type == 1) {
        var t = Date.parse(new Date()) / 1000;
    } else {
        var t = new Date().getTime();
    }
    if(proof==1 && api){
        if(type==1){
            t=t+ddInt(get('DD_proofTime'));
        }else{
            t=t+ddInt(get('DD_proofTime'))*1000;
        }
    }
    return t;
}

/*
时间格式化
var myDate = new Date();
myDate.format('YYYY-mm-dd HH:ii:ss');
*/
Date.prototype.format = function(format) {
    /*
     * eg:format="YYYY-mm-dd HH:ii:ss";
     */
    format = format || 'YYYY-mm-dd HH:ii:ss';
    var o = {
        "m+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "i+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };

    if (/(Y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

/* 和PHP一样的时间戳格式化函数
@param  {string} format    格式
@param  {int}    timestamp 要格式化的时间 默认为当前时间
@return {string}           格式化的时间字符串*/
function date(format, timestamp) {
    timestamp=timestamp||time(1);
    var a, jsdate = ((timestamp) ? new Date(timestamp * 1000) : new Date());
    var pad = function(n, c) {
        if ((n = n + "").length < c) {
            return new Array(++c - n.length).join("0") + n;
        } else {
            return n;
        }
    };
    var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var txt_ordin = {
        1: "st",
        2: "nd",
        3: "rd",
        21: "st",
        22: "nd",
        23: "rd",
        31: "st"
    };
    var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var f = {
        d: function() {
            return pad(f.j(), 2);
        },
        D: function() {
            t = f.l();
            return t.substr(0, 3);
        },
        j: function() {
            return jsdate.getDate();
        },
        l: function() {
            return txt_weekdays[f.w()];
        },
        N: function() {
            return f.w() + 1;
        },
        S: function() {
            return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th';
        },
        w: function() {
            return jsdate.getDay();
        },
        z: function() {
            return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0;
        },
        W: function() {
            var a = f.z(),
                b = 364 + f.L() - a;
            var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
            if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
                return 1;
            } else {
                if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
                    nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                    return date("W", Math.round(nd2.getTime() / 1000));
                } else {
                    return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                }
            }
        },
        F: function() {
            return txt_months[f.n()];
        },
        m: function() {
            return pad(f.n(), 2);
        },
        M: function() {
            t = f.F();
            return t.substr(0, 3);
        },
        n: function() {
            return jsdate.getMonth() + 1;
        },
        t: function() {
            var n;
            if ((n = jsdate.getMonth() + 1) == 2) {
                return 28 + f.L();
            } else {
                if (n & 1 && n < 8 || !(n & 1) && n > 7) {
                    return 31;
                } else {
                    return 30;
                }
            }
        },
        L: function() {
            var y = f.Y();
            return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0;
        },
        Y: function() {
            return jsdate.getFullYear();
        },
        y: function() {
            return (jsdate.getFullYear() + "").slice(2);
        },
        a: function() {
            return jsdate.getHours() > 11 ? "pm" : "am";
        },
        A: function() {
            return f.a().toUpperCase();
        },
        B: function() {
            var off = (jsdate.getTimezoneOffset() + 60) * 60;
            var theSeconds = (jsdate.getHours() * 3600) +
                (jsdate.getMinutes() * 60) +
                jsdate.getSeconds() + off;
            var beat = Math.floor(theSeconds / 86.4);
            if (beat > 1000) beat -= 1000;
            if (beat < 0) beat += 1000;
            if ((String(beat)).length == 1) beat = "00" + beat;
            if ((String(beat)).length == 2) beat = "0" + beat;
            return beat;
        },
        g: function() {
            return jsdate.getHours() % 12 || 12;
        },
        G: function() {
            return jsdate.getHours();
        },
        h: function() {
            return pad(f.g(), 2);
        },
        H: function() {
            return pad(jsdate.getHours(), 2);
        },
        i: function() {
            return pad(jsdate.getMinutes(), 2);
        },
        s: function() {
            return pad(jsdate.getSeconds(), 2);
        },
        O: function() {
            var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
            if (jsdate.getTimezoneOffset() > 0) t = "-" + t;
            else t = "+" + t;
            return t;
        },
        P: function() {
            var O = f.O();
            return (O.substr(0, 3) + ":" + O.substr(3, 2));
        },
        c: function() {
            return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P();
        },
        U: function() {
            return Math.round(jsdate.getTime() / 1000);
        }
    };
    return format.replace(/[\\]?([a-zA-Z])/g, function(t, s) {
        if (t != s) {
            ret = s;
        } else if (f[s]) {
            ret = f[s]();
        } else {
            ret = s;
        }
        return ret;
    });
}

function styleOnload(node, callback) {
    if (node.attachEvent) {
        node.attachEvent('onload', callback);
    }
    else {
        setTimeout(function() {
            poll(node, callback);
        },
        0);
    }
}

function poll(node, callback) {
    if (callback.isCalled) {
        return;
    }
    var isLoaded = false;
    if (/webkit/i.test(navigator.userAgent)) {
        if (node['sheet']) {
            isLoaded = true;
        }
    }
    else if (node['sheet']) {
        try {
            if (node['sheet'].cssRules) {
                isLoaded = true;
            }
        } catch(ex) {
            if (ex.code === 1000) {
                isLoaded = true;
            }
        }
    }
    if (isLoaded) {
        setTimeout(function() {
            callback();
        },
        1);
    } else {
        setTimeout(function() {
            poll(node, callback);
        },
        1);
    }
}

/*加载css文件*/
function loadStyle(css, head, callback) {
    if(css.indexOf('/css')==0){
        if(api.systemType=='ios'){
            css='widget:/'+css;
        }else{
            css='../..'+css;
        }
    }
    if (typeof head == 'undefined' || head == '') {
        var head = document.getElementsByTagName('head')[0];
    }
    var link = document.createElement('link');
    link.href = css;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    head.appendChild(link);
    if (typeof callback == 'function') {
        styleOnload(link, function() {
            callback();
        });
    }
}

/*
是否存在数组（对象）中
*/
function inArray(v, arr) {
    var l = arr.length;
    for (i = 0; i < l; i++) {
        if (arr[i] == v) {
            return i;
        }
    }
    return -1;
}

/*动态加载js*/
var loadScript = {
    jsArr: [],
    go: function(js, callback, css) {
        var _this = this;
        css = css || '';
        if(js.indexOf('/script')==0){
            if(api.systemType=='ios'){
                js='widget:/'+js;
            }else{
                js='../..'+js;
            }
        }
        if (inArray(js, _this.jsArr) < 0) {
            _this.onload(js, callback, css);
        } else {
            _this.back(callback);
        }
    },
    onload: function(js, callback, css) {
        var _this = this;
        var head = document.getElementsByTagName('head')[0];
        if (css != '') {
            loadStyle(css, head);
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = js;
        head.appendChild(script);
        script.onload = function() {
            _this.jsArr.push(js);
            _this.back(callback);
        }
    },
    back: function(callback) {
        if (typeof callback == 'function') {
            callback();
        }
    }
};

/*打开窗口*/
function openWin(obj) {
    if (obj.mod == 'root' && obj.act == 'header') {
        var mod = obj.pageParam.mod;
        var act = obj.pageParam.act;
    } else {
        var mod = obj.mod;
        var act = obj.act;
    }
    if(APP_TAG=='' || HUNXIAO==0){
        var tag='';
    }else{
        var tag='-'+APP_TAG;
    }
    obj.randName = obj.randName || '';
    obj.url = obj.mod + '/' + obj.act + tag+'.html';

    var fs_url='fs://template/'+TPL_NAME+'_'+TPL_VERSION+'/html/' + obj.url;
    if (get('DD_tplVerson') >= TPL_VERSION_NUM && fileExists(fs_url)) {
        obj.url = fs_url;
    }else{
        if (typeof ROOT != 'undefined' && ROOT == 1) {
            if(api.systemType=='ios'){
                obj.url = 'widget://'+DEVELOP_HTML+'/' + obj.url;
            }else{
                obj.url = DEVELOP_HTML+'/' + obj.url;
            }
        } else {
            if(api.systemType=='ios'){
                obj.url = 'widget://'+DEVELOP_HTML+'/' + obj.url;
            }else{
                obj.url = '../' + obj.url;
            }
        }
    }

    if (obj.randName != '') {
        obj.randName = '_' + obj.randName;
    }
    obj.name = mod + '_' + act + obj.randName;
    /*var winName = get('DD_winName');
    if (winName == '') {
        winName = [];
    }
    winName.push(obj.name);
    set('DD_winName', winName);*/
    obj.pageParam = obj.pageParam || {};
    if (typeof window.pageParam == 'object') {
        for (var i in window.pageParam) {
            obj.pageParam[i] = window.pageParam[i];
            delete window.pageParam[i];
        }
    }
    if(api.systemType=='ios' || api.systemType=='android'){
        if(typeof api.pageParam.curPageBarColor=='undefined'){
            alert(window.location.href+'当前页面状态栏颜色未定义');
        }else { /*告诉下一个页面，上一个页面的状态栏颜色*/
            obj.pageParam.lastPageBarColor=api.pageParam.curPageBarColor;
        }
        if(typeof api.pageParam.barColor=='undefined' || api.pageParam.barColor==''){ /*设置下一个页面的状态栏颜色*/
            api.pageParam.barColor='dark';/*默认为黑色*/
        }
        obj.pageParam.barColor=api.pageParam.barColor;
    }
    api.pageParam.barColor='';
    obj.animation = obj.animation || {
        type: "push",
        subType: "from_right",
        duration: 300
    };
    obj.softInputMode = obj.softInputMode || 'resize';
    obj.softInputDismissMode = obj.softInputDismissMode || "['tap']";
    /*obj.customRefreshHeader = obj.customRefreshHeader || 'UIPullRefresh';*/
    obj.bounces = obj.bounces || false;
    obj.useWKWebView = false;
    obj.reload = obj.reload || true;
    if (typeof obj.slidBackEnabled == 'undefined') {
        obj.slidBackEnabled = true;
    }

    api.openWin({
        name: obj.name,
        url: obj.url,
        pageParam: obj.pageParam,
        bounces: obj.bounces,
        animation: obj.animation,
        softInputMode: obj.softInputModesoftInputMode,
        softInputDismissMode: obj.softInputDismissMode,
        customRefreshHeader: obj.customRefreshHeader,
        slidBackEnabled: obj.slidBackEnabled,
        useWKWebView: obj.useWKWebView,
        reload: obj.reload,
        pageParam: obj.pageParam,
        allowEdit:true
    });
}

function setPageParam(k, v) {
    if (typeof window.pageParam != 'object') {
        window.pageParam = {};
    }
    window.pageParam[k] = v;
}

/*打开浮动层*/
function openFrame(obj) {
    if(APP_TAG=='' || HUNXIAO==0){
        var tag='';
    }else{
        var tag='-'+APP_TAG;
    }
    obj.url = obj.mod + '/' + obj.act+ tag + '.html';

    var fs_url='fs://template/'+TPL_NAME+'_'+TPL_VERSION+'/html/' + obj.url;
    if (get('DD_tplVerson') >= TPL_VERSION_NUM && fileExists(fs_url)) {
        obj.url=fs_url;
    } else {
        if (typeof ROOT != 'undefined' && ROOT == 1) {
            if(api.systemType=='ios'){
                obj.url = 'widget://'+DEVELOP_HTML+'/' + obj.url;
            }else{
                obj.url = DEVELOP_HTML+'/' + obj.url;
            }
        } else {
            if(api.systemType=='ios'){
                obj.url = 'widget://'+DEVELOP_HTML+'/' + obj.url;
            }else{
                obj.url = '../' + obj.url;
            }
        }
    }
    obj.name = obj.mod + '_' + obj.act;
    obj.pageParam = obj.pageParam || {};
    if (typeof window.pageParam == 'object') {
        for (var i in window.pageParam) {
            obj.pageParam[i] = window.pageParam[i];
        }
    }
    for (var i in api.pageParam) {
        obj.pageParam[i] = api.pageParam[i];
    }
    obj.animation = obj.animation || {
        "type": "none",
        "duration": 0
    };
    if (typeof obj.id != 'undefined') {
        var offset = $api.offset($api.dom('#' + obj.id));
        obj.rect = {
            'x': offset.l,
            'y': offset.t,
            'w': offset.w,
            'h': offset.h
        };
    }
    obj.softInputMode = obj.softInputMode || 'resize';
    obj.softInputDismissMode = obj.softInputDismissMode || "['tap']";
    /*obj.customRefreshHeader = obj.customRefreshHeader || 'UIPullRefresh';*/
    obj.bounces = obj.bounces || false;
    if(typeof obj.bgColor=='undefined'){
        obj.bgColor = '#FFFFFF';
    }
    /* if (typeof obj.useWKWebView == 'undefined') {
    //     obj.useWKWebView = true;
    // }*/
    if(inArray(obj.mod+'_'+obj.act,useWKWebViewFrame)>=0){
        obj.useWKWebView = true;
    }else{
        obj.useWKWebView = false;
    }
    obj.reload = obj.reload || true;
    api.openFrame({
        name: obj.name,
        url: obj.url,
        rect: obj.rect,
        bounces: obj.bounces,
        animation: obj.animation,
        softInputMode: obj.softInputModesoftInputMode,
        softInputDismissMode: obj.softInputDismissMode,
        customRefreshHeader: obj.customRefreshHeader,
        useWKWebView: obj.useWKWebView,
        reload: obj.reload,
        pageParam: obj.pageParam,
        bgColor: obj.bgColor,
        allowEdit:true
    });
}

/*打开页面*/
function openPage(mod, act, randName, header, animation,title) {
    if(typeof mod=='object'){
        var act=mod[1];
        var title=mod[2];
        var randName=mod[3];
        var header=mod[4];
        var animation=mod[5];
        var mod=mod[0];
    }
    if(typeof title!='undefined'){
        api.setGlobalData({
            key: 'title',
            value: title
        });
    }
    if (mod.indexOf('!') == 0) {
        var user = checkLogin();
        if (user === false) {
            return false;
        }
        mod = mod.replace('!', '');
    }
    randName = randName || '';
    if (typeof header == 'undefined' || header == 1) {
        header = 1;
    } else {
        header = 0;
    }
    if (act.indexOf('_header') > 0) {
        openWin({
            "mod": mod,
            "act": act,
            'randName': randName,
            "animation": animation,
            "pageParam": {
                "header": header
            }
        });
    } else {
        openWin({
            "mod": "root",
            "act": "header",
            'randName': randName,
            "animation": animation,
            "pageParam": {
                'mod': mod,
                "act": act,
                "header": header
            }
        });
    }
}

/*头部窗口固定代码*/
function headerFuns(type) {
    /*var DD_winName = get('DD_winName');*/
    if(api.systemType=='android' && BAR_COLOR==0){
        document.body.appendHTML('<div style="position:fixed;top:0;width:100%;height:' + get('safeAreaTop') + 'px;background-color:#000000">&nbsp;</div>');
    }
    var curWinName = api.winName;
    type = type || 'page';
    var headerShow = api.pageParam.header;
    if (headerShow == 1) {
        $api.dom('header').style.display = 'block';
    }
    $api.fixStatusBar($api.dom('header'));
    $api.fixTabBar($api.byId('footer'));
    setStatusBarStyle(api.pageParam.barColor);
    api.pageParam.barColor='';

    if (type == 'page') {
        var offset = $api.offset($api.dom('#main'));
        var rect={'marginLeft':0,'marginTop':offset.t,'marginRight':0,'marginBottom':$api.byId('footer').offsetHeight};
        mod = api.pageParam.mod;
        act = api.pageParam.act;
        openFrame({
            'rect': rect,
            'mod': mod,
            'act': act + '_frm'
        });
    }

    api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        if (typeof window.pop != 'undefined' && window.pop != '') {
            api.closeFrame({
                name: window.pop
            });
            window.pop='';
            return false;
        }
        leftClick();
    });

    /*A窗口覆盖B窗口，A窗口会隐藏，触发消失，这个现象是不想看到的，因为只有通过这个方法才能判断苹果下侧滑关闭

    //判断当前窗口是不是最上层，如果是，说明是关闭窗口

    //appInterface作用：苹果依赖窗口消失判断被关闭了，从而修改状态栏颜色，如果是打开组件，页面会消失，从而会触发关闭回调，这个是不想看到的
    //所以再打开组件前，定义这个参数，成功打开组件后，再清空这个参数*/
    api.addEventListener({
        name: 'viewdisappear'
    }, function(ret, err) {
        if (api.systemType == 'ios') {
            if(typeof appInterface=='undefined'){
                appInterface='';
            }
            var windows=getWindowsName();
            if (appInterface=='' && windows[windows.length-2] && windows[windows.length-2].name!=api.winName) {
                setStatusBarStyle(api.pageParam.lastPageBarColor);
            }
        }
    });
}

function getWindowsName(){  /*安卓和苹果获取windows名字的顺序不一样，苹果是正的（开一个页面，入栈一个），安卓是反的，但是不敢确定安卓都是反的（因为这种结果反常理），所以做了判断，按照root判断是正序还是倒叙*/
    var windows=api.windows();
    if(windows[0].name!='root'){ /*说明是倒叙*/
        windows=windows.reverse();
    }
    return windows;
}

/*关闭窗口*/
function closeWin(obj) {
    obj = obj || {};
    /*苹果依赖窗口消失监听方法，否则会触发2次*/
    if (api.systemType == 'android') {
       /* var DD_winName = get('DD_winName');
        if (typeof DD_winName == 'object') {
            for (var i in DD_winName) {
                if (api.winName == DD_winName[i]) {
                    DD_winName.splice(i, 1);
                }
            }
            set('DD_winName', DD_winName);
        }*/
    }
    api.closeWin(obj);
}

/* 仅对Storage进行缓存，setPrefs默认就是永久有效*/
function set(key, val, cachetime) {
    if(api.systemType=='ios' && (key=='userInfo' || key=='appInfo' || key=='siteInfo')){
        api.writeFile({
            path: 'fs://'+key+'.json',
            data: JSON.stringify(val)
        }, function(ret, err) {

        });
        return true;
    }
    var _key=key;
    if(typeof key=='object'){
        return false;
    }
    cachetime = cachetime || 86400 * 365;
    var isLocalData = key.match(/^[A-Z]/);
    if(key.length<=30){
        key = APP_TAG + key;
    }
    if (isLocalData) {
        val = JSON.stringify(val);
        api.setPrefs({
            'key': key,
            'value': val
        });
        $api.setStorage(key, val);
    } else {
        if (typeof val == 'number') {
            val = String(val);
        }
        if (typeof val == 'string') {
            var endTime = time() + cachetime;
            val = endTime + '|' + val;
        }
        try{
            $api.setStorage(key, val);
        }catch(e){
            clear(1);
            $api.setStorage(key, val);
        }
    }
}

function get(key, del) {
    if(typeof key=='object'){
        return false;
    }
    if(api.systemType=='ios' && (key=='userInfo' || key=='appInfo' || key=='siteInfo')){
        var val = api.readFile({
            sync: true,
            path: 'fs://'+key+'.json'
        });
        if(val==''){
            val = $api.getStorage(key);
        }
        try{
            val=JSON.parse(val);
        }catch(e){
            val ='';
        }
        return val;
    }
    del = del || 0;
    var isLocalData = key.match(/^[A-Z]/);
    if(key.length<=30){
        key = APP_TAG + key;
    }
    if (isLocalData) {
        var val = api.getPrefs({
            sync: true,
            key: key
        });
        if(!val){
            val = $api.getStorage(key);
        }
        try {
            val = JSON.parse(val);
        } catch (e) {
            val = '';
        }
        if (del == 1) {
            api.removePrefs({
                key: key
            });
        }
    } else {
        var val = $api.getStorage(key);
        if (typeof val == 'undefined' || val == 'undefined' || val == undefined) {
            val = '';
        }
        if (typeof val == 'string' && val != '') {
            try{
                var a = val.match(/(\d{10})\|/);
                val = val.replace(a[0], '');
                if (ddFloat(a[1]) < time()) {
                    val = '';
                    $api.rmStorage(key);
                }
            }catch(e){
                val='';
                $api.rmStorage(key);
            }
        }
        if (del == 1) {
            $api.rmStorage(key);
        }
    }
    return val;
}

function del(key) {
    if(api.systemType=='ios' && (key=='userInfo' || key=='appInfo' || key=='siteInfo')){
        set(key,'');
        return false;
    }
    var _key=key;
    var isLocalData = key.match(/^[A-Z]/);
    if(key.length<=30){
        key = APP_TAG + key;
    }
    if (isLocalData) {
        api.removePrefs({
            key: key
        });
        $api.rmStorage(key);
    } else {
        $api.rmStorage(key);
    }
}

/*
0获取当前缓存，检查是否过期，过期就删除
1删除全部缓存
2删除当前页面的缓存
*/
function clear(type) {
    type=type||0;
    var storage = window.localStorage;
    if(type==2){
        for(var i in window.cacheKeyArr){
            storage.removeItem(window.cacheKeyArr[i]);
        }
    }else{
        for (var i in storage) {
            if(i.length>30){
                if(type==0){
                    get(i);
                }
                else if(type==1){
                    storage.removeItem(i);
                }
            }
        }
    }
}

function checkLogin(jump) {
    var user = get('userInfo');
    if (user == '' || typeof user != 'object' || typeof user.id == 'undefined' || user.id == 0) {
        if(jump === 1){
            toast('请先登录', 500, function() {
                openPage('user', 'login');
            });
        }
        return false;
    } else {
        if (typeof jump == 'function') {
            jump();
        } else {
            return user;
        }
    }
}

/*设置标题和回调*/
function setTitle(title, callback) {
    callback = callback || 0;
    api.execScript({
        name: '',
        frameName: '',
        script: "setWinTitle('" + title + "'," + callback + ")"
    });
}

/*设置右侧文字和回调*/
function setRight(html, callback) {
    callback = callback || 0;
    api.execScript({
        name: '',
        frameName: '',
        script: "setWinRight('" + html + "'," + callback + ")"
    });
}

/*设置左侧文字和回调*/
function setLeft(html, callback) {
    callback = callback || 0;
    api.execScript({
        name: '',
        frameName: '',
        script: "setWinLeft('" + html + "'," + callback + ")"
    });
}

/*
网址和对象拼接
p：可以是对象，也可以是参数链
*/
function ddJoin(url, p) {
    p = p || '';
    if (typeof p == 'object') {
        p = ddSerialize(p);
    }
    if (url.indexOf('?') < 0) {
        p = '?' + p;
    }
    url += p;
    return url;
}

/*用于获取官方数据*/
function buildUrl(mod, data) {
    data = data || {};
    var _data=clone(data);
    _data['url'] = URL2;
    var signature = api.require('signature');
    var md5Key = signature.md5Sync({
        'data': YUN_KEY,
        'uppercase': false
    });
    _data['key'] = md5Key;
    if (mod.indexOf('http') == 0) {
        var url=ddJoin(mod + '?', _data);
    } else {
        _data['mod'] = mod;
        var url=ddJoin(URL1 + 'page/cms.php?', _data);
    }
    return url;
}

/*用于获取独立数据*/
function createUrl(act,fun, data) {
    if(typeof data=='undefined'){
        fun = fun || {};
        data=fun;
        data['act'] = act;
    }else{
        data = data || {};
        data['act'] = act;
        data['fun'] = fun;
    }
    return ddJoin(URL + 'plugin.php?mod=' + APP_FRAME, data);
}

function openAlert(title, callback) {
    if (api.systemType == 'ios') {
        var msg = '';
    } else {
        var msg = title;
        title = "提示";
    }
    api.alert({
        title: title,
        msg: msg,
    }, function(ret, err) {
        if (typeof callback == 'function') {
            callback();
        }
    });
}

function openPrompt(title,msg,button,callback){
    button = button || ['取消', '确定'];
    if(api.systemType=='android'){
        button.reverse();
    }
    api.prompt({
        title:title,
        msg:msg,
        buttons: button
    }, function(ret, err) {
        if(api.systemType=='android'){
            var index = button.length-ret.buttonIndex+1;
        }else{
            var index = ret.buttonIndex;
        }
        callback(index,ret.text);
    });
}

function openConfirm(title, msg, button, callback) {
    button = button || ['取消', '确定'];
    if(typeof button=='string'){
        button=button.split(',');
    }
    var ci = 0;
    if(api.systemType=='android'){
        button.reverse();
        ci = 1;
    }
    api.confirm({
        title: title,
        msg: msg,
        buttons: button
    }, function(ret, err) {
        if(api.systemType=='android'){
            var index = button.length-ret.buttonIndex+1;
        }else{
            var index = ret.buttonIndex;
        }
        if (button[ci] == '取消') {
            if (index == 2) {
                callback();
            }
        } else {
            callback(index);
        }
    });
}
// function openConfirm(title, msg, button, callback) {
//     button = button || ['取消', '确定'];
//     if(typeof button=='string'){
//         button=button.split(',');
//     }
//     if(button.length>2) {
//         openConfirm0(title, msg, button, callback);
//         return false;
//     }
//     dlAlert({
//         title: title,
//         content: msg,
//         leftBtnText: button[0],
//         rightBtnText: button[1],
//         rightback: callback
//     });
// }

function dlAlert(param) {
    if (!param) {
        param = {};
    }
    if (!param.leftback) {
        param.leftback = function() {};
    }
    if (!param.rightback) {
        param.rightback = function() {};
    }
    var dialogBox = api.require('dialogBox');
    dialogBox.alert({
        texts: {
            title: param.title||'提示',
            content: param.content||'',
            leftBtnTitle: param.leftBtnText||'取消',
            rightBtnTitle: param.rightBtnText||'确认'
        },
        styles: {
            bg: 'rgba(255,255,255,0.9)',
            corner: 5,
            w: 300,
            title: {
                marginT: 20,
                titleSize: 16,
                titleColor: '#000'
            },
            content: {
                marginT: 10,
                marginB: 20,
                color: '#666',
                size: 12
            },
            left: {
                marginB: 0,
                marginL: 0,
                w: 150,
                h: 40,
                corner: 0,
                bg: 'rgba(255,255,255,0)',
                color: param.leftColor || '#007fff',
                size: 14
            },
            right: {
                marginB: 0,
                marginL: 0,
                w: 150,
                h: 40,
                corner: 0,
                bg: 'rgba(255,255,255,0)',
                color: param.rightColor || '#007fff',
                size: 14
            },
            horizontalLine:{
                color:'#e1e1e1',
                height: 1
            },
            verticalLine:{
                color:'#e1e1e1',
                height: 1
            }
        }
    }, function(ret) {
        if (ret.eventType == 'left') {
            param.leftback();
            dialogBox.close({
                dialogName: 'alert'
            });
        } else if (ret.eventType == 'right') {
            param.rightback();
            dialogBox.close({
                dialogName: 'alert'
            });
        }
    });
}

function getBaseInfo() {
    api.appId;
    api.appVersion;
    api.systemType;
    api.systemVersion;
    api.deviceModel;
    api.deviceId;
}

function appVersion(ver) {
  var a = api.appVersion.split('.');
  var version1 = parseInt(a[2]);
  var version2 = parseInt(a[1]);
  var version3 = parseInt(a[0]);
  var version=version3*10000+version2*100+version1;
  if(version==100){
      version=19999;
  }
  return version;
}

function iosShenhe() {
    if(typeof window.ios_shenhe!='undefined'){
        return window.ios_shenhe;
    }
    if(api.systemType=='android'){
        return 0;
    }
    if (navigator.userAgent.indexOf('APICloudStudio2') > 0) {
        return 0;
    }
    if (typeof appInfo == 'undefined') {
        appInfo = get('appInfo');
    }
    if(typeof window.ios_shenhe=='undefined'){
        window.ios_shenhe=0;
    }
    if (appVersion() > appVersion(appInfo.ios_banben) && appInfo.iphone_appstoreing==1) {
        window.ios_shenhe=1;
    } else {
        window.ios_shenhe=0;
    }
    return window.ios_shenhe;
}

/*复制*/
function clipboardGet(callback) {
    var clipBoard = api.require('clipBoard');
    var pid=setTimeout(function(){
        callback('');
    },1000);
    clipBoard.get(function(ret, err) {
        var val='';
        if (ret) {
            val=ret.value;
        }
        clearTimeout(pid);
        callback(val);
    });
}

/*获取剪切板*/
function clipboardSet(val) {
    var clipBoard = api.require('clipBoard');
    clipBoard.set({
        value: val
    }, function(ret, err) {
        if (ret) {
            var md5Key = api.require('signature').md5Sync({
                'data': val
            });
            set('DD_jianqieban',md5Key);
        } else {
        }
    });
}

/*保留两位小数*/
function toFixed(num, num1) {
    num1 = num1 || 2;
    num = parseFloat(num);
    return parseFloat(num.toFixed(num1));
}

/*获取模板函数*/
function getTpl(_function) {
    var tpl = _function.toString();
    tpl = tpl.replace(/function\s*\w+\s*\(\)\s*{\s*\/\*/, '').replace(/\*\/\s*;\s*}$/, '');
    return tpl;
}

/*js模板解析，有个bug，if里的判断，不能写>，需要把数据倒过来写<*/
var barretTpl = function(str, data) {
    if (typeof str == 'function') {
        str = getTpl(str);
    }
    return tplEngine(str, data);

    function tplEngine(tpl, data) {
        var reg = /<%(?!%>+).*?%>/g,
            regOut = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
            code = 'var r=[];\n',
            cursor = 0;

        var add = function(line, js, n) {
            js ? (code += line.match(regOut) ? line + '\n' : 'r.push(' + line + ');\n') : (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return add;
        };

        function setExec(res) {
            if (res && res.length > 0) {
                var a = res[0];
                a = a.replace(/^<%|%>$/g, '');
                res.push(a);
                return res;
            }
        }

        while (match = setExec(reg.exec(tpl))) {
            add(tpl.slice(cursor, match.index))(match[1], true);
            cursor = match.index + match[0].length;
        };
        add(tpl.substr(cursor, tpl.length - cursor));
        code += 'return r.join("");';
        return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
    };
};

/*下拉到底部触发*/
function infinite(callback) {
    api.addEventListener({
        name: 'scrolltobottom',
        extra: {
            threshold: 0 /*设置距离底部多少距离时触发，默认值为0，数字类型*/
        }
    }, function(ret, err) {
        callback();
    });
}

/*下拉刷新，注意，apicloud没有上拉的效果（真TM神奇，很多人反馈给官方。官方就是不做）*/
function setBounce(callback) {
    if (!callback) {
        callback = function() {};
    }
    api.setRefreshHeaderInfo({
        loadingImg: 'widget://image/refresh.png',
        bgColor: '#FFFFFF',
        textColor: '#CCCCCC',
        textDown: '下拉刷新...',
        textUp: '松开刷新...'
    }, function(ret, err) {
        setTimeout(function() {
            api.refreshHeaderLoadDone();
        }, 1000);
        callback();
    });
    /* return false;
    // api.setFrameAttr({
    //     name:api.frameName,
    //     bounces:true,
    // });
    // api.setCustomRefreshHeaderInfo({
    //     bgColor: '#FFFFFF',
    //     image: {
    //         pull:'widget://res/img/refresh/001.png',
    //         transform: [
    //             'widget://res/img/refresh/001.png',
    //             'widget://res/img/refresh/002.png',
    //             'widget://res/img/refresh/003.png',
    //             'widget://res/img/refresh/004.png',
    //             'widget://res/img/refresh/005.png',
    //             'widget://res/img/refresh/006.png',
    //             'widget://res/img/refresh/007.png',
    //             'widget://res/img/refresh/008.png',
    //             'widget://res/img/refresh/009.png',
    //             'widget://res/img/refresh/010.png',
    //             'widget://res/img/refresh/011.png',
    //             'widget://res/img/refresh/012.png',
    //         ],
    //         load: [
    //             'widget://res/img/refresh/001.png',
    //             'widget://res/img/refresh/002.png',
    //             'widget://res/img/refresh/003.png',
    //             'widget://res/img/refresh/004.png',
    //             'widget://res/img/refresh/005.png',
    //             'widget://res/img/refresh/006.png',
    //             'widget://res/img/refresh/007.png',
    //             'widget://res/img/refresh/008.png',
    //             'widget://res/img/refresh/009.png',
    //             'widget://res/img/refresh/010.png',
    //             'widget://res/img/refresh/011.png',
    //             'widget://res/img/refresh/012.png',
    //         ],
    //     }
    // }, function() {
    //     setTimeout(function() {
    //         api.refreshHeaderLoadDone();
    //     }, 1000);
    //     callback();
    // });*/
}

function objKeySort(obj) {
    if (Object.prototype.toString.call(obj) == '[object Object]') {
        var newObj = {};
        var newkey = [];

        for (key in obj) {
            newkey.push(key);
        }
        if (newkey.length == 0) {
            return false;
        }

        newkey.sort(function(a, b) {
            return a.localeCompare(b);
        });

        for (var i = 0; i < newkey.length; i++) {
            newObj[newkey[i]] = obj[newkey[i]];
        }

        return newObj;
    }
}

/*显示全局页面*/
var everyWinFrm = {
    'indexOk':0,
    'fuzhi':function(neirong,callback){
        if(neirong==''){
            callback();
        }else{
            var url=createUrl('goods',{'fun':'tbfenxiang','str':neirong});
            getAjax(url,function(data){
                callback();
            },'',3600);
        }
    },
    'exec': function(data, type) {
        var _this=this;
        clipboardGet(function(neirong){
            if(neirong==null){
                neirong='';
            }
            var jianqieban=get('DD_jianqieban');
            var data = api.require('signature').md5Sync({
                'data': neirong
            });
            if(jianqieban==data){
                neirong='';
            }
            _this.fuzhi(neirong,function(){
                var zhuceTipStatus=0;
                var popTipStatus=0;
                var zhuceTipDay=ddInt(get('DD_zhuceTipDay'));
                var popUpDay=ddInt(get('DD_popUpDay'));
                var today=ddInt(date('Ymd'));
                if(appInfo.hongbao_ad==1 && checkLogin()===false && zhuceTipDay<today){
                    zhuceTipStatus=1;
                }
                if(appInfo.index_pop_up_img && appInfo.index_pop_up_img!='' && popUpDay<today){
                    popTipStatus=1;
                }
                if(neirong!='' || zhuceTipStatus==1 || popTipStatus==1){
                    var name;
                    /*var winName = get('DD_winName');*/
            		var winName=getWindowsName();
                    if (typeof winName == 'object') {
                        var name = winName[winName.length - 1]['name'];
                        if (name == 'page_welcome') {
                            var name = winName[winName.length - 2]['name'];
                        }
                        set('everyWinFrm_data', data);
                        set('everyWinFrm_type', type);
                        api.execScript({
                            name: name,
                            script: 'if(typeof everyWinFrm!="undefined"){everyWinFrm.show();}'
                        });
                    }
                }
            });
        });
    },
    'show': function() {
        if(this.indexOk==0){
            if(api.winName=='root_root'){
                var frames=api.frames();
                for(var i in frames){
                    if(frames[i].name=='index_index_frm'){
                        this.indexOk=1;
                        break;
                    }
                }
            }else{
                this.indexOk=1;
            }
        }
        if(this.indexOk==1){
            window.pop = "page_pop_frm";
            var data = get('everyWinFrm_data', 1);
            var type = get('everyWinFrm_type', 1);
            var obj = {
                'mod': 'page',
                'act': 'pop_frm',
                'rect': {
                    'x': 0,
                    'y': 0,
                    'w': 'auto',
                    'h': 'auto'
                },
                'reload': true,
                'pageParam': {
                    'data': data,
                    'type': type
                },
                'bgColor':''
            };
            openFrame(obj);
        }else{
            setTimeout(function(){
                everyWinFrm.show();
            },1000);
        }
    }
};

function openDialog(title,content,img,logo,leftBtn,rightBtn,leftClick,rightClick,a){
    if(api.getGlobalData({'key':'dialogPop'})==1){
        return false;
    }
    a=a||0;
    if(api.getGlobalData({'key':'indexOk'})==1){
        if(a==1){
            setGlobalData('dialogPop',1);
        }
        logo=logo||appInfo.logo;
        leftClick=leftClick.toString();
        rightClick=rightClick.toString();
        leftClick=leftClick.replace(/function(\s+)?\(\)\{/,'');
        leftClick=leftClick.replace(/}$/,'');
        rightClick=rightClick.replace(/function(\s+)?\(\)\{/,'');
        rightClick=rightClick.replace(/}$/,'');
        window.pop = "page_dialog_frm";
        var obj = {
            'mod': 'page',
            'act': 'dialog_frm',
            'rect': {
                marginLeft:0,    //相对父 window 左外边距的距离
                marginTop:0,     //相对父 window 上外边距的距离
                marginBottom:0,  //相对父 window 下外边距的距离
                marginRight:0    //相对父 window 右外边距的距离
            },
            'reload': true,
            'pageParam': {
                'title': title,
                'content': content,
                'content': content,
                'img': img,
                'logo': logo,
                'leftClick': leftClick,
                'rightClick': rightClick,
                'leftBtn': leftBtn,
                'rightBtn': rightBtn,
            },
            'bgColor':''
        };
        openFrame(obj);
    }else{
        setTimeout(function(){
            openDialog(title,content,img,logo,leftBtn,rightBtn,leftClick,rightClick,a);
        },500);
    }
}

/*系统分享*/
function sysShare(img,title,url,app){
    app=app||'';
    title=title||'';
    url=url||'';
    img=img||'';
    if(typeof img=='string'){
        if(img==''){
            var imgs=[];
        }else{
            var imgs=[getRealPath(img)];
        }
    }else{
        var imgs=[];
        for(var i in img){
            imgs.push(getRealPath(img[i]));
        }
    }
    var uexAn = api.require('uexAn');
    if(api.systemType=='ios'){
        if(app=='weixin' || app=='pyq'){
            var pageName='com.tencent.xin.sharetimeline';
            uexAn.getShare({
                 msg: [title,imgs,url,pageName]
            },function(ret, err){

            });
        }else if (app=='qq' || app=='kongjian') {
            var pageName='com.tencent.mqq.ShareExtension';
            uexAn.getShare({
                 msg: [title,imgs,url,pageName]
            },function(ret, err){

            });
        }else{
            var sharedModule = api.require('shareAction');
            if(url!=''){
                var data={'text':title,'type':'url','path':url,'images':[img],'thumbnail':img};
            }else{
                var data={text: title,type: 'image',path:img};
            }
            sharedModule.share(data);
        }
    }else{
        var content='';
        if(title!=''){
            content+=title;
        }
        if(url!=''){
            content+=url;
        }
        if(size(imgs)==0){
            type="0";
        }else{
            type="1";
        }
        if(app=='weixin' || app=='pyq' || app=='qq' || app=='kongjian'){
            if(app=='pyq'){
                imgs=[imgs[0]];
            }
            imgs=JSON.stringify(imgs);
            if(app=='weixin'){
                var pageName='com.tencent.mm';
                var className='com.tencent.mm.ui.tools.ShareImgUI';
            }else if(app=='pyq'){
                var pageName='com.tencent.mm';
                var className='com.tencent.mm.ui.tools.ShareToTimeLineUI';
            }else if(app=='qq'){
                var pageName='com.tencent.mobileqq';
                var className='com.tencent.mobileqq.activity.JumpActivity';
            }else if(app=='kongjian'){
                var pageName='com.qzone';
                var className='com.qzonex.module.operation.ui.QZonePublishMoodActivity';
            }
            var param={packName:pageName,className:className,other1:'APP',other2:'APP分享',content:content,type:type,imgs:imgs,otherType:'1'};
	        uexAn.getShare(param);
        }else{
            var sharedModule = api.require('shareAction');
            if(url!=''){
                var data={'text':title,'type':'url','path':url,'images':[img],'thumbnail':img};
            }else{
                var data={text: title,type: 'image',path:img};
            }
            sharedModule.share(data);
        }
    }
}

function shareImgPageBack(img,code){
    // if(appInfo.appshare && appInfo.weixin_appshare_xiufu==1){
    //     appInfo.appshare.weixin=0;
    // }
    if(code=='weixin'){
        if(appInfo.appshare && appInfo.appshare.weixin == 1){
            var wx = api.require('wx');
            wx.shareImage({
                apiKey: '',
                scene: 'session',
                thumb: '',
                contentUrl: img
            }, function(ret, err) {

            });
        }else{
            sysShare(img,'','',code);
        }
    }else if(code=='pyq'){
        if(appInfo.appshare && appInfo.appshare.weixin == 1){
            var wx = api.require('wx');
            wx.shareImage({
                apiKey: '',
                scene: 'timeline',
                thumb: '',
                contentUrl: img
            }, function(ret, err) {

            });
        }else{
            sysShare(img,'','',code);
        }
    }else if(code=='qq'){
        if(appInfo.appshare && appInfo.appshare.qq == 1){
            var qq = api.require('QQPlus');
            qq.shareImage({
                type : 'QFriend',
                imgPath: img
            },function(ret,err){
            });
        }else{
            sysShare(img,'','',code);
        }

    }else if(code=='kongjian'){
        if(appInfo.appshare && appInfo.appshare.qq == 1){
            var qq = api.require('QQPlus');
            qq.shareImage({
                type : 'QZone',
                imgPath: img
            },function(ret,err){
            });
        }else{
            sysShare(img,'','',code);
        }
    }
}

function shareImgPage(img,code,tip){
    tip=tip||'';
    if(typeof img=='object' && $api.isArray(img) && img.length==1){
        img=img[0];
    }
    if(typeof img=='object'){
        sysShare(img,'','',code);
    }
    else if(img.indexOf('http')==0){
        if(tip!=''){
            toastOpen(tip,30000);
        }
        fs=api.require('fs');
        fs.removeSync({
            path: "fs://down/share.png"
        });
        down(img,function(img){
            toastClose();
            shareImgPageBack(img,code);
        },"fs://down/share.png");
    }else{
        shareImgPageBack(img,code);
    }
}

function shareUrlPage(title,desc,url,img,code){
    if(code=='weixin'){
        var wx = api.require('wx');
        wx.shareWebpage({
            apiKey: '',
            scene: 'session',
            title: title,
            description: desc,
            thumb: img,
            contentUrl: url
        }, function(ret, err) {

        });
    }else if(code=='pyq'){
        var wx = api.require('wx');
        wx.shareWebpage({
            apiKey: '',
            scene: 'timeline',
            title: title,
            description: desc,
            thumb: img,
            contentUrl: url
        }, function(ret, err) {

        });
    }else if(code=='qq'){
        var qq = api.require('QQPlus');
        qq.shareNews({
            url: url,
            title: title,
            description:desc,
            imgUrl: img,
            type:'QFriend'
        },function(ret,err){

        });
    }else if(code=='kongjian'){
        var qq = api.require('QQPlus');
        qq.shareNews({
            url: url,
            title: title,
            description:desc,
            imgUrl: img,
            type:'QZone'
        },function(ret,err){

        });
    }
}

/*分享组件*/
function share(title, url, img, desc, winName) {
    var dialogBox = api.require('dialogBox');
    dialogBox.share({
        rect: {
            w: 300,
            h: 240
        },
        tapClose:true,
        items: [{
            text: '微信',
            icon: 'widget://res/img/weixin.png'
        },
        {
            text: '朋友圈',
            icon: 'widget://res/img/weixin2.png'
        },
        {
            text: '复制',
            icon: 'widget://res/img/fuzhi1.png'
        },
        {
            text: 'QQ',
            icon: 'widget://res/img/qq.png'
        },
        {
            text: '空间',
            icon: 'widget://res/img/qq2.png'
        },
        {
            text: '系统分享',
            icon: 'widget://res/img/share.png'
        }],
        styles: {
            bg: '#FFF',
            column: 3,
            corner:10,
            horizontalSpace: 15,
            verticalSpace: 30,
            itemText: {
                color: '#000',
                size: 15,
                marginT: 10
            },
            itemIcon: {
                size: 50
            }
        }
    }, function(ret) {
        toastOpen('数据加载中');
        down(img,function(_img){
            toastClose();
            dialogBox.close({
                dialogName: 'share'
            });
            // if(appInfo.appshare && appInfo.weixin_appshare_xiufu==1){
            //     appInfo.appshare.weixin=0;
            // }
            if(ret.index==0){
                if(appInfo.appshare && appInfo.appshare.weixin == 1){
                    shareUrlPage(title,desc,url,_img,'weixin');
                }else{
                    _img='';
                    sysShare(_img,title,url,'weixin');
                }
            }else if(ret.index==1){
                if(appInfo.appshare && appInfo.appshare.weixin == 1){
                    shareUrlPage(title,desc,url,_img,'pyq');
                }else{
                    clipboardSet(title+url);
                    sysShare(_img,title,url,'pyq');
                }
            }else if(ret.index==2){
                clipboardSet(title+url);
            }else if(ret.index==3 ){
                if(appInfo.appshare && appInfo.appshare.qq == 1){
                    shareUrlPage(title,desc,url,img,'qq');
                }else{
                    _img='';
                    sysShare(_img,title,url,'qq');
                }
            }else if(ret.index==4){
                if(appInfo.appshare && appInfo.appshare.qq == 1){
                    shareUrlPage(title,desc,url,img,'kongjian');
                }else{
                    clipboardSet(title+url);
                    sysShare(_img,title,url,'kongjian');
                }
            }else if(ret.index==5){
                sysShare(_img,title,url);
            }
            if(typeof shareCallBack=='function'){
                shareCallBack(ret.index);
            }
        });
    });
    return false;

    title = title || '';
    url = url || '';
    img = img || '';
    desc = desc || '';
    var obj = {
        'mod': 'page',
        'act': 'share_frm',
        'rect': {
            'x': 0,
            'y': 0,
            'w': 'auto',
            'h': 'auto'
        },
        'reload': true,
        'pageParam': {
            'title': title,
            'url': url,
            'img': img,
            'desc': desc,
            'winName': winName
        }
    };
    openFrame(obj);
}

/*设置标题栏颜色*/
function setStatusBarStyle(color) { /*light白  dark黑*/
    color=color||'';
    if(color==''){
        return false;
    }
    api.pageParam.curPageBarColor=color;

    if (api.systemType == 'ios') {
        api.setStatusBarStyle({style: color});
    } else {

    }
}

function setWinTitle(title, callback) {
    try{
        $api.dom('#title').innerHTML = title;
    }catch(e){
    }

    if (callback == 1) {
        $api.addEvt($api.dom("#title"), 'touchend', function() {
            api.execScript({
                name: '',
                frameName: mod + '_' + act + '_frm',
                script: "middleClick()"
            });
        });
    }
}

function setWinRight(html, callback) {
    $api.dom('#right').innerHTML = html;
    if (callback == 1) {
        $api.addEvt($api.dom("#right"), 'touchend', function() {
            api.execScript({
                name: '',
                frameName: mod + '_' + act + '_frm',
                script: "rightClick()"
            });
        });
    }
}

function setWinLeft(html, callback) {
    if (html != '') {
        $api.dom('#left').innerHTML = html;
    }
    if (callback == 1) {
        leftFun = 1;
    }
}

function leftClick() {
    if (leftFun == 0) {
        closeWin();
    } else {
        api.execScript({
            name: '',
            frameName: mod + '_' + act + '_frm',
            script: "leftClick()"
        });
    }
}

var ddLayer = {
    'open': function(content, title, btn) {
        btn = btn || ['朕知道了'];
        title = title || '';
        var c = '<div class="text_alert"><div class="alert">{$title}<div class="wrapper touch-callout">{$content}</div></div></div>';
        if (title != '') {
            title = '<h2><span>' + title + '</span><span onclick="layer.closeAll()" class="layer-close" style="transform: rotate(45deg)">+</span></h2>';
        }
        c = c.replace('{$title}', title);
        c = c.replace('{$content}', content);
        loadScript.go('/script/layer.js', function() {
            layer.open({
                content: c,
                title: false,
                btn: btn
            });
        }, '/css/layer.css');
    }
};

/*打开QQ*/
function openQq(code,callback) {
    if (api.systemType == 'ios') {
        var packName = 'mqq://';
    } else {
        var packName = 'com.tencent.mobileqq';
    }
    var installed = install(packName);
    if (installed) {
        if (api.systemType == 'ios') {
            api.openApp({
                iosUrl: 'mqq://im/chat',
                appParam: {
                    appParam: 'chat_type=wpa&uin=' + code + '&version=1&src_type=web'
                }
            });
        } else {
            api.openApp({
                androidPkg: 'android.intent.action.VIEW',
                mimeType: '',
                uri: 'mqqwpa://im/chat?chat_type=wpa&uin=' + code
            }, function(ret, err) {

            });
        }
    } else {
        if(typeof callback=='function'){
            callback();
        }else{
            openAlert('请安装手机QQ');
        }
    }
}

/*打开淘宝*/
function openTaobao(url) {
    if (install('taobao://', 'com.taobao.taobao')) {
        var uri = url.replace(/(https|http)/, 'taobao');
        openApp(uri, 'com.taobao.taobao');
        return true;
    } else {
        ddevent.url(url);
        return false;
    }
}

/*判断app是否安装*/
function install(scheme, pageName) {
    pageName = pageName || scheme;
    if (api.systemType == 'ios') {
        var bundle = scheme;
    } else {
        var bundle = pageName;
    }
    var installed = api.appInstalled({
        sync: true,
        appBundle: bundle
    });
    return installed;
}

/*打开app*/
function openApp(uri, androidPkg) {
    androidPkg = androidPkg || '';
    if (api.systemType == 'ios') {
        api.openApp({
            iosUrl: uri,
            appParam: {
                appParam: {}
            }
        });
    } else {
        if (uri != 'taobao://') {
            androidPkg = 'android.intent.action.VIEW';
        } else {
            androidPkg = 'com.taobao.taobao';
            uri = '';
        }
        api.openApp({
            androidPkg: 'android.intent.action.VIEW',
            mimeType: '',
            uri: uri
        }, function(ret, err) {

        });
    }
}

/*文件是否存在*/
function fileExists(file){
    var fs = api.require('fs');
    var ret = fs.existSync({
        path: file
    });
    if (ret.exist) {
        return 1;
    } else {
        return 0;
    }
}

/*文件改名*/
function fileRename(oldPath,newPath){
    var fs = api.require('fs');
    var ret = fs.renameSync({
        oldPath: oldPath,
        newPath: newPath
    });
    return ret.status;
}

/*下载
//正常情况，肯定会定义callback，如果callback为空，说明并不在意当前的下载情况，这个是是应用在图片的显示
//比如首页广告位，图片是远程地址，用down(url)获取本地地址，如果没有，还是原样返回url*/
function down(url, callback, savePath,report) {
    if(url==''){
        callback('');
        return false;
    }
    savePath = savePath || '';
    callback = callback || '';
    report=report||false;
    if (savePath == '') {
        var md5Key = api.require('signature').md5Sync({
            'data': url
        });
        var ext = url.match(/\.\w+$/);
        if (ext == null || ext=='') {
            ext = '.tmp';
        }
        var suiji = md5Key.substr(0, 2) + '/' + md5Key;
        var savePath = "fs://down/" + suiji + ext;
    }

    if(callback==''){
        if(fileExists(savePath)){
            return savePath;
        }
    }

    api.download({
        url: url,
        savePath: savePath,
        report: report,
        encode:false,
        cache: false,
        allowResume: true
    }, function(ret, err) {
        if(report==false){
            if (ret.state == 1) {
                if(savePath!=''){
                    ret.savePath=savePath;
                }
                if(typeof callback=='function'){
                    callback(ret.savePath);
                }
            }
        }else{
            if (ret.state == 1) {
                if(savePath!=''){
                    ret.savePath=savePath;
                }
            }
            if(typeof callback=='function'){
                callback(ret);
            }
        }
    });

    if(callback==''){
        return url;
    }
}

/*下载队列，带界面*/
var downLoad={
    'downloadManager':{},
    'loopQuery':function(id,callback){
        var _this=this;
        setTimeout(function(){
            try{
                _this.query(id,function(data){
                    if(data.status==3){
                        callback(data.status,data.savePath);
                    }else{
                        _this.loopQuery(id,callback);
                        if(data.totalSize==0){
                            var num=0;
                        }else{
                            var num=data.finishSize/data.totalSize*100;
                            num=Math.ceil(num);
                        }
                        callback(data.status,num);
                    }
                });
            }catch(e){
                //console.log(JSON.stringify(e));
            }
        },500);
    },
    'enqueue':function(url,savePath,callback,uncompress,title){
        savePath = savePath || '';
        if (savePath == '') {
            var md5Key = api.require('signature').md5Sync({
                'data': url
            });
            var ext = url.match(/\.\w+$/);
            if (ext == null) {
                ext = '.tmp';
            }
            var suiji = md5Key.substr(0, 2) + '/' + md5Key;
            var savePath = "fs://down/" + suiji + ext;
        }
        var _this=this;
        title=title||'下载';
        uncompress=uncompress||false;
        this.downloadManager = api.require('downloadManager');
        this.downloadManager.enqueue({
            url:url,
            savePath: savePath,
            uncompress: true,
            cache: false,
            title: title,
            networkTypes: 'all'
        }, function(ret, err) {
            _this.loopQuery(ret.id,callback);
        });
    },
    'query':function(id,callback){
        this.downloadManager.query({
            'ids': [id]
        }, function(ret, err) {
            callback(ret.data[0]);
        });
    }
};

/*保存图片到相册*/
function saveImage(img, callback) {
    api.saveMediaToAlbum({
        path: img
    }, function(ret, err) {
        if (ret && ret.status) {
            callback(1);
        } else {
            callback(0,JSON.stringify(err));
        }
    });
}

function addUrlParam(url,safe) {
    if(typeof safe=='undefined'){
        safe=1;
    }
    if(url.indexOf('?')<0){
        url=url+'?';
    }
    url+='&DD_DDUSERID='+get('DD_DDUSERID')+'&DD_PASSWORD='+get('DD_PASSWORD')+'&app_sys='+api.systemType+'&app_version='+api.systemVersion+'&app_os='+urlencode(api.deviceModel)+'&app_imei='+api.deviceId+'&idfa='+get('DD_idfa')+'&qudao='+get('DD_qudao')+'&TPL_VERSION='+TPL_VERSION+'&TPL_NAME='+TPL_NAME+'&version='+appVersion();
    if(safe==1){
        url+='&request_time='+time(1,1);
        var a=url.split('?');
        var signature = api.require('signature');
        var sign = signature.md5Sync({
            'data':a[1],
            'uppercase': false
        });
        url+='&signSafe='+sign;
    }
    return url;
}

/*执行会员中心初始化代码*/
function updateUserIndex(reload) {
    reload = reload || 0;
    api.execScript({
        name: 'root_root',
        frameName: 'user_user_frm',
        script: 'start(' + reload + ')'
    });
}

function updateUser(k, v, user) {
    if(typeof k=='object'){
        var user=getNeedUserField(k);
    }else{
        if (typeof user == 'undefined') {
            var user = get('userInfo');
        }
        user[k] = v;
    }
    set('userInfo', user);
    return user;
}

function imgAddErr(imgSrc){
    imgSrc=imgSrc||'';
    if(navigator.userAgent.match(/iphone/i)){
        if(imgSrc==''){
            var oImg = document.querySelectorAll('img');
            for (var i = 0, l = oImg.length; i < l; i++) {
                if(oImg[i].getAttribute('src')!=null && oImg[i].getAttribute('src').indexOf('../../')==0){
                    oImg[i].setAttribute('biaoji',i);
                    oImg[i].onerror = function() {
                        var src = this.getAttribute('src');
                        src = src.replace('../../','widget://');
                        this.setAttribute('src',src);
                        oImg[this.getAttribute('biaoji')].onerror=null;
                    }
                }
            }
        }else{
			var _imgSrc=imgSrc.replace('../../','fs://template/'+TPL_NAME+'_'+TPL_VERSION+'/');
			if(fileExists(_imgSrc)){
				imgSrc=_imgSrc;
			}else{
				imgSrc = imgSrc.replace('../../','widget://');
			}
			return imgSrc;
        }
    }else{
		return imgSrc;
	}
}

function alarm(type,name,msg){
    msg=msg||name;
    if(type==0){
        setTimeout(function(){
            if(typeof window['alarm_'+name]=='undefined'){
				alert(msg);
            }
        },2000);
    }else{
        window['alarm_'+name]='';
    }
}

function ready(callback, type,callback2) {
    imgAddErr();
    apiready=function(){
        type = type || 0;
        scriptLoadNum=0;
        needScriptLoadNum=2+type;
        alarm(0,'config_js');
        loadScript.go('../../script/config.js', function() {
            alarm(1,'config_js');
            scriptLoadNum++;
            alarm(0,'fun_js');
            loadScript.go('../../script/fun.js', function() {
                alarm(1,'fun_js');
                scriptLoadNum++;
                try{
                    window.cacheKeyArr=[];
                    window.appInfo = get('appInfo');
                    window.siteInfo = get('siteInfo');
                    window.user=checkLogin();
                    if(appInfo.kaola && appInfo.kaola.open && appInfo.kaola.open==1){
                        webMalls.kaola='考拉';
                    }
                    if(appInfo.vipshop && appInfo.vipshop.open && appInfo.vipshop.open==1){
                        webMalls.vip='唯品会';
                    }
                }catch(e){
                    alert('基本信息获取失败');
                }

                if(typeof callback2=='function'){
                    callback2();
                }
                if(scriptLoadNum==needScriptLoadNum){
                    callback();
                }
                goTop();
            });
        });

        if (type >= 1) {
            try{
                alarm(0,'zepto_js');
                loadScript.go('../../script/zepto.js', function() {
                    alarm(1,'zepto_js');
                    scriptLoadNum++;
                    if(scriptLoadNum==needScriptLoadNum){
                        callback();
                    }
                    if (type >= 2) {
                        alarm(0,'zepto_lazyload_js');
                        loadScript.go('../../script/zepto_lazyload.js', function() {
                            alarm(1,'zepto_lazyload_js');
                            scriptLoadNum++;
                            if(scriptLoadNum==needScriptLoadNum){
                                callback();
                            }
                        });
                    }
                });
            }catch(e){
                alert('3100:'+JSON.stringify(e));
            }
        }
    };
}

/*
对象克隆
*/
function clone(obj){
    var o;
    switch(typeof obj){
    case 'undefined': break;
    case 'string'   : o = obj + '';break;
    case 'number'   : o = obj - 0;break;
    case 'boolean'  : o = obj;break;
    case 'object'   :
        if(obj === null){
            o = null;
        }else{
            if(obj instanceof Array){
                o = [];
                for(var i = 0, len = obj.length; i < len; i++){
                    o.push(clone(obj[i]));
                }
            }else{
                o = {};
                for(var k in obj){
                    o[k] = clone(obj[k]);
                }
            }
        }
        break;
    default:
        o = obj;break;
    }
    return o;
}

var downImg={
    'run':function(){
        var doms=$api.domAll('.down-img');
        for(var i=0,c=doms.length;i<c;i++){
            var url=$api.attr(doms[i],'data-img');
            if(typeof url!='undefined' && url.indexOf('http')==0){
                this.down(doms[i],url);
            }else{
                this.set(doms[i],url);
            }
        }
    },
    'down':function(dom,url){
        api.imageCache({
            url: url,
            policy:'cache_only',
            thumbnail:false
        }, function(ret, err) {
            if (typeof dom.tagName!='undefined' && dom.tagName.toLowerCase() == 'img') {
                $api.attr(dom,'src',ret.url);
            } else {
                dom.style.backgroundImage = "url(" + ret.url + ")";
            }
            $api.removeAttr(dom,'data-img');
        });
    },
    'set':function(dom,url){
        if (typeof dom.tagName!='undefined' && dom.tagName.toLowerCase() == 'img') {
            $api.attr(dom,'src',url);
        } else {
            dom.style.backgroundImage = "url(" + url + ")";
        }
        $api.removeAttr(dom,'data-img');
        $api.removeCls(dom,'down-img');
    }
};

function getTaoId(url){
    var id=0;
    var a=url.match(/^(http|https):\/\/(item\.taobao\.com)|(detail\.tmall\.com)|(h5\.m\.taobao\.com)|(detail\.m\.tmall\.com)|(detail\.tmall\.hk)|(detail\.m\.tmall\.hk)|(a\.m\.taobao\.com)|(detail\.yao\.95095\.com)/);
    if(a){
        a=url.match(/\/i(\d+)\.htm/,url);
        if(!a){
            a=url.match(/[&|?](id|Id|item_num_id|default_item_id|item_id|itemId|mallstItemId)=(\d+)/);
            if(a){
                id=a[2];
            }
        }else{
            id=a[1];
        }
    }
    return id;
}

function getTaoIdFromWebview(url,callback){
    var browser = api.require('webBrowser');
    var callbackok=0;
    setTimeout(function(){
        if(callbackok==0){
            callbackok=1;
            callback(0);
            browser.closeView();
        }
    },5000);
    browser.openView({
        url: url,
        rect: {
            x: 0,
            y: -100,
            w: 1,
            h: 1
        }
    }, function(ret, err) {
        if(typeof ret.url!='undefined'){
            var id=getTaoId(ret.url);
            if(id>0){
                callbackok=1;
                callback(id);
                browser.closeView();
            }
        }
    });
}

var mtop={
	'appkey':'12574478',
	'_m_h5_tk':'',
    '_m_h5_tk_enc':'',
    't':'',
	'cookie':'',
	'run':function(api,data,callback){
		var _this=this;
		this.getCookie(_this.apiUrl(api),function(){
			if(api=='kouling'){
				_this.kouling(data,callback);
			}else if(api=='queryBoughtList'){
				_this.queryBoughtList(data,callback);
			}
		});
	},
    'getTaoIdFromWebview':function (url,callback){
        var _this=this;
        var callbackok=0;
        setTimeout(function(){
            if(callbackok==0){
                callbackok=1;
                callback(0);
                uexWebView.closeView();
            }
        },5000);

        var intercept=['https://detail.m.tmall.com','https://uland.taobao.com','https://h5.m.taobao.com'];
        var js='';
        var ua=navigator.userAgent;
        uexWebView.setUa(ua);
        uexWebView.open(url,{'x':0,'y':0,'w':1,'h':1},js,intercept,{
            'title':function(str){
            },
            'url':function(str){
            },
            'intercept':function(data){
                if(data.indexOf('uland.taobao.com')>0){
                    _this.ulandToItem(data,function(url){
                        if(url.indexOf('http')<0){
    						url='https:'+url;
    					}
                        var apiUrl="http://quan2.meiquan8.com/api/gongju/tb.php?method=taobao_tbk_item_click_extract&url="+urlencode(url);
                        getAjax(apiUrl,function(data){
                            callbackok=1;
                            uexWebView.close();
                            if(data.s==1){
                                callback(data.r);
                            }else{
                                callback(0);
                            }
                        },'',0);
                    });
                }else{
                    var id=getTaoId(data);
                    if(id>0){
                        callbackok=1;
                        callback(id);
                        uexWebView.close();
                    }
                }
            }
        });
    },
	'kouling':function(kouling,callback){
		kouling='￥'+kouling.substr(1,kouling.length-2)+'￥';
		var _this=this;
		var url=this.apiUrl('kouling',1,kouling);
		this.getHtml(url,function(data){
			try{
				data=data.replace('mtopjsonp2(','').replace(/\)$/,'');
				data=JSON.parse(data);
				url=data.data.url;
                var id=getTaoId(url);
                if(id>0){
                    callback(id);
                }else{
                    _this.ulandToItem(url,function(url){
    					if(url.indexOf('http')<0){
    						url='https:'+url;
    					}
                        _this.getTaoIdFromWebview(url,function(id){
                            callback(id);
                        });
    				});
                }
			}catch(err){
                callback(0);
			}
		},'body');
	},
	'ulandToItem':function(url,callback){
		if(url.indexOf('uland.taobao.com/coupon/edetail')>0){
			var url=this.apiUrl('ulandToItem',1,url);
			this.getHtml(url,function(data){
				try{
					data=data.replace('mtopjsonp2(','').replace(/\)$/,'');
					data=JSON.parse(data);
					url=data.data.result['item'].clickUrl;
					callback(url);
				}catch(err){
				}
			},'body');
		}else{
			callback(url);
		}
	},
	'queryBoughtList':function(page,callback){
		var _this=this;
		var url=this.apiUrl('queryBoughtList',1,page);
		this.getHtml(url,function(data){
			try{
				data=data.replace('mtopjsonp3(','').replace(/\)$/,'');
				data=JSON.parse(data);
				if(JSON.stringify(data.ret).indexOf('FAIL')>=0){
					_this.login();
				}else{
					data=data.data.data.group;
					callback(data);
				}
			}catch(err){
				_this.login();
			};
		},'body');
	},
	'desc':function(id,callback){
		var _this=this;
		var url=this.apiUrl('desc',1,id);
		this.getHtml(url,function(data){
            if(data==''){

            }else{
                try{
    				data=data.replace('mtopjsonp2(','').replace(/\)$/,'');
    				data=JSON.parse(data);
    				callback(data.data.wdescContent.pages);
    			}catch(err){
                    //console.log(JSON.stringify(err));
    			};
            }
		},'body');
	},
	'login':function(){
		baichuan.logout();
		openConfirm("请从新获取淘宝授权","授权到期",['稍后再说','马上授权'],function(data){
			if(data==1){
				baichuan.login(function(){});
			}else{
				set('DD_buyaoshouquan',TIME);
			}
		});
	},
	'apiUrl':function(api,type,data){
		type=type||0;
		if(api=='kouling'){
			var url='https://api.m.taobao.com/h5/com.taobao.redbull.getpassworddetail/1.0/?appKey='+this.appkey+'&api=com.taobao.redbull.getpassworddetail&v=1.0';
			if(type==1){
				var data='{"password":"'+data+'"}';
				var sign=this.sign(data,this.t);
				url=url+'&t='+this.t+'&sign='+sign+'&ecode=1&type=jsonp&dataType=jsonp&callback=mtopjsonp2&data='+urlencode(data);
			}
		}else if(api=='desc'){
			var url='https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdesc/6.0/?jsv=2.4.16&appKey='+this.appkey+'&api=mtop.taobao.detail.getdesc&v=6.0';
			if(type==1){
				var data='{"id":"'+data+'","type":"0"}';
				var sign=this.sign(data,this.t);
				url=url+'&t='+this.t+'&sign='+sign+'&type=jsonp&dataType=jsonp&callback=mtopjsonp2&data='+urlencode(data);
			}
		}else if(api=='ulandToItem'){
			var url='https://acs.m.taobao.com/h5/mtop.alimama.union.hsf.coupon.get/1.0/?jsv=2.3.16&appKey='+this.appkey+'&api=mtop.alimama.union.hsf.coupon.get';
			if(type==1){
				var data=data.match(/e=(.*?)&/);
				var data='{"e":"'+data[1]+'","pid":"mm_33231688_7050284_23466709"}';
				var sign=this.sign(data,this.t);
				url=url+'&t='+this.t+'&sign='+sign+'&ecode=1&type=jsonp&dataType=jsonp&callback=mtopjsonp2&data='+urlencode(data);
			}
		}else if(api=='queryBoughtList'){
			var url='https://h5api.m.taobao.com/h5/mtop.order.queryboughtlist/3.0/?jsv=2.4.8&appKey='+this.appkey+'&api=mtop.order.queryBoughtList&v=3.0';
			if(type==1){
				var data='{"spm":"a2141.7756461.2.6","page":'+data+',"tabCode":"all","appVersion":"1.0","appName":"tborder"}';
				var time=Date.parse(new Date());
				var sign=this.sign(data,time);
				url=url+'&t='+time+'&sign='+sign+'&jsv=2.4.8&ttid=%23%23h5&ecode=1&AntiFlood=true&AntiCreep=true&LoginRequest=true&type=jsonp&dataType=jsonp&callback=mtopjsonp3&data='+urlencode(data);
			}
		}else if(api=='getusersimple'){
            var url='https://h5api.m.taobao.com/h5/mtop.user.getusersimple/1.0/?jsv=2.4.0&appKey=12574478&t=1559118821869&sign=be84e279763b896e86c59c83bf1e7f67&api=mtop.user.getUserSimple&v=1.0&H5Request=true&type=jsonp&dataType=jsonp&callback=mtopjsonp2&data=%7B%22isSec%22%3A0%7D';
        }
		return url;
	},
	'getCookie':function(url,callback){
		var _this=this;
		this.getHtml(url,function(re){
			if(re==null){
				re='';
			}
            if(typeof re['Set-Cookie']!='undefined'){
                re=re['Set-Cookie'];
            }
			if(re.indexOf('_m_h5_tk')>=0){
                var re2=re.match(/_m_h5_tk_enc=(\w+)/);
                re=re.match(/_m_h5_tk=(\w+)_(\w+);/);
				if(typeof re[1]!='undefined'){
					_this._m_h5_tk=re[1];
                    _this.t=re[2];
                    _this._m_h5_tk_enc=re2[1];
                    _this.cookie='_m_h5_tk='+re[1]+'_'+re[2]+'; _m_h5_tk_enc='+re2[1]+';'
					callback();
				}
			}else{
				callback();
			}
		},'headers');
	},
	'sign':function(data,t){
		var signParam = [this._m_h5_tk,t,this.appkey,data];
        var sign=api.require('signature').md5Sync({data: signParam.join('&')}).toLowerCase();
		return sign;
	},
	'getHtml':function(url,callback,type){
        type=type||'';
        var _this=this;
        api.ajax({
            url: url,
            method: 'get',
            headers: {'Cookie':_this.cookie,'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'},
            returnAll:true,
            dataType:'text',
            encode:false
        }, function(ret,err) {
            try{
                if(type!=''){
                    ret=ret[type];
                }
                callback(ret);
            }catch(err){
                //alert('3312error:'+JSON.stringify(err));
                callback("");
            }
        });
	}
};

function emptyData(tip){
    return '<div style="padding-top:40%;text-align:center"><img style="width:10em;display:block;margin:auto" src="../../img/wushuju.png"><br/>'+tip+'</div>';
}

/*如果页面有弹动，底部固定的div，会在上拉的时候往上走，此方法是为了解决这个问题的
//原理是原先页面的div，复制一份放在浮动层里，所以这样就需要原来的div的样式，都在dom上
//此方法并不完善，如果复杂的结构，还是需要单独写，实际应用在淘宝详情页*/
var fixedFrm={
    'status':0,
    'html':function(id){
        var html=$api.dom('#'+id).outerHTML;
        if(html==''){
            alert('fixedHtml error:'+id);
        }
        set('fixedHtml',html);
        set('frameName',api.frameName);
        openFrame({id:id,mod:'page',act:'fixed_frm'});
        setTimeout(function(){
            $api.dom('#'+id).innerHTML='';
        },1000);
    },
    'zhengHtml':function(id,html){
        var _this=this;
        if(this.status==1){
            set('zhengHtml',html);
            api.execScript({
                frameName: 'page_fixed_frm',
                script: 'setHtml("'+id+'")'
            });
        }else{
            setTimeout(function(){
                _this.zhengHtml(id,html);
            },100);
        }
    },
    'fanClick':function(jsfun){
        api.execScript({
            frameName: frameName,
            script: jsfun
        });
    },
    'setStatus':function(){
        api.execScript({
            frameName: frameName,
            script: 'fixedFrm.status=1'
        });
    }
};

function goTop(){
    $api.append($api.dom('body'),'<div onClick="document.documentElement.scrollTop=document.body.scrollTop=0" style=" text-align:center; line-height:40px;background:rgba(255,255,255,0.6);border:1px solid #fdabc7;-webkit-border-radius:50%;width: 40px;height: 40px;background-size: cover;display: inline-block;position: fixed;right: 8px;z-index: 99;bottom:-48px;-webkit-transition-duration:.2s" id="backToTop"><i class="iconfont shake shake-slow" style=" font-size:32px;color:#f54275;">&#xe600;</i></div>');
    var $backToTop=document.getElementById('backToTop');
    window.onscroll = function() {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var bodyHeight = ddInt(window.screen.availHeight/2);
        if(scrollTop > bodyHeight){
            $backToTop.style.bottom='64px';
        }else{
            $backToTop.style.bottom='-64px';
        }
    };
}

function openPdd(url){
    if (install('pinduoduo://', 'com.xunmeng.pinduoduo')) {
        var uri=url.replace('https://mobile.yangkeduo.com','pinduoduo://com.xunmeng.pinduoduo');
        openApp(uri, 'com.xunmeng.pinduoduo');
        return true;
    } else {
        ddevent.url(url);
        return false;
    }
}

function openVip(url){
    if (0 && install('vipshop://', 'com.achievo.vipshop')) {
        var uri='vipshop://showWebview?url='+urlencode(url);
        openApp(uri, 'com.achievo.vipshop');
        return true;
    } else {
        ddevent.url(url);
        return false;
    }
}

function openKaola(url){
    if (install('kaola://', 'com.kaola')) {
        if(api.systemType=='ios'){
            var uri=url.replace(/https|http/,'kaola');
        }else{
            var uri=url;
        }
        openApp(uri, 'com.kaola');
        return true;
    } else {
        ddevent.url(url);
        return false;
    }
}

function getRealPath(path){
    path=path.replace('fs:/',api.fsDir);
    return path;
}

/*得到文件的fs地址*/
function getWidgetFile(file){
    file=file||'';
    if(file!='' && file.indexOf('http')==0){
        return down(file).replace('fs:/',api.fsDir);
    }else if(file.indexOf('../')==0 || file.indexOf('widget')==0 || file.indexOf('/')==0){
        return file;
    }else{
        return file;
    }
}

function checkAuth(callback){
    if(APP_TAG=='duoduo123' || APP_TAG=='duoduo'){
        return false;
    }
    var url='http://yun.duoduo123.com/index.php?m=Api&a=one&code=meiquan&url='+urlencode(URL);
    getAjax(url,function(data){
        if((data.s=='0' || data.s=='-1') && data.r!=''){
            clear();
            openAlert(data.r,function(){
                api.closeWidget({'silent':true});
            });
        }else{
            if(typeof callback=='function'){
                callback();
            }
        }
    },'',86400*7);
}

/*下载主题*/
function downloadTpl(callback,tip) {
    var DD_tplVerson=ddInt(get('DD_tplVerson'));
    DD_tplVerson=DD_tplVerson>=TPL_VERSION_NUM?DD_tplVerson:TPL_VERSION_NUM;
    var url=TPL_URL+'apicloud/index.php?TPL_NAME='+TPL_NAME+'&TPL_VERSION='+TPL_VERSION+'&DD_tplVerson='+DD_tplVerson+'&a=' + time();
    tip=tip||0;
    if(tip==1){
        api.showProgress({
            title: '主题获取中',
            text: '开始启动',
            modal: false
        });
        DD_tplVerson=0; /*如果有tip，说明是手动更新，所以把比较版本赋值为0，怎么都会触发*/
    }
    getAjax(url+'&act=version',function(data){
        /*{"num":1,"update":0,"msg":"升级"}*/
        if(data.num>DD_tplVerson){
            down(url+'&act=down&dir='+urlencode(api.fsDir),function(re){
                if(re.state==1){
                    toastOpen('解析主题文件',30000);
                    var zip = api.require('zip');
                    zip.unarchive({
                        file: re.savePath,
                        password: ''
                    }, function(ret, err) {
                        if (ret.status) {
                            var fs = api.require('fs');
                            var ret = fs.removeSync({
                                path: re.savePath
                            });

                            var fileArr=[];
                            var ret = fs.readDirSync({
                				path: 'fs://template/'+TPL_NAME+'_'+TPL_VERSION+'/html'
                			});
                			if (!ret.status) {
                				alert('列目录错误');
                				return false;
                			}
                			var file=ret.data;
                			for(var i in file){
                                var ret1 = fs.readDirSync({
                    				path: 'fs://template/'+TPL_NAME+'_'+TPL_VERSION+'/html/'+file[i]+'/'
                    			});
                                var file1=ret1.data;
                                for(var j in file1){
                                    fileArr.push('fs://template/'+TPL_NAME+'_'+TPL_VERSION+'/html/'+file[i]+'/'+file1[j]);
                                }
                            }

                            /*这里区分安卓和苹果的原因：苹果用同步方式，在执行多个文件后，写入或者读取就不好用了，安卓用异步方式会报一个js的语法错误，这个错误应该是fs插件里的*/
                            if(api.systemType=='ios'){
                                for(var i in fileArr){
                                    fs.open({
                                        path: fileArr[i],
                                        flags: 'read_write'
                                    }, function(ret, err) {
                                        if (ret.status) {
                                            fs.read({
                                                fd: ret.fd,
                                                offset: 0,
                                                length: 0
                                            }, function(ret2, err2) {
                                                if (ret2.status) {
                                                    ret2.data=ret2.data.replace(/\.\.\/\.\.\/css/ig,'widget://css');
                                                    ret2.data=ret2.data.replace(/\.\.\/\.\.\/script/ig,'widget://script');
                                                    fs.write({
                                                        fd: ret.fd,
                                                        data: ret2.data,
                                                        offset: 0
                                                    }, function(ret3, err) {
                                                        if (ret3.status) {
                                                            fs.close({
                                                                fd: ret.fd
                                                            }, function(ret, err) {
                                                            });
                                                        } else {
                                                            alert(JSON.stringify(err));
                                                            return false;
                                                        }
                                                    });
                                                } else {
                                                    alert(JSON.stringify(err));
                                                    return false;
                                                }
                                            });
                                        } else {
                                            alert(JSON.stringify(err));
                                            return false;
                                        }
                                    });
                                }
                            }else{
                                for(var i in fileArr){
                                    var ret2 = fs.readByLengthSync({
                                        path: fileArr[i],
                                        substring: {
                                            start: 0
                                        }
                                    });
                                    if (!ret2.status) {
                                        alert('读取失败：'+ret2.msg);
                                        return false;
                                    }
                                    ret2.content=ret2.content.replace(/\.\.\/\.\.\/img/ig,api.fsDir+'/img');
                                    var ret3 = fs.writeByLengthSync({
                                        path: fileArr[i],
                                        content: ret2.content,
                                        place: {
                                            start: 0,
                                            strategy: -1
                                        }
                                    });
                                    if (!ret3.status) {
                                        //console.log('写入失败：'+fileArr[i]);
                                    }
                                }
                            }

                            var file='fs://template/'+TPL_NAME+'_'+TPL_VERSION+'/version.txt';
                            var ret = fs.existSync({
                                path: file
                            });
                            if (ret.exist) {
                                var ret = fs.readByLengthSync({
                                    path: file
                                });
                                var num=0;
                                if (ret.status) {
                                    ret.content=ret.content.replace(/[\u0000]+$/ig,'');
                                    try {
                                        var version=JSON.parse(ret.content);
                                        var num=version.num;
                                    } catch (e) {
                                        //console.log(JSON.stringify(e));
                                    }
                                }
                                toastClose();
                                callback(version.num,version.update,version.msg);
                            } else {
                                toastClose();
                                alert('解压主题失败');
                            }
                        } else {
                            //console.log(JSON.stringify(err));
                        }
                    });
                }else{
                    if(tip==1){
                        api.showProgress({
                            title: '主题获取中',
                            text: ddInt(re.percent)+'%',
                            modal: false
                        });
                    }
                }
            },'fs://template.zip',true);
        }else{
            toastClose();
            callback(-1);/*当前已是最新主题*/
        }
    },'');
}

function bendi() {
    if (api.deviceModel == 'Droid4X') {
        return 1;
    } else {
        return 0;
    }
}

function moniqi() {
    if (navigator.userAgent.indexOf('APICloudStudio2') > 0) {
        return 1;
    } else {
        return 0;
    }
}

function tplOnce(tpl){
    var js=tpl.match(/<script>([\s\S])+?<\/script>/);
    if(js==null){
        js='';
    }
    else{
        js=js[0];
    }
    var css=tpl.match(/<style>([\s\S])+?<\/style>/);
    if(css==null){
        css='';
    }
    else{
        css=css[0];
    }
    var html=tpl.match(/<body>([\s\S])+?<\/body>/);
    if(html==null){
        html='';
    }
    else{
        html=html[0];
    }
    tpl={'html':html,'js':js,'css':css};
    return tpl;
}

function strencode(string) {
    var signature = api.require('signature');
    string = signature.base64Sync({data: string});
    var key = 'xiaoan!';
    var len = key.length;
    var code = '';
    for (i = 0; i < string.length; i++) {
        var k = i % len;
        var a = String.fromCharCode(string.charCodeAt(i) ^ key.charCodeAt(k));
        code = code + String(a);
    }
    return signature.base64Sync({data: code});
}

var versionUpdate={
    'appVer':0,
    'downIng':0,
    'appInfo_banben':0,
    'appInfo_update_content2':'',
    'check':function(callback){
        var appVer=appVersion();
        this.appVer=appVer;
        if(api.systemType=='ios'){
            var appInfo_banben=appVersion(appInfo.ios_banben);
            var appInfo_banben_zuidi=appVersion(appInfo.ios_banben_zuidi);
            var appInfo_update_content=appInfo.ios_update_content;
            if(typeof appInfo.ios_update_content2=='undefined'){
                appInfo.ios_update_content2='';
            }
            var appInfo_update_content2=appInfo.ios_update_content2;
            var appInfo_update_url=appInfo.ios_update_url;
        }else{
            var appInfo_banben=appVersion(appInfo.android_banben);
            var appInfo_banben_zuidi=appVersion(appInfo.android_banben_zuidi);
            var appInfo_update_content=appInfo.android_update_content;
            if(typeof appInfo.android_update_content2=='undefined'){
                appInfo.android_update_content2='';
            }
            var appInfo_update_content2=appInfo.android_update_content2;
            var appInfo_update_url=appInfo.android_update_url;
        }
        this.appInfo_banben=appInfo_banben;
        this.appInfo_update_content2=appInfo_update_content2;
        if(appVer<appInfo_banben_zuidi){
            api.closeToWin({
                name: 'root_root'
            });
            api.execScript({
                name: 'root_root',
                script: 'mustUpdate();'
            });
            return false;
        }
        if(appVer<appInfo_banben){
            var updateTip=get('updateTip');
            if(time()-updateTip>3600){
                set('updateTip',time());
                this.tip(appVer,appInfo_banben_zuidi,appInfo_update_content,appInfo_update_url);
            }else{
                if(typeof callback=='function'){
                    callback();
                }
            }
        }else{
            if(typeof callback=='function'){
                callback();
            }
        }
    },
    'tip':function(appVer,appInfo_banben_zuidi,appInfo_update_content,appInfo_update_url){
        var _this=this;
        if(_this.appInfo_update_content2==''){
            api.confirm({
                title: '当前有新版本',
                msg: appInfo_update_content,
                buttons: ['确定', '取消']
            }, function(ret, err) {
                var index = ret.buttonIndex;
                if(index==1){
                    _this.update(appInfo_update_url);
                }else{

                }
            });
        }else{
            var id=this.appInfo_banben;
            var b = id.split('');
            var c=[];
            k=0;
            for(i=id.length-1;i>=0;i--){
            	if(k==2){
            		c.push('.');
            		k=0;
            	}
            	c.push(b[i]);
            	k++;
            }
            id='';
            for(i=c.length-1;i>=0;i--){
            	id+=c[i];
            }
            openDialog(appInfo.name+id+'版本升级',_this.appInfo_update_content2,'',appInfo.logo,'稍后更新','马上更新','','versionUpdate.update("'+appInfo_update_url+'")',1);
        }
    },
    'update':function(appInfo_update_url){
        appInfo_update_url=appInfo_update_url||'';
        if(appInfo_update_url==''){
            if(api.systemType=='ios'){
                appInfo_update_url=appInfo.ios_update_url;
            }else{
                appInfo_update_url=appInfo.android_update_url;
            }
        }
        if(api.systemType=='ios'){
            openApp(appInfo_update_url);
        }else{
            if(appInfo_update_url.match(/\.apk$/)){
                this.updateApk(appInfo_update_url);
            }else{
                openApp(appInfo_update_url);
            }
        }
    },
    'updateApk':function(url){
        var _this=this;
        if(this.downIng==1){
            toast('下载中，请稍后');
            return false;
        }
        this.downIng=1;
        toast('开始下载，状态栏查看进度');
        down(url,function(ret){
            if(ret.state==0){
                api.notification({
                    vibrate:[0,0],
                    sound:'',
                    notify:{
                        title:'最新版本下载中',                /*标题，Android中默认值为应用名称，支持Android和iOS 8.2以上系统*/
                        content:'已下载'+ddInt(ret.percent)+'%，请耐心等待，谢谢~~~',                /*内容，默认值为'有新消息'*/
                        extra:'',                   /*附加信息，页面可以监听noticeclicked事件得到点击的通知的附加信息*/
                        updateCurrent: true    /*是否覆盖更新已有的通知，取值范围true|false。只Android有效*/
                    }
                });
            }else{
                _this.downIng=0;
                api.cancelNotification({id:-1});
                api.installApp({
                    appUri: ret.savePath
                });
            }
        },'',true);
    }
};

function checkUpdate(callback){
    versionUpdate.check(function(){
        smartUpdate(function(){
            callback();
            if(api.systemType=='ios'){ //苹果触发静默更新主题
                downloadTpl(function(version,update,msg) {
                    if(version==-1){
                        if(typeof callback=='function'){
                            callback();
                        }
                        return false;
                    }
                    set('DD_tplVerson', version);
                    if(update==1){
                        api.alert({
                            title: '主题升级',
                            msg: msg,
                        }, function(ret, err){
                            api.execScript({
                                name: 'root',
                                script: 'reStart();'
                            });
                        });
                    }else{
                        if(typeof callback=='function'){
                            callback();
                        }
                    }
                });
            }
        });
    });
}

function webLog(str){
    var url=createUrl('api','log');
    postAjax(url,{'data':str},function(){

    },'','txt');
}

function alertUpdate(msg) {
    var alert_html = '';
    alert_html += '<div style="width:70%;position:relative;margin:auto;padding-top:50px;">';
    alert_html += '  <div style="width:100%;position:relative;padding-top:10px;"><img style="position:absolute;width:100%;bottom:0;left:0;" src="../../img/alert_hj.png" alt="" /></div>';
    alert_html += '  <div style="background:#fff;border-radius:0 0 6px 6px;overflow:hidden;">';
    alert_html += '    <div style="font-size:16px;color:#333;line-height:30px;font-weight:bold;">小惊喜</div>';
    alert_html += '    <div style="padding:10px 15px;font-size:14px;line-height:24px;text-align:left;color:#333;">'+msg+'<p style="padding:5px 0 10px;font-size:12px;color:999;">需要重启生效哦~</p></div>';
    alert_html += '    <div class="flex-wrap flex-justify-sb flex-align" style="padding:0 15px 20px;">';
    alert_html += '      <div class="aubtn" style="width:44%;height:28px;color:#FF7818;line-height:28px;font-size:14px;border:1px solid #FF7818;border-radius:14px;">稍后再说</div>';
    alert_html += '      <div class="aubtn" style="width:44%;height:28px;background:#FF7818;color:#fff;line-height:28px;font-size:14px;border:1px solid #FF7818;border-radius:14px;">立即重启</div>';
    alert_html += '    </div>';
    alert_html += '  </div>';
    alert_html += '</div>';
    loadScript.go('/script/layer.js',function() {
        layer.open({
            style: 'background: rgba(0,0,0,0);',
            content: alert_html
        })
        $('.aubtn').eq(1).click(function() {
            api.rebootApp();
        });
        $('.aubtn').eq(0).click(function() {
            layer.closeAll();
        });
    },'/css/layer.css');
}

function showAU(msg) {
    var frames = api.frames();
    api.execScript({
        name: api.winName,
        frameName: frames[0].name,
        script: 'alertUpdate("'+msg+'");'
    });
}

function smartUpdate(callback){
    var mam = api.require('mam');
    mam.checkSmartUpdate(function(ret, err){
        var tip='';
        if(typeof ret.packages!='undefined' && typeof ret.packages[0]!='undefined'){
            for(var i in ret.packages){
                if(ret.packages[i].extra!=''){
                    tip=ret.packages[i].extra;
                }
            }
            mam.startSmartUpdate(function(ret, err){
                if(ret.state==3){
                    if(tip.length>0 && iosShenhe()==0){/*用tip为空判断会无效，不知道为什么*/
                        api.alert({
                            title: '小惊喜',
                            msg: tip,
                        }, function(ret, err){
                            api.rebootApp();
                        });
                    }else{
                        if(typeof callback=='function'){
                            callback();
                        }
                    }
                }
            });
        }else{
            if(typeof callback=='function'){
                callback();
            }
        }
    });
}

function getInt(cb,cacheTime,isHuanxing){
    isHuanxing=isHuanxing||0;
    cacheTime=cacheTime||0;
    if(isHuanxing==1){
        var tip='';
    }else{
        var tip='获取基础数据';
    }
    if(cacheTime!=0){
        cacheTime=3600;
    }
    var tplBanben=ddInt(get('DD_tplVerson'));
    var myDate = new Date();
    var day=myDate.format('YYYYmmdd');
    var appcode=strencode(day+'_'+URL);
    /*获取基本信息的同时，还会获取额外的数据，如果是唤醒后获取的基本信息，那么额外的数据不需要(额外数据指的是会员信息等)*/
    var url=createUrl('api',{'fun':'set','appcode':appcode,'huanxing':isHuanxing});
    getAjax(url,function(data,cache){
        if(data.s==1){
            appInfo=data.r.appinfo;
            siteInfo=data.r.siteinfo;
            set('appInfo',appInfo);
            set('siteInfo',siteInfo);
            if(cache==0 && get('DD_DDUSERID')>0){
                if(typeof data.r.user=='object' && data.r.user.id>0){
                    updateUser(data.r.user);
                }else{
                    del('userInfo');
                }
            }

            if(appInfo.close=='0'){
                checkAuth();
                if(typeof huanxing=='function'){
                    huanxing();
                }
                if(typeof cb=='function'){
                    cb(data.r,cache,1);
                }
                if(cache==1){
                    getAjax(url,function(_data,_cache){
                        if(_data.s==1){
                            appInfo=_data.r.appinfo;
                            siteInfo=_data.r.siteinfo;
                            set('appInfo',appInfo);
                            set('siteInfo',siteInfo);
                            if(_cache==0 && get('DD_DDUSERID')>0){
                                if(typeof _data.r.user=='object' && _data.r.user.id>0){
                                    updateUser(_data.r.user);
                                }else{
                                    del('userInfo');
                                }
                                cb(_data.r,_cache,2);
                            }
                        }
                    },'',0);
                }
            }
            else{
                var closeMsgUrl=appInfo.closeMsgUrl;
                if(closeMsgUrl==''){
                    closeMsgUrl='APP升级中';
                }
                if(ddIndexOf(closeMsgUrl,'http')==0){
                    openApp(closeMsgUrl);
                }
                else{
                    openAlert(closeMsgUrl);
                }
            }
        }else{
            if(typeof data.error!='undefined'){
                $('#without-network').show();
            }else{
                openAlert(data.r);
            }
        }
    },tip,cacheTime);
}

function cancelBubble(e) {
    var evt = e ? e : window.event;
    if (evt.stopPropagation) {
       evt.stopPropagation();
    }else {
       evt.cancelBubble = true;
    }
}

/*获取当前页面的html到文件中*/
function getCurlHtml(){
    console.log(document.getElementsByTagName('html')[0].outerHTML);
}

function setGlobalData(k,v){
    api.setGlobalData({
        'key':k,
        'value':v
    });
}

function getGlobalData(key){
    var data = api.getGlobalData({
        'key': key
    });
    if(data!=''){
        api.setGlobalData({
            'key': key,
            'value':''
        });
    }
    return data;
}

function fnSlide() {
    /*监听手指向滑动距离底部多少禁止弹动*/
    api.addEventListener({
               name: 'scrolltobottom',
               extra: {
                   threshold: 300
               }
           }, function(ret, err) {
             api.setFrameAttr({
                 bounces: false
             });
         });

      var startx, starty;
      function getAngle(angx, angy) {
          return Math.atan2(angy, angx) * 180 / Math.PI;
      };
      function getDirection(startx, starty, endx, endy) {
          var angx = endx - startx;
          var angy = endy - starty;
          var result = 0;
          if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
              return result;
          }
          var angle = getAngle(angx, angy);
          if (angle >= -135 && angle <= -45) {
              result = 1;
          } else if (angle > 45 && angle < 135) {
              result = 2;
          } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
              result = 3;
          } else if (angle >= -45 && angle <= 45) {
              result = 4;
          }
          return result;
      }
      document.addEventListener("touchstart", function(e) {
          startx = e.touches[0].pageX;
          starty = e.touches[0].pageY;
      }, false);
      document.addEventListener("touchmove", function(e) {
          var endx, endy;
          endx = e.changedTouches[0].pageX;
          endy = e.changedTouches[0].pageY;
          var direction = getDirection(startx, starty, endx, endy);
          switch (direction) {
              case 0:
                  break;
              case 1:
                  api.setFrameAttr({
                      bounces: false
                  });
                  break;
              case 2:
                  api.setFrameAttr({
                      bounces: true
                  });
                  break;
              case 3:
                  break;
              case 4:
                  break;
              default:
          }
      }, false);
  }

  function swiperForAndroid(id){
      var a=document.getElementById(id);
      if(a){
          document.getElementById(id).addEventListener('touchstart',function (ev) {
              api.setFrameAttr({
                  bounces: false
              });
          }, false);
          document.getElementById(id).addEventListener('touchend',function (ev) {
              api.setFrameAttr({
                  bounces: true
              });
          }, false);
      }
  }

  var yzm_dxm={
      getDxm:function(){
          var mobile=$('#mobile').val();
          if(mobile==''){
              toast('请填写手机',1000);
              return false;
          }
          jq_jym=$('#jym');
          var data=jq_jym.attr('data');
          if(data==0){
              jq_jym.attr('data',1);
          }else{
              return false;
          }

          var getYzmTime=jq_jym.attr('getYzmTime');
          var YZM_EFFE=jq_jym.attr('YZM_EFFE');
          if(time(1)-getYzmTime<YZM_EFFE){
              toast('等等啦',1000);
          }
          else{
              var url=createUrl('user',{'fun':'sms','mobile':mobile});
              getAjax(url,function(data){
                  if(data.s==1){
                      jq_jym.attr('getYzmTime',time(1));
                      daojishiProcess=window.setInterval('yzm_dxm.daojishi()', 1000);
                      toast(data.r,1000);
                  }else{
                      openAlert(data.r);
                      jq_jym.attr('data',0);
                  }
              },'发送短信码',0);
          }
      },
      daojishi:function(){
          jq_jym=$('#jym');
          var YZM_EFFE_USE=ddInt(jq_jym.attr('YZM_EFFE_USE'));
          YZM_EFFE_USE--;
          if(YZM_EFFE_USE==0){
              $('#jym').val('发送验证码');
              clearInterval(daojishiProcess);
              YZM_EFFE_USE=YZM_EFFE;
              var YZM_EFFE=jq_jym.attr('YZM_EFFE');
              jq_jym.attr('YZM_EFFE_USE',YZM_EFFE);
              jq_jym.attr('data',0);
          }
          else{
              jq_jym.val('发送中('+YZM_EFFE_USE+')');
              jq_jym.attr('YZM_EFFE_USE',YZM_EFFE_USE);
          }
      }
  };

var getTbData = {
    'tpl':'',
    'lock': 0,
    'page': 0,
    'url': '',
    'id':'goods',
    'infinite':0,
    'goodsFrom':1,
    'reset':function(i){
        i=i||0;
        if (i==0) {
          $('#'+this.id).html('');
        }
        this.page=0;
        this.lock=0;
        this.infinite=0;
    },
    'go': function(param,callback,isM,ourl) {
        var _this = this;
        param=param||'';
        if (_this.page == 0 && _this.infinite==0) {
            _this.infinite=1;
            infinite(function() {
                _this.go();
            });
        }
        var url='';
        if(param!=''){
            var _param=clone(param);
			//console.log(JSON.stringify(_param));
			if (!!_param.q) { // 搜索接口走 goods
				_this.goodsFrom=2;
			}
            if(_this.goodsFrom==1){
                url=buildUrl('app_goods',_param);
            }else if(_this.goodsFrom==2){
                url=createUrl('goods','allSearch',_param);
            }
        }
        if(url.length>0){  /*这里很奇怪，用url==""判断无效。一直都是空*/
            _this.url = url;
        }else{
            url=_this.url;
        }
        if (_this.lock == 1) {
            return false;
        }
        _this.page++;
        url = url + '&page=' + _this.page;
        _this.lock = 1;
        getAjax(url, function(data) {
            _this.lock = 0;
            var goodsFrom=0;
            if(typeof data.data!='undefined'){
                if(typeof data.data.goods=='undefined'){
                    var count = 0;
                }else{
                    var count = size(data.data.goods);
                }
                _this.goodsFrom=1; /*来自淘鹊桥*/
            }else{
                var count = size(data.r);
                _this.goodsFrom=2; /*来自返利站*/
            }
            if (isM==1) {
                $('#'+_this.id).html('');
            }
            if (count > 0) {
                if(typeof setTitleFun=='function' && typeof data.r=='string' && data.r!=''){
                    setTitleFun(data.r);
                }
                else if(typeof param['q']!='undefined' && param['q']!=''){
                    setTitleFun(q);
                }
                if(_this.goodsFrom==1){
                    _this.goodsSet(data.data.goods);
                }else if(_this.goodsFrom==2){
                    _this.goodsSet(data.r);
                }
                if(_this.goodsFrom==1){
                    if(typeof param['q']!='undefined' && param['q']!='' && count<20){
                        _this.goodsFrom=2;
                        _this.page=0;
                        _this.go(param);
                    }
                }
                else if(_this.goodsFrom==2){
                    if(count<20){
                        $api.dom('#loading').innerHTML = '————我是有底线的————';
                        api.removeEventListener({
                            name: 'scrolltobottom'
                        });
                    }
                }
            } else {
                if(_this.goodsFrom==1 && typeof param['q']!='undefined'){
                    _this.goodsFrom=2;
                    _this.page=0;
                    _this.go(param);
                }else{
                    _this.lock = 1;
                    if (_this.page == 1) {
                        $api.dom('#goods').innerHTML = emptyData('暂无数据');
                        $api.dom('#loading').innerHTML = '';
                    } else {
                        $api.dom('#loading').innerHTML = '————我是有底线的————';
                    }
                    api.removeEventListener({
                        name: 'scrolltobottom'
                    });
                }
            }
            if(typeof callback=='function'){
                if(_this.goodsFrom==1){
                    if(param['type']=='day'){
                      callback(data.data);
                    }else{
                      callback(data.data.goods);
                    }
                }else{
                    callback(data.r);
                }
            }
        }, '', 3600);
    },
    'goodsSet':function(data) {
        if(this.tpl==''){
            this.tpl=goodsTbTpl;
        }
        var html = barretTpl(this.tpl, data);
        $('#'+this.id).append(html);
        $('.lazyimg').picLazyLoad();
        api.parseTapmode();
    }
};

function getNeedUserField(user){
    return user;
    var f=['id','type','level','nick','ddusername','mobile','alipay','money','jifenbao','avatar','level_name','realname','tjm','daili','rate'];
    var u={};
    for(var i in f){
        if(typeof user[f[i]]!='undefined'){
            u[f[i]]=user[f[i]];
        }
    }
    return u;
}

var baichuanIos={
    'loginErrNum':0,
    'ini':function(){
        var uexBcWeb=api.require('uexBcWeb');
        uexBcWeb.aliBaiChuanInit({
            msg: ''
        },function(ret, err){
            if(ret.indexOf('成功')<0){
                alert('百川初始化失败');
            }
        });
    },
    'login':function(callback){
        var _this=this;
        var uexBcWeb=api.require('uexBcWeb');
        uexBcWeb.getLoginCallBack({
            msg: ''
        },function(ret, err){
            if(typeof ret=='string' && ret.indexOf('授权失败Error')==0){ /*第一次授权可能由于未知原因失败，所以需要自动再登录一次*/
                if(_this.loginErrNum==0){
                    _this.loginErrNum=1;
                    _this.login(callback);
                    return false;
                }
            }
            try{
                ret=JSON.parse(ret);
                callback(ret);
            }catch(e){
                callback({'error':ret});
            }
        });
        uexBcWeb.login_tb({
            msg: ''
        },function(ret, err){
        });
    },
    'callBackIsLogin':function(callback){
        var uexBcWeb = api.require('uexBcWeb');
        var re=uexBcWeb.callBackIsLogin();
        callback(re);
    },
    'loginout':function(callback){
        var uexBcWeb=api.require('uexBcWeb');
        uexBcWeb.loginout_tb({
            msg: ''
        },function(ret, err){

        });
        if(typeof callback=='function'){
            setTimeout(function(){
                callback();
            },500);
        }
    },
    'openApp':function(url){
        var uexBcWeb=api.require('uexBcWeb');
        uexBcWeb.start_tbWeb({
            msg: url
        },function(ret, err){

        });
    },
    'openH5':function(url){
        var uexBcWeb=api.require('uexBcWeb');
        uexBcWeb.getDefaultWeb({
            msg: url
        },function(ret, err){

        });
    }
};

var baichuanAndroid={
    'ini':function(){
        var uexBcWeb=api.require('uexBcWeb');
        uexBcWeb.init_baichuan(function(ret){
            if(ret.status!='success'){
                openAlert('百川初始化失败');
            }
        });
    },
    //安卓下如果是登录状态，调起登录没反应，所以先退出再登录
    'login':function(callback){
        var uexBcWeb=api.require('uexBcWeb');
        this.loginout(function(){
            uexBcWeb.login_tb(function(data,err){
                try{
                    var userInfo={};
                    data=data.session;
                    data=data.split(',');
                    var t=[];
                    for(var i in data){
                        t=data[i].split('=');
                        t[0]=trim(t[0]);
                        t[1]=trim(t[1]);
                        if(t[0]=='nick'){
                            userInfo['nick']=t[1];
                        }else if(t[0]=='ava'){
                            var a='';
                            for(var j in t){
                                if(j>0){
                                    a=a+t[j]+'=';
                                }
                            }
                            a=a.replace(/=$/,'');
                            userInfo['avatarUrl']=a;
                        }else if(t[0]=='topAuthCode'){
                            userInfo['topAuthCode']=t[1];
                        }else if(t[0]=='openId'){
                            userInfo['openId']=t[1];
                        }
                    }
                    callback(userInfo);
                }catch(e){
                    callback({'error':data});
                }
            });
        });
    },
    'getLoginStatus':function(callback){
        var uexBcWeb=api.require('uexBcWeb');
        uexBcWeb.login_status(function(ret){
            callback(ret.login);
        });
    },
    'loginout':function(callback){
        var uexBcWeb=api.require('uexBcWeb');
        uexBcWeb.loginout_tb();
        if(typeof callback=='function'){
            setTimeout(function(){
                callback();
            },500);
        }
    },
    'openApp':function(url){
        var uexBcWeb=api.require('uexBcWeb');
        var param={url:url,adzoneid:'',appkey:'',pid:'',subpid:'',unionid:'',orderNumber:true,openState:true,clientType:'taobao'};
	    uexBcWeb.start_shouTao(param,function(ret){});
    },
    'openH5':function(url){
        var uexBcWeb=api.require('uexBcWeb');
        var param={url:url,orderNumber:true,clientType:'taobao'};
	    uexBcWeb.openDefaultBcWeb(param);
    }
};

var baichuan={
    'ini':function(){
        if(api.systemType=='ios'){
            baichuanIos.ini();
        }else{
            baichuanAndroid.ini();
        }
    },
    'open':function(url,openTb){
        openTb=openTb||'';
        if(openTb==''){
            openTb=get('DD_openTb');
        }
        if(openTb=='shouTao'){
            appInfo.baichuan=2;
        }else if(openTb=='h5'){
            appInfo.baichuan=1;
        }else if(openTb=='sysTao'){
            appInfo.baichuan=0;
        }
        if(appInfo.baichuan==1){
            baichuan.openH5(url);
        }else if(appInfo.baichuan==2){
            baichuan.openApp(url);
        }else{
            openTaobao(url);
        }
    },
    'getLoginStatus':function(callback){
        var _this=this;
        if(api.systemType=='ios'){
            baichuanIos.callBackIsLogin(function(data){
                callback(data);
            });
        }else{
            baichuanAndroid.getLoginStatus(function(data){
                callback(data);
            });
        }
    },
    'login':function(callback){
        var _this=this;
        if(api.systemType=='ios'){
            baichuanIos.login(function(data){
                _this.loginBack(data,callback);
            });
        }else{
            baichuanAndroid.login(function(data){
                _this.loginBack(data,callback);
            });
        }
    },
    'loginBack':function(data,callback){
        data.userId=0;
        if(typeof data.avatarUrl!='undefined' && data.avatarUrl!=''){
            var a=data.avatarUrl.match(/userId=(\d+)/);
            if(a!=null && typeof a[1]!='undefined'){
                data.userId=a[1];
            }
        }
        callback(data);
    },
    'loginout':function(callback){
        var _this=this;
        if(api.systemType=='ios'){
            baichuanIos.loginout(function(){
                _this.loginoutBack(callback);
            });
        }else{
            baichuanAndroid.loginout(function(){
                _this.loginoutBack(callback);
            });
        }
    },
    'loginoutBack':function(callback){
        if(typeof callback=='function'){
            callback();
        }
    },
    'openApp':function(url){
        if (install('taobao://', 'com.taobao.taobao')) {
            if(api.systemType=='ios'){
                baichuanIos.openApp(url);
            }else{
                baichuanAndroid.openApp(url);
            }
        } else {
            this.openH5(url);
        }
    },
    'openH5':function(url){
        ddevent.url(url);
    }
};

var keplerIos={
    'ini':function(){
        var uexJD=api.require('uexJD');
        uexJD.jdKplInit({
            msg: ''
        },function(ret, err){
            if(ret.indexOf('成功')<0){
                alert('开普勒初始化失败');
            }
        });
    },
    'login':function(callback){
        var uexJD=api.require('uexJD');
        uexJD.shouquan({
            msg: ''
        },function(ret, err){
            if(ret==''){
                callback();
            }
        });
    },
    'loginout':function(callback){

        var uexJD=api.require('uexJD');
        uexJD.cancelShouquan({
            msg: ''
        },function(ret, err){
        });
        if(typeof callback=='function'){
            setTimeout(function(){
                callback();
            },500);
        }
    },
    'openApp':function(url){
        var uexJD=api.require('uexJD');
        uexJD.openAPP({
            msg: url
        },function(ret, err){
        });
    },
    'openH5':function(url){
        var uexJD=api.require('uexJD');
        uexJD.openUrl({
            msg: url
        },function(ret, err){
        });
    }
};

var keplerAndroid={
    'ini':function(key,secret){
        secret=secret||key;
        var uexJD=api.require('uexJD');
        var param={key:key,miyao:secret};
	    uexJD.initKpl(param,function(ret){
            if(ret.initStatus!=true){
                alert('京东开普勒初始化失败');
            }
        });
    },
    'login':function(callback){
        var uexJD=api.require('uexJD');
        uexJD.shouquan(function(ret,err){
        });
    },
    'loginout':function(callback){
        var uexJD=api.require('uexJD');
        uexJD.cancelShouquan();
        if(typeof callback=='function'){
            setTimeout(function(){
                callback();
            },500);
        }
    },
    'openApp':function(url){
        var uexJD=api.require('uexJD');
        var param={url:url};
	    uexJD.openApp(param,function(){});
    },
    'openH5':function(url){
        var uexJD=api.require('uexJD');
        var param={url:url};
	    uexJD.openUrl(param);
    }
};

var kepler={
    'ini':function(key,secret){
        if(api.systemType=='ios'){
            keplerIos.ini();
        }else{
            keplerAndroid.ini(key,secret);
        }
    },
    'login':function(callback){
        if(api.systemType=='ios'){
            keplerIos.login(callback);
        }else{
            keplerAndroid.login(callback);
        }
    },
    'loginout':function(callback){
        if(api.systemType=='ios'){
            keplerIos.loginout(callback);
        }else{
            keplerAndroid.loginout(callback);
        }
    },
    'openApp':function(url){
        if(api.systemType=='ios'){
            keplerIos.openApp(url);
        }else{
            keplerAndroid.openApp(url);
        }
    },
    'openH5':function(url){
        if(api.systemType=='ios'){
            keplerIos.openH5(url);
        }else{
            keplerAndroid.openH5(url);
        }
    }
};

var jdZHIos={
    'ini':function(){
        var jd = api.require('uexJDZH');
        jd.jdZhInit({
        },function(ret, err){
            if(ret.indexOf('成功')<0){
                alert('京东直呼初始化失败');
            }
        });
    },
    'open':function(url,callback){
        var jd = api.require('uexJDZH');
        jd.cb_faild({
            msg: ''
        },function(ret, err){
            if(typeof callback=='function'){
                callback(url);
            }
        });
        jd.openJdAppByUrl({
            msg: url
        },function(ret, err){
        });
    }
};

var jdZHAndroid={
    'ini':function(key,secret){
        var jd = api.require('uexJDZH');
        var param={key:key,miyao:secret};
        jd.initJDZH(param,function(ret){
            if(ret.initStatus!=true){
                alert('京东直呼初始化失败');
            }
        });
    },
    'open':function(url,callback){
        var jd = api.require('uexJDZH');
	    var param={"url":url};
	    jd.openJdAppByUrl(param,function(ret){
            if(ret.state==0){
                callback(url);
            }
        });
    }
};

var jdZH={
    'ini':function(key,secret){
        if(api.systemType=='ios'){
            jdZHIos.ini(key,secret);
        }else{
            jdZHAndroid.ini(key,secret);
        }
    },
    'open':function(url,callback){
        if(api.systemType=='ios'){
            jdZHIos.open(url,callback);
        }else{
            jdZHAndroid.open(url,callback);
        }
    }
};

var jdSdk={
    'ini':function(key,secret){
        var jdType=api.loadSecureValue({sync: true,key: 'jd_type'});
        set('DD_jdSdk',jdType);
        if(jdType=='kepler'){
            kepler.ini(key,secret);
        }else if(jdType=='jdZH'){
            jdZH.ini(key,secret);
        }
    },
    'open':function(url){
        var jdSdk=get('DD_jdSdk');
        if(jdSdk==''){
            ddevent.url(url);
        }else if(jdSdk=='kepler'){
            kepler.openApp(url);
        }else if(jdSdk=='jdZH'){
            jdZH.open(url,function(data){
                ddevent.url(data);
            });
        }
    }
};

function reStart(){
    clear(2);
    start();
}

function loadLazyImg(){
    $('.lazyimg').picLazyLoad();
}

function rightHtml(a,b){
    setRight(a,b);
}

function trim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}

function loga(a){
    console.log(JSON.stringify(a));
}

function alerta(a){
    alert(JSON.stringify(a));
}

function goToIndex() {
    api.closeToWin({
        name: 'root_root'
    });
}

function ddActionSheet(title,cancel,button,callback){
    button=button.split(',');
    api.actionSheet({
        title: title,
        cancelTitle: cancel,
        destructiveTitle: '',
        buttons: button
    }, function(ret, err) {
        var index = ret.buttonIndex-1;
        callback(index);
    });
}

var uexWebView={
    'webView':{},
    'urls':[], //ios如果页面有iframe，当前加载完成的网址会判断失效，方案是把所有加载了的网址都传递出去，由应用场景自己判断
    'url':'', //安卓如果页面有iframe，加载完成状态会回调2次，然后获取当前网址，都是主网址，利用这个把第二次加载完成忽略
    'open':function(url,rect,js,intercept,callback){
        /*intercept 数组*/
        intercept=intercept||[];
        js=js||'';
        if(typeof callback!='object'){
            alert('callback回调不存在');
            return false;
        }
        if(typeof callback.title!='function'){
            alert('title回调不存在');
            return false;
        }
        if(typeof callback.url!='function'){
            alert('url回调不存在');
            return false;
        }
        if(typeof callback.intercept!='function'){
            alert('intercept回调不存在');
            return false;
        }
        var _this=this;
        this.webView=api.require('uexWebView');
        if(api.systemType=='ios'){
            this.webView.callBack({
            },function(ret, err){
                try {
                    ret=JSON.parse(ret);
                    if(ret.state==0){ /*开始加载网页*/
                        _this.urls=[];
                    }else if(ret.state==2){ /*加载完成*/
                        callback.url(ret.url,_this.urls);
                        if(js!=''){
                            _this.loadScript(js);
                        }
                    }else if(ret.state==4){ /*网址发生变化，网页内可能有多个网址，所以不能确认主网址是什么，所以把变化的网址也传递回去*/
                        _this.urls.push(ret.url);
                    }else if(ret.state==3){ /*title变化*/
                        callback.title(ret.title);
                    }else if(ret.state==5){
                        callback.intercept(ret.url);
                    }
                } catch (e) {
                    //console.log(JSON.stringify(e));
                }
            });
            this.webView.openView({
                'url':url,'rect':rect,'intercept':intercept,'isHeader':'0','httpHeader':{},'color':'#DC143C'
            },function(ret, err){
            });
        }else{
            var param={color: '#ff0000'};
            _this.webView.setProgressColor(param);
            var param={'url':url,'rect': rect,'intercept':intercept};
            _this.webView.openView(param,function(ret){
                if(typeof ret.interUrl!='undefined'){
                    ret.state=2;
                }
                if(ret.state==1){
                    _this.getTitle(function(title){
                        callback.title(title);
                    });
                    _this.getCurUrl(function(url){
                        callback.url(url,0);
                        if(_this.url==''){
                            _this.url=url;
                            if(js!=''){
                                _this.loadScript(js);
                            }
                        }
                    });
                }else if(ret.state==2){
                    callback.intercept(ret.interUrl);
                }
            });
        }
    },
    'close':function(){
        this.webView.closeView({
        },function(ret, err){
        });
    },
    'back':function(callback){
        var _this=this;
        this.webView.historyBack({
        },function(ret, err){
            if(api.systemType=='ios'){
                callback();
            }else{
                if(ret.canBack==false){
                    callback();
                }
            }
        });
    },
    'loadUrl':function(url){
        this.webView.loadUrl({
            'url':url
        },function(ret, err){
        });
    },
    'loadScript':function(js){
        this.webView.loadScript({
            'script':js
        },function(ret, err){
        });
    },
    'setUa':function(ua){
        this.webView=api.require('uexWebView');
        if(api.systemType=='ios'){
            this.webView.changeUA({
                'ua':ua
            },function(ret, err){
            });
        }else{
            var param={ua: ua};
            this.webView.setUA(param);
        }
    },
    'getUa':function(callback){
        this.webView=api.require('uexWebView');
        if(api.systemType=='ios'){
            this.webView.obtainUA({
            },function(ret, err){
                callback(ret);
            });
        }else{error();
            this.webView.getUA(function(ret){
                callback(ret.ua);
            });
        }
    },
    'getCookie':function(callback){
        if(api.systemType=='ios'){
            this.webView.obtainCookie({
            },function(ret, err){
                callback(ret);
            });
        }else{
            this.webView.getCookie(function(ret){
                callback(ret.cookie);
            });
        }
    },
    'getTitle':function(callback){
        this.webView.getTitle(function(ret){
            callback(ret.title);
        });
    },
    'getCurUrl':function(callback){
        this.webView.getCurUrl(function(ret){
            callback(ret.url);
        });
    }
};

var bcWebView={
    'webView':{},
    'urls':[], //ios如果页面有iframe，当前加载完成的网址会判断失效，方案是把所有加载了的网址都传递出去，由应用场景自己判断
    'url':'', //安卓如果页面有iframe，加载完成状态会回调2次，然后获取当前网址，都是主网址，利用这个把第二次加载完成忽略
    'open':function(url,rect,js,intercept,callback){
        /*intercept 数组*/
        intercept=intercept||[];
        js=js||'';
        if(typeof callback!='object'){
            alert('callback回调不存在');
            return false;
        }
        if(typeof callback.title!='function'){
            alert('title回调不存在');
            return false;
        }
        if(typeof callback.url!='function'){
            alert('url回调不存在');
            return false;
        }
        if(typeof callback.intercept!='function'){
            alert('intercept回调不存在');
            return false;
        }
        var _this=this;
        this.webView=api.require('uexBcWeb');
        if(api.systemType=='ios'){
            this.webView.callBack({
            },function(ret, err){
                try {
                    ret=JSON.parse(ret);
                    if(ret.state=='0'){ /*开始加载网页*/
                        _this.urls=[];
                        _this.url='';
                        if(typeof callback.reStart=='function'){
                            callback.reStart();
                        }
                    }else if(ret.state==2){ /*加载完成*/
                        if(ret.url=='about:blank'){
                            return false;
                        }
                        if(_this.url==''){
                            _this.url=ret.url;
                            callback.url(ret.url,_this.urls);
                            if(js!=''){
                                _this.loadScript(js);
                            }
                        }
                    }else if(ret.state==3){ /*title变化*/
                        callback.title(ret.title);
                    }
                } catch (e) {
                    //console.log(JSON.stringify(e));
                }
            });
            this.webView.intercept({
                msg: JSON.stringify(intercept)
            },function(ret, err){
            });
            this.webView.cbopen({
                msg: ''
            },function(ret, err){
                callback.intercept(ret);
            });
            this.webView.start_bcWeb({
                msg: [url,api.winWidth,api.winHeight-rect.y,rect.x,rect.y,'0','#FFB6C1']
            },function(ret, err){

            });
        }else{
            var param={color: '#ff0000'};
            if(typeof _this.webView.setProgressColor=='function'){
                _this.webView.setProgressColor(param);
            }
            var param={url:url,rect: rect,interLists:JSON.stringify(intercept),interUrl:true,orderNumber:true,startType:0};
            _this.webView.start_baichuan(param,function(ret){
                if(typeof ret.interUrl!='undefined'){
                    ret.state=2;
                }
                if(ret.state==0){ /*开始加载网页*/
                    _this.url='';
                }else if(ret.state==1){
                    _this.getTitle(function(title){
                        callback.title(title);
                    });
                    _this.getCurUrl(function(url){
                        callback.url(url,0);
                        if(_this.url==''){
                            _this.url=url;
                            if(js!=''){
                                _this.loadScript(js);
                            }
                        }
                    });
                }else if(ret.state==2){
                    callback.intercept(ret.interUrl);
                }
            });
        }
    },
    'close':function(){
        if(api.systemType=='ios'){
            this.webView.finish({
            },function(ret, err){
            });
        }else{
            this.webView.closeView({
            },function(ret, err){
            });
        }
    },
    'back':function(callback){
        var _this=this;
        this.webView.historyBack({
        },function(ret, err){
            if(api.systemType=='ios'){
                callback();
            }else{
                if(ret.canBack==false){
                    callback();
                }
            }
        });
    },
    'loadUrl':function(url){
        this.webView.loadUrl({
            'url':url
        },function(ret, err){
        });
    },
    'loadScript':function(js){
        this.webView.loadScript({
            'script':js
        },function(ret, err){
        });
    },
    'setUa':function(ua){
        this.webView=api.require('uexBcWeb');
        if(api.systemType=='ios'){
            this.webView.changeUA({
                'ua':ua
            },function(ret, err){
            });
        }else{
            var param={ua: ua};
            this.webView.setUA(param);
        }
    },
    'getUa':function(callback){
        this.webView=api.require('uexBcWeb');
        if(api.systemType=='ios'){
            this.webView.obtainUA({
            },function(ret, err){
                callback(ret);
            });
        }else{error();
            this.webView.getUA(function(ret){
                callback(ret.ua);
            });
        }
    },
    'getCookie':function(callback){
        if(api.systemType=='ios'){
            this.webView.obtainCookie({
            },function(ret, err){
                callback(ret);
            });
        }else{
            this.webView.getCookie(function(ret){
                callback(ret.cookie);
            });
        }
    },
    'getTitle':function(callback){
        this.webView.getTitle(function(ret){
            callback(ret.title);
        });
    },
    'getCurUrl':function(callback){
        this.webView.getCurUrl(function(ret){
            callback(ret.url);
        });
    }
};

function imgBrowser(imgs,topColor){
    if(typeof imgs=='string'){
        imgs=[imgs];
    }
    openWin({'mod':'page','act':'imgs','pageParam':{'topColor':topColor,'imgs':JSON.stringify(imgs)}});
}

function tbImg(img,size){
	if(img.indexOf('alicdn.com')>0 || img.indexOf('tbcdn.cn')>0 || img.indexOf('taobaocdn.com')>0 ){
		if(img.indexOf('_.webp')>0){
			img=img.replace('_.webp','');
		}
		if(!isNaN(size)){
			size=size+'x'+size;
		}
		img=img.replace(/_((b)|(\d+x\d+))\.jpg/,'');
		return img+'_'+size+'.jpg';
	}
	return img;
}

/*滚动到指定id*/
function getPos(e)
{
    var l = 0;
    var t  = 0;
    var w = ddInt(e.style.width);
    var h = ddInt(e.style.height);
    var wb = e.offsetWidth;
    var hb = e.offsetHeight;
    while (e.offsetParent){
        l += e.offsetLeft + (e.currentStyle?ddInt(e.currentStyle.borderLeftWidth):0);
        t += e.offsetTop  + (e.currentStyle?ddInt(e.currentStyle.borderTopWidth):0);
        e = e.offsetParent;
    }
    l += e.offsetLeft + (e.currentStyle?ddInt(e.currentStyle.borderLeftWidth):0);
    t  += e.offsetTop  + (e.currentStyle?ddInt(e.currentStyle.borderTopWidth):0);
    return {x:l, y:t, w:w, h:h, wb:wb, hb:hb};
}

function getScroll()
{
    var t, l, w, h;

    if (document.documentElement && document.documentElement.scrollTop) {
        t = document.documentElement.scrollTop;
        l = document.documentElement.scrollLeft;
        w = document.documentElement.scrollWidth;
        h = document.documentElement.scrollHeight;
    } else if (document.body) {
        t = document.body.scrollTop;
        l = document.body.scrollLeft;
        w = document.body.scrollWidth;
        h = document.body.scrollHeight;
    }
    return { t: t, l: l, w: w, h: h };
}

function scroller(el, duration,offset)
{
    if(typeof el != 'object') { el = document.getElementById(el); }

    if(!el) return;
	var dqScroller=get('dqScroller')||0;
	if(dqScroller==1){
		return false;
	}
	set('dqScroller',1);
    var z = this;
    z.el = el;
    z.p = getPos(el);
	if(offset>0){
		z.p.y=z.p.y-offset;
	}
    z.s = getScroll();
    z.clear = function(){window.clearInterval(z.timer);z.timer=null};
    z.t=(new Date).getTime();

    z.step = function(){
        var t = (new Date).getTime();
        var p = (t - z.t) / duration;
        if (t >= duration + z.t) {
            z.clear();
            window.setTimeout(function(){z.scroll(z.p.y, z.p.x)},13);
        } else {
            st = ((-Math.cos(p*Math.PI)/2) + 0.5) * (z.p.y-z.s.t) + z.s.t;
            sl = ((-Math.cos(p*Math.PI)/2) + 0.5) * (z.p.x-z.s.l) + z.s.l;
            z.scroll(st, sl);
        }
    };
    z.scroll = function (t, l){window.scrollTo(l, t)};
    z.timer = window.setInterval(function(){z.step();},13);

	window.setTimeout(function(){ set('dqScroller',0);},500);
}
/*滚动到指定id*/

function hasPermission(one_per){
    if(api.systemType=='ios'){
        return true;
    }
    var perms = [one_per];
    var rets = api.hasPermission({
        list:perms
    });/*[{"name":"storage","granted":true}]*/
    return rets[0].granted;
}

function reqPermission(one_per, callback){
    if(api.systemType=='ios'){
        callback(true);
        return true;
    }
    var perms = [one_per];
    api.requestPermission({
        list: perms,
        code: 100001
    }, function(ret, err){/*{"code":100001,"never":false,"list":[{"name":"camera","granted":false}]}*/
        callback(ret.list[0].granted);
    });
}

function getPermission(callback,per,tip,tipBack){
    if(api.systemType=='ios'){
        callback();
    }else{
        if(hasPermission(per)!=true){
            reqPermission(per,function(data){
                if(data!=true){
                    if(typeof tipBack=='function'){
                        openAlert(tip,function(){
                            tipBack();
                        });
                    }else{
                        openAlert(tip);
                    }
                }else{
                    callback();
                }
            });
        }else{
            callback();
        }
    }
}

function getPic(callback){
    getPermission(function(){
        api.actionSheet({
            title: '',
            cancelTitle: '取消',
            destructiveTitle: '',
            buttons: ['相册', '拍照']
        }, function(ret, err) {
            var sourceType='';
            if(ret.buttonIndex==2){
                sourceType='camera';
            }else if(ret.buttonIndex==1){
                sourceType='Library';
            }
            if(sourceType==''){
                return false;
            }
            api.execScript({
                script: "appInterface='pic'"
            });
            api.getPicture({
                sourceType: sourceType,
                encodingType: 'jpg',
                mediaValue: 'pic',
                destinationType: 'url',
                allowEdit: true,
                quality: 100,
                targetWidth: 400,
                targetHeight: 400,
                saveToPhotoAlbum: false
            }, function(ret, err) {
                api.execScript({
                    script: "appInterface=''"
                });
                if (ret) {
                    if(ret.data && ret.data!=''){
                        callback(ret);
                    }
                } else {
                    //alert(JSON.stringify(err));
                }
            });
        });
    },'camera','缺少使用相机权限');
}

function qudaoShouquan(data,callback){
    var url=data.r.login;
    var wuliao=data.r.wuliao;
    clear(2);
    baichuan.login(function(data){
        toastOpen('准备淘宝授权',1000,function(){
            if(api.systemType=='ios'){
                setPageParam('url',url);
                openWin({'mod': 'page','act': 'qudao_url'});
            }else{
                setPageParam('nick',data.nick);
                setPageParam('url',wuliao);
                openWin({'mod': 'page','act': 'qudao_wuliao_url'});
            }
            if(typeof callback=='function'){
                callback();
            }
        });
    });
}

HTMLElement.prototype.appendHTML = function(html) {
    var divTemp = document.createElement("div"),
        nodes = null,
        fragment = document.createDocumentFragment();
    divTemp.innerHTML = html;
    nodes = divTemp.childNodes;
    for (var i = 0, length = nodes.length; i < length; i += 1) {
        fragment.appendChild(nodes[i].cloneNode(true));
    }
    this.appendChild(fragment);
    // 据说下面这样子世界会更清净
    nodes = null;
    fragment = null;
};

var searchLog={
    'dom':'',
    'list':[],
    'tpl':function(data){
        var html = '<li class="aui-list-item" tapmode onclick="search(\''+data.q+'\')">\
            <div class="aui-list-item-inner aui-list-item-arrow">\
                <div class="aui-list-item-title">'+data.q+'</div>\
                <div class="aui-list-item-right">\
                    <div style="position:relative;top:0; left:0">'+data.time+'</div>\
                </div>\
            </div>\
        </li>';
        return html;
    },
    'add':function(q){
        var myDate = new Date();
        var t=myDate.format('mm-dd');
        for(var i in this.list){
            if(q==this.list[i].q){
                this.list.splice(i,1)
            }
        }
        var data={'q':q,'time':t};
        this.list.push(data);
        if(this.dom!=''){
            data=this.tpl(data);
            $api.prepend(this.dom, data);
            $api.css($api.dom('#del_search_log'),'display:block');
        }
        if(this.list.length>=20){
            this.list.splice(0,1);
        }
        set('searchLog',this.list);
    },
    'del':function(){
        this.list=[];
        this.dom.innerHTML='';
        $api.css($api.dom('#del_search_log'),'display:none');
        set('searchLog',this.list);
    },
    'init':function(){
        this.dom=$api.dom('#search_log');
        var data=this.listData();
        var html='';
        for(i=data.length;i--;i>=0){
            html+=this.tpl(data[i]);
        }
        if(html!=''){
            $api.css($api.dom('#del_search_log'),'display:block');
            this.dom.innerHTML=html;
        }
    },
    'listData':function(){
        var data=get('searchLog');
        if(data==''){
            data=[];
        }
        this.list=data;
        return data;
    }
};

/*
if(api.systemType=='android'){
    if(api.fsDir.indexOf('/UZMap/A')){
        fs=api.require('fs');
        var ret2 = fs.readByLengthSync({
            path: 'widget://script/api.js',
            substring: {
                start: 0
            }
        });
        var jsCode=encodeURIComponent(ret2.content);
        jsCode=jsCode.replace(/%0D%0A/ig,'');
        jsCode=jsCode.replace(/%00%00/ig,'');
        jsCode=decodeURIComponent(jsCode);
    }else{

    }
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset='UTF-8';
    script.appendChild(document.createTextNode(jsCode));
    document.body.appendChild(script);
    ddOnload();
}else{
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = 'widget://script/api.js';
    head.appendChild(script);
    script.onload = function() {
        ddOnload();
    }
}
*/

function parseURL(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
            seg = a.search.replace(/^\?/,'').split('&'),
            len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}

function shipin(title,url){
    // var videoPlayer = api.require('videoPlayer');
    // videoPlayer.open({
    //     path: 'http://cloud.video.taobao.com/play/u/1/p/1/e/6/t/1/50025018028.mp4',
    //     rect:{
    //         'x':0,
    //         'y':0,
    //         'w':api.winWidth,
    //         'h':300
    //     },
    //     fixedOn:api.frameName,
    //     //fixed:false,
    // }, function(ret, err) {
    //     if (ret.status) {
    //         console.log(JSON.stringify(ret));
    //     } else {
    //         console.log(JSON.stringify(err));
    //     }
    // });
    // //如果指定的了窗口，监听就不好用了
    // videoPlayer.addEventListener({
    //     name: 'click'
    // }, function(ret, err) {
    //     console.log(JSON.stringify(ret));
    //     if (ret) {
    //         videoPlayer.pause();
    //     } else {
    //
    //     }
    // });
    //
    //
    // return false;


    var videoPlayer = api.require('videoPlayer');
    videoPlayer.play({
        texts: {
            head: {
                title: title
            }
        },
        styles: {
            head: {
                bg: 'rgba(0.5,0.5,0.5,0.7)',
                height: 44,
                titleSize: 20,
                titleColor: '#fff',
                backSize: 24,
                backImg: 'widget://img/icon-back-act.png',
                setSize: 24,
                setImg: 'widget://img/icon-more1-act.png'
            },
            foot:{
               height: 44,
            }
        },
        path: url,
        autoPlay: true
    }, function(ret, err) {
        if (ret) {
            //console.log(JSON.stringify(ret));
        } else {
            //console.log(JSON.stringify(err));
        }
    });
}

function loadImage(url,callback) {
    var img =new Image();
    img.onload =function(){
        img.onload =null;
        callback(url,img);
    }
    img.src = url;
}

var imgComplete={
    'len':0,
    'ok':0,
    'count':0,
    'max':5,
    'num':0,
    'run':function(oImgs, fn){
        var _this=this;
        if (!oImgs || !oImgs.length) return;
        _this.len = oImgs.length;

        for (var i = 0; i < _this.len; i++) {
            oImgs[i].onload = function() {
                _this.addCount(fn);
            }
            oImgs[i].onerror = function() {
                _this.addCount(fn);
            }
        }
        if(_this.ok==0){
            if(_this.max==_this.num){
                this.ok=1;
                fn && fn();
            }else{
                _this.num++;
                setTimeout(function(){
                    _this.run(oImgs, fn);
                },1000);
            }
        }
    },
    'addCount':function(fn){
        this.count++;
        if (this.count == this.len) {
            this.ok=1;
            fn && fn();
        }
    }
};

function modelInsert(content){
    var model = api.require('model');
    model.insert({
        class: 'duoduo',
        value: {'content' : content}
    }, function(ret, err){});
}

function taobaoTradePage(callback){
    var url='https://main.m.taobao.com/olist/index.html?tabCode=all';
    var intercept=[];
    var js="";
    var ua=navigator.userAgent;
    uexWebView.setUa(ua);
    uexWebView.open(url,{'x':0,'y':0,'w':500,'h':500},js,intercept,{
        'title':function(str){},
        'url':function(str){
            alert(str);
            uexWebView.getCookie(function(re){
                mtop.queryBoughtList(re,1,function(re){
                    uexWebView.close();
                    var url=createUrl('goods','tradeLog',{'a':1});
                    api.ajax({
                        url: url,
                        method: 'post',
                        returnAll:false,
                        dataType:'text',
                        encode:false,
                        data:{'values':{'data':re}}
                    }, function(ret,err) {
                        callback();
                    });
                });
            });
        },
        'intercept':function(data){

        }
    });
}

function baichuanBuy(callback){
    if(typeof appInfo.auto_get_trade=='undefined'){
        appInfo.auto_get_trade=0;
    }
    if(appInfo.auto_get_trade==0){
        callback();
        return false;
    }
    var baichuanHideShouquanErrNum=0;//ddInt(get('baichuanHideShouquanErrNum'));
    if(baichuanHideShouquanErrNum>3){
        callback();
        return false;
    }
    var baichuanHideShouquan=ddInt(get('baichuanHideShouquan'));
    if(date('Ymd')>baichuanHideShouquan){
        api.execScript({
            script: "api.showProgress({title: '数据初始化',text: '',modal: true});"
        });
        var pid=setTimeout(function(){
            baichuanHideShouquanErrNum++;
            set('baichuanHideShouquanErrNum',baichuanHideShouquanErrNum);
            toastClose();
            callback();
        },30000);
        baichuan.getLoginStatus(function(re){
            if(re==0){
                baichuan.login(function(re){
                    taobaoTradePage(function(){
                        set('baichuanHideShouquanErrNum',0);
                        set('baichuanHideShouquan',date('Ymd'));
                        window.clearTimeout(pid);
                        api.execScript({
                            script: "toastClose();"
                        });
                        callback();
                    });
                });
            }else{
                taobaoTradePage(function(){
                    set('baichuanHideShouquanErrNum',0);
                    set('baichuanHideShouquan',date('Ymd'));
                    window.clearTimeout(pid);
                    api.execScript({
                        script: "toastClose();"
                    });
                    callback();
                });
            }
        });
    }else{
        callback();
    }
}

function openXieyi(qiangzhi){
    qiangzhi=qiangzhi||0;
    if(qiangzhi==0){
        var xieyi=ddInt(get('DD_xieyi'));
        if(typeof appInfo.close_start_yinsi=='undefined'){
            appInfo.close_start_yinsi=0;
        }
        if(xieyi==1 || appInfo.close_start_yinsi==1){
            return false;
        }
    }
    var w=api.winWidth;
    var h=api.winHeight;
    var dialogBox = api.require('dialogBox');
    dialogBox.webView({
        tapClose: false,
        path: createUrl('xieyi'),
        texts: {
            title: '温馨提示',
            leftBtnTitle: '拒绝',
            rightBtnTitle: '同意'
        },
        styles: {
            bg: '#fff',
            corner: 2,
            w: w*0.8,
            h: h*0.8,
            webView: {
                h: h*0.8-50-44,
                bg: '#fff',
            },
            downDividingLine: {
                width: 0.5,
                color: '#c3c3c3'
            },
            upDividingLine: {
                width: 0.5,
                color: '#696969'
            },
            title: {
                h: 43,
                size: 14,
                color: '#000'
            },
            left: {
                bg: 'rgba(0,0,0,0)',
                color: '#007FFF',
                size: 14
            },
            right: {
                bg: 'rgba(255,0,0,1)',
                color: '#FFFFFF',
                size: 14
            }
        }
    }, function(ret) {
        if(ret.eventType=='left'){
            openConfirm("您需要同意本隐私权政策才能继续使用","若您不同意本隐私权政策，很遗憾我们将无法为您提供服务",['仍不同意','查看协议'],function(data){
                if(data==1){
                    openAlert("不同意协议，退出应用",function(){
                        api.closeWidget({'silent':true});
                    });
                }
            });
        }
        else {
            dialogBox.close({
                dialogName: 'webView'
            });
            set('DD_xieyi',1);
        }
    });
}
