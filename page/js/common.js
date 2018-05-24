var layerMsg;
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
    if (location.origin.indexOf("localhost")) {
        parent.location.href = "http://127.0.0.1:8081/?backUrl=" + location.origin + "/page/jump.html";
    } else {
        parent.location.href = "http://sso.9ee3.com?backUrl=" + location.origin + "/page/jump.html";
    }
}

/*!
 * jquery.ajax 重新封装，功能：1、统一提示，2、错误处理
 * 调用方式不变，只需要引入该js文件
 */
(function ($) {
    //备份jquery的ajax方法
    var _ajax = $.ajax;
    //重写jquery的ajax方法
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
        //备份opt中error和success方法
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
        //扩展增强处理
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
                //错误方法增强处理
                fn.error(XMLHttpRequest, textStatus, errorThrown);
            },
            success: function (data, textStatus) {
                layerMsg.close(loadi);
                if (opt.errTip) {
                    //json转换对象
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
    $.fn.bindTable = function (options) {
        var defaults = {
            jsonData: {},  //传入的jsondata.list数据
            page: 1,
            pageSize: 0,
            handle: function (index, e) {
            } //用来处理一些变色的操作等。/index:当前tr的索引。 e:当前tr的元素

        };
        var opts = $.extend(defaults, options);
        $table = this;
        var data = opts.jsonData.data.list;//$.parseJSON(opts.jsonData);
        var trhtml = "";
        var val;
        if (data == null || data == undefined || data.length == 0) {
            trhtml = "<tr><td colspan='" + $table.find("thead tr th").size() + "' align='center' style='text-align: center;'>暂无数据</td></tr>";
            $table.find("tbody").html(trhtml);
        } else {
            for (var i = 0; i < data.length; i++) {
                eval("pk=data[i]." + ($table.attr("data-pk") || "id"));
                trhtml += "<tr id='" + (pk == undefined ? "" : pk) + "' class='" + (i % 2 ? "tr_bg" : "") + "'>";
                $table.find("thead tr th").each(function () {
                    if ($(this).attr("data-order") == "1") {
                        trhtml += "<td>" + ((opts.page - 1) * opts.pageSize + (i + 1)) + "</td>";
                    } else {
                        eval("val=data[i]." + $(this).attr("name"));
                        if (val == undefined || val == null || $(this).attr("name") == undefined) {
                            val = "";
                        }
                        var align = $(this).attr("align") || "";
                        var handle = $(this).attr("data-handle") || false;
                        var style = $(this).attr("data-style") || "";
                        if (style != "") {
                            style = " style='" + style + "'";
                        }
                        var cls = $(this).attr("data-class") || "";
                        if (cls != "") {
                            cls = " class='" + cls + "'";
                        }
                        var dataType = $(this).attr("data-type") || "";
                        var housingType = $(this).attr("data-housingType") || "";
                        var radio = $(this).find("input[type=radio]").length > 0;
                        var chkbox = $(this).find("input[type=checkbox]").length > 0;
                        if (chkbox) {
                            $(this).find("input[type=checkbox]").addClass("chkboxall");
                            trhtml += "<td " + style + cls + ">  <input type='checkbox' class='i-checks chkbox' value='" + pk + "' ></td>";
                        }
                        else if (radio) {
                            $(this).find("input[type=radio]").addClass("hide");
                            $(this).addClass("chkradioall");
                            trhtml += "<td " + style + cls + ">  <input type='radio' name='radio_1' class='i-checks chkradio' value='" + pk + "' ></td>";
                        }
                        else if (handle) {
                            var handleStr = $(this).find(".hidden").html();
                            if (handleStr != undefined && handleStr != "") {
                                for (var item in data[i]) {
                                    eval("var re = /{" + item + "}/g;");
                                    handleStr = handleStr.replace(re, data[i][item]);
                                }
                            } else {
                                eval("var handleStr =" + handle + "(data[i]);");
                            }
                            trhtml += "<td " + style + cls + ">" + handleStr + "</td>";
                        } else if (dataType != "") {
                            if (dataType == "datetime") {
                                trhtml += "<td " + style + cls + "  name= " + val + " >" + formatDateTime(val) + "</td>";
                            }
                            else if (dataType == "date-m") {
                                trhtml += "<td " + style + cls + "  name= " + val + " >" + formatDateMonth(val) + "</td>";
                            }
                            else if (dataType == "img") {
                                trhtml += "<td " + style + cls + "  name= " + val + " ><img src='" + (val == "" || val == null || val == 'null' || val == undefined ? "/static/image/default.png" : val) + "'></td>";
                            }
                            else if (dataType == "date") {
                                trhtml += "<td  " + style + cls + " name= " + val + " >" + formatDate(val) + "</td>";
                            } else if (dataType == "datetime_") {
                                trhtml += "<td  " + style + cls + " name= " + val + " >" + formatDateTime_(val) + "</td>";
                            }

                        } else if (housingType != '') {
                            eval("type=" + housingType + "(data[i])");
                            trhtml += "<td " + style + cls + "  name= " + val + " >" + type + "</td>";
                        }
                        else {
                            trhtml += "<td  " + style + cls + " name= " + val + " >" + val + "</td>";
                        }
                    }
                });
                trhtml += "</tr>";
            }
            $table.find("tbody").html(trhtml);
            //处理选中状态
            $table.find("tbody tr").click(function () {
                $(this).parent().find("tr").removeClass("hover");
                $(this).addClass("hover");
            });
            //绑定tr的处理事件，用于前台处理颜色
            $table.find("tbody tr").each(function (index, element) {
                opts.handle(index, $(this));
            });
        }
    };

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

    $.fn.bindTemplate = function (options) {
        var defaults = {
            template: null,
            jsonData: {},
            page: 1,
            pageSize: 0,
            handle: function (index, e) {
            }
        };
        var opts = $.extend(defaults, options);
        $table = this;
        var data = opts.jsonData.data.list;//$.parseJSON(opts.jsonData);
        var tempHtml = "";
        var val;
        if (data == null || data == undefined || data.length == 0) {
            tempHtml = "<div>暂无数据</div>";
            $table.html(tempHtml);
        }
        else if (opts.template == null) {
            tempHtml = "<div>模板错误</div>";
            $table.html(tempHtml);
        }
        else {
            for (var i = 0; i < data.length; i++) {
                var handleStr = opts.template;
                for (var item in data[i]) {
                    eval("var re = /{" + item + "}/g;");
                    var val = data[i][item];
                    if (val == undefined || val == null) {
                        val = "";
                    }
                    handleStr = handleStr.replace(re, val);
                }
                var templateHandleArr = [];
                var templateHandle = $(this).attr("data-template-handle");
                if (templateHandle == null || templateHandle == '' || templateHandle == undefined) {
                    templateHandle = "";
                } else {
                    templateHandle.indexOf(",") == -1 ? templateHandleArr.push(templateHandle) : templateHandleArr = templateHandle.split(",");
                }
                if (templateHandleArr != "" && templateHandleArr.length > 0) {
                    for (var j = 0; j < templateHandleArr.length; j++) {
                        var rehandle = templateHandleArr[j].split("#")[1];
                        var key = templateHandleArr[j].split("#")[0];
                        for (var item in data[i]) {
                            eval("var re = /{" + templateHandleArr[j] + "}/g;");
                            var val = data[i][key];
                            if (val == undefined || val == null) {
                                val = "";
                            }
                            switch (rehandle) {
                                case "data":
                                    handleStr = handleStr.replace(re, formatDate(val));
                                    break;
                                case "dataTime":
                                    handleStr = handleStr.replace(re, formatDateTime(val));
                                    break;
                                case "dataTime_":
                                    handleStr = handleStr.replace(re, formatDateTime_(val));
                                    break;
                                case "dataHourMin":
                                    handleStr = handleStr.replace(re, dataHourMin(val));
                                    break;
                                default:
                                    handleStr = handleStr.replace(re, eval("" + rehandle + "(data[i])"));
                            }
                            handleStr = handleStr.replace(re, val);
                        }

                    }
                }
                tempHtml += handleStr;
            }


        }
        $table.html(tempHtml);
        $.each($table.find("[data-src]"), function (i, item) {
            var src = $(item).attr("data-src");
            $(item).attr("src", (src == "" || src == undefined || src == "" || src == 'null' ? "/static/image/default.png" : src))
        })
    };

    //返回改元素下name不为空的 url查询串
    $.fn.getParams = function () {
        $table = this;


        var jsonstr = "";
        $table.find("input[name!='']").each(function () {
            var v = $(this).val();
            if (v == undefined || v == "") {
                v = "";
            }
            if ($(this).attr("name") != null) {
                jsonstr += "" + $(this).attr("name") + "=" + v + "&";
            }
        });

        $table.find("select[name!='']").each(function () {
            var v = $(this).val();
            if (v == undefined || v == "") {
                v = "";
            }
            jsonstr += "" + $(this).attr("name") + "=" + v + "&";
        });
        jsonstr += "abc=1";
        jsonstr = jsonstr.replace("&abc=1", "");
        return jsonstr;
    };
    //返回该元素下name不为空的json串
    $.fn.getJson = function () {
        $table = this;
        var jsonStr = "{";
        $table.find("input[name!='']").each(function () {
            var v = $(this).val();
            if (v == undefined || v == "") {
                v = "''";
            }
            if ($(this).attr("name") != null) {
                jsonStr += "'" + $(this).attr("name") + "':'" + v + "',";
            }
        });
        $table.find("select[name!='']").each(function () {
            var v = $(this).val();
            if (v == undefined || v == "") {
                v = "''";
            }
            jsonStr += "'" + $(this).attr("name") + "':'" + v + "',";
        });
        jsonStr += "abc:1}";
        jsonStr = jsonStr.replace(",abc:1", "");
        return jsonStr;
    };
})(jQuery);
