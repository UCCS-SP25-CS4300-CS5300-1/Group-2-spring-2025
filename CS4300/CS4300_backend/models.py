import requests
import json


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

