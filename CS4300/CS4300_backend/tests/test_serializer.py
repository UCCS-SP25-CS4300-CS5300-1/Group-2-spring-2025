"""
module for testing serializers
"""
from unittest.mock import patch, MagicMock
from django.test import TestCase
from ..serializers import ProductSerializer

#pylint: disable=missing-function-docstring
#pylint: disable=missing-class-docstring

class ProductSerializerTest(TestCase):
    @patch("CS4300_backend.serializers.Product")
    def test_create_product_serializer(self, mock_product_test):
        mock_product = MagicMock()
        mock_product.barcode = "123456789"
        mock_product.name = "Mock Product"
        mock_product.nutrition_data = {"fat": 1, "sugar": 2}
        mock_product.alerts = []
        mock_product.image_url = ""
        mock_product.ingredients = []
        mock_product_test.return_value = mock_product

        data = {"barcode": "123456789"}
        serializer = ProductSerializer(data=data)
        self.assertTrue(serializer.is_valid())

        product_data = serializer.save()

        self.assertEqual(product_data["barcode"], "123456789")
        self.assertEqual(product_data["name"], "Mock Product")
