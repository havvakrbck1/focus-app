# api/urls.py

from django.urls import path
from . import views
# YENİ IMPORTLAR
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('', views.get_routes, name="routes"),
    path('register/', views.register, name="register"),
    path('tasks/<int:pk>/', views.task_detail, name="task-detail"), 
    # YENİ YOLLAR
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('tasks/', views.task_list, name="task-list"),
]