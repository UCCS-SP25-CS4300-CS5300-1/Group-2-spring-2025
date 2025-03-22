from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProductSerializer
from .models import Product
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.decorators import api_view


class ProductView(APIView):
    def get(self, request, barcode, format=None):
        # Create the Product object
        product = Product(barcode)
        product.fetch_nutrition_data()  # Fetch nutrition data from the API

        # Serialize the Product object
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
            return JsonResponse({"message": "Login successful"})
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
    return JsonResponse({"error": "Invalid request method"}, status=405)
