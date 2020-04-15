from django.shortcuts import render
from django.contrib.auth import login, logout, authenticate
from django.views.decorators.http import require_POST
from .forms import LoginForm
from django.http import JsonResponse
from utils import restful


# Create your views here.

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
