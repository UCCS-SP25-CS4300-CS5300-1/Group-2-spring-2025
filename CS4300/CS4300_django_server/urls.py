# File: CS4300/CS4300_django_server/urls.py

from django.urls import path, include

urlpatterns = [
    path('api/', include('CS4300_backend.urls')),
    # Add other URL patterns here
]
