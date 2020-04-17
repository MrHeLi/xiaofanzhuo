from django.urls import path

from apps.xfzauth import views

app_name = 'xfzauth'

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout')
]
