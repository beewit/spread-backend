$(function () {
    $(".nav > li > a").click(function () {
        $(".nav > li > a").removeClass("active")
        $(this).addClass("active")
    });
    getAccountInfo();
});

function getAccountInfo() {
    $.ajax({
        url: "/api/sys/check/role",
        success: function (d) {
            var acc = d.data.account;
            var org = d.data.org;
            if (acc.photo != null && acc.photo !== "")
                $("#photo").attr("src", acc.photo);
            if (acc.nickname != null && acc.nickname !== "")
                $("#nickname").html(acc.nickname);
            if (org.name != null && org.name !== "")
                $("#company").html(org.name);
        }
    });

}