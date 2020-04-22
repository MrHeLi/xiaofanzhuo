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
    this.bannerUl.stop().animate({"left": -self.bannerWidth * self.index}, 500);
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

function Index() {
    var self = this;
    self.page = 1;
    self.category_id;
    template.defaults.imports.timeSince = function (date) {

        var date = new Date(date);
        var datets = date.getTime();
        var nowts = (new Date()).getTime();
        var timestamp = (nowts - datets) / 1000;

        if (timestamp < 60) {
            return '刚刚';
        } else if (timestamp >= 60 && timestamp < 60 * 60) {
            var minutes = timestamp / 60;
            return minutes + '分钟前';
        } else if (timestamp >= 60 * 60 && timestamp < 60 * 60 * 24) {
            var hours = int(timestamp / 60 / 60);
            return hours + '小时前';
        } else if (timestamp >= 60 * 60 * 24 && timestamp < 60 * 60 * 24 * 30) {
            var days = timestamp / 60 / 60 / 24;
            return days + '天前';
        } else {
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDay();
            var hour = date.getHours();
            var minute = date.getMinutes();
            return year + '/' + month + '/' + day + ' ' + hour + ':' + minute;
        }
    };
}

Index.prototype.listenLoadMore = function () {
    var self = this;
    var loadMoreBtn = $('#load-more-btn');
    loadMoreBtn.click(function () {
        var page = 1;
        myajax.get({
            'url': '/news/list/',
            'data': {
                'p': self.page,
                'category_id': self.category_id
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    var news = result['data'];
                    if (news.length <= 0) {
                        loadMoreBtn.hide();
                        return;
                    }
                    var tpl = template("news-item", {"newses": news});
                    var ul = $(".list-inner-group");
                    ul.append(tpl);
                    self.page++;
                }
            }
        })
    });
};

Index.prototype.listenCategoryClick = function () {
    var self = this;
    var tabGroup = $(".list-tab");
    tabGroup.children().click(function () {
        var li = $(this);
        var category_id = li.attr("data-category");
        self.category_id = category_id;
        var page = 1;
        myajax.get({
            'url': '/news/list/',
            'data': {
                'p': page,
                'category_id': category_id
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    var news = result['data'];
                    var tpl = template("news-item", {"newses": news});
                    var ul = $(".list-inner-group");
                    ul.empty(); // 将标签下的所有子元素删掉
                    ul.append(tpl);
                    self.page = 1;
                    li.addClass('active').siblings().removeClass('active');
                }
            }
        });
    });
};

Index.prototype.run = function () {
    var self = this;
    self.listenLoadMore();
    self.listenCategoryClick();
    console.log('hello');
};

// $ jquery定义的，只有在文本元素加载完后才会执行
$(function () {
    var banner = new Banner(); // 创建类对象
    banner.run();
    var index = new Index();
    index.run();
});
