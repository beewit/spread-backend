$(function () {
    var id = GetQueryString('id');
    if (!isEmpty(id)) {
        $('#editForm').append("<input type='hidden' name='id' value='" + id + "'>");
        //获取详细信息
        Bind.View({
            url: "/api/advert/get",
            data: {id: id},
            backFun: function (d) {
                $('#dlImg').html('');
                if (!isEmpty(d.img)) {
                    var imgs = d.img.split(',');
                    for (var i = 0; i < imgs.length; i++) {
                        $('#dlImg').append("<dd><i></i><img src='/file/" + imgs[i] + "'></dd>");
                    }
                }
            }
        })
    }
    $('#dlImg').on('click', 'dd i', function () {
        var thatImg = $(this).parent().find('img').attr('src').replace('/file/', '');
        var img = $('input[name=img]').val();
        if (!isEmpty(img)) {
            var imgs = img.split(',');
            var imgArr = new Array();
            for (var i = 0; i < imgs.length; i++) {
                if (imgs[i] != thatImg) {
                    imgArr.push(imgs[i])
                }
            }
            $('input[name=img]').val(imgArr.join(','))
        }
        $(this).parent().remove();
    });
    new Viewer(document.getElementById('dlImg'), {
        url: 'data-original'
    });
    formValidation({
        formId: "editForm",
        rules: {
            title: {required: true},
            content: {required: true},
            img: {required: true}
        },
        messages: {
            title: {required: "标题不能为空"},
            content: {required: "内容不能为空"},
            img: {required: "图片不能为空"}
        },
        postForm: {
            postUrl: "/api/advert/edit",
            callbackFunc: function (data) {
                ExecuteIframeMethod("loadData", 1, '');
                closeIframe();
            }
        }
    });
    bindSingleUpload({
        maxFileSize: "3mb",
        btnId: "pickfiles",
        container: "container",
        score: "advert",
        maxWidth: 2000,   //最大
        maxHeight: 10000,  //最大
        callbackFunc: callback,
        multi: true
    });

});

function callback(json, file) {
    var src = json.path;
    var img = $('input[name=img]').val();
    if (!isEmpty(img)) {
        img += "," + src;
    } else {
        img = src;
    }
    $('input[name=img]').val(img);
    $('#dlImg').append("<dd><i></i><img src='/file/" + src + "'></dd>");
}