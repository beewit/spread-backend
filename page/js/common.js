﻿var layerMsg;
var winName;
try {
    layerMsg = window === window.top ? layer : (parent.window === parent.window.top) ? parent.layer : (parent.parent.window === parent.parent.window.top ? parent.parent.layer : parent.parent.parent.layer);
} catch (e) {
    $("body").append("<script src='/page/js/plugins/layer/layer.min.js' type='text/javascript'><\/script>");
    layerMsg = layer;
}

try {
    winName = parent.layer.getFrameIndex(window.name)
} catch (e) {

}

/**
 * Cookies
 *
 * */
var BaseCookies = {};
var token;
try {
    BaseCookies = window === window.top ? Cookies : (parent.window === parent.window.top) ? parent.Cookies : (parent.parent.window === parent.parent.window.top ? parent.parent.Cookies : parent.parent.parent.Cookies);
    token = BaseCookies.get('token');
} catch (e) {
    $("body").append("<script src='/page/js/js.cookie.js' type='text/javascript'><\/script>");
    BaseCookies = Cookies;
    token = BaseCookies.get('token');
}

$(function () {
    $("body").delegate("#allCheckBox", "click", function () {
        if ($(this).is(':checked')) {
            var ids = new Array();
            $.each($(this).parents().find(".itemCheckBox"), function (i, item) {
                $(item)[0].checked = true;
                ids.push($(item).val());
            })
            $(this).val(ids.join(","));
        } else {
            $(this).val("");
            $.each($(this).parents().find(".itemCheckBox"), function (i, item) {
                $(item)[0].checked = false
            })
        }
    });
    $("body").delegate(".itemCheckBox", "click", function () {
        var ids = new Array();
        $.each($(this).parents().find(".itemCheckBox:checked"), function (i, item) {
            ids.push($(item).val());
        })
        $("#allCheckBox").val(ids.join(","));
    });
    $("body").delegate("[data-layer]", "click", function () {
        openWin($(this), winName);
    });
});

function UrlChangeParam(url, name, value) {
    var newUrl = "";
    var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
    var tmp = name + "=" + value;
    if (url.match(reg) != null) {
        newUrl = url.replace(eval(reg), tmp);
    }
    else {
        if (url.match("[\?]")) {
            newUrl = url + "&" + tmp;
        }
        else {
            newUrl = url + "?" + tmp;
        }
    }
    return newUrl;
}

//关闭弹出
function closeIframe() {
    var index = layerMsg.getFrameIndex(window.name);
    layerMsg.close(index);
}


//子弹窗调用父级弹窗的方法
var ExecuteParentMethod = function (methodName, param1, param2, param3) {
    switch (arguments.length) {
        case 1:
            eval("$(window.parent.document).find('#layui-layer-iframe' + (LinkUrl.Request('winname') || ''))[0].contentWindow." + methodName + "()");
            break;
        case 2:
            eval("$(window.parent.document).find('#layui-layer-iframe' + (LinkUrl.Request('winname') || ''))[0].contentWindow." + methodName + "('" + param1 + "')");
            break;
        case 3:
            eval("$(window.parent.document).find('#layui-layer-iframe' + (LinkUrl.Request('winname') || ''))[0].contentWindow." + methodName + "('" + param1 + "','" + param2 + "')");
            break;
        case 4:
            eval("$(window.parent.document).find('#layui-layer-iframe' + (LinkUrl.Request('winname') || ''))[0].contentWindow." + methodName + "('" + param1 + "','" + param2 + "','" + param3 + "')");
            break;
        default:

    }
};

//子弹窗调用Iframe的方法
var ExecuteIframeMethod = function (methodName, param1, param2, param3) {
    var iframeClass;
    eval("iframeClass=$(window.parent.document).find('.J_menuTab.active').attr('data-id')");
    switch (arguments.length) {
        case 1:
            eval("$(window.parent.document).find('iframe[data-id=\"'+iframeClass+'\"]')[0].contentWindow." + methodName + "()");
            break;
        case 2:
            eval("$(window.parent.document).find('iframe[data-id=\"'+iframeClass+'\"]')[0].contentWindow." + methodName + "('" + param1 + "')");
            break;
        case 3:
            eval("$(window.parent.document).find('iframe[data-id=\"'+iframeClass+'\"]')[0].contentWindow." + methodName + "('" + param1 + "','" + param2 + "')");
            break;
        case 4:
            eval("$(window.parent.document).find('iframe[data-id=\"'+iframeClass+'\"]')[0].contentWindow." + methodName + "('" + param1 + "','" + param2 + "','" + param3 + "')");
            break;
        default:

    }
};

