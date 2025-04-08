from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProductSerializer
from .models import Product, imageScan
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import ScannedItem
from .serializers import ScannedItemSerializer
from rest_framework.permissions import IsAuthenticated


class ImagescanView(APIView):
    def post(self, request, format=None):
        image = request.FILES.get('file')
        if not image:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        scanner = imageScan()
        upc = scanner.fetch_upc(image)

        if not upc:
            return Response({'error': 'No barcode found'}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        product = Product(upc)
        product.fetch_nutrition_data()

        serializer = ProductSerializer(product)

        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductView(APIView):

    def get(self, request, barcode, format=None):
        # Create and populate the Product object
        product = Product(barcode)
        product.fetch_nutrition_data()  # Fetch data from the external API

        # Serialize and return product data
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)


def csrf_token_view(request):
    return JsonResponse({"csrfToken": get_token(request)})


def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully"})


def check_auth_view(request):
    if request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": True})
    return JsonResponse({"isAuthenticated": False}, status=401)


@api_view(['POST'])
@csrf_exempt
def register_view(request):
    if request.method == "POST":
        data = request.data
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")

        if not username or not password or not email:
            return JsonResponse({"error": "All fields are required"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"}, status=400)

        user = User.objects.create_user(username=username, password=password, email=email)
        user.save()
        return JsonResponse({"message": "User registered successfully"})
    return JsonResponse({"error": "Invalid request method"}, status=405)


@api_view(['POST'])
def login_view(request):
    if request.method == "POST":
        data = request.data
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse({"error": "Username and password are required"}, status=400)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            token = get_token(request)
            return JsonResponse({"message": "Login successful", "token": token})
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
    return JsonResponse({"error": "Invalid request method"}, status=405)


class SaveScannedItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        barcode = request.data.get('barcode')
        if not barcode:
            return Response({'error': 'No barcode provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Optionally, you can fetch the product data to extract additional info like product name
        product = Product(barcode)
        product.fetch_nutrition_data()

        # Save the scanned item to the user's history, creating one if it doesn't exist
        scanned_item = ScannedItem.objects.create(
            user=request.user,
            barcode=barcode,
            name=product.name
        )

        serializer = ScannedItemSerializer(scanned_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserScannedItemsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        scanned_items = ScannedItem.objects.filter(user=request.user)
        serializer = ScannedItemSerializer(scanned_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk, format=None):
        try:
            scanned_item = ScannedItem.objects.get(pk=pk, user=request.user)
            scanned_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ScannedItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk, format=None):
        try:
            scanned_item = ScannedItem.objects.get(pk=pk, user=request.user)
        except ScannedItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = request.data
        scanned_item.favorite = data.get('favorite', scanned_item.favorite)
        scanned_item.save()

        serializer = ScannedItemSerializer(scanned_item)
        return Response(serializer.data, status=status.HTTP_200_OK)
