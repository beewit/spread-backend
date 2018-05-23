/*
/!*!
 * jquery.ajax 重新封装，功能：1、统一提示，2、错误处理
 * 调用方式不变，只需要引入该js文件
 *!/
(function ($) {
    var layerMsg = window === window.top ? layer : (parent.window === parent.window.top) ? parent.layer : (parent.parent.window === parent.parent.window.top ? parent.parent.layer : parent.parent.parent.layer);
    var token = "";
    try {
        token = BaseCookies.get('token');
    } catch (e) {
        $("body").append("<script src='/page/js/js.cookie.js' type='text/javascript'><\/script>");
        token = BaseCookies.get('token');
    }
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
                    loadi = layerMsg.msg('正在加载..', {icon: 6, time: -1});
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
                                location.href = "http://127.0.0.1:8081/?backUrl=" + location.origin + "/page/jump.html";//"http://sso.9ee3.com?backUrl=" + location.origin + "/page/jump.html";
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
})(jQuery);*/
