$(function () {
    $("html").attr("onkeydown", "return cellkeydown(event)");
});

var head = ["序号", "姓名", "手机号码", "性别", "操作"];
var names = ["name", "mobile", "gender"];
var headW = ["30","50", "80", "50", "30"];
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
    headStr += headHtml.replace("{head}", head[head.length-1]).replace("{w}", headW[head.length-1]);
    $("#head").html(headStr);
    $("#body").html(rowsHtml);
}