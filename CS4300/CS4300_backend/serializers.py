# CS4300_backend/serializers.py

from rest_framework import serializers
from .models import Product
from .models import ScannedItem
from dotenv import load_dotenv

load_dotenv()

class ProductSerializer(serializers.Serializer):
    barcode = serializers.CharField(max_length=20)
    name = serializers.CharField(max_length=255, read_only=True)
    nutrition_data = serializers.JSONField(read_only=True)
    health_score = serializers.CharField(max_length=255, read_only=True)
    health_score_summary = serializers.CharField(max_length=255, read_only=True)

    def create(self, validated_data):
        #Create product instance from given barcode
        barcode = validated_data.get('barcode')
        product = Product(barcode)

        #get necessary info about product
        product.fetch_nutrition_data()
        product.fetch_health_score()
        product.fetch_health_score_summary()

        return {
            'barcode': product.barcode,
            'name': product.name,
            'nutrition_data': product.nutrition_data,
            'health_score': product.health_score,
            'health_score_summary': product.health_score_summary
        }

    def update(self, instance, validated_data):
        instance.barcode = validated_data.get('barcode', instance.barcode)
        instance.fetch_nutrition_data()
        instance.fetch_health_score()
        instance.fetch_health_score_summary()
        return instance


class ScannedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScannedItem
        fields = ['id', 'barcode', 'name', 'favorite']
