//判断token，如果没有直接跳转
var token = Cookies.get('token') || null;
if (!token) {
    var win = self;
    //跳转登录页面
    while (true) {
        if (win.frameElement && win.frameElement.tagName == "IFRAME") {
            win = win.parent;
        } else {
            if (location.origin.indexOf("localhost") > -1 || location.origin.indexOf("127.0.0.1") > -1) {
                location.href = "http://127.0.0.1:8081/?backUrl=" + location.origin + "/page/jump.html";
            } else {
                location.href = "http://sso.9ee3.com?backUrl=" + location.origin + "/page/jump.html";
            }
            break;
        }
    }
}