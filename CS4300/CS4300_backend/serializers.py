# CS4300_backend/serializers.py

from rest_framework import serializers
from .models import Product
from .models import ScannedItem, Allergen
from dotenv import load_dotenv

load_dotenv()

class ProductSerializer(serializers.Serializer):
    barcode = serializers.CharField(max_length=20)
    name = serializers.CharField(max_length=255, read_only=True)
    nutrition_data = serializers.JSONField(read_only=True)
    alerts = serializers.CharField(max_length=255, read_only=True)
    image_url = serializers.CharField(max_length=255, read_only=True)

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
            'image_url': product.image_url,
        }

    def update(self, instance, validated_data):
        instance.barcode = validated_data.get('barcode', instance.barcode)
        instance.fetch_nutrition_data()
        return instance


class AllergenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergen
        fields = ["allergen"]

class ScannedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScannedItem
        fields = ['id', 'barcode', 'name', 'favorite']
