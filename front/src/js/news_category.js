function NewsCategory() {

}

NewsCategory.prototype.listenClick = function () {
    var addBtn = $('#add-btn');
    addBtn.click(function () {
        xfzalert.alertOneInput({
            'title': '添加新闻分类',
            'placeholder': '请输入新闻分类',
            'confirmCallback': function (inputValue) {
                myajax.post({
                    'url': '/cms/add_news_category/',
                    'data': {
                        'name': inputValue
                    },
                    'success': function (result) {
                        if (result['code'] === 200) {
                            console.log(result);
                            window.location.reload();
                        } else {
                            xfzalert.close();
                        }
                    }
                });
            }
        });
    });
};

NewsCategory.prototype.listenEditCategoryClick = function () {
    var self = this;
    var editBtn = $('.edit-btn');
    editBtn.click(function () {
        var currentBtn = $(this);
        var tr = currentBtn.parent().parent();
        var pk = tr.attr('data-pk');
        var name = tr.attr('data-name');
        xfzalert.alertOneInput({
            'title': '修改分类名称',
            'placeholder': '请输入新的分类名称',
            'value': name,
            'confirmCallback': function (inputValue) {
                myajax.post({
                    'url': '/cms/edit_news_category/',
                    'data': {
                        'pk': pk,
                        'name': inputValue
                    },
                    'success': function (result) {
                        if (result['code'] === 200) {
                            window.location.reload();
                        } else {
                            xfzalert.close();
                        }
                    }
                });
            }
        });
    });
};

NewsCategory.prototype.listenDeleteCategoryClick = function () {
    var deleteBtn = $('.delete-btn');
    deleteBtn.click(function () {
        var currentBtn = $(this);
        var tr = currentBtn.parent().parent();
        var pk = tr.attr('data-pk');
        xfzalert.alertConfirm({
            'title': '您确定要删除这个分类吗？',
            'confirmCallback': function () {
                myajax.post({
                    'url': '/cms/delete_news_category/',
                    'data': {
                        'pk': pk
                    },
                    'success': function (result) {
                        if (result['code'] === 200) {
                            window.location.reload();
                        } else {
                            xfzalert.close();
                        }
                    }
                });
            }
        });
    });
};

NewsCategory.prototype.run = function () {
    var self = this;
    self.listenClick();
    self.listenEditCategoryClick();
    self.listenDeleteCategoryClick();
};

$(function () {
    var newsCategory = new NewsCategory();
    newsCategory.run();
});
