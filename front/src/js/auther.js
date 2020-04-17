// // 点击登陆按钮， 弹出模块对话框
//
// // $(function () {
// // $("#btn").click(function () {
// //     $(".mask-wrapper").show();
// // });
// //
// // $(".close-btn").click(function () {
// //     $(".mask-wrapper").hide();
// // });
// // });
//
//
// // $(function () {
// //     $(".switch").click(function () {
// //         var scrollWrapper = $(".scroll-wrapper");
// //         var currentLeft = parseInt(scrollWrapper.position().left);
// //         if (currentLeft < 0) {
// //             scrollWrapper.animate({"left": '0'});
// //         } else {
// //             scrollWrapper.animate({"left": '-400'});
// //         }
// //     });
// // });
//
// function Auth() {
//     var self = this;
//     self.maskWrapper = $('.mask-wrapper');
//     self.scrollWrapper = $('.scroll-wrapper');
// }
//
// Auth.prototype.showAuthInterface = function (show, login) {
//     var self = this;
//     if (show) {
//         self.maskWrapper.show();
//         if (login) {
//             self.scrollWrapper.css({"left": 0});
//         } else {
//             self.scrollWrapper.css({"left": -400});
//         }
//     } else {
//         self.maskWrapper.hide();
//     }
// };
//
// Auth.prototype.listenClick = function () {
//     var self = this;
//
//     var signinBtn = $('.signin-btn');
//     signinBtn.click(function () {
//         self.showAuthInterface(true, true);
//     });
//
//     var signupBtn = $('.signup-btn');
//     signupBtn.click(function () {
//         self.showAuthInterface(true, false);
//     });
//
//     var closeBtn = $('.close-btn');
//     closeBtn.click(function () {
//         self.showAuthInterface(false);
//     })
//
//     var switchBtn = $('.switch');
//     switchBtn.click(function () {
//         var left = parseInt(self.scrollWrapper.position().left);
//         if (left < 0) { // signup
//             self.showAuthInterface(true, true);
//         } else { // signin
//             self.showAuthInterface(true, false);
//         }
//     });
//
//     var loginBtn = $('.submit-btn');
//     loginBtn.click(function () {
//         console.log("登陆");
//     })
// };
//
// Auth.prototype.run = function () {
//     console.log("nuuuuuuuuuuuuuur");
//     this.listenClick();
// };
//
// // Auth.prototype.listenSign = function() {
// //     var singinGroup = $('.signin-group'); // 查找signin-group标签类
// //     var telephoneInput = singinGroup.find("input[name='telephone']"); // 查找signin-group下的input标签，并且name=telephone的标签
// //     telephoneInput.val(); // 提取input标签中的数据
// //     //Message js 文件集成
// //
// // };
//
// $(function () {
//     var auth = new Auth();
//     auth.run();
// });
