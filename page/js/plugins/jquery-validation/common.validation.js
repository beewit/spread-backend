/*
 *  jquery.validation 表单验证重新封装，功能：1、统一提示，2、统一执行回调方法，3、自定义返回设置等
 *  调用方式：
 form_Validation({
 formid: "form_edit", post_form: { posturl: "postedit.html", notify_url: location.href }, rules: {
 staff_name: { required: true,ChineseCharacter:true, maxlength: 20 },
 gender: { required: true,Contains:['男','女'] }
 }
 });
 引入js文件：
 <script src="/static/js/jquery.min.js?v=2.1.4"></script>
 <script src="/static/js/validate/jquery.validate.min.js"></script>       //表单验证
 <script src="/static/js/validate/messages_zh.min.js"></script>           //中文提示
 <script src="/static/js/jquery.form.min.js" type="text/javascript"></script>     //form表单提交
 <script src="/static/js/common/common.validation.js" type="text/javascript"></script>   //封装验证
 */

var layerMsg;
try {
    layerMsg = window === window.top ? layer : (parent.window === parent.window.top) ? parent.layer : (parent.parent.window === parent.parent.window.top ? parent.parent.layer : parent.parent.parent.layer);
} catch (e) {
    console.log(e)
}

var formValidation = function (options) {
    var defaults = {
        formId: null,//验证表单ID值
        ignore: null,//排除验证空间
        rules: {},//验证项
        messages: {},//消息
        isVaidForm: true,//是否提交表单
        startPostFunc: null,  //开始提交时候函数
        postForm: {
            postUrl: null,//添加post地址
            callbackFunc: null,  //保存成功回调函数
            isTip: true, //提交表单时候，是否提示
            notify_url: null //成功回调url
        },
        submitBtn: null //提交按钮，请求数据中，禁用按钮
    };
    var opts = $.extend(defaults, options);
    var objForm = $('#' + opts.formId);
    objForm.validate({
        ignore: opts.ignore,
        rules: opts.rules,
        invalidHandler: function (event, validator) {
        },
        errorPlacement: function (error, element) {
            var small = $(element).parent().find("small") || $(element).next("small");
            if (small === undefined || small.length <= 0) {
                $(element).parent().append("<small class='vail_err " + (objForm.attr("data-vail-direction") || '') + "'></small>");
                small = $(element).next("small").length > 0 ? $(element).next("small") : $(element).parent().find("small");
            }
            if (error.text() !== "") {
                if (objForm.hasClass("form_vail_icon")) {
                    small.attr("data-layer-tip", error.text());
                } else {
                    small.html(error.text());
                }
            }
            $(element).addClass("form_err").removeClass("form_suc");
            small.addClass("vail_err").removeClass("vail_suc");
        },
        highlight: function (element) {
            $(element).parent().addClass("vail_item");
        },
        unhighlight: function (element, error) {
            $(element).parent().addClass("vail_item");
        },
        success: function (label, element) {
            var small = $(element).parent().find("small") || $(element).next("small");
            small.html("").removeClass("vail_err").addClass("vail_suc");
            $(element).removeClass("form_err").addClass("form_suc");
        },
        submitHandler: function () {
            $(objForm).find(".form-group").removeClass("has-success");
            if (opts.isVaidForm) {
                if (opts.postForm.postUrl === "" || opts.postForm.postUrl === null || opts.postForm.postUrl === undefined) {
                    layerMsg.alert("请求url不能为空", {
                        title: "系统提示",
                        icon: 8
                    });
                } else {
                    var token = BaseCookies.get('token');
                    if (token === undefined || token == null || token === "") {
                        parent.location.href = "/";
                        return false;
                    }
                    //开始提交函数
                    if (opts.startPostFunc) {
                        opts.startPostFunc();
                    }
                    savePost(objForm, {
                        href: opts.postForm.postUrl,
                        callbackFunc: opts.postForm.callbackFunc,
                        isTip: opts.postForm.isTip,
                        notify_url: opts.postForm.notify_url,
                        token: token,
                        submitBtn: opts.submitBtn
                    });
                }
            } else {
                return true;
            }
        },
        messages: opts.messages
    });
};

