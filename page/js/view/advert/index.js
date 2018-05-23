var listTemp, order, page;
$(function () {
    listTemp = $("#listTemp").html();
    $(".i-checks").iCheck({checkboxClass: "icheckbox_square-green", radioClass: "iradio_square-green"});

    loadData(GetQueryString("pageIndex") || 1, GetQueryString("keyword") || null);
});

function search() {
    var keyword = $("#keyword").val() || null;
    loadData(1, keyword);
}

function loadData(pageIndex, keyword) {
    window.history.pushState(null, null, "index.html?pageIndex=" + pageIndex + "&keyword=" + (keyword || ""));
    page = pageIndex;
    $.ajax({
        url: "/api/advert/list",
        data: {pageIndex: pageIndex, keyword: keyword},
        success: function (res) {
            var d = res.data;
            var list = res.data.Data;
            if (list != null && list.length > 0) {
                if (pageIndex == 1) {
                    order = 0;
                } else {
                    order = (pageIndex - 1) * 10;
                }
                $("#list").html('');
                var imgArr = new Array();
                $.each(list, function (i, item) {
                    var imgs = "";
                    if (item.img != null && item.img != "") {
                        imgArr.push(item.img);
                        var str = item.img.split(',');
                        for (var i = 0; i < str.length; i++) {
                            imgs += "<img src='http://file.9ee3.com/" + str[i] + "' data-original='http://file.9ee3.com/" + str[i] + "'> ";
                        }
                    }
                    order++;
                    $("#list").append(listTemp.replace(/{order}/g, order)
                        .replace(/{id}/g, item.id)
                        .replace(/{title}/g, item.title)
                        .replace(/{content}/g, item.content)
                        .replace(/{img}/g, imgs)
                        .replace(/{sendCount}/g, item.sendCount)
                        .replace(/{status}/g, item.status));
                });
                new Viewer(document.getElementById('list'), {
                    url: 'data-original'
                });

            } else {
                $("#list").html('<tr><td colspan="7" class="text-center">暂无数据</td></tr>');
            }
            laypage({
                cont: 'pageDiv', //容器。值支持id名、原生dom对象，jquery对象,
                pages: d.PageNumber, //总页数
                count: d.Count,
                skin: 'molv', //皮肤
                curr: d.PageIndex,
                first: 1, //将首页显示为数字1,。若不显示，设置false即可
                last: d.PageNumber || false,//d.pageCount, //将尾页显示为总页数。若不显示，设置false即可
                prev: '上一页', //若不显示，设置false即可
                next: '下一页', //若不显示，设置false即可
                skip: true,
                jump: function (obj, first) { //触发分页后的回调
                    if (!first) {
                        loadData(obj.curr, keyword)
                    }
                }
            });
        }
    })
}

function delAdvert(id) {
    layerMsg.confirm('确定删除？', {
        icon: 0,
        title: "系统提示",
        btn: ['删除', '取消']
    }, function () {
        $.ajax({
            url: "/api/advert/del",
            data: {id: id},
            success: function (d) {
                layerMsg.msg(d.msg, {icon: 1})
                $("#tr_" + id).remove();
            }
        })
    }, function () {

    });
}

