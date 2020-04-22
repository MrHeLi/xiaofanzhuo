function Banners() {

}

Banners.prototype.listenAddBanner = function() {
    var self = this;
    var addBtn = $('#add-banner-btn');
    addBtn.click(function () {
        var tpl = template("banner-item");
        var bannerListGroup = $(".banner-list-group");
        bannerListGroup.prepend(tpl);

        var bannerItem = bannerListGroup.find(".banner-item:first");
        self.addItemSelectEvent(bannerItem);
    });
};

Banners.prototype.addItemSelectEvent = function(bannerItem) {
    // var image
};

Banners.prototype.run = function () {
    this.listenAddBanner();
};

$(function () {
    var banners = new Banners();
    banners.run()
});