//关闭弹出
function closeIframe() {
    var index = layerMsg.getFrameIndex(window.name);
    layerMsg.close(index);
}

//子弹窗调用父级弹窗的方法
var ExecuteParentMethod = function (methodName, param1, param2, param3) {
    try {
        switch (arguments.length) {
            case 1:
                eval("$(window.parent.document).find('#layui-layer-iframe' + (LinkUrl.Request('winname') || ''))[0].contentWindow." + methodName + "()");
                break;
            case 2:
                eval("$(window.parent.document).find('#layui-layer-iframe' + (LinkUrl.Request('winname') || ''))[0].contentWindow." + methodName + "('" + param1 + "')");
                break;
            case 3:
                eval("$(window.parent.document).find('#layui-layer-iframe' + (LinkUrl.Request('winname') || ''))[0].contentWindow." + methodName + "('" + param1 + "','" + param2 + "')");
                break;
            case 4:
                eval("$(window.parent.document).find('#layui-layer-iframe' + (LinkUrl.Request('winname') || ''))[0].contentWindow." + methodName + "('" + param1 + "','" + param2 + "','" + param3 + "')");
                break;
            default:

        }
    } catch (e) {
    }
};


function open(content, okFunc) {
    layer.open({
        content: content,
        btn: ['确认', '取消'],
        shadeClose: false,
        yes: function (i) {
            layer.close(i)
            okFunc();
        }, no: function () {

        }
    });
}

function openWin($obj, win_name) {
    var handle = $obj.attr("data-layer-handle");
    var flog = true;
    if (handle) {
        flog = eval("flog=" + handle + "()");
    }
    if (!flog) {
        return;
    }
    var pkId = $("#pkId").val();
    var href = $obj.attr("data-layer");
    var v = Date.parse(new Date());
    if (href.indexOf("?") > -1) {
        href += "&v=" + v;
    } else {
        href += "?v=" + v;
    }
    if (win_name != undefined) {
        if (href.indexOf("?") > -1) {
            href += "&winname=" + win_name;
        } else {
            href += "?winname=" + win_name;
        }
    }
    if (pkId != undefined && pkId != null && pkId != "" && href.indexOf("&id=") < 0 && href.indexOf("?id=") < 0) {
        if (href.indexOf("?") > -1) {
            href += "&id=" + pkId;
        } else {
            href += "?id=" + pkId;
        }
    }
    var title = $obj.attr("data-layer-title");
    var w = $obj.attr("data-layer-w");
    var h = $obj.attr("data-layer-h");
    w = w || "893px";
    h = h || "600px";
    var t = $obj.attr("data-layer-top");
    var l = $obj.attr("data-layer-left");
    t = t || "5%";
    l = l || "";
    var shade = $obj.attr("data-layer-shade");
    shade = [0.5, '#000000'];
    var maxmin = $obj.attr("data-layer-maxmin");
    maxmin = maxmin == "false" ? false : true;
    var closeBtn = $obj.attr("data-layer-closeBtn");
    closeBtn = closeBtn == undefined ? 1 : parseInt(closeBtn);
    var security = $obj.attr("data-layer-iframe-security") != undefined;
    if (href != null && href != undefined && href != "") {
        layerMsg.open({
            type: 2,
            title: title,
            moveOut: true,
            resize: false,
            shade: shade,//shade,
            shadeClose: false,//如果shade存在，shadeClose控制点击弹层外区域关闭。
            maxmin: maxmin, //开启最大化最小化按钮
            area: [w, h],
            offset: [t, l],
            content: href,
            closeBtn: closeBtn,
            moveEnd: function (e) {
                var top = $(window.parent.document).find(e.prevObject.selector).offset().top;
                var left = $(window.parent.document).find(e.prevObject.selector).offset().left;
                var wh = $(window.parent.document).find(e.prevObject.selector).width();
                if (top < 0) {
                    $(window.parent.document).find(e.prevObject.selector).css("top", 0);
                } else if (top + 40 > parent.document.body.clientHeight) {
                    $(window.parent.document).find(e.prevObject.selector).css("top", (parent.document.body.clientHeight - 40) + "px");
                }
                if (left + wh < 40) {
                    $(window.parent.document).find(e.prevObject.selector).css("left", (40 - wh) + "px");
                }
                if (left + 40 > parent.document.body.clientWidth) {
                    $(window.parent.document).find(e.prevObject.selector).css("left", (parent.document.body.clientWidth - 40) + "px");
                }
            }, success: function (layero, index) {
                if (security) {
                    $(layero).find("iframe").attr("security", "restricted").attr("sandbox", "");
                }
            }
        });
    }
}

