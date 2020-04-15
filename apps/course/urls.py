from django.urls import path

from apps.course import views

app_name = 'course'

urlpatterns = [
    path('', views.course_index, name='index'),
    path('detail/', views.course_detail, name='detail')
]
