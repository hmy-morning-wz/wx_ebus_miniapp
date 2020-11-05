module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1599097260855, function(require, module, exports) {
var __TEMP__ = require('./tracker/index');var Tracker = __REQUIRE_DEFAULT__(__TEMP__);
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.default = Tracker;
}, function(modId) {var map = {"./tracker/index":1599097260856}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1599097260856, function(require, module, exports) {
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __TEMP__ = require('../utils/common');var logInfo = __TEMP__['logInfo'];
var __TEMP__ = require('../utils/unify');var unify = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('../utils/alipay');var getBasicInfo = __TEMP__['getBasicInfo'];
var __TEMP__ = require('./mtr');var MTR = __TEMP__['MTR'];
var __TEMP__ = require('../config');var CONFIG = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('./miniapp');var Hook = __TEMP__['Hook'];var TrackerPage = __TEMP__['TrackerPage'];var TrackerComponent = __TEMP__['TrackerComponent'];var TrackerApp = __TEMP__['TrackerApp'];

var TrackerClass = function () {
    function TrackerClass(data) {
        _classCallCheck(this, TrackerClass);

        this.data = data;
        this.Mtr = data.Mtr;
        this.App = data.App;
        this.Page = data.Page;
        this.Component = data.Component;
    }

    _createClass(TrackerClass, [{
        key: "log",
        value: function log(seed, p) {
            return this.Mtr.log(seed, p);
        }
    }, {
        key: "err",
        value: function err(r, seed, p) {
            return this.Mtr.err(r, seed, p);
        }
    }, {
        key: "click",
        value: function click(seed, param) {
            return this.Mtr.click(null, seed, param);
        }
    }, {
        key: "calc",
        value: function calc(seed, n, p4) {
            return this.Mtr.calc(null, seed, n, p4);
        }
    }, {
        key: "expo",
        value: function expo(seed, dir, param) {
            return this.Mtr.expo(null, seed, dir, param);
        }
    }, {
        key: "setUserId",
        value: function setUserId(userId) {
            this.Mtr.setUserId(userId);
        }
    }, {
        key: "getUserId",
        value: function getUserId() {
            return this.Mtr.getUserId();
        }
    }, {
        key: "api",
        value: function api(data) {
            return this.Mtr.api(data);
        }
    }, {
        key: "setData",
        value: function setData(key, value) {
            return this.Mtr.setData(key, value);
        }
    }]);

    return TrackerClass;
}();

function initMtr() {
    var Mtr = new MTR(CONFIG);
    Mtr.startTime = +Date.now();
    if (Mtr.stat_sw) {
        // true = on 
        getBasicInfo(function (baseInfo) {
            _extends(Mtr, baseInfo);
            Mtr.baseInfo = baseInfo;
            Mtr.start();
            Mtr.mtrDebug && logInfo("App init start");
        });
        if (CONFIG.my) {
            if (unify.isIDE) {
                Mtr.workspaceId = "develop";
            } else {
                unify.canIUse("getRunScene") && unify.getRunScene({
                    success: function success(res) {
                        Mtr.mtrDebug && logInfo("getRunScene", res);
                        if (res.envVersion === "release" || res.envVersion === "gray") {
                            Mtr.mtrDebug = false;
                        } else {
                            Mtr.workspaceId = res.envVersion;
                        }
                    }
                });
            }
        }
    }
    var tracker = {
        Mtr: Mtr,
        App: new TrackerApp(Mtr),
        Page: new TrackerPage(Mtr),
        Component: new TrackerComponent(Mtr)
    };
    return new TrackerClass(tracker);
}
var Tracker = initMtr();
(function () {
    var _APP = App,
        _Page = Page,
        _Component = Component;
    //Nn = {};
    App = function App(app) {
        var Mtr = Tracker.Mtr;
        _extends(Mtr, app.mtrConfig || {
            appId: unify.canIUse("getAppIdSync") && unify.getAppIdSync && unify.getAppIdSync().appId,
            server: ["https://webtrack.allcitygo.com:8088/event/upload"],
            appName: "未配置",
            mtrDebug: false
        });
        Hook(app, "onLaunch", Tracker.App.onLaunch());
        Hook(app, "onShow", Tracker.App.onShow());
        Hook(app, "onHide", Tracker.App.onHide());
        Mtr.stat_auto_apperr && Hook(app, "onError", Tracker.App.onError());
        app.Tracker = Tracker;
        return _APP(app);
    };
    Page = function Page(page) {
        var Mtr = Tracker.Mtr;
        if (!('onTap' in page)) {
            page.onTap = function () {};
        }
        if (!('onAppear' in page)) {
            page.onAppear = function () {};
        }
        if (!('onNopAppear' in page)) {
            page.onNopAppear = function () {};
        }
        Hook(page, "onLoad", Tracker.Page.onLoad());
        Hook(page, "onShow", Tracker.Page.onShow());
        Hook(page, "onHide", Tracker.Page.onHide());
        Hook(page, "onUnload", Tracker.Page.onUnload());
        if (Mtr.stat_reach_bottom) {
            Hook(page, "onReachBottom", Tracker.Page.onReachBottom());
        }
        if (Mtr.stat_pull_down_fresh) {
            Hook(page, "onPullDownRefresh", Tracker.Page.onPullDownRefresh());
        }
        if (Mtr.stat_page_scroll) {
            Hook(page, "onPageScroll", Tracker.Page.onPageScroll());
        }
        if (Mtr.stat_auto_click) {
            Tracker.Page._hook(page);
        }
        page.$mtr_click = function (seed, param) {
            Mtr.click(page.route, seed, param);
        };
        page.$mtr_expo = function (seed, dir, param) {
            Mtr.expo(page.route, seed, dir, param);
        };
        page.$mtr_calc = function (r, n, p4) {
            Mtr.calc(page.route, r, n, p4);
        };
        return _Page(page);
    };
    Component = function Component(component) {
        if (component.methods) {
            if (!('onNopTap' in component.methods)) {
                component.methods.onNopTap = function () {};
            }
            if (!('onNopAppear' in component.methods)) {
                component.methods.onNopAppear = function () {};
            }
        }
        Tracker.Component._hook(component);
        var Mtr = Tracker.Mtr;
        component.$mtr_click = function (seed, param) {
            Mtr.click(null, seed, param);
        };
        component.$mtr_expo = function (seed, dir, param) {
            Mtr.expo(null, seed, dir, param);
        };
        component.$mtr_calc = function (r, n, p4) {
            Mtr.calc(null, r, n, p4);
        };
        return _Component(component);
    };
})();
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.default = Tracker;
}, function(modId) { var map = {"../utils/common":1599097260857,"../utils/unify":1599097260859,"../utils/alipay":1599097260860,"./mtr":1599097260861,"../config":1599097260862,"./miniapp":1599097260863}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1599097260857, function(require, module, exports) {
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var __TEMP__ = require('../global');
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var getPagePath = exports.getPagePath = function getPagePath() {
    try {
        // var a = getCurrentPages()
        var a = getCurrentPages().pop();
        return a && a.route;
    } catch (c) {
        console.warn('Tracker get current page path error:' + c);
    }
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var getMainInfo = exports.getMainInfo = function getMainInfo() {
    var a = { url: getPagePath() };
    //console.log(a)
    return a;
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var dateFormat = exports.dateFormat = function dateFormat(t) {
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yyyy-MM-dd hh:mm:ss.S';

    var fmt = format; //|| 'yyyy-MM-dd hh:mm:ss.S'
    if ((typeof t === 'undefined' ? 'undefined' : _typeof(t)) !== 'object') {
        t = new Date(t);
    }
    var o = {
        'M+': t.getMonth() + 1,
        'd+': t.getDate(),
        'h+': t.getHours(),
        'm+': t.getMinutes(),
        's+': t.getSeconds(),
        'q+': Math.floor((t.getMonth() + 3) / 3),
        S: t.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (t.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }return fmt;
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var dealExtra = exports.dealExtra = function dealExtra(param) {
    if (!param) return {};
    var prefix = "mtr-";
    var out = {};
    for (var n in param) {
        if (param[n] != undefined) {
            var a = 0 === n.indexOf(prefix) ? n : prefix + n;
            out[a] = param[n];
        }
    }return out;
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var extend = exports.extend = function extend(e, t) {
    for (var r in t) {
        void 0 !== t[r] && (e[r] = t[r]);
    }return e;
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var _encodeStr = exports._encodeStr = function _encodeStr(e) {
    return 'string' == typeof e ? e.replace(/=|,|\^|\$\$/g, function (e) {
        switch (e) {
            case ',':
                return '%2C';
            case '^':
                return '%5E';
            case '$$':
                return '%24%24';
            case '=':
                return '%3D';
            default:
                return ' ';
        }
    }) : e;
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var _formatExinfoParam = exports._formatExinfoParam = function _formatExinfoParam(e) {
    var t = [];
    for (var r in e) {
        if (e.hasOwnProperty(r)) {
            var msg = "" + e[r];
            if ('[object Object]' === msg) {
                msg = JSON.stringify(e[r]);
                if (msg.length >= 1024) {
                    msg = msg.substring(0, 1024);
                }
            }
            t.push(r + '=' + _encodeStr(msg));
        }
    }
    return t.join('^');
};
var TAG = 'Tracker';
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.logger = function logger(tag) {
    var _console;

    for (var _len = arguments.length, payload = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        payload[_key - 1] = arguments[_key];
    }

    (_console = console).debug.apply(_console, ['%c [' + TAG + ']' + tag, 'color: #649191; font-weight: bold'].concat(payload));
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.logInfo = function logInfo(tag) {
    var _console2;

    for (var _len2 = arguments.length, payload = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        payload[_key2 - 1] = arguments[_key2];
    }

    (_console2 = console).log.apply(_console2, ['%c [' + TAG + ']' + tag, 'color: #b10ff7; font-weight: bold'].concat(payload));
};
//事件英文名称，可由小写字母、下划线、数字组成，并以小写字母开头，（长度为32个字符以内），不能重复，保存后不可修改
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var formatSeed = exports.formatSeed = function formatSeed(seed) {
    var msg = "" + seed;
    if (msg === '[object Object]') {
        msg = _formatExinfoParam(seed); //encodeURIComponent(JSON.stringify(seed))
    }
    msg = encodeURIComponent(msg);
    if (msg.indexOf('%') > -1) {
        var reg = new RegExp('%', 'g');
        msg = msg.replace(reg, "");
    }
    if (msg.length >= 32) {
        msg = msg.substring(0, 32);
    }
    return msg.toLowerCase();
};
}, function(modId) { var map = {"../global":1599097260858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1599097260858, function(require, module, exports) {

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1599097260859, function(require, module, exports) {
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var api = {
    getStorage: function getStorage(data) {},
    setStorage: function setStorage(_ref) {
        var key = _ref.key,
            data = _ref.data;
    },
    getAppIdSync: function getAppIdSync() {
        return;
    },
    canIUse: function canIUse(api) {
        return;
    },
    reportAnalytics: function reportAnalytics(seed, data) {},
    getStorageSync: function getStorageSync(_ref2) {
        var key = _ref2.key;

        return;
    },
    setStorageSync: function setStorageSync(_ref3) {
        var key = _ref3.key,
            data = _ref3.data;
    },
    getSystemInfo: function getSystemInfo(data) {
        return;
    },
    getNetworkType: function getNetworkType(data) {},
    request: function request(data) {},
    getLocation: function getLocation(data) {},
    getRunScene: function getRunScene(data) {},
    isCollected: function isCollected(data) {},

    isIDE: false
};
var myApi = typeof my !== 'undefined';
//@ts-ignore
var wxApi = typeof wx !== 'undefined';
if (myApi) {
    api = _extends(api, my);
} else if (wxApi) {
    //@ts-ignore
    api = _extends(api, wx);
}
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.default = api;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1599097260860, function(require, module, exports) {
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var __TEMP__ = require('./common');var logger = __TEMP__['logger'];
var __TEMP__ = require('./unify');var unify = __REQUIRE_DEFAULT__(__TEMP__);
var canIUseRequest = unify.canIUse("request");
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var setStorageSync = exports.setStorageSync = function setStorageSync(key, data) {
    unify.setStorageSync({ key: key, data: data });
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var setStorage = exports.setStorage = function setStorage(key, data) {
    unify.setStorage({ key: key, data: data });
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var getStorageSync = exports.getStorageSync = function getStorageSync(key) {
    var o = unify.getStorageSync({ key: key });
    console.log(key, o);
    return o.data;
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var guid = exports.guid = function guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
        var t = 16 * Math.random() | 0,
            r = "x" === e ? t : 3 & t | 8;
        return r.toString(16);
    });
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var setUID = exports.setUID = function setUID(key, uid) {
    try {
        var key = key || "mtr-mdap";
        setStorage(key, uid);
        return uid;
    } catch (b) {}
};
//userId
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var getUUid = exports.getUUid = function getUUid(callback) {
    var uid;
    var key = "mtr-mdap";
    try {
        unify.getStorage({
            key: key,
            success: function success(res) {
                uid = res && res.success && res.data;
                uid = uid ? uid : (uid = guid(), setUID(key, uid));
            },
            complete: function complete() {
                callback && callback(uid);
            }
        });
    } catch (err) {
        console.error(err);
        callback && callback(uid);
    }
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var getSessionId = exports.getSessionId = function getSessionId() {
    return guid();
};
function getSystemInfo() {
    var info = {};
    return new Promise(function (r, _) {
        try {
            unify.getSystemInfo({
                success: function success(res) {
                    info = {
                        deviceModel: encodeURIComponent(res.model),
                        pixelRatio: res.pixelRatio,
                        screen: { width: res.windowWidth, height: res.windowHeight },
                        language: res.language,
                        appVersion: res.version,
                        osVersion: encodeURIComponent(res.system),
                        os: encodeURIComponent(res.platform),
                        sessionId: getSessionId()
                    };
                },
                complete: function complete() {
                    r(info);
                }
            });
        } catch (err) {
            console.error(err);
            r(info);
        }
    });
}
function getNetworkType() {
    return new Promise(function (r, _) {
        var info = {};
        unify.getNetworkType({
            success: function success(res) {
                try {
                    info.networkType = res && res.networkType;
                } catch (err) {
                    console.log(err);
                }
            },
            complete: function complete() {
                r(info);
            }
        });
    });
}
function getBasicStorage() {
    return new Promise(function (r, _) {
        var key = "mtr-mdap-data";
        var info = {};
        try {
            unify.getStorage({
                key: key,
                success: function success(res) {
                    if (res && res.data) {
                        info = res.data || {};
                    }
                    //uid = res && res.success && res.data;
                    //uid = uid ? uid : ((uid = guid()), setUID(key, uid));
                },
                complete: function complete() {
                    r(info);
                }
            });
        } catch (a) {
            r(info);
        }
    });
}
function saveBasicStorage(info) {
    unify.setStorage({
        key: "mtr-mdap-data",
        data: info
    });
}
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var getBasicInfo = exports.getBasicInfo = function getBasicInfo(callback) {
    var p = [getBasicStorage(), getSystemInfo(), getNetworkType()];
    return Promise.all(p).then(function (res) {
        //console.log("getBasicInfo",res)
        var info = _extends(res[0], res[1], res[2]);
        var uid = info.uid;
        if (!uid) {
            getUUid(function (res) {
                info.uid = res || guid();
                saveBasicStorage(info);
                callback(info);
            });
        } else {
            callback(info);
        }
    })["catch"](function (err) {
        console.error(err);
        callback({});
    });
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var requestNext = exports.requestNext = function requestNext(that) {
    if (that && that.requestList && that.requestList.length > 0) {
        var send = that.requestList.shift();
        that.requestTimestamp = Date.now();
        that && that.mtrDebug && logger("request");
        that.sendIng = 1;
        var url = send.url;

        if (url.indexOf("_=") == -1) {
            send.url = url.indexOf("?") > -1 ? url + "&_=" + that.requestTimestamp : url + "?_=" + that.requestTimestamp;
        }
        canIUseRequest && unify.request(send);
    }
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var request = exports.request = function request(url, msg, that) {
    var send = {
        url: url,
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: "data=" + encodeURIComponent(msg),
        method: "POST",
        dataType: "text",
        noTracker: true,
        success: function success() {
            that && that.sendSuccess++;
            that && that.mtrDebug && logger("send Success");
        },
        fail: function fail(res) {
            that && that.sendError++;
            that && that.mtrDebug && console.warn("Tracker requestres send fail", res);
            unify.reportAnalytics("tracker_send_fail", res);
        },
        complete: function complete() {
            that.sendIng = 0;
            that && that.mtrDebug && logger("send complete");
            requestNext(that);
        }
    };
    that && that.sendCounter++;
    if (that && that.requestList) {
        that.requestList.push(send);
        if (that.sendIng === 0 || Date.now() - that.requestTimestamp > 30000) {
            requestNext(that);
        }
    } else {
        canIUseRequest && unify.request(send);
    }
};
function cutUrlSearch(t) {
    return t && "string" == typeof t ? t.replace(/^(.*?https?:)?\/\//, "").replace(/\?.*$/, "") : "";
}
function checkAPI(t, e) {
    if (!t || "string" != typeof t) {
        return !1;
    }
    var n = /webtrack\.allcitygo\.com[\w-]*/.test(t); ///openmonitor(\.(dev|sit|test))?\.alipay[\w-]*/.test(t);
    //webtrack
    return !n && e && (n = /(\.png)|(\.gif)|(alicdn\.com)/.test(t)), !n;
}
function getPropertyValue(j, arr) {
    if (!arr) return undefined;
    for (var k in j) {
        if (arr.indexOf(k) > -1) {
            return "" + j[k];
        }
    }
    return undefined;
}
function ext(t) {
    for (var _len = arguments.length, _ = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        _[_key - 1] = arguments[_key];
    }

    for (var e = 1, n = arguments.length; e < n; e++) {
        var r = arguments[e];
        for (var o in r) {
            Object.prototype.hasOwnProperty.call(r, o) && (t[o] = r[o]);
        }
    }
    return t;
}
function isObject(d) {
    return "object" == (typeof d === "undefined" ? "undefined" : _typeof(d));
}
function isString(d) {
    return "string" == typeof d;
}
function isJSON(str) {
    var pass_object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (pass_object && isObject(str)) return true;
    if (!isString(str)) return false;
    str = str.replace(/\s/g, "").replace(/\n|\r/, "");
    if (/^\{(.*?)\}$/.test(str)) return (/"(.*?)":(.*?)/g.test(str)
    );
    if (/^\[(.*?)\]$/.test(str)) {
        return str.replace(/^\[/, "").replace(/\]$/, "").replace(/},{/g, "}\n{").split(/\n/).map(function (s) {
            return isJSON(s);
        }).reduce(function (_, curr) {
            return !!curr;
        });
    }
    return false;
}
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.hookRequest = function hookRequest(mtr) {
    //@ts-ignore
    var myapi = mtr.my ? my : mtr.wx ? wx : undefined;
    if ("undefined" != typeof myapi && myapi && "function" == typeof myapi.request) {
        var _request = myapi.request;
        var reqDes = Object.getOwnPropertyDescriptor(myapi, "request");
        reqDes && reqDes.writable && (myapi.request = function (sendData) {
            var t0 = new Date().getTime();
            var sendData2 = sendData;
            if (sendData && !sendData.noTracker && sendData.url) {
                var api = cutUrlSearch(sendData.url);
                if (!checkAPI(api, true)) {
                    return _request.call(my, sendData2);
                }
                /*
                var headers = sendData && sendData.headers;
                (headers && "object" == typeof headers) || (headers = {});
                */
                var p = {
                    success: function success(res) {
                        "function" == typeof sendData.success && sendData.success(res);
                        var t1 = new Date().getTime(),
                            code = "",
                            msg = "",
                            response = "";
                        if (res && res.data && (!sendData.dataType || sendData.dataType === "json" || "object" == _typeof(res.data))) {
                            var d = res.data;
                            code = getPropertyValue(d, ['code', 'stat', 'status', 'success']);
                            /* (d.code!=undefined && ""+d.code) ||
                             (d.stat!=undefined && ""+d.stat) ||
                             (d.status!=undefined && ""+d.status)  ||
                             (d.success!=undefined && ""+d.success)  || undefined*/
                            if (code == undefined && mtr.code && mtr.code.length) code = getPropertyValue(d, mtr.code);
                            msg = getPropertyValue(d, ['msg', 'message', 'subMsg', 'errorMsg', "ret", 'errorResponse']);
                            /*  d.msg ||
                              d.message ||
                              d.subMsg ||
                              d.errorMsg ||
                              d.ret ||
                              d.errorResponse */
                            if (msg == undefined && mtr.msg && mtr.msg.length) code = getPropertyValue(d, mtr.msg) || "";
                            if ('string' != typeof msg && "object" == (typeof msg === "undefined" ? "undefined" : _typeof(msg))) {
                                code = code || msg.code;
                                msg = msg.msg || msg.message || msg.info || msg.ret || JSON.stringify(msg);
                            }
                            response = (response = JSON.stringify(d)).substr(0, 1000);
                        } else if (res) {
                            try {
                                var d = res.data || res;
                                response = (response = JSON.stringify(d)).substr(0, 1000);
                                if (res.data && "string" == typeof res.data && isJSON(res.data)) {
                                    d = JSON.parse(res.data);
                                    code = getPropertyValue(d, ['code', 'stat', 'status', 'success']);
                                    /* (d.code!=undefined && ""+d.code) ||
                                     (d.stat!=undefined && ""+d.stat) ||
                                     (d.status!=undefined && ""+d.status)  ||
                                     (d.success!=undefined && ""+d.success)  || undefined*/
                                    if (code == undefined && mtr.code && mtr.code.length) code = getPropertyValue(d, mtr.code);
                                    msg = getPropertyValue(d, ['msg', 'message', 'subMsg', 'errorMsg', "ret", 'errorResponse']);
                                    /* d.msg ||
                                     d.message ||
                                     d.subMsg ||
                                     d.errorMsg ||
                                     d.ret ||
                                     d.errorResponse */
                                    if (msg == undefined && mtr.msg && mtr.msg.length) {
                                        code = getPropertyValue(d, mtr.msg) || "";
                                    }
                                    if ('string' != typeof msg && "object" == (typeof msg === "undefined" ? "undefined" : _typeof(msg))) {
                                        code = code || msg.code;
                                        msg = msg.msg || msg.message || msg.info || msg.ret || JSON.stringify(msg);
                                    }
                                }
                            } catch (e) {
                                console.warn(e);
                            }
                        }
                        var time = t1 - t0;
                        var bizSuccess = code == "20000" || code == "200" || code == "0" || msg == "Success" || msg == "success" || msg == "SUCCESS";
                        if (bizSuccess) {
                            mtr.stat_api_success && time > mtr.stat_api_long_time && mtr.api({
                                api: api,
                                success: true,
                                time: time,
                                code: code,
                                msg: msg,
                                bizSuccess: bizSuccess,
                                response: response
                            });
                        } else {
                            mtr.stat_api_fail && mtr.api({
                                api: api,
                                success: true,
                                time: time,
                                code: code,
                                msg: msg,
                                bizSuccess: bizSuccess,
                                response: response
                            });
                        }
                    },
                    fail: function fail(res) {
                        /**
                         * data:{bizSuc: false, code: 401, message: "用户未登录", msg: "用户未登录", suc: false}
                        error
                        :
                        19
                        errorMessage
                        :
                        "http status error"
                        headers
                        :
                        {Connection: "close", Content-Type: "application/json;charset=UTF-8", Date: "Thu, 16 Jan 2020 12:24:03 GMT", Server: "openresty", Transfer-Encoding: "chunked"}
                        status
                        :
                        401
                         */
                        "function" == typeof sendData.fail && sendData.fail(res);
                        var t1 = new Date().getTime();
                        var code = "";
                        var msg = "";
                        var response = "";
                        if (res) {
                            code = res.data && "object" == _typeof(res.data) && (res.data.code || res.data.status || res.data.error) || res.status || res.error;
                            msg = res.data && "object" == _typeof(res.data) && (res.data.msg || res.data.message) || res.errorMessage || res.error;
                            var d = res.data || res;
                            response = (response = JSON.stringify(d)).substr(0, 1000);
                            //if (res.data) { response = (response = JSON.stringify(res.data)).substring(0, 1000) }
                            //response = response || (response = JSON.stringify(res)).substring(0, 1000)
                        }
                        mtr.stat_api_fail && mtr.api({
                            api: api,
                            success: false,
                            time: t1 - t0,
                            code: code,
                            msg: msg,
                            bizSuccess: false,
                            response: response
                        });
                    }
                };
                sendData2 = ext({}, sendData2, p);
            }
            return _request.call(myapi, sendData2);
        });
    }
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.hookGetLocation = function hookGetLocation(mtr) {
    //@ts-ignore
    var myapi = mtr.my ? my : mtr.wx ? wx : undefined;
    if ("undefined" != typeof myapi && myapi && "function" == typeof myapi.getLocation) {
        var _getLocation = myapi.getLocation;
        var des = Object.getOwnPropertyDescriptor(myapi, "getLocation");
        des && des.writable && (myapi.getLocation = function (data) {
            var p = data;
            if (data) {
                p = {
                    success: function success(res) {
                        "function" == typeof data.success && data.success(res);
                        var longitude = res.longitude,
                            latitude = res.latitude,
                            city = res.city,
                            cityAdcode = res.cityAdcode,
                            district = res.district,
                            districtAdcode = res.districtAdcode;

                        var location = { longitude: longitude, latitude: latitude };
                        city && (location.city = city);
                        cityAdcode && (location.cityAdcode = cityAdcode);
                        district && (location.district = district);
                        districtAdcode && (location.districtAdcode = districtAdcode);
                        mtr.location = location;
                    }
                };
                p = ext({}, data, p);
            }
            return _getLocation.call(myapi, p);
        });
    }
};
}, function(modId) { var map = {"./common":1599097260857,"./unify":1599097260859}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1599097260861, function(require, module, exports) {
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __TEMP__ = require('../utils/common');var logger = __TEMP__['logger'];var logInfo = __TEMP__['logInfo'];var dateFormat = __TEMP__['dateFormat'];var _encodeStr = __TEMP__['_encodeStr'];var _formatExinfoParam = __TEMP__['_formatExinfoParam'];var getMainInfo = __TEMP__['getMainInfo'];var formatSeed = __TEMP__['formatSeed'];var dealExtra = __TEMP__['dealExtra'];
var __TEMP__ = require('../utils/alipay');var request = __TEMP__['request'];var setStorage = __TEMP__['setStorage'];
var __TEMP__ = require('../utils/unify');var unify = __REQUIRE_DEFAULT__(__TEMP__);
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var MTR = exports.MTR = function () {
    function MTR(config) {
        _classCallCheck(this, MTR);

        this.cfg = {
            pageSeedId: "MINI_MTRACKER_AP_PAGE",
            clkSeedId: "MINI_MTRACKER_AP_CLK",
            calcSeedId: "MINI_MTRACKER_AP_CALC",
            expoSeedId: "MINI_MTRACKER_AP_EXPO",
            syslogSeedId: "MINI_MTRACKER_AP_SYSLOG",
            apiSeedId: "MINI_MTRACKER_AP_API"
        };
        this.data = {};
        this.userId = "";
        this.appVersion = ""; // app version
        this.version = ""; //mini app version
        this.mtrVer = ""; // Tracker js versions
        this.mtrDebug = false;
        this.mPageState = ""; // m.mPageState,
        this.platformType = "";
        this.bizScenario = ""; //m.bizScenario,
        this.autoStart = true;
        this.autoError = true;
        this.autoClick = true;
        this.eventType = "touchstart";
        this.bizType = "MiniBehavior";
        this.expotTimeout = 300;
        this.servers = [];
        //this.expoType
        this.expoSection = [-0.3, 0.3];
        this.appId = "";
        this.url = null; //p.URL,
        this._ready = false;
        this.sendError = 0;
        this.sendSuccess = 0;
        this.sendCounter = 0;
        this.timezoneOffset = +new Date().getTimezoneOffset();
        this.requestList = [];
        this.batchSendList = []; //stat_batch_send
        this.callList = [];
        this.requestTimestamp = 0;
        this.sendIng = 0;
        this.sn = 0;
        this.visitorList = [];
        this.timezone = 8; //目标时区时间，东八区
        this.sessionId = "";
        this.appName = "";
        this.mPlatformType = "";
        this.deviceModel = "";
        this.location = "";
        this.workspaceId = "";
        this.ref = "";
        this.os = "";
        this.osVersion = "";
        this.networkType = "";
        this.language = "";
        this.screen = {};
        this.cPageUrl = "";
        this.jumpPage = "";
        this.pageJumpTime = 0;
        this.pageLoadTime = 0;
        this.startTime = 0;
        this.pageHideTime = 0;
        this.isCollected = false;
        this.prefix = 'mtr-';
        this.stat_share_app = !1;
        this.stat_pull_down_fresh = !1;
        this.stat_page_scroll = !1;
        this.stat_hide = true;
        this.stat_unload = !1;
        this.stat_reach_bottom = !1;
        this.stat_auto_click = true;
        this.stat_api = true;
        this.stat_api_success = true;
        this.stat_api_long_time = 3000;
        this.stat_api_fail = true;
        this.baseInfo = {};
        this.code = []; //request hook code 码
        this.msg = []; //request hook msg 码
        this.refAction = '';
        this.scene = '-';
        this.referrerAppId = '-';
        this.refActionList = [];
        this.stat_app_launch = false;
        this.stat_app_show = false;
        this.stat_auto_expo = false;
        this.stat_sw = true;
        this.stat_batch_send = false;
        this.batchSendTimerId = 0;
        _extends(this, config);
        console.debug("offset_GMT", this.timezoneOffset);
    }

    _createClass(MTR, [{
        key: "_start",
        value: function _start() {
            this._ready = true;
            logInfo("_start", this._ready, this.callList);
            while (this.callList && this.callList.length) {
                var send = this.callList.shift();
                send && this._remoteLog(send, { batchSend: true, time: 100 });
            }
        }
    }, {
        key: "start",
        value: function start() {
            var _this = this;

            if (typeof this.server === "string") {
                this.servers.push(this.server);
            } else if (Array.isArray(this.server)) {
                this.servers = this.servers.concat(this.server);
            }
            if (!this.baseInfo.sn || typeof this.baseInfo.sn != "number") {
                unify.getStorage({
                    key: "mtr-sn",
                    success: function success(res) {
                        _this.baseInfo.sn = res.data || res.APDataStorage || 0;
                        if (typeof _this.baseInfo.sn != "number") {
                            _this.baseInfo.sn = 0;
                        }
                        logInfo("mtr-sn", _this.baseInfo.sn);
                    },
                    complete: function complete() {}
                });
            }
            if (!this.userId) {
                unify.getStorage({
                    key: "mtr-userId",
                    success: function success(res) {
                        _this.userId = res.data || res.APDataStorage;
                        _this.baseInfo.userId = _this.userId;
                        setStorage("mtr-mdap-data", _this.baseInfo);
                        logInfo("mtr-userId", _this.userId);
                    },
                    complete: function complete() {
                        _this.autoStart && _this._start();
                    }
                });
            } else {
                this.autoStart && this._start();
            }
        }
    }, {
        key: "batchSend",
        value: function batchSend() {
            if (this.batchSendList.length) {
                var that = this;
                var msg = this.batchSendList /*.map((t)=>encodeURIComponent(t))*/.join('^next=');
                this.batchSendList = [];
                this.servers && this.servers.forEach(function (s) {
                    s.indexOf("https://") > -1 && request(s, msg, that);
                });
            }
        }
    }, {
        key: "_send",
        value: function _send(msg) {
            var _this2 = this;

            var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var that = this;
            if (this.stat_sw && this.servers) {
                // batchSendList:any[] = []//stat_batch_send
                if (this.stat_batch_send && option.batchSend) {
                    this.batchSendList.push(msg);
                    if (this.batchSendTimerId) {
                        clearTimeout(this.batchSendTimerId);
                    }
                    this.batchSendTimerId = setTimeout(function () {
                        _this2.batchSendTimerId = 0;
                        _this2.batchSend();
                    }, option.time || 1000);
                } else {
                    this.servers.forEach(function (s) {
                        s.indexOf("https://") > -1 && request(s, msg, that);
                    });
                }
            }
        }
    }, {
        key: "_trueUserId",
        value: function _trueUserId() {
            return this.userId || "VISITOR";
        }
    }, {
        key: "_getSessionId",
        value: function _getSessionId() {
            return this.sessionId;
        }
    }, {
        key: "_getUUid",
        value: function _getUUid() {
            return this.baseInfo.uid;
        }
    }, {
        key: "_formatRemoteParam",
        value: function _formatRemoteParam(msg) {
            var param4 = _extends({}, this.data, { user_id: this._trueUserId(), fullURL: this.url, txSuc: this.sendSuccess, txCnt: this.sendCounter, txErr: this.sendError });
            this.bizType && (param4.bizType = this.bizType);
            this.appVersion && (param4.appVersion = this.appVersion);
            this.appName && (param4.appName = this.appName);
            this.bizScenario && (param4.mBizScenario = this.bizScenario);
            this.mPageState && (param4.mPageState = this.mPageState);
            this.mPlatformType && (param4.mPlatformType = this.mPlatformType);
            this.deviceModel && (param4.deviceModel = this.deviceModel);
            if (this.location) {
                _extends(param4, this.location);
            }
            //this.lauchOpts && (param4.lauchOpts = JSON.stringify(this.lauchOpts))
            msg.param4 ? msg.param4 = _extends(param4, msg.param4) : msg.param4 = param4;
            if ('next' in msg.param4) {
                delete msg.param4.next;
            }
            return msg;
        }
    }, {
        key: "_now",
        value: function _now() {
            var nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
            var targetDate = new Date(nowDate + this.timezoneOffset * 60 * 1000 + this.timezone * 60 * 60 * 1000);
            return targetDate;
        }
    }, {
        key: "_getSN",
        value: function _getSN() {
            return this.baseInfo && this.baseInfo.sn++;
        }
        /*
        *
        *
        # 字段名称
        字段 01	日志头 D-VM
        字段 02	客户端日志时间
        字段 03	客户端 ID
        字段 04	客户端版本
        字段 05	日志版本
        字段 06	终端 ID
        字段 07	会话 ID
        字段 08	用户 ID
        字段 09	行为 ID
        字段 10	行为状态
        字段 11	行为状态消息
        字段 12	子应用 ID
        字段 13	子应用版本
        字段 14	视图 ID
        字段 15	自动化埋点的 contentId
        字段 16	埋点 ID
        字段 17	url
        字段 18	行为类型
        字段 19	日志类型
        字段 20	扩展 1
        字段 21	扩展 2
        字段 22	扩展 3
        字段 23	扩展 4
        字段 24	sourceId营销来源
        字段 25	页面流水号
        字段 26	utdid
        字段 27	ucid 用例编号
        字段 28	索引号
        字段 29	上一个 VIEWID
        字段 30	当前 VIEWID
        字段 31	当前 ACTIONID
        字段 32	当前 ACTIONTOKEN
        字段 33	当前 ACTIONDESC
        字段 34	手机型号
        字段 35	操作系统版本
        字段 36	网络类型
        字段 37	内部版本号
        字段 38	渠道号
        字段 39	语言
        字段 40	hotPatch 版本号
        字段 41	Android: CPU CoreNum
        字段 42	Android: CPU MaxFreq，单位 MHz
        字段 43	Android: TotalMem，单位 MB
        字段 44	基础额外字段
        字段 45	UserSessionId
        字段 46	分辨率
        *
        * */

    }, {
        key: "_packFinalData",
        value: function _packFinalData(data) {
            data.param4 = _extends({
                mtrVer: this.mtrVer || "-",
                mtrSeed: data.param2 || "",
                mtrValue: data.param3 || ""
            }, data.param4);
            //const type = "MINI";
            if (!this.appId && unify.canIUse("getAppIdSync") && unify.getAppIdSync) {
                this.appId = unify.getAppIdSync().appId || "";
            }
            var sendList = ["D-VM", dateFormat(data.timestamp || this._now()), this.appId + "_MINI-" + (this.workspaceId || "default"), this.version || "-", "2", "-", this._getSessionId() || "-", this._trueUserId() || "-", data.seedId || "-", "-", "-", "-", "-", "-", "-", data.seedId || "-", _encodeStr(this.url || "-"), this.bizType, "c", _encodeStr(data.param1 || "-"), data.param2 || "", data.param3 || "", _formatExinfoParam(data.param4) || "-", this.bizScenario || "-", data.sn || this._getSN() || "-", this._getUUid() || "-", "-", "-", _encodeStr(this.ref || "-"), _encodeStr(this.url || "-"), "-", "-", "-", this.os || "-", this.osVersion || "-", this.networkType || "-", "-", "-", this.language || "-", "-", "-", "-", "-", "-", "-", this.screen && this.screen.width + "x" + this.screen.height || "-", "-", "-"];
            return this.mtrDebug && console.log(sendList), sendList.join();
        }
    }, {
        key: "_remoteLog",
        value: function _remoteLog(msg) {
            var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var sn = msg.sn || this._getSN();
            msg.sn = sn;
            if (this._ready) {
                this._formatRemoteParam(msg);
                var r = this._packFinalData(msg);
                this._send(r, option);
                if (this._trueUserId() === "VISITOR") {
                    this.visitorList.push(r);
                }
                this.mtrDebug && logger("_remoteLog _send");
            } else {
                this.callList.push(msg);
                this.mtrDebug && logger("_remoteLog push");
            }
            return sn;
        }
    }, {
        key: "getUserId",
        value: function getUserId() {
            return this._trueUserId();
        }
    }, {
        key: "setUserId",
        value: function setUserId(userId) {
            var resend = this._trueUserId() === "VISITOR" && userId !== this.userId && this.visitorList.length;
            this.userId = userId;
            this.baseInfo.userId = userId;
            setStorage("mtr-mdap-data", this.baseInfo); //  mtr-userId
            if (resend) {
                while (this.visitorList && this.visitorList.length) {
                    var send = this.visitorList.shift();
                    send = send && send.replace("VISITOR", this.userId).replace("VISITOR", this.userId);
                    send && this._send(send, { batchSend: true });
                }
                this.mtrDebug && logInfo("VISITOR resended");
            }
        }
    }, {
        key: "logJump",
        value: function logJump(currentPage, to) {
            var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            if (this.jumpPage && this.jumpPage === currentPage) {
                return;
            }
            this.mtrDebug && logger("logJump");
            //Mtr.st app init
            //this.ld page onShow
            //this.hd  page hide
            //this.jo  page jump
            //h5  this.ol || this.dr
            var jo = this.pageLoadTime || this.startTime;
            var now = +Date.now();
            var t0 = now - jo;
            this.pageJumpTime = now;
            var param4 = param;
            if (currentPage && to && currentPage != to) {
                to = to || "-";
                param4 = param4 || {};
                _extends(param4, {
                    currentPage: currentPage,
                    nextPage: to,
                    action: "page_jump"
                });
                this.calc(currentPage, "PAGE_JUMP", t0, param4, true);
            }
            this.jumpPage = currentPage;
        }
        /*
        onPageHide(currentPage:string) {
          this.pageHide(currentPage, { action: "page_hide" });
        }
            onPageUnload(currentPage:string) {
          this.pageHide(currentPage, { action: "page_unload" });
        }
        */

    }, {
        key: "onAppHide",
        value: function onAppHide() {
            var t0 = +Date.now() - this.startTime;
            this.calc(null, "APP_HIDE", t0, {/*isCollected: this.isCollected */}, true);
            //setStorage("mtr-sn", this.sn);
            setStorage("mtr-mdap-data", this.baseInfo);
        }
    }, {
        key: "onAppError",
        value: function onAppError(err) {
            this.err("APP_ERROR", err);
        }
        /*
        pageHide(currentPage:string, p4:any={}) {
          this.mtrDebug && logger("pageHide");
          var jo = this.ld || this.st;
          var now = Date.now();
          var t0 = now - jo;
          this.hd = now;
          if (!this.jo) {
            p4 = p4 || {};
            Object.assign(p4, {
              currentPage: currentPage
            });
            this.calc(currentPage, "PAGE_STAY", t0, p4,true);
          }
        }*/

    }, {
        key: "pagePv",
        value: function pagePv(t) {
            var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            this.mtrDebug && logger("pagePv", this.cPageUrl);
            var currentPageUrl = t || getMainInfo().url;
            if (this.cPageUrl && this.cPageUrl !== currentPageUrl) {
                this.logJump(this.cPageUrl, currentPageUrl);
            }
            this.ref = this.cPageUrl;
            this.cPageUrl = currentPageUrl;
            this.url = this.cPageUrl;
            this.pageLoadTime = +Date.now();
            this.pageHideTime = 0;
            this.pageJumpTime = 0;
            var param4 = dealExtra(param);
            if (this.refAction != 'PAGE_LOAD') {
                param4.refAction = this.refAction;
            }
            this.refAction = 'PAGE_LOAD';
            this.refActionList = [];
            return this._remoteLog({
                seedId: this.cfg.pageSeedId,
                param1: this.cPageUrl,
                param2: "PAGE_LOAD",
                param3: "",
                param4: param4
                //param4: t || {}
            });
        }
    }, {
        key: "appEvent",
        value: function appEvent(event) {
            var _this3 = this;

            var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var timestamp = this._now();
            var send = function send() {
                _this3.mtrDebug && logger("appEvent", param);
                var param4 = param;
                param4.refAction = _this3.refAction;
                _this3.refAction = event;
                return _this3._remoteLog({
                    timestamp: timestamp,
                    seedId: _this3.cfg.clkSeedId,
                    param1: "",
                    param2: event,
                    param3: "",
                    param4: param4
                }, { batchSend: true });
            };
            if (this.userId) {
                send();
            } else {
                setTimeout(function () {
                    send();
                }, 2000);
            }
        }
    }, {
        key: "click",
        value: function click(url, seed) {
            var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            var inter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            this.mtrDebug && logger("click", seed);
            var myUrl = url || getMainInfo().url;
            this.url = myUrl;
            var param4 = inter ? param : dealExtra(param);
            var param2 = _encodeStr(seed);
            if (this.refActionList.indexOf(param2) != -1) {
                //param4.refAction = "["+this.refAction+"]"
            } else if (this.refAction != param2) {
                param4.refAction = this.refAction;
            }
            var msg = {
                seedId: this.cfg.clkSeedId,
                param1: myUrl,
                param2: param2,
                param3: '',
                param4: param4
            };
            if (param.terminal != undefined && param.terminal) {
                this.refAction = '';
            } else {
                this.refAction = param2;
                this.refActionList.push(this.refAction);
            }
            return this._remoteLog(msg, { batchSend: true });
        }
    }, {
        key: "calc",
        value: function calc(url, r, n) {
            var param = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var inter = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

            this.mtrDebug && logger("calc");
            var myUrl = url || getMainInfo().url;
            this.url = myUrl;
            var param4 = inter ? param : dealExtra(param);
            param4.refAction = this.refAction;
            var a = {
                seedId: this.cfg.calcSeedId,
                param1: myUrl,
                param2: _encodeStr(r),
                param3: n,
                param4: param4
            };
            return this._remoteLog(a, { batchSend: true });
        }
    }, {
        key: "expo",
        value: function expo(url, item, dir, data) {
            this.mtrDebug && logger("expo");
            if (!this.stat_auto_expo) {
                logger("expo disable");
                return -1;
            }
            var myUrl = url || getMainInfo().url;
            this.url = myUrl;
            var param4 = dealExtra(data || {});
            param4.refAction = this.refAction;
            return this._remoteLog({
                seedId: this.cfg.expoSeedId,
                param1: myUrl,
                param2: _encodeStr(item),
                param3: dir,
                param4: param4
            }, { batchSend: true });
        }
    }, {
        key: "log",
        value: function log(r) {
            var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            this.mtrDebug && logger("log");
            var info = getMainInfo();
            this.url = info.url;
            var param2 = formatSeed(r);
            var param4 = _extends({ mtrLogMsg: r }, dealExtra(param));
            param4.refAction = this.refAction;
            unify.reportAnalytics(param2, param4);
            return this._remoteLog({
                seedId: this.cfg.syslogSeedId,
                param1: this.url,
                param2: param2,
                param3: "",
                param4: param4
            }, { batchSend: true });
        }
    }, {
        key: "err",
        value: function err(r, n) {
            var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            this.mtrDebug && console.warn("Tracker.err()", r, n);
            var info = getMainInfo();
            this.url = info.url;
            var param2 = formatSeed(n);
            var param4 = _extends({ mtrTag: r, mtrErrMsg: n }, dealExtra(param));
            param4.refAction = this.refAction;
            unify.reportAnalytics(param2, param4);
            return this._remoteLog({
                seedId: "MTRERR_" + this.appId + "_" + r,
                param1: this.url,
                param2: param2,
                param3: '',
                param4: param4
            }, { batchSend: true });
        }
    }, {
        key: "api",
        value: function api(param) {
            var api = param.api,
                success = param.success,
                time = param.time,
                code = param.code,
                msg = param.msg,
                response = param.response,
                bizSuccess = param.bizSuccess;

            this.mtrDebug && logger("api", api, success, time, code, msg);
            var myUrl = getMainInfo().url;
            var param2 = bizSuccess ? time > 30000 ? "API_UNUSUAL" : "API_SLOW" : success ? "API_BIZ_FAIL" : "API_FAIL"; //this.formatSeed(api)    
            unify.reportAnalytics(param2.toLowerCase(), { api: api, success: success, bizSuccess: bizSuccess, time: time, code: code, msg: msg, response: response });
            return this._remoteLog({
                seedId: this.cfg.apiSeedId,
                param1: myUrl,
                param2: param2,
                param3: time,
                param4: { api: api, success: success, bizSuccess: bizSuccess, time: time, code: code, msg: msg, response: response, refAction: this.refAction }
            }, { batchSend: true });
        }
    }, {
        key: "setData",
        value: function setData(key, value) {
            this.data[key] = value;
        }
    }]);

    return MTR;
}();
}, function(modId) { var map = {"../utils/common":1599097260857,"../utils/alipay":1599097260860,"../utils/unify":1599097260859}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1599097260862, function(require, module, exports) {
var myscene = {
    "1000": "首页12宫格及更多",
    "1002": "小程序收藏应用入口，包含朋友tab中的入口",
    "1005": "顶部搜索框的搜索结果页",
    "1007": "单人聊天会话中的小程序消息卡片",
    "1011": "扫描二维码",
    "1014": "小程序模版消息（服务提醒）",
    "1020": "生活号 profile 页相关小程序列表",
    "1023": "系统桌面图标",
    "1037": "小程序打开小程序",
    "1038": "从另一个小程序返回",
    "1090": "长按小程序右上角菜单唤出最近使用历史",
    "1200": "城市服务频道",
    "1201": "芝麻信用频道",
    "1202": "车主服务频道",
    "1203": "医疗服务频道",
    "1204": "大学生活频道",
    "1205": "中小学频道",
    "1206": "共享单车频道",
    "1207": "保险服务频道",
    "1208": "天天有料频道",
    "1209": "支付宝会员频道",
    "1300": "第三方APP（如钉钉）打开",
    "0000": "待确认的场景"
};
var wxscene = {
    '1000': '其他',
    '1001': '发现栏小程序主入口，「最近使用」列表',
    '1005': '微信首页顶部搜索框的搜索结果页',
    '1006': '发现栏小程序主入口搜索框的搜索结果页',
    '1007': '单人聊天会话中的小程序消息卡片',
    '1008': '群聊会话中的小程序消息卡片',
    '1010': '收藏夹',
    '1011': '扫描二维码',
    '1012': '长按图片识别二维码',
    '1013': '扫描手机相册中选取的二维码',
    '1014': '小程序模板消息',
    '1017': '前往小程序体验版的入口页',
    '1019': '微信钱包',
    '1020': '公众号 profile 页相关小程序列表',
    '1022': '聊天顶部置顶小程序入口',
    '1023': '安卓系统桌面图标',
    '1024': '小程序 profile 页',
    '1025': '扫描一维码',
    '1026': '发现栏小程序主入口，「附近的小程序」列表',
    '1027': '微信首页顶部搜索框搜索结果页「使用过的小程序」列表',
    '1028': '我的卡包',
    '1029': '小程序中的卡券详情页',
    '1030': '自动化测试下打开小程序',
    '1031': '长按图片识别一维码',
    '1032': '扫描手机相册中选取的一维码',
    '1034': '微信支付完成页',
    '1035': '公众号自定义菜单',
    '1036': 'App 分享消息卡片',
    '1037': '小程序打开小程序',
    '1038': '从另一个小程序返回',
    '1039': '摇电视',
    '1042': '添加好友搜索框的搜索结果页',
    '1043': '公众号模板消息',
    '1044': '带 shareTicket 的小程序消息卡片 详情',
    '1045': '朋友圈广告',
    '1046': '朋友圈广告详情页',
    '1047': '扫描小程序码',
    '1048': '长按图片识别小程序码',
    '1049': '扫描手机相册中选取的小程序码',
    '1052': '卡券的适用门店列表',
    '1053': '搜一搜的结果页',
    '1054': '顶部搜索框小程序快捷入口（微信客户端版本6.7.4起废弃）',
    '1056': '聊天顶部音乐播放器右上角菜单',
    '1057': '钱包中的银行卡详情页',
    '1058': '公众号文章',
    '1059': '体验版小程序绑定邀请页',
    '1064': '微信首页连Wi-Fi状态栏',
    '1067': '公众号文章广告',
    '1068': '附近小程序列表广告（已废弃）',
    '1069': '移动应用',
    '1071': '钱包中的银行卡列表页',
    '1072': '二维码收款页面',
    '1073': '客服消息列表下发的小程序消息卡片',
    '1074': '公众号会话下发的小程序消息卡片',
    '1077': '摇周边',
    '1078': '微信连Wi-Fi成功提示页',
    '1079': '微信游戏中心',
    '1081': '客服消息下发的文字链',
    '1082': '公众号会话下发的文字链',
    '1084': '朋友圈广告原生页',
    '1088': '会话中系统消息，打开小程序',
    '1089': '微信聊天主界面下拉，「最近使用」栏（基础库2.2.4版本起包含「我的小程序」栏）',
    '1090': '长按小程序右上角菜单唤出最近使用历史',
    '1091': '公众号文章商品卡片',
    '1092': '城市服务入口',
    '1095': '小程序广告组件',
    '1096': '聊天记录，打开小程序',
    '1097': '微信支付签约原生页，打开小程序',
    '1099': '页面内嵌插件',
    '1102': '公众号 profile 页服务预览',
    '1103': '发现栏小程序主入口，「我的小程序」列表（基础库2.2.4版本起废弃）',
    '1104': '微信聊天主界面下拉，「我的小程序」栏（基础库2.2.4版本起废弃）',
    '1106': '聊天主界面下拉，从顶部搜索结果页，打开小程序',
    '1107': '订阅消息，打开小程序',
    '1113': '安卓手机负一屏，打开小程序（三星）',
    '1114': '安卓手机侧边栏，打开小程序（三星）',
    '1124': '扫“一物一码”打开小程序',
    '1125': '长按图片识别“一物一码”',
    '1126': '扫描手机相册中选取的“一物一码”',
    '1129': '微信爬虫访问 详情',
    '1131': '浮窗打开小程序',
    '1133': '硬件设备打开小程序 详情',
    '1135': '小程序profile页其他小程序列表，打开小程序',
    '1146': '地理位置信息打开出行类小程序',
    '1148': '卡包-交通卡，打开小程序',
    '1150': '扫一扫商品条码结果页打开小程序',
    '1153': '“识物”结果页打开小程序',
    '1169': '发现栏小程序主入口，各个生活服务入口（例如快递服务、出行服务等）'
};
var alipay = typeof my !== 'undefined';
// @ts-ignore
var wixin = typeof wx !== 'undefined';
var CONFIG = {
    appId: '',
    prefix: 'mtr-',
    mtrVer: '0.0.23',
    stat_sw: true,
    stat_share_app: false,
    stat_pull_down_fresh: false,
    stat_page_scroll: false,
    stat_hide: true,
    stat_unload: false,
    stat_batch_send: false,
    stat_reach_bottom: false,
    stat_auto_click: true,
    stat_auto_expo: false,
    stat_auto_apperr: false,
    stat_location: false,
    stat_api: true,
    stat_api_success: true,
    stat_api_long_time: 3000,
    stat_api_fail: true,
    scene: alipay ? myscene : wxscene,
    my: alipay,
    wx: wixin
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.default = CONFIG;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1599097260863, function(require, module, exports) {
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __TEMP__ = require('../utils/common');var logger = __TEMP__['logger'];var logInfo = __TEMP__['logInfo'];
var __TEMP__ = require('../config');var CONFIG = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('../utils/alipay');var hookGetLocation = __TEMP__['hookGetLocation'];var hookRequest = __TEMP__['hookRequest'];
var actionEventTypes = ["tap", "longpress", "firstAppear", "appear", "submit"];
function actionListener(Mtr, t, e) {
    var mtrDebug = Mtr.mtrDebug;
    mtrDebug && logger("actionListener");
    if (t.trackered) {
        logInfo("actionListener trackered");
        return;
    }
    t.trackered = true;
    var dataset = t.currentTarget.dataset;
    var xpath = (t.id || "") + "#" + e;
    var obj = dataset.obj;
    var name = obj ? obj.seedName || obj.name || obj.icon_name || obj.text || obj.text_content || obj.mid_text_content : undefined;
    var seedName = dataset.seed || dataset.seedName || dataset.title || name || xpath;
    var globalData = {};
    if (dataset.mtrappdata) {
        // @ts-ignore
        var app = getApp();
        app.globalData && Object.keys(app.globalData).forEach(function (key) {
            if (dataset.mtrappdata.indexOf(key) > -1) {
                globalData["app-" + key] = app.globalData[key];
            }
        });
    }
    var pageData = {};
    if (dataset.mtrpagedata && this.data) {
        var data = this.data;
        Object.keys(data).forEach(function (key) {
            if (dataset.mtrpagedata.indexOf(key) > -1) {
                pageData['page-' + key] = data[key];
            }
        });
    }
    if ("tap" === t.type || "longpress" === t.type || "submit" === t.type) {
        mtrDebug && logInfo("Hook click", seedName);
        if (dataset.mtrignore) {
            mtrDebug && logInfo("Hook click mtrignore");
            return;
        }
        //var { url_type, url_path, url_data, url_remark } = obj || {};
        obj = obj || {};
        Mtr.click(this.route, seedName, _extends({ xpath: xpath }, globalData, pageData, obj, { index: dataset.index || 0, group: dataset.group || "-" }));
    } else if ("appear" === t.type || "firstAppear" === t.type) {
        Mtr.mtrDebug && logInfo("Hook expo", seedName);
        if (dataset.mtrignore) {
            mtrDebug && logInfo("Hook expo mtrignore");
            return;
        }
        Mtr.expo(this.route, seedName, "-", _extends({ xpath: xpath }, globalData, pageData, obj, { index: dataset.index || 0, group: dataset.group || "-" }));
    }
    // ("tap" === t.type || "longpress" === t.type) &&  Mtr.click(t, e)
}
function hookComponent(Mtr, t, e) {
    return function () {
        var i = arguments ? arguments[0] : void 0;
        if (i && i.currentTarget && -1 !== actionEventTypes.indexOf(i.type)) try {
            actionListener.call(this, Mtr, i, t);
        } catch (t) {
            console.error(t);
        }
        return e.apply(this, arguments);
    };
}
function hookPage(Mtr, t, e) {
    return function () {
        var i = arguments ? arguments[0] : void 0;
        if (i && i.currentTarget && -1 !== actionEventTypes.indexOf(i.type)) try {
            actionListener.call(this, Mtr, i, t);
        } catch (t) {
            console.error(t);
        }
        return e.apply(this, arguments);
    };
}
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.Hook = function Hook(obj, funName, hook) {
    var fun1 = obj[funName];
    obj[funName] = function (data) {
        hook.call(this, data);
        return fun1 && fun1.call(this, data);
    };
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var TrackerApp = exports.TrackerApp = function () {
    function TrackerApp(Mtr) {
        _classCallCheck(this, TrackerApp);

        this.Mtr = Mtr;
    }

    _createClass(TrackerApp, [{
        key: "init",
        value: function init(config) {
            config && _extends(this.Mtr, config);
            console.warn("App.init() 已经不再使用,请删除代码,配置信息请放置 App({ mtrConfig:{ ... }})");
        }
    }, {
        key: "onLaunch",
        value: function onLaunch() {
            var Mtr = this.Mtr;
            return function (option) {
                try {
                    if (option) {
                        var query = option.query,
                            scene = option.scene,
                            referrerInfo = option.referrerInfo;

                        Mtr.scene = scene || '';
                        scene && (scene = CONFIG.scene[scene] || scene);
                        var query_bizScenario = query && (query.bizScenario || query.bz);
                        var extraData_bizScenario = referrerInfo && referrerInfo.extraData && referrerInfo.extraData.bizScenario;
                        var referrerInfo_appId = referrerInfo && referrerInfo.appId;
                        if (!Mtr.bizScenario) {
                            Mtr.bizScenario = query_bizScenario || extraData_bizScenario || referrerInfo_appId || scene;
                        }
                        Mtr.referrerAppId = referrerInfo_appId || '';
                    }
                } catch (b) {
                    Mtr.mtrDebug && console.error("Mtr", b);
                }
                Mtr.stat_app_launch && Mtr.appEvent("APP_ON_LAUNCH", {
                    option: JSON.stringify(option),
                    tzone: Mtr.timezoneOffset,
                    referrerAppId: Mtr.referrerAppId,
                    scene: Mtr.scene
                });
                Mtr.stat_location && hookGetLocation(Mtr);
                Mtr.stat_api && hookRequest(Mtr);
                Mtr.mtrDebug && logInfo("App onLaunch");
            };
        }
    }, {
        key: "onHide",
        value: function onHide() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("app onHide");
                Mtr.onAppHide();
            };
        }
    }, {
        key: "onError",
        value: function onError() {
            var Mtr = this.Mtr;
            return function (e) {
                try {
                    Mtr.mtrDebug && logInfo("app onError");
                    Mtr.onAppError(e);
                } catch (err) {
                    console.error(err);
                }
            };
        }
    }, {
        key: "onShow",
        value: function onShow() {
            var Mtr = this.Mtr;
            return function (option) {
                try {
                    if (option) {
                        var query = option.query,
                            scene = option.scene,
                            referrerInfo = option.referrerInfo;

                        Mtr.scene = scene || '';
                        scene && (scene = CONFIG.scene[scene] || scene);
                        var query_bizScenario = query && (query.bizScenario || query.bz);
                        var extraData_bizScenario = referrerInfo && referrerInfo.extraData && referrerInfo.extraData.bizScenario;
                        var referrerInfo_appId = referrerInfo && referrerInfo.appId;
                        if (!Mtr.bizScenario) {
                            Mtr.bizScenario = query_bizScenario || extraData_bizScenario || referrerInfo_appId || scene;
                        }
                        Mtr.referrerAppId = referrerInfo_appId || '';
                    }
                } catch (b) {
                    Mtr.mtrDebug && console.error("Mtr", b);
                }
                Mtr.startTime = +Date.now();
                Mtr.stat_app_show && Mtr.appEvent("APP_ON_SHOW", {
                    option: JSON.stringify(option),
                    referrerAppId: Mtr.referrerAppId,
                    scene: Mtr.scene
                });
                Mtr.mtrDebug && logInfo("app onShow", option);
            };
        }
    }]);

    return TrackerApp;
}();
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var TrackerPage = exports.TrackerPage = function () {
    function TrackerPage(Mtr) {
        _classCallCheck(this, TrackerPage);

        this.Mtr = Mtr;
    }

    _createClass(TrackerPage, [{
        key: "init",
        value: function init() {
            console.warn("Page.init() 已经不再使用,请删除代码");
        }
    }, {
        key: "onLoad",
        value: function onLoad() {
            var Mtr = this.Mtr;
            return function (query) {
                Mtr.mtrDebug && logInfo("Page onLoad ", this.route, query);
                if (query && ("bizScenario" in query || "bz" in query)) {
                    var bizScenario = query.bizScenario,
                        bz = query.bz;

                    bizScenario = bizScenario || bz;
                    Mtr.bizScenario = bizScenario;
                }
                this.$mtr_query = query;
            };
        }
    }, {
        key: "onShow",
        value: function onShow() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("onShow", this.route);
                this.$mtr_time_show = +Date.now();
                Mtr.pagePv(this.route, this.$mtr_query);
            };
        }
    }, {
        key: "onPageScroll",
        value: function onPageScroll() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("onPageScroll", this.route);
                Mtr.click(this.route, "PAGE_SCROLL");
            };
        }
    }, {
        key: "onReachBottom",
        value: function onReachBottom() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("onReachBottom", this.route);
                Mtr.click(this.route, "REACH_BOTTOM");
            };
        }
    }, {
        key: "onHide",
        value: function onHide() {
            var Mtr = this.Mtr;
            return function () {
                var now = +Date.now();
                var t0 = now - this.$mtr_time_show;
                Mtr.calc(this.route, "PAGE_STAY", t0, { action: "page_hide" }, true);
                Mtr.mtrDebug && logInfo("onHide", this.route);
                //Mtr.onPageHide(this.route);
            };
        }
    }, {
        key: "onPullDownRefresh",
        value: function onPullDownRefresh() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("onPullDownRefresh ", this.route);
                Mtr.click(this.route, "PULL_DOWN_REFRESH");
            };
        }
    }, {
        key: "onUnload",
        value: function onUnload() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("onUnload", this.route);
                //Mtr.onPageUnload(this.route);
            };
        }
    }, {
        key: "_hook",
        value: function _hook(page) {
            var lifeFunction = ["onShow", "onPageScroll", "onLoad", "onReachBottom", "onHide", "onPullDownRefresh", "onUnload", "setData", "dispatch", "register", "subscribeAction", "subscribe", "watch", "when", "getInstance"];
            if (this.Mtr.stat_auto_click) {
                for (var e in page) {
                    "function" === typeof page[e] && lifeFunction.indexOf(e) === -1 && e.indexOf("$") === -1 && (page[e] = hookPage(this.Mtr, e, page[e]));
                }
            }
            return page;
        }
    }]);

    return TrackerPage;
}();
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var TrackerComponent = exports.TrackerComponent = function () {
    function TrackerComponent(Mtr) {
        _classCallCheck(this, TrackerComponent);

        this.Mtr = Mtr;
    }

    _createClass(TrackerComponent, [{
        key: "init",
        value: function init() {
            console.warn("Component.init() 已经不再使用,请删除代码");
        }
    }, {
        key: "_hook",
        value: function _hook(c) {
            if (this.Mtr.stat_auto_click) {
                var a = c.methods;
                for (var e in a) {
                    "function" === typeof a[e] && e.indexOf("$") === -1 && (a[e] = hookComponent(this.Mtr, e, a[e]));
                }
            }
            return c;
        }
    }]);

    return TrackerComponent;
}();
}, function(modId) { var map = {"../utils/common":1599097260857,"../config":1599097260862,"../utils/alipay":1599097260860}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1599097260855);
})()
//# sourceMappingURL=index.js.map