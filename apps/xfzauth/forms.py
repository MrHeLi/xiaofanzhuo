from django import forms

from apps.forms import FormMixin
from django.core.cache import cache
from .models import User


class LoginForm(forms.Form, FormMixin):
    telephone = forms.CharField(max_length=11)
    password = forms.CharField(max_length=10, min_length=6)
    remember = forms.IntegerField(required=False)


class RegisterForm(forms.Form, FormMixin):
    telephone = forms.CharField(min_length=11, max_length=11)
    username = forms.CharField(max_length=20, min_length=5)
    password1 = forms.CharField(min_length=6, max_length=20, error_messages={"max_length": "密码最多不能超过20个字符！", "min_length": "密码最少不能少于6个字符！"})
    password2 = forms.CharField(min_length=6, max_length=20, error_messages={"max_length": "密码最多不能超过20个字符！", "min_length": "密码最少不能少于6个字符！"})
    img_captcha = forms.CharField(min_length=4, max_length=4)
    sms_captcha = forms.CharField(min_length=4, max_length=4)

    def clean(self):
        cleaned_data = super(RegisterForm, self).clean()
        pwd1 = cleaned_data.get('password1')
        pwd2 = cleaned_data.get('password2')
        if pwd1 != pwd2:
            raise forms.ValidationError("两次密码输入不一致！")

        img_code = cleaned_data.get('img_captcha')
        cache_img_code = cache.get(str(img_code).lower())
        print('cache:', cache_img_code, ' sms_code:', str(img_code).lower())
        if not cache_img_code or cache_img_code != str(img_code).lower():
            raise forms.ValidationError("图形验证码错误")

        tel = cleaned_data.get('telephone')
        sms_code = cleaned_data.get('sms_captcha')
        cache_sms_code = cache.get(tel)
        print('cache:', cache_sms_code, ' sms_code:', sms_code)
        if not cache_sms_code or str(sms_code).lower() != str(cache_sms_code).lower():
            raise forms.ValidationError("短信验证码错误")

        exits = User.objects.filter(telephone=tel)
        if exits:
            raise forms.ValidationError("该手机号码已经被注册！")

        return cleaned_data

