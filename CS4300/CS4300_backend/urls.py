# File: CS4300/CS4300_backend/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('example_api/', views.ExampleApiView.as_view(), name='example_api'),
    # Add other URL patterns here
]