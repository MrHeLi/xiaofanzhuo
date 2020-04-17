
function Barss() {
    // var self = this;
}

Barss.prototype.listenBarHover = function () {
    var authBox = $(".auth-box");
    var box = $('.user-more-box');
    authBox.hover(function () {
        box.show();
    }, function () {
        box.hide();
    });
};

Barss.prototype.runs = function () {
    var self = this;
    self.listenBarHover();
};

// /* 登陆验证相关 start */
function Auth() {
    var self = this;
    self.maskWrapper = $('.mask-wrapper');
    self.scrollWrapper = $('.scroll-wrapper');
}

Auth.prototype.showAuthInterface = function (show, login) {
    var self = this;
    if (show) {
        self.maskWrapper.show();
        if (login) {
            self.scrollWrapper.css({"left": 0});
        } else {
            self.scrollWrapper.css({"left": -400});
        }
    } else {
        self.maskWrapper.hide();
    }
};

Auth.prototype.listenClick = function () {
    var self = this;

    var signinBtn = $('.signin-btn');
    signinBtn.click(function () {
        self.showAuthInterface(true, true);
    });

    var signupBtn = $('.signup-btn');
    signupBtn.click(function () {
        self.showAuthInterface(true, false);
    });

    var closeBtn = $('.close-btn');
    closeBtn.click(function () {
        self.showAuthInterface(false);
    });

    var switchBtn = $('.switch');
    switchBtn.click(function () {
        var left = parseInt(self.scrollWrapper.position().left);
        if (left < 0) { // signup
            self.showAuthInterface(true, true);
        } else { // signin
            self.showAuthInterface(true, false);
        }
    });
};

Auth.prototype.listenLoginClick = function () {
    var self = this;
    console.log("=======listenLoginClick=======");
    var telephoneInput = $('#login_tel');
    var pwdInput = $('#login_pwd');
    var check = $('.check-box');
    // console.log("listenLoginClick");
    // // var $submit = signGroup.find('.submit-btn');
    var submit = $('.submit-btn');
    submit.click(function () {
        var telephone = telephoneInput.val();
        var password = pwdInput.val();
        var remember = check.prop("checked");
        // console.log(telephone);
        // console.log(password);
        // console.log(remember);

        newajax.post({
            'url': '/account/login/',
            'data': {
                'telephone': telephone,
                'password': password,
                'remember': remember ? 1 : 0
            },
            'success': function (result) {
                self.showAuthInterface(false);
                window.location.reload();
            }
        })
    });
};

Auth.prototype.run = function () {
    this.listenClick();
    this.listenLoginClick();
};

$(function () {
    var auth = new Auth();
    auth.run();
    var bar = new Barss();
    bar.runs();
});

/* 登陆验证相关 start */

console.log("=========");
