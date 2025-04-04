import os
import pytest
from django.conf import settings
from ..models import imageScan

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CS4300_django_server.settings')

def test_scanner():
    testimage1 = os.path.dirname(os.path.realpath(__file__))+"/testChips.jpg"
    testimage2 = os.path.dirname(os.path.realpath(__file__))+"/testTakis.jpeg"

    with open(testimage1, 'rb') as img:
        image_data = img
        scanner = imageScan()
        barcode = scanner.fetch_upc(image_data)
        assert barcode == "0096619440047"
    
    with open(testimage2, 'rb') as img:
        image_data = img
        scanner = imageScan()
        barcode = scanner.fetch_upc(image_data)
        assert barcode == "0757528029753"

    scanner = imageScan()
    barcode = scanner.fetch_upc("ERROR")
    assert barcode == None

    barcode = scanner.fetch_upc(bytearray(256))
    assert barcode == None

    barcode = scanner.fetch_upc(None)
    assert barcode == None
