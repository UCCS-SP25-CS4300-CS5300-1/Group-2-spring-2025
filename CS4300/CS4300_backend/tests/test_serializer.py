from django.test import TestCase
from unittest.mock import patch, MagicMock
from ..serializers import ProductSerializer


class ProductSerializerTest(TestCase):
    @patch("CS4300_backend.serializers.Product")
    def test_create_product_serializer(self, MockProduct):
        mock_product = MagicMock()
        mock_product.barcode = "123456789"
        mock_product.name = "Mock Product"
        mock_product.nutrition_data = {"fat": 1, "sugar": 2}
        MockProduct.return_value = mock_product

        data = {"barcode": "123456789"}
        serializer = ProductSerializer(data=data)
        self.assertTrue(serializer.is_valid())

        product_data = serializer.save()

        self.assertEqual(product_data["barcode"], "123456789")
        self.assertEqual(product_data["name"], "Mock Product")
