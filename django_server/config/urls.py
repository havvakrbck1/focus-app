# django_server/config/urls.py
from django.contrib import admin
from django.urls import path, include # 'include' fonksiyonunu import et

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), # /api/ ile başlayan her şeyi api uygulamasına yönlendir
]