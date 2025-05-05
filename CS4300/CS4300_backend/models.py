'''
models.py
classes for django
'''

import os
import json
import requests
from pyzbar import pyzbar
import cv2
import numpy as np
from django.db import models
from django.contrib.auth.models import User
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')


#pylint: disable=no-member
#pylint: disable=broad-exception-caught
#pylint: disable=too-few-public-methods

class ImageScan:
    """
    scans an image
    """
    def __init__(self):
        """
        init function
        """
        self.barcode = None

    def fetch_upc(self, image):
        """
        gets a upc from an image
        """
        def decode(image0):
            decoded_objects = pyzbar.decode(image0)
            for obj in decoded_objects:
                return obj.data.decode('utf-8')

        try:
            image.seek(0)
        except BaseException:
            return None

        filebytes = image.read()
        nparray = np.frombuffer(filebytes, np.uint8)

        img = cv2.imdecode(nparray, cv2.IMREAD_COLOR)

        if img is None:
            return None

        barcode = decode(img)

        return barcode if barcode else None


def parse_allergens(product_data, custom=False):
    """
    take food info and return a list of allergens
    """
    allergens_list = product_data.get("allergens_from_ingredients", {})
    # split into a list and remove any en:
    allergens_list = allergens_list.replace("en:", "").split(", ")
    allergens_list = list(set(allergens_list))  # remove duplicates
    ingredients = json.dumps(product_data.get("ingredients", {}))
    ingredients = "".join(ingredients).lower()
    if custom and isinstance(custom, list):
        for allergen in custom:
            if str(allergen).lower() in ingredients:
                allergens_list.append(str(allergen))
    allergens = json.dumps(allergens_list)
    return allergens


def parse_ingredients(product_data):
    """
    get ingredients for product
    """
    returnval = list([])
    ingredients = product_data.get("ingredients", {})
    for ingredient in ingredients:
        returnval.append(ingredient.get("text", "Error"))
    return json.dumps(returnval)


class Product:
    """
    product class, gets nutrition data and returns based on a user
    """
    def __init__(self, barcode, allergens=None):
        """
        init function
        """
        self.image_url = None
        self.barcode = barcode
        self.custom_allergens = allergens
        self.name = ''
        self.nutrition_data = ''
        self.alerts = ''
        self.ingredients = ''

    def fetch_nutrition_data(self, custom_allergens=None):
        """
        gets nutrition data such as ingredients
        """
        url = f"https://world.openfoodfacts.net/api/v2/product/{self.barcode}.json"
        response = requests.get(url, timeout=5)

        if response.status_code == 200:
            data = response.json()
            product_data = data.get('product', {})
            self.name = product_data.get('product_name', 'Unknown')
            self.nutrition_data = json.dumps(
                product_data.get('nutriments', {}))
            self.alerts = parse_allergens(
                product_data, (custom_allergens or self.custom_allergens))
            self.ingredients = parse_ingredients(product_data)
            self.image_url = product_data.get('image_front_url')
        else:
            self.name = "Unknown Product"
            self.nutrition_data = "No Data Available"
            self.alerts = "No Data Available"
            self.ingredients = "No Data Available"
            self.image_url = "No Data Available"


class Allergen(models.Model):
    """
    class for allergens
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    allergen = models.CharField(max_length=100)

    def __str__(self):
        """
        returns a string for the allergen
        """
        return f'{self.allergen}'


class ScannedItem(models.Model):
    """
    model saved for a saved item
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    barcode = models.CharField(max_length=100)
    name = models.CharField(max_length=255)
    favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """
        returns a formatted string
        """
        return f"{self.name} ({self.barcode})"

    class Meta:
        """
        allows for an order
        """
        ordering = ['-created_at']

#pylint: enable=no-member
#pylint: enable=broad-exception-caught
#pylint: enable=too-few-public-methods
