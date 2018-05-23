$(function () {
    $(".i-checks").iCheck({checkboxClass: "icheckbox_square-green", radioClass: "iradio_square-green"})
    formValidation({
        formId: "editForm",
        rules: {
            nickname: {required: true},
            gender: {required: true},
            mobile: {required: true, isMobile: true},
            email: {email: true},
            date_of_birth: {dateISO: true},
            password: {passwordvaild: true},
            remark: {maxlength: 1000}
        },
        messages: {
            nickname: {required: "姓名不能为空"},
            gender: {required: "请选择性别"},
            mobile: {required: "请输入手机号码"}
        },
        postForm: {
            postUrl: "/api/account/add",
            callbackFunc: function (data) {
                alert(JSON.stringify(data));
            }
        }
    });
    bindSingleUpload({
        maxFileSize: "3mb",
        btnId: "pickfiles",
        container: "container",
        score: "account",
        maxWidth: 2000,   //最大
        maxHeight: 10000,  //最大
        callbackFunc: callback
    });

});

function callback(json, file) {
    var src = json.path;
    $("#photo").attr("src", src);
    $("input[name=photo]").val(src);
}
