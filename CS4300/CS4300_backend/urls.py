from django.urls import path
from . import views

urlpatterns = [
    # Barcode URLs
    path('product/<str:barcode>/', views.ProductView.as_view(), name='product-detail'),

    # Authentication URLs
    path('csrf/', views.csrf_token_view, name='csrf'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('check-auth/', views.check_auth_view, name='check-auth'),
    path('register/', views.register_view, name='register'),

    # Scanned Item URLs
    path('save-scanned-item/', views.SaveScannedItemView.as_view(), name='save-scanned-item'),
    path('user-scanned-items/', views.UserScannedItemsView.as_view(), name='user-scanned-items'),

    # allowing scanned items to be marked as favorite or delete them from their history
    # payload: {"favorite": true} would set the item as favorite to the user-scanned-items/<pk> endpoint
    # delete request would delete the item from the history
    path('user-scanned-items/<int:pk>/', views.UserScannedItemsView.as_view(), name='scanned-item-detail'),
]