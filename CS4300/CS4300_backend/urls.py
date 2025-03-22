# File: CS4300/CS4300_backend/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('product/<str:barcode>/', views.ProductView.as_view(), name='product-detail'),

    path('csrf/', views.csrf_token_view, name='csrf'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('check-auth/', views.check_auth_view, name='check-auth'),
    path('register/', views.register_view, name='register'),
]