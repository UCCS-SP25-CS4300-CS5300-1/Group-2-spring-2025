import requests
import json
from pyzbar import pyzbar
import cv2
import numpy as np

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
            print("Invalid Image")
            return None

        filebytes = image.read()
        nparray = np.frombuffer(filebytes, np.uint8)

        img = cv2.imdecode(nparray, cv2.IMREAD_COLOR)
        if img is None:
            print("cv2 failed to decode image")
            return None

        barcode = decode(img)

        # this ended up being an issue with a perfect barcode image, grabbing pictures of real barcodes works better than a machine generated one.
        # OCR worked great for my testing images but terrible with real images, this does not work with testing images but works great with real images.
        # Who woulda thought... 

        return barcode if barcode else None



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

