"""
Controls API endpoints based on urls.py
"""
import os
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import openai
from .serializers import ProductSerializer, ScannedItemSerializer, AllergenSerializer
from .models import Product, ImageScan, ScannedItem, Allergen

#pylint: disable=no-member
#pylint: disable=broad-exception-caught

def get_product_info(barcode, request):
    """
    Returns product information based on an int barcode
    """
    allergens = None
    if request.user.is_authenticated:
        allergens = list(Allergen.objects.filter(user=request.user))
    product = Product(barcode, allergens=allergens)
    product.fetch_nutrition_data()
    return ProductSerializer(product)


class ImageScanView(APIView):
    """
    Provides an API endpoint for scanning static images
    """
    def post(self, request):
        """
        post
        """
        image = request.FILES.get('file')
        if not image:
            return Response({'error': 'No file uploaded'},
                            status=status.HTTP_400_BAD_REQUEST)

        scanner = ImageScan()
        upc = scanner.fetch_upc(image)

        if not upc:
            return Response({'error': 'No barcode found'},
                            status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        serializer = get_product_info(upc, request)

        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductView(APIView):
    """
    Provides an API endpoint for getting barcode ints
    """
    def get(self, request, barcode):
        """
        get
        """
        serializer = get_product_info(barcode, request)
        return Response(serializer.data, status=status.HTTP_200_OK)


class HealthScoreOnlyView(APIView):
    """
    returns a health score from chatGPT
    """
    def post(self, request):
        """
        post
        """
        name = request.data.get("name")
        nutrition_data = request.data.get("nutrition_data")

        if not name or not nutrition_data:
            return Response(
                {"error": "Missing product name or nutrition data"}, status=400)

        prompt_score = (
            "Generate a health score scaled from 1-10 in the format 'x.x/10'"
            f" and no summary or extra information "
            f"based on this information about the food: "
            f"Product name: {name}\nProduct Nutrition Data: {nutrition_data}"
        )

        try:
            client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            score_response = client.chat.completions.create(
                model="o3-mini",
                messages=[
                    {"role": "system", "content": "You are a nutrition expert."},
                    {"role": "user", "content": prompt_score}
                ]
            )
            score = score_response.choices[0].message.content
            return Response({"health_score": score}, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


class HealthSummaryOnlyView(APIView):
    """
    returns a health summary "why" from chatGPT
    """
    def post(self, request):
        """
        post
        """
        name = request.data.get("name")
        nutrition_data = request.data.get("nutrition_data")

        if not name or not nutrition_data:
            return Response(
                {"error": "Missing product name, nutrition data, or health score"}, status=400)

        prompt_summary = (
            "Generate a 50-75 word summary about the health factors of "
            "the below food product based on a potential"
            "health score that you generate, without stating the score unnecessarily.\n"
            f"Product name: {name}\n Product Nutrition Data: {nutrition_data}"
        )

        try:
            client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            summary_response = client.chat.completions.create(
                model="o3-mini",
                messages=[
                    {"role": "system", "content": "You are a nutrition expert."},
                    {"role": "user", "content": prompt_summary}
                ]
            )
            summary = summary_response.choices[0].message.content
            return Response({"health_score_summary": summary}, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


def csrf_token_view(request):
    """
    get token
    """
    return JsonResponse({"csrfToken": get_token(request)})


def logout_view(request):
    """
    log out
    """
    logout(request)
    return JsonResponse({"message": "Logged out successfully"})


def check_auth_view(request):
    """
    check if authenticated
    """
    if request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": True})
    return JsonResponse({"isAuthenticated": False}, status=401)


@api_view(['POST'])
@csrf_exempt
def register_view(request):
    """
    provides a register method for api endpoint
    """
    if request.method == "POST":
        data = request.data
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")

        if not username or not password or not email:
            return JsonResponse(
                {"error": "All fields are required"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse(
                {"error": "Username already exists"}, status=400)

        user = User.objects.create_user(
            username=username, password=password, email=email)
        user.save()
        return JsonResponse({"message": "User registered successfully"})
    return JsonResponse({"error": "Invalid request method"}, status=405)


@api_view(['POST'])
def login_view(request):
    """
    provides an api endpoint for loging in
    """
    if request.method == "POST":
        data = request.data
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse(
                {"error": "Username and password are required"}, status=400)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            token = get_token(request)
            return JsonResponse(
                {"message": "Login successful", "token": token})

        return JsonResponse({"error": "Invalid credentials"}, status=401)

    return JsonResponse({"error": "Invalid request method"}, status=405)


class SaveScannedItemView(APIView):
    """
    adds a scanned item to the database for the user
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        post
        """
        barcode = request.data.get('barcode')
        if not barcode:
            return Response({'error': 'No barcode provided'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Optionally, you can fetch the product data to extract additional info
        # like product name
        product = Product(barcode)
        product.fetch_nutrition_data()

        # Save the scanned item to the user's history, creating one if it
        # doesn't exist
        scanned_item = ScannedItem.objects.create(
            user=request.user,
            barcode=barcode,
            name=product.name
        )

        serializer = ScannedItemSerializer(scanned_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserScannedItemsView(APIView):
    """
    returns items if a get, deletes if delete, updates favorites if patch
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        get
        """
        scanned_items = ScannedItem.objects.filter(user=request.user)
        serializer = ScannedItemSerializer(scanned_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """
        remove an item
        """
        try:
            scanned_item = ScannedItem.objects.get(pk=pk, user=request.user)
            scanned_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ScannedItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        """
        add/remove favorite
        """
        try:
            scanned_item = ScannedItem.objects.get(pk=pk, user=request.user)
        except ScannedItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = request.data
        scanned_item.favorite = data.get('favorite', scanned_item.favorite)
        scanned_item.save()

        serializer = ScannedItemSerializer(scanned_item)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AllergensView(APIView):
    """
    adds on a post, sends all allergens on a get, and removes on a delete. 
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        add to the allergens
        """
        allergen = request.data.get('allergen')
        if not request.user.is_authenticated:
            return Response({'error': 'Not logged in'},
                            status=status.HTTP_400_BAD_REQUEST)
        if not allergen:
            return Response({'error': 'No allergen provided'},
                            status=status.HTTP_400_BAD_REQUEST)

        allergen_obj = Allergen.objects.create(
            user=request.user,
            allergen=str(allergen)
        )

        serializer = AllergenSerializer(allergen_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request):
        """
        get allergens
        """
        if not request.user.is_authenticated:
            return Response({'error': 'Not logged in'},
                            status=status.HTTP_400_BAD_REQUEST)
        allergens = Allergen.objects.filter(user=request.user)
        serializer = AllergenSerializer(allergens, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request):
        """
        remove an allergen
        """
        if not request.user.is_authenticated:
            return Response({'error': 'Not logged in'},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            todelete = request.data.get('allergen')
            if not todelete:
                return Response({'error': 'No allergen provided'},
                                status=status.HTTP_400_BAD_REQUEST)

            allergen = Allergen.objects.get(
                user=request.user, allergen=str(todelete))
            allergen.delete()
            return Response(status=status.HTTP_200_OK)
        except Allergen.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
#pylint: enable=no-member
#pylint: enable=broad-exception-caught
