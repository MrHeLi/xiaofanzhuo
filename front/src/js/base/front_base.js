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
    self.smsBtn = $('.sms-captcha-btn');
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
                if (result["code"] == 200) {
                    self.showAuthInterface(false);
                    window.location.reload();
                } else {
                    var des = "";
                    for (var name in result) {
                        des += name + ":" + result[name] + ";";
                    }
                    var messageObj = result['message'];
                    if (typeof messageObj == 'string' || messageObj.constructor == String) {
                        window.messageBox.show(messageObj);
                    } else {
                        for (var key in messageObj) {
                            var messages = messageObj[key];
                            var message = messages[0];
                            window.messageBox.show(message);
                            break;
                        }
                    }
                }
            }
        })
    });
};

Auth.prototype.listenCaptchaClick = function () {
    var captcha = $('.img-captcha');
    captcha.click(function () {
        captcha.attr("src", "/account/img_captcha/" + "?random=" + Math.random());
    });
};

Auth.prototype.smsSuccess = function () {
    var self = this;
    messageBox.showSuccess("发送短信验证码成功");
    self.smsBtn.addClass('disabled');
    self.smsBtn.unbind('click');
    var count = 10;
    var timer = setInterval(function () {
        self.smsBtn.text(count + "s");
        count--;
        if (count < 0) {
            clearInterval(timer);
            self.smsBtn.removeClass('disabled');
            self.smsBtn.text("发送验证码");
            self.listenSmsClick();
        }
    }, 1000);
};

Auth.prototype.listenSmsClick = function () {
    var self = this;
    var telInput = $('.signup-group input[name="telephone"]');
    self.smsBtn.click(function () {
        var telephone = telInput.val();
        if (!telephone) {
            messageBox.showInfo("请输入手机号码");
            return;
        }
        newajax.get({
            "url": '/account/sms_captcha/',
            "data": {
                "telephone": telephone
            },
            "success": function (result) {
                if (result['code'] == 200) {
                    self.smsSuccess();
                }
            },
            "fail": function (error) {
                console.log(error);
            }
        });
    });
};

Auth.prototype.listenSignup = function () {
    var self = this;
    var signupGroup = $('.signup-group');
    var submitBtn = signupGroup.find('.submit-btn');
    submitBtn.click(function (event) {
        event.preventDefault();
        var telephoneInput = signupGroup.find("input[name='telephone']");
        var usernameInput = signupGroup.find("input[name='username']");
        var imgCaptchaInput = signupGroup.find("input[name='img_captcha']");
        var password1Input = signupGroup.find("input[name='password1']");
        var password2Input = signupGroup.find("input[name='password2']");
        var smsCaptchaInput = signupGroup.find("input[name='sms_captcha']");

        var telephone = telephoneInput.val();
        var username = usernameInput.val();
        var img_captcha = imgCaptchaInput.val();
        var password1 = password1Input.val();
        var password2 = password2Input.val();
        var sms_captcha = smsCaptchaInput.val();

        newajax.post({
            'url': '/account/register/',
            'data': {
                'telephone': telephone,
                'username': username,
                'img_captcha': img_captcha,
                'password1': password1,
                'password2': password2,
                'sms_captcha': sms_captcha
            },
            'success': function (result) {
                self.showAuthInterface(false);
                window.location.reload();
            }
        });
    });
};

Auth.prototype.run = function () {
    this.listenClick();
    this.listenLoginClick();
    this.listenCaptchaClick();
    this.listenSmsClick();
    this.listenSignup();
};

$(function () {
    var auth = new Auth();
    auth.run();
    var bar = new Barss();
    bar.runs();
});

/* 登陆验证相关 start */

console.log("=========");
