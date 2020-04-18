from django.shortcuts import render, redirect, reverse
from django.contrib.auth import login, logout, authenticate
from django.views.decorators.http import require_POST
from .forms import LoginForm, RegisterForm
from django.http import JsonResponse, HttpResponse
from utils import restful
from utils.captcha.xfzcaptcha import Captcha
from io import BytesIO
from django.core.cache import cache


# Create your views here.
from .models import User


@require_POST
def login_view(request):
    form = LoginForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        password = form.cleaned_data.get('password')
        remember = form.cleaned_data.get('remember')
        user = authenticate(request, username=telephone, password=password)
        if user:
            if user.is_active:
                login(request, user)
                if remember:
                    request.session.set_expiry(None)
                else:
                    request.session.set_expiry(0)
                return restful.ok()
            else:
                return restful.unauth(message="账号冻结")
        else:
            return restful.params_error(message="手机号码或者密码错误")
    else:
        data = form.get_error()
        return restful.params_error(message=data)


def logout_view(request):
    logout(request)
    return redirect(reverse('news:index'))


def img_captcha(request):
    text, image = Captcha.gene_code()
    out = BytesIO()  # ByteIO用于存储字节
    image.save(out, 'png')  # 将验证码图片暂存于ByteIO
    out.seek(0)  # 将ByteIO读写指针归零

    resp = HttpResponse(content_type='image/png')
    resp.write(out.read())  # 将ByteIO中的字节读取并写给HttpResponse
    resp['Content-length'] = out.tell()

    cache.set(text.lower(), text.lower(), 5 * 60)  # 缓存验证码
    return resp


def sms_captcha(request):
    telephone = request.GET.get('telephone')
    code = Captcha.gene_text()
    print('sms code =', code)
    # TODO: 应该动态生成，使用短信发送给用户，因阿里云SDK下载失败，以后再试
    cache.set(telephone, code, 5 * 60)
    print("telephone = ", telephone)
    return restful.ok()


@require_POST
def register(request):
    print("require_POST")
    forms = RegisterForm(request.POST)
    if forms.is_valid():
        tel = forms.cleaned_data.get('telephone')
        username = forms.cleaned_data.get('username')
        password = forms.cleaned_data.get('password1')
        user = User.objects.create_user(telephone=tel, username=username, password=password)
        login(request, user)
        return restful.ok()
    else:
        print(forms.get_error())
        return restful.params_error(message=forms.get_error())


def cache_test(request):
    cache.set('username', 'homer', 60)
    result = cache.get('username')
    print(result)
    return HttpResponse('success')
