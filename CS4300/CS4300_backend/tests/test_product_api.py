"""
Module docstring
"""

import os
import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from ..models import Product

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'CS4300_django_server.settings')

#pylint: disable=missing-function-docstring
#pylint: disable=redefined-outer-name

@pytest.fixture
def client():
    client = APIClient()
    User.objects.create_user(
        username='testuser',
        password='testpassword')
    client.login(username='testuser', password='testpassword')
    return client


@pytest.mark.django_db
def test_fetch_nutrition_data():
    product = Product(barcode="3017624010701")
    product.fetch_nutrition_data()
    assert product.name != "Unknown Product"
    assert product.nutrition_data != "No Data Available"


@pytest.mark.django_db
def test_product_fetch_invalid_barcode():
    product = Product(barcode="999999999999999999")
    product.fetch_nutrition_data()
    assert product.name == "Unknown Product"
    assert product.nutrition_data == "No Data Available"


@pytest.mark.django_db
def test_product_view_valid_barcode(client):
    response = client.get("/api/product/1234567890123/")
    assert response.status_code == 200
    assert 'barcode' in response.data
    assert 'name' in response.data
    assert 'nutrition_data' in response.data
    assert response.data['barcode'] == '1234567890123'
    assert response.data['name'] != "Unknown Product"
    assert response.data['nutrition_data'] != "No Data Available"
