import requests
import json
from django.db import models
from django.contrib.auth.models import User


class Product:
    def __init__(self, barcode):
        self.barcode = barcode

    def fetch_nutrition_data(self):
        url = f"https://world.openfoodfacts.net/api/v2/product/{self.barcode}.json"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            product_data = data.get('product', {})
            self.name = product_data.get('product_name', 'Unknown')
            self.nutrition_data = json.dumps(product_data.get('nutriments', {}))
        else:
            self.name = "Unknown Product"
            self.nutrition_data = "No Data Available"


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

