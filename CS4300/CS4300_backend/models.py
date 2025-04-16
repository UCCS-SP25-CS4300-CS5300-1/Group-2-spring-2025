import os

import requests
import json

from openai import OpenAI
from pyzbar import pyzbar
import cv2
import numpy as np
from django.db import models
from django.contrib.auth.models import User
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')

class imageScan:
    def __init__(self):
        self.barcode = None


    def fetch_upc(self, image):
        def decode(image0):
            decoded_objects = pyzbar.decode(image0)
            for obj in decoded_objects:
                return obj.data.decode('utf-8')

        try:
            image.seek(0)
        except:
            return None

        filebytes = image.read()
        nparray = np.frombuffer(filebytes, np.uint8)

        img = cv2.imdecode(nparray, cv2.IMREAD_COLOR)
        if img is None:
            return None

        barcode = decode(img)

        return barcode if barcode else None

def parseAllergens(product_data):
    allergens_list = product_data.get("allergens_from_ingredients", {})
    allergens_list = allergens_list.replace("en:", "").split(", ") # split into a list and remove any en:
    allergens_list = list(set(allergens_list)) # remove duplicates
    allergens = json.dumps(allergens_list)
    return allergens

class Product:
    def __init__(self, barcode):
        self.barcode = barcode

    def fetch_nutrition_data(self, customAllergens=None):
        url = f"https://world.openfoodfacts.net/api/v2/product/{self.barcode}.json"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            product_data = data.get('product', {})
            self.name = product_data.get('product_name', 'Unknown')
            self.nutrition_data = json.dumps(product_data.get('nutriments', {}))
            self.alerts = parseAllergens(product_data)
        else:
            self.name = "Unknown Product"
            self.nutrition_data = "No Data Available"
            self.alerts = "No Data Available"

class Allergen(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    Allergen = models.CharField(max_length=100)

    def __str__(self):
        return self.Allergen

class ScannedItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    barcode = models.CharField(max_length=100)
    name = models.CharField(max_length=255)
    favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.barcode})"

    class Meta:
        ordering = ['-created_at']

