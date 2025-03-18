import os
import pytest
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CS4300_django_server.settings')
from ..models import Product


def test_fetch_nutrition_data():
    product = Product(barcode="3017624010701")

    product.fetch_nutrition_data()

    assert product.name != "Unknown Product"
    assert product.nutrition_data != "No Data Available"

def test_product_fetch_invalid_barcode():
    product = Product("999999999999999999")
    product.fetch_nutrition_data()
    assert product.name == "Unknown Product"
    assert product.nutrition_data == "No Data Available"

def test_product_view_valid_barcode(client):
    response = client.get("/api/product/1234567890123/")
    assert response.status_code == 200
    assert 'barcode' in response.data
    assert 'name' in response.data
    assert 'nutrition_data' in response.data
    assert response.data['barcode'] == '1234567890123'
    assert response.data['name'] != "Unknown Product"
    assert response.data['nutrition_data'] != "No Data Available"