function exit() {
    layerMsg.confirm("是否确定退出系统？",
        {
            title: '系统提示',
            btn: ['确定', '取消'],
            icon: 0
        },
        function () {
            BaseCookies.remove("token");
            jump();
        }, function () {
        });
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function isEmpty(o) {
    if (o == null || o == undefined || o == "") {
        return true
    }
    return false
}

//数据简单绑定
var Bind = {
    View: function (options) {
        var defaults = {
            formId: "editForm",
            placeholder: true,
            data: null,
            url: null,
            backFun: null,
            callBackFun: null
        };
        var opt = $.extend(defaults, options);

        $.ajax({
            url: opt.url,
            data: opt.data,
            type: "POST",
            dataType: "JSON",
            success: function (data) {
                $("#" + opt.formId).bindView({
                    jsonData: data.data
                });
                if (opt.backFun)
                    opt.backFun(data.data);
                if (opt.callBackFun)
                    opt.callBackFun(data);
            }
        });
    },
    //封装select数据源
    bindselect: function (options) {
        var defaults = {
            objId: null,
            //请求路径url
            method: null,
            val: null,
            text: null,
            selval: null,
            def: "--请选择--",
            //成功后的处理事件
            handle: function () {
            }
        };
        var opt = $.extend(defaults, options);
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: opt.method,
            success: function (d) {
                var r = d;//$.parseJSON(d);
                if (r.code == 200) {
                    var html = "";
                    if (opt.def != null) {
                        html = "<option value=''>" + opt.def + "</option>";
                    }
                    var data = r.data;
                    for (var i = 0; i < data.length; i++) {
                        eval("val=data[i]." + opt.val);
                        eval("text=data[i]." + opt.text);
                        if (opt.selval == val) {
                            html += "<option value='" + val + "'  selected>" + text + "</option>";
                        } else {
                            html += "<option value='" + val + "'>" + text + "</option>";
                        }
                    }
                    var arr = opt.objId.split(",");
                    for (var i = 0; i < arr.length; i++) {
                        $("#" + arr[i]).html(html);
                        $("#" + arr[i]).trigger("chosen:updated");
                    }
                }
            }
        });
    }
};

function jump() {
    if (location.origin.indexOf("localhost") > -1 || location.origin.indexOf("127.0.0.1") > -1) {
        location.href = "http://127.0.0.1:8081/?backUrl=" + location.origin + "/page/jump.html";
    } else {
        location.href = "http://sso.9ee3.com?backUrl=" + location.origin + "/page/jump.html";
    }
}

/*!
 * jquery.ajax 重新封装，功能：1、统一提示，2、错误处理
 */
