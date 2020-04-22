from django.http import Http404
from django.shortcuts import render

# Create your views here.
from apps.news.forms import PublicCommentForm
from apps.news.models import News, NewsCategory, Comment
from django.conf import settings

from apps.news.serializers import NewsSerializer, CommentSerializer
from apps.xfzauth.decorators import xfz_login_required
from utils import restful


def index(request):
    count = settings.ONE_PAGE_NEWS_COUNT
    newses = News.objects.select_related('category', 'author').all()[0:count]
    categories = NewsCategory.objects.all()
    context = {
        'newses': newses,
        'categories': categories
    }
    return render(request, 'news/index.html', context=context)


def news_detail(request, news_id):
    try:
        news = News.objects.select_related('category', 'author').prefetch_related("comments__author").get(pk=news_id)
        context = {
            'news': news
        }
        return render(request, 'news/news_detail.html', context=context)
    except News.DoesNotExist:
        raise Http404


def news_list(request):
    page = int(request.GET.get('p', 1))

    start = (page - 1) * settings.ONE_PAGE_NEWS_COUNT
    end = start + settings.ONE_PAGE_NEWS_COUNT
    category_id = int(request.GET.get('category_id', 0))

    if category_id == 0:
        newses = News.objects.select_related('category', 'author').all()[start:end]
    else:
        newses = News.objects.select_related('category', 'author').filter(category_id=category_id)

    serializer = NewsSerializer(newses, many=True)
    data = serializer.data
    return restful.result(data=data)


@xfz_login_required
def public_comment(request):
    form = PublicCommentForm(request.POST)
    if form.is_valid():
        news_id = form.cleaned_data.get('news_id')
        content = form.cleaned_data.get('content')
        news = News.objects.get(pk=news_id)
        comment = Comment.objects.create(content=content, news=news, author=request.user)
        serializer = CommentSerializer(comment)
        return restful.result(data=serializer.data)
    else:
        return restful.params_error(message=form.get_error())
