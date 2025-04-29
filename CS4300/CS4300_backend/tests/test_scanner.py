import os
import pytest
from django.conf import settings
from ..models import imageScan
from django.test import TestCase, Client
from rest_framework import status
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'CS4300_django_server.settings')

testimage1 = os.path.dirname(os.path.realpath(__file__)) + "/testChips.jpg"
testimage2 = os.path.dirname(os.path.realpath(__file__)) + "/testTakis.jpeg"


def test_scanner():

    with open(testimage1, 'rb') as img:
        image_data = img
        scanner = imageScan()
        barcode = scanner.fetch_upc(image_data)
        assert barcode == "0096619440047"
        img.close()

    with open(testimage2, 'rb') as img:
        image_data = img
        scanner = imageScan()
        barcode = scanner.fetch_upc(image_data)
        assert barcode == "0757528029753"
        img.close()

    scanner = imageScan()
    barcode = scanner.fetch_upc("ERROR")
    assert barcode is None

    barcode = scanner.fetch_upc(bytearray(256))
    assert barcode is None

    barcode = scanner.fetch_upc(None)
    assert barcode is None


class api(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse("image-scanner")

    def test_api(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        with open(testimage1, 'rb') as img:
            response = self.client.post(
                self.url, {'file': img}, format='multipart')
            img.close()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        testfile = SimpleUploadedFile(
            name="image.jpg",
            content=os.urandom(1024),
            content_type='application/octet-stream'
        )
        response = self.client.post(
            self.url, {'file': testfile}, format='multipart')
        self.assertEqual(
            response.status_code,
            status.HTTP_422_UNPROCESSABLE_ENTITY)
