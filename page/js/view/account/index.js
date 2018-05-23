$(function () {
    loadData(1,null)
});

function search() {
    var keyword = $("#keyword").val() || null;
    loadData(1, keyword);
}

function loadData(pageIndex, keyword) {
    window.history.pushState(null, null, "index.html?pageIndex=" + pageIndex + "&keyword=" + (keyword || ""));
    page = pageIndex;
    $.ajax({
        url: "/api/account/list/org",
        data: {pageIndex: pageIndex, keyword: keyword},
        success: function (res) {
            var d = res.data;
            var list = res.data.Data;
            if (list != null && list.length > 0) {
                $('#list').html(template('accountList',{data:res.data}));
            } else {
                $("#list").html('<tr><td colspan="5" class="text-center">暂无数据</td></tr>');
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