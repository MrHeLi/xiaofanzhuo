function News() {

}

News.prototype.initUeditor = function() {
    window.ue = UE.getEditor('editor', {
        'initialFrameHeight': 400,
        'serverUrl': '/ueditor/upload/'
    });

};

News.prototype.listenUploadFileClick = function () {
    var uploadBtn = $('#thumbnail-btn');
    uploadBtn.change(function () {
        var file = uploadBtn[0].files[0];
        var formData = new FormData();
        formData.append('file', file);
        myajax.post({
            'url': '/cms/upload_file/',
            'data': formData,
            'processData': false,
            'contentType':false,
            'success': function (result) {
                if (result['code'] === 200) {
                    var url = result['data']['url'];
                    var thumbnailInput = $("#thumbnail-form");
                    thumbnailInput.val(url);
                }
            }
        });
    });
};

News.prototype.listenSubmitEvent = function () {
    var submitBtn = $("#submit-btn");
    submitBtn.click(function (event) {
        event.preventDefault();
        // var btn = $(this);
        // var pk = btn.attr('data-news-id');

        var title = $("input[name='title']").val();
        var category = $("select[name='category']").val();
        var desc = $("input[name='desc']").val();
        var thumbnail = $("input[name='thumbnail']").val();
        var content = window.ue.getContent();

        console.log(title + ":" + desc + ":" + thumbnail + ":" + content);

        // var url = '';
        // if(pk){
        //     url = '/cms/edit_news/';
        // }else{
        //     url = '/cms/write_news/';
        // }


        myajax.post({
            'url': "/cms/write_news/",
            'data': {
                'title': title,
                'category': category,
                'desc': desc,
                'thumbnail': thumbnail,
                'content': content
            },
            'success': function (result) {
                if(result['code'] === 200){
                    xfzalert.alertSuccess('恭喜！新闻发表成功！',function () {
                        window.location.reload();
                    });
                }
            }
        });
    });
};

News.prototype.run = function () {
    var self = this;
    self.listenUploadFileClick();
    self.initUeditor();
    self.listenSubmitEvent();
};

$(function () {
    var news = new News();
    news.run();
});
