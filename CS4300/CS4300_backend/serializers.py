"""
Provides django serializers for API endpoints
"""

from rest_framework import serializers
from dotenv import load_dotenv
from .models import Product
from .models import ScannedItem, Allergen

load_dotenv()

class ProductSerializer(serializers.Serializer):
    """
    serializes a product, requires valid data
    """
    barcode = serializers.CharField(max_length=20)
    name = serializers.CharField(max_length=255, read_only=True)
    nutrition_data = serializers.JSONField(read_only=True)
    alerts = serializers.CharField(read_only=True)
    image_url = serializers.CharField(max_length=255, read_only=True)
    ingredients = serializers.CharField(read_only=True)

    def create(self, validated_data):
        # Create product instance from given barcode
        barcode = validated_data.get('barcode')
        product = Product(barcode)

        # Get necessary info about product
        product.fetch_nutrition_data()
        return {
            'barcode': product.barcode,
            'name': product.name,
            'nutrition_data': product.nutrition_data,
            'alerts': product.alerts,
            'ingredients': product.ingredients,
            'image_url': product.image_url,
        }

    def update(self, instance, validated_data):
        instance.barcode = validated_data.get('barcode', instance.barcode)
        instance.fetch_nutrition_data()
        return instance

#pylint: disable=too-few-public-methods
class AllergenSerializer(serializers.ModelSerializer):
    """
    provides a basis for allergens to be serialized
    """
    class Meta:
        """
        super init
        """
        model = Allergen
        fields = ["allergen"]


class ScannedItemSerializer(serializers.ModelSerializer):
    """
    Provides a basis for a scanned item to be serialized.
    """
    class Meta:
        """
        super init
        """
        model = ScannedItem
        fields = ['id', 'barcode', 'name', 'favorite']
#pylint: enable=too-few-public-methods
