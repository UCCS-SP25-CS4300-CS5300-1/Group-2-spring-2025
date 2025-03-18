# File: CS4300/CS4300_backend/views.py

from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProductSerializer
from .models import Product  # If you want to use the actual model

class ProductView(APIView):
    def get(self, request, barcode, format=None):
        # Create the Product object
        product = Product(barcode)
        product.fetch_nutrition_data()  # Fetch nutrition data from the API

        # Serialize the Product object
        serializer = ProductSerializer(product)

        return Response(serializer.data, status=status.HTTP_200_OK)


class ExampleApiView(APIView):
    def get(self, request):
        return Response({'message': 'Hello, world!'})
