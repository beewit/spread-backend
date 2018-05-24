$(function () {
    $("html").attr("onkeydown", "return cellkeydown(event)");
    $("#validateBtn").click(function () {
        pasteData(true, getUpdateJson());
    });
    $("#pasteBtn").click(function () {
        pasteData(false, getUpdateJson());
    });

});


function pasteData(debug, json) {
    layerMsg.open({
        content: '您是否确定导入数据？',
        btn: ['确认', '取消'],
        shadeClose: false,
        yes: function () {
            $.ajax({
                url: "/api/account/paste/import",
                data: {debug: debug, json: json},
                success: function (data) {
                    if (isEmpty(data.data)) {
                        if (debug) {
                            layerMsg.alert(data.msg, {icon: 1, title: "系统提示"})
                        } else {
                            ExecuteIframeMethod("loadData", 1, '');
                            layerMsg.alert("导入成功，即将关闭窗口", {icon: 1, title: "系统提示"}, function (index) {
                                layerMsg.close(index);
                                closeIframe();
                            })
                        }
                    }
                    else {
                        layerMsg.alert(data.msg, {icon: 0, title: "系统提示"}, function (index) {
                            layerMsg.close(index);
                            focusInput(data.data);
                        })
                    }
                }
            });
        }, no: function () {

        }
    });
}

function focusInput(data) {
    switch (data.data) {
        case "nickname":
            $("input[name='nickname']:eq(" + data.order + ")").focus();
            break;
        case "mobile":
            $("input[name='mobile']:eq(" + data.order + ")").focus();
            break;
        case "gender":
            $("input[name='gender']:eq(" + data.order + ")").focus();
            break;
    }
}


//获取需要修改的json
function getUpdateJson() {
    var list = new Array();
    var qi = {};
    $.each($("tr.am-active"), function () {
        var order = $(this).attr("data-order");
        var nickname = $(this).find("input[name=nickname]").val();
        var mobile = $(this).find("input[name=mobile]").val();
        var gender = $(this).find("input[name=gender]").val();
        qi.nickname = nickname || "";
        qi.mobile = mobile || "";
        qi.gender = gender || "";
        list.push(qi);
        qi = {};
    });
    return JSON.stringify(list);
}

var head = ["序号", "姓名", "手机号码", "性别", "操作"];
var names = ["nickname", "mobile", "gender"];
var headW = ["30", "50", "50", "50", "30"];
var headHtml = '<th class="table-type" style="width:{w}px">{head}</th> ';

function cellkeydown(event) {
    if (event.ctrlKey && event.keyCode == 86) {
        var ss = document.getElementById("textArea");
        ss.focus();
        ss.select();
        // 等50毫秒，keyPress事件发生了再去处理数据
        setTimeout("dealwithData()", 5);
    }
}

function dealwithData(event) {
    var val = $("#textArea").val();
    if (val == null || val == "") {
        layerMsg.alert("粘贴的姓名、手机号码、性别内容为空或格式错误", {icon: 2});
        return;
    }
    var rows = val.split("\n");
    if (rows.length == 0) {
        layerMsg.alert("粘贴的姓名、手机号码、性别内容为空或格式错误", {icon: 2});
        return;
    }
    $("#textArea").val("");
    var headStr = "", rowsHtml = "";
    headStr += headHtml.replace("{head}", head[0]).replace("{w}", headW[0]);
    var headFlog = false;
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        if (r == undefined || r == null || r == "") {
            break;
        } else {
            rowsHtml += '<tr class="am-active" data-order="' + i + '">';
            rowsHtml += "<td>" + i + "</td>";
            var cell = r.split("\t");
            if (cell.length < 3) {
                layerMsg.alert("请必须复制姓名、手机号码、姓名", {icon: 0});
                return
            }
            for (var j = 0; j < cell.length; j++) {
                if (!headFlog) {
                    headStr += headHtml.replace("{head}", head[j + 1]).replace("{w}", headW[j + 1]);
                }
                rowsHtml += "<td><input type='text' name='" + names[j] + "' value='" + cell[j] + "' class='w-100 paste-input'></td>";
            }
            headFlog = true;
            rowsHtml += '<td><button class="btn btn-danger btn-xs" type="button" onclick="del(this)"><i class="fa fa-remove"></i>&nbsp;&nbsp;删除</button></td>';
            rowsHtml += '</tr>';
        }
    }
    headStr += headHtml.replace("{head}", head[head.length - 1]).replace("{w}", headW[head.length - 1]);
    $("#head").html(headStr);
    $("#body").html(rowsHtml);
}

function del(obj) {
    layerMsg.confirm('确定删除？', {
        icon: 0,
        title: "系统提示",
        btn: ['删除', '取消']
    }, function (index) {
        layerMsg.close(index);
        $(obj).parents("tr").remove();
    }, function () {

    });
}