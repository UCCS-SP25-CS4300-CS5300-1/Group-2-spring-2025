import os
import pytest
from django.conf import settings
from ..models import imageScan

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CS4300_django_server.settings')

def test_scanner():
    scanner = imageScan()
    scanner.fetch_upc()