(function ($) {
    var _ajax = $.ajax;
    $.ajax = function (options) {
        var defaults = {
            loadTip: true,
            errTip: true,
            sucTip: true,
            type: "post",
            dataType: "json",
            url: null,
            token: token,
        };
        var opt = $.extend(defaults, options);
        var fn = {
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            },
            success: function (data, textStatus) {
            },
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Authorization', "Bearer " + opt.token);
            }
        };
        if (opt.error) {
            fn.error = opt.error;
        }
        if (opt.success) {
            fn.success = opt.success;
        }
        var loadi;
        var _opt = $.extend(opt, {
            headers: {'Authorization': "Bearer " + opt.token},
            beforeSend: function (XMLHttpRequest) {
                if (opt.loadTip) {
                    try {
                        loadi = layerMsg.msg('正在加载..', {icon: 6, time: -1});
                    } catch (e) {
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                layerMsg.close(loadi);
                if (opt.errTip) {
                    layerMsg.alert('网络异常刷新重试', {
                        title: "系统提示",
                        icon: 2
                    });
                }
                fn.error(XMLHttpRequest, textStatus, errorThrown);
            },
            success: function (data, textStatus) {
                layerMsg.close(loadi);
                if (opt.errTip) {
                    var json = data;
                    if (json.ret !== 200 && json.ret !== 404) {
                        if (json.ret === 401) {
                            BaseCookies.remove("token");
                            layerMsg.msg(json.msg, {icon: 0, time: 1500}, function () {
                                jump();
                            });
                        } else {
                            layerMsg.alert(json.msg, {
                                title: "系统提示",
                                icon: 8
                            });
                        }
                        return;
                    }
                }
                fn.success(data, textStatus);
            }
        });
        _ajax(_opt);
    };

    var $table;

    //将json串绑定入该元素其下name属性控件
    $.fn.bindView = function (options) {
        var defaults = {
            jsonData: {},
            handle: function () {
                //绑定完成执行的回调函数
            }
        };
        var opts = $.extend(defaults, options);
        $table = this;
        var data = opts.jsonData;
        $table.find("input:text").each(function () {
            var word = $(this).attr("name");
            var s;
            if (word !== "") {
                eval("s=data." + word);
                if (s == null || s === undefined) {
                    s = "";
                }

                var dataType = $(this).attr("data-type") || "";
                if (dataType !== "") {
                    if (dataType === "datetime") {
                        s = formatDateTime(s);
                    }
                    else if (dataType === "date-m") {
                        s = formatDateMonth(s);
                    }
                    else if (dataType === "date") {
                        s = formatDate(s);
                    }
                }
                $(this).val(s);

            }
            $.fn.dataHandle($(this).attr("data-handle"), s, this, data);
        });


        $table.find("input[type='radio']").each(function () {
            var word = $(this).attr("name");
            var type = $(this).attr("data-type") || '';
            eval("var s=data." + word);
            if (s == null || s === undefined) {
                s = "";
            }
            //Checked样式
            var $radioitem = $table.find("input:radio[name='" + word + "'][value='" + s + "']");
            if ($radioitem.next().hasClass("iCheck-helper")) {
                $radioitem.iCheck('check');
            } else {
                $radioitem.attr("checked", true);
            }
            if (type !== '') {
                if ($(this).attr("value") === s) {
                    $("input[name='" + word + "']").parent().next(".cenginput").addClass("hide");
                    $(this).parent().next(".cenginput").removeClass("hide");
                }
            }
            $.fn.dataHandle($(this).attr("data-handle"), s, this, data);
        });

        $table.find("select").each(function () {
            var word = $(this).attr("name");
            eval("var s=data." + $(this).attr("name"));
            if (s == null || s === undefined) {
                s = "";
            }
            $(this).val(s);
            $(this).attr("data-val", s);
            if ($(this).hasClass("chosen-select")) {
                $(this).trigger("chosen:updated");
            }
            $.fn.dataHandle($(this).attr("data-handle"), s, this, data);
        });

        $table.find("textarea").each(function () {
            eval("var s=data." + $(this).attr("name"));
            if (s == null || s === undefined) {
                s = "";
            }
            $(this).val(s);
            $.fn.dataHandle($(this).attr("data-handle"), s, this, data);
        });


        $table.find("input[type='checkbox']").each(function () {
            eval("var s=data." + $(this).attr("name"));
            if (s == null || s === undefined) {
                s = "";
            }
            if (s.indexOf($(this).val()) !== -1) {
                $(this).attr("checked", true);
            }

        });

        $table.find("input[type='hidden']").each(function () {
            eval("var s=data." + $(this).attr("name"));
            if (s == null || s === undefined) {
                s = "";
            }
            $(this).val(s);
            var $imgSrc = $(this).attr("data-img-id");
            if ($imgSrc !== "" && $imgSrc !== undefined) {
                $("#" + $imgSrc).attr("src", (s === "" || s === undefined || s == null || s === 'null' ? "/static/image/default.png" : s));
            }
            $.fn.dataHandle($(this).attr("data-handle"), s, this, data);
        });

        opts.handle();
    };

    $.fn.dataHandle = function (handle, val, obj, data) {
        if (handle != null && handle != undefined && handle != "")
            eval(handle + "(val,obj,data)");
    };
})(jQuery);
