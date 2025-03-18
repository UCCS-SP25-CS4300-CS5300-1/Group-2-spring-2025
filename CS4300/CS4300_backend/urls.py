# File: CS4300/CS4300_backend/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('product/<str:barcode>/', views.ProductView.as_view(), name='product-detail')
]