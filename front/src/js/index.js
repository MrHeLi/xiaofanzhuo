// 原型链 prototype
function Banner() { // 定义类
    // 类似构造函数
    this.bannerWidth = 798;
    this.bannerGroup = $("#banner-group");
    this.index = 1;
    this.leftArrow = $('#left-arrow');
    this.rightArrow = $('#right-arrow');
    this.bannerUl = $('#banner-ul');
    this.liList = this.bannerUl.children("li");
    this.bannerCount = this.liList.length;
    this.pageControl = $('.page-control');
}

Banner.prototype.initBanner = function () {
    var self = this;
    var firstBanner = self.liList.eq(0).clone();
    var lastBanner = self.liList.eq(self.bannerCount - 1).clone();
    self.bannerUl.append(firstBanner);
    self.bannerUl.prepend(lastBanner);
    self.bannerUl.css({"width": self.bannerWidth * (self.bannerCount + 2), "left": -self.bannerWidth})
};

Banner.prototype.initPageControl = function () {
    var self = this;
    for (var i = 0; i < self.bannerCount; i++) {
        var circle = $("<li></li>")
        self.pageControl.append(circle);
        if (i === 0) {
            circle.addClass("active");
        }
    }
    self.pageControl.css({"width": 12 * self.bannerCount + 8 * 2 + 16 * (self.bannerCount - 1)})
};

Banner.prototype.listenBannerHomer = function () {
    var self = this;
    this.bannerGroup.hover(function () {
        clearInterval(self.timer);
        self.toggleArrow(true);
    }, function () {
        self.loop();
        self.toggleArrow(false);
    });
};

Banner.prototype.loop = function () {
    var self = this;
    this.timer = setInterval(function () { // 定时器
        self.index++;
        if (self.index === self.bannerCount + 2) {
            self.bannerUl.css({"left": -self.bannerWidth});
            self.index = 2;
        }
        self.animate();
    }, 2000);
};

Banner.prototype.toggleArrow = function (isShow) {
    var self = this;
    if (isShow) {
        self.leftArrow.show();
        self.rightArrow.show();
    } else {
        self.leftArrow.hide();
        self.rightArrow.hide();
    }
};

Banner.prototype.listenArrowClick = function () {
    var self = this;
    self.leftArrow.click(function () {
        self.index--;
        if (self.index < 0) {
            self.bannerUl.css({"left": -self.bannerWidth * self.bannerCount});
            self.index = self.bannerCount - 1;
        }
        self.animate();
    });

    self.rightArrow.click(function () {
        self.index++;
        if (self.index >= self.bannerCount + 2) {
            self.bannerUl.css({"left": -self.bannerWidth});
            self.index = 2;
        }
        self.animate();
    });
};

Banner.prototype.listenPageControl = function () {
    var self = this;
    // noinspection JSUnresolvedFunction
    self.pageControl.children("li").each(function (index, obj) {
        $(obj).click(function () {
            self.index = index;
            self.animate();
        });
    });
};

Banner.prototype.animate = function () {
    var self = this;
    this.bannerUl.animate({"left": -self.bannerWidth * self.index}, 500);
    var index = self.index;
    if (index === 0) {
        index = self.bannerCount - 1;
    } else if (index === self.bannerCount + 1) {
        index = 0;
    } else {
        index = self.index - 1;
    }
    self.pageControl.children("li").eq(index).addClass("active").siblings().removeClass("active");
};

Banner.prototype.run = function () { // 给类定义函数
    this.loop();
    this.listenArrowClick();
    this.listenBannerHomer();
    this.initPageControl();
    this.listenPageControl();
    this.initBanner();
    console.log("Banner listenArrowClick");
};

// $ jquery定义的，只有在文本元素加载完后才会执行
$(function () {
    var banner = new Banner(); // 创建类对象
    banner.run();
});