//ajax通用保存方法formObj：表单对象，options：设置参数
function savePost(formObj, options) {
    var defaults = {
        href: null,
        error: "保存失败，网络异常请稍后再试！",
        success: "保存成功",
        isTip: true,
        notify_url: "",//回调地址
        callbackFunc: null,  //保存成功回调函数
        token: null,
        submitBtn: null
    };
    var opts = $.extend(defaults, options);
    if (opts.href && opts.href !== "") {
        var loadi;
        //提交表单
        if (opts.isTip) {
            loadi = layerMsg.msg('正在保存..', {icon: 6, time: -1});
        }
        //按钮只读
        if (opts.submitBtn != null) {
            $(opts.submitBtn).attr("disabled", "disabled");
        }
        formObj.ajaxSubmit({
            type: "post", dataType: "json",
            url: opts.href,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Authorization', "Bearer " + opts.token);
            },
            success: function (data) {
                layerMsg.close(loadi);
                if (data.ret === 200) {
                    //成功回调函数
                    if (opts.callbackFunc) {
                        opts.callbackFunc(data);
                    } else {
                        if (opts.isTip) {
                            if (data.msg === "" || data.msg === undefined || data.msg == null) {
                                data.msg = "保存成功";
                            }
                            layerMsg.alert(data.msg, {
                                title: "系统提示",
                                icon: 1
                            });
                        }
                        //回调页面
                        if (opts.notify_url !== "" && opts.notify_url !== null) {
                            if (opts.isTip) {
                                setTimeout(function () {
                                    location.href = opts.notify_url;
                                }, 800);
                            } else {
                                location.href = opts.notify_url;
                            }
                        }
                    }
                }
                else if (data.ret === 401) {
                    BaseCookies.remove("token");
                    layerMsg.msg('登陆已失效..', {icon: 0, time: 1500},function () {
                        parent.location.href = "/";
                    });
                }
                else {
                    layerMsg.alert(data.msg, {
                        title: "系统提示",
                        icon: 8
                    });
                }
            },
            complete: function (XHR, TS) {
                XHR = null;
                $(opts.submitBtn).removeAttr("disabled");
            },
            error: function (msg) {
                layerMsg.alert('网络异常刷新重试', {
                    title: "系统提示",
                    icon: 2
                });
            }
        });
    }
}

//字符串字符长度
function JHshStrLen(sString) {
    var sStr, iCount, i, strTemp;
    iCount = 0;
    sStr = sString.split("");
    for (i = 0; i < sStr.length; i++) {
        strTemp = escape(sStr[i]);
        if (strTemp.indexOf("%u", 0) === -1) // 表示是汉字
        {
            iCount = iCount + 1;
        }
        else {
            iCount = iCount + 2;
        }
    }
    return iCount;
}

$(function () {
    //自定义验证\d*(.\d)?,正数
    jQuery.validator.addMethod("positive", function (value, element) {
        return this.optional(element) || (/(^\+?|^\d?)\d*\.?\d{1,5}$/.test(value));
    }, "只能输入正数且最多保留五位小数");
    //字符串最大字符个数验证
    jQuery.validator.addMethod("cmaxlength", function (value, element, param) {
        return this.optional(element) || JHshStrLen(value) < parseInt(param);
    }, "内容过长");
    //字符串最小字符个数验证
    jQuery.validator.addMethod("cminlength", function (value, element, param) {
        return this.optional(element) || JHshStrLen(value) > parseInt(param);
    }, "内容太短");
    //字符串的格式为6-12位，只能是字母、数字和下划线
    jQuery.validator.addMethod("passwordvaild", function (value, element, param) {
        return this.optional(element) || (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value));
    }, "密码必须由6-20位字母+数字组成");
    //手机号码
    jQuery.validator.addMethod("isMobile", function (value, element, param) {
        return this.optional(element) || (/^(1)\d{10}$/.test(value));
    }, "手机号码格式不正确");
    //手机号码或者座机号码
    jQuery.validator.addMethod("isPhone", function (value, element, param) {
        return this.optional(element) || (/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}$/).test(value) || (/^1[3456789]\d{9}$/).test(value);
    }, "电话号码格式不正确");
    //手机号码
    jQuery.validator.addMethod("isMobileOrEmail", function (value, element, param) {
        return this.optional(element) || (/^(1)\d{10}$/.test(value)) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
    }, "手机或邮箱的格式错误");
    //限定值范围，是否包含数组中的值，例如：性别，['男','女']，其他值将不通过验证
    jQuery.validator.addMethod("Contains", function (value, element, param) {
        return this.optional(element) || param.indexOf(value) > -1;
    }, "数据值超出指定值");
    // 字符验证
    jQuery.validator.addMethod("stringCheck", function (value, element) {
        return this.optional(element) || /^[u0391-uFFE5w]+$/.test(value);
    }, "只能包括中文字、英文字母、数字和下划线");
    // 数字验证
    jQuery.validator.addMethod("numberCheck", function (value, element) {
        return this.optional(element) || /^[\d]+$/.test(value);
    }, "只能包括数字");

    // 身份证号码验证
    jQuery.validator.addMethod("isIdCardNo", function (value, element) {
        var idcard = new IDValidator();
        var isidcard = idcard.isValid(value);
        return this.optional(element) || isidcard;
    }, "请正确输入您的身份证号码");

    // 只能为汉字
    jQuery.validator.addMethod("ChineseCharacter", function (value, element) {
        return this.optional(element) || /^[\u2E80-\u9FFF]+$/.test(value);
    }, "只能包括中文字");

    // 保留两位小数
    jQuery.validator.addMethod("numberForTwo", function (value, element) {
        return this.optional(element) || /^[0-9]+(.[0-9]{0,2})?$/.test(value);
    }, "只能输入正数且最多保留两位小数");

    // 只能输入数字和字母
    jQuery.validator.addMethod("STR_ENG_NUM", function (value, element) {
        return this.optional(element) || /^[A-Za-z0-9]+$/.test(value);
    }, "只能输入数字和字母");

});
