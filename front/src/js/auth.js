// 点击登陆按钮， 弹出模块对话框

$(function () {
    $("#btn").click(function () {
        $(".mask-wrapper").show();
    });

    $(".close-btn").click(function () {
        $(".mask-wrapper").hide();
    });
});


$(function () {
    $(".switch").click(function () {
        var scrollWrapper = $(".scroll-wrapper");
        var currentLeft = parseInt(scrollWrapper.position().left);
        if (currentLeft < 0) {
            scrollWrapper.animate({"left": '0'});
        } else {
            scrollWrapper.animate({"left": '-400'});
        }
    });
});
