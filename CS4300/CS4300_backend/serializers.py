# CS4300_backend/serializers.py

from rest_framework import serializers
from .models import Product
from .models import ScannedItem


class ProductSerializer(serializers.Serializer):
    barcode = serializers.CharField(max_length=20)
    name = serializers.CharField(max_length=255, read_only=True)
    nutrition_data = serializers.JSONField(read_only=True)

    def create(self, validated_data):
        # We don't actually create a Product instance in the DB
        barcode = validated_data.get('barcode')
        product = Product(barcode)
        product.fetch_nutrition_data()
        return {
            'barcode': product.barcode,
            'name': product.name,
            'nutrition_data': product.nutrition_data
        }

    def update(self, instance, validated_data):
        instance.barcode = validated_data.get('barcode', instance.barcode)
        instance.fetch_nutrition_data()
        return instance


class ScannedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScannedItem
        fields = ['id', 'barcode', 'name', 'favorite']
